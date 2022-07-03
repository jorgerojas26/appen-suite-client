import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Modal,
    ModalBody,
    ModalTitle,
    ModalHeader,
    ListGroup,
    ListGroupItem,
    Button,
    ModalFooter,
} from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';

import { saveProxyBulk, deleteProxy } from 'services/proxies';

import useSWR from 'swr';

const ProxiesModal = ({ show, onClose }) => {
    const { data: proxies, mutate: updateProxies } = useSWR('/proxies', null, {
        revalidateOnFocus: false,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProxies, setFilteredProxies] = useState([]);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [addLoading, setAddLoading] = useState(false);

    const proxiesToRender = searchTerm ? filteredProxies : proxies ?? [];

    const searchRef = useRef();

    const handleSearch = useCallback(
        (search) => {
            if (proxies) {
                const splittedSearch = search.trim().split('\n');
                const uniqueSearch = [...new Set(splittedSearch)];

                const filtered = [];

                uniqueSearch.forEach((search) => {
                    const filter = proxies?.filter((proxy) => {
                        return (
                            proxy.host.includes(search) ||
                            proxy.port.toString().includes(search) ||
                            proxy.type.includes(search) ||
                            `${proxy.host}:${proxy.port}`.includes(search)
                        );
                    });
                    filtered.push(...filter);
                });

                setFilteredProxies([...new Set(filtered)]);
            }
        },
        [proxies]
    );

    const handleAdd = async () => {
        const searchInputValue = searchRef.current.value;
        const splittedValues = searchInputValue.trim().split('\n');

        setFormError('');
        setFormSuccess('');

        let errors = [];
        for (let value of splittedValues) {
            if (!value.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})/)) {
                errors.push(`${value} doesn't match the format ip:port`);
            }
        }

        if (errors.length) {
            alert(errors.join(','));
            return;
        }

        setAddLoading(true);
        const response = await saveProxyBulk(splittedValues);

        if (response.status === 201) {
            updateProxies((old) => [...old, ...response]);
            setSearchTerm('');
            setFormSuccess('Saved successfully');
        } else {
            setFormError(response.data.error.join(','));
        }
        setAddLoading(false);
    };

    const handleDelete = async (id) => {
        const didConfirm = window.confirm('Are you sure you want to delete this proxy?');

        if (didConfirm) {
            const response = await deleteProxy(id);

            if (response.status === 200) {
                console.log('deleted', id);
                updateProxies((old) => old.filter((proxy) => proxy._id !== id));
                setFormSuccess('Proxy deleted successfully');
            } else {
                setFormError(response.data.error);
            }
        }
    };

    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, handleSearch]);

    return (
        <Modal show={show} onHide={onClose} enforceFocus autoFocus>
            <ModalHeader>
                <ModalTitle>Proxies</ModalTitle>
            </ModalHeader>
            <ModalBody>
                <div className='d-flex gap-2 mb-2 align-items-end'>
                    <textarea
                        ref={searchRef}
                        style={{ height: 100, maxHeight: 300 }}
                        type='search'
                        placeholder='Example: 123.123.123.123:8000'
                        className='form-control'
                        autoFocus
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <Button onClick={handleAdd} disabled={addLoading}>
                        {addLoading ? 'Loading...' : 'Add'}
                    </Button>
                </div>
                <ListGroup style={{ maxHeight: 400, overflow: 'auto' }} className='border'>
                    {proxiesToRender &&
                        proxiesToRender.map((proxy, index) => (
                            <ListGroupItem key={index} className='d-flex justify-content-between fw-bold h-100'>
                                <div>
                                    <span className='text-success fw-bold' title='HOST'>
                                        {proxy.host}
                                    </span>
                                    <span className='text-danger fw-bold'>:</span>
                                    <span title='PORT'>{proxy.port}</span>
                                </div>
                                <div>
                                    <Button variant='danger' onClick={() => handleDelete(proxy._id)}>
                                        <Trash />
                                    </Button>
                                </div>
                            </ListGroupItem>
                        ))}
                </ListGroup>
                <div>
                    <span>{proxiesToRender.length} items</span>
                </div>
            </ModalBody>
            <ModalFooter>
                <div className='w-100'>
                    {formError && <p className='text-danger text-center'>{formError}</p>}
                    {formSuccess && <p className='text-success text-center'>{formSuccess}</p>}
                </div>
                <div className='d-flex justify-content-between w-100'>
                    <div className='d-flex gap-1'>
                        <Button variant='success'>Import</Button>
                        <Button variant='info'>Export</Button>
                    </div>
                    <div className='d-flex gap-1'>
                        <Button variant='secondary' onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </ModalFooter>
        </Modal>
    );
};

export default ProxiesModal;
