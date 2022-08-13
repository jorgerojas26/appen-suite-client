import { useState } from 'react';
import { Modal, Badge, Spinner } from 'react-bootstrap';
import { toggleFavoriteActive } from '../../../services/favorite';

const FavoritesAccountsModal = ({ data = [], show, onClose, onToggle }) => {
    const [loading, setLoading] = useState(false);

    return (
        <Modal show={show} onHide={onClose} size='lg'>
            <Modal.Body>
                <div className='d-flex gap-2 flex-wrap'>
                    {data.map((account, index) => {
                        return (
                            <div key={index} className='position-relative'>
                                <Badge
                                    title='Click to toggle active'
                                    bg={account.favorite_active ? 'success' : 'danger'}
                                    onClick={async () => {
                                        setLoading(index);
                                        await toggleFavoriteActive(
                                            account._id,
                                            account.favorite_id,
                                            !account.favorite_active
                                        );
                                        setLoading(false);
                                        onToggle();
                                    }}
                                    role='button'
                                >
                                    {account.email}{' '}
                                    {loading === index && (
                                        <div className='position-absolute' style={{ left: '50%', top: '25%' }}>
                                            <Spinner animation='border' size='sm' />
                                        </div>
                                    )}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default FavoritesAccountsModal;
