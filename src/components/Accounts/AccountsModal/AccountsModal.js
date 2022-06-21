import { useState, useMemo } from 'react';
import { Offcanvas } from 'react-bootstrap';
import AddAccountModal from 'components/Accounts/AddAccountModal';
import AccountsToolbar from 'components/Accounts/AccountsToolbar';
import AccountsCount from 'components/Accounts/AccountsCount';
import AccountCard from 'components/Accounts/AccountCard';
import Notification from 'components/Notification';

import useSWR from 'swr';

const AccountsOffcanvas = ({ show, onClose }) => {
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const { data: accounts } = useSWR('/accounts');

    const accountsToRender = useMemo(() => {
        if (!accounts) return [];

        return filteredAccounts.length > 0 ? filteredAccounts : searchTerm ? [] : accounts;
    }, [filteredAccounts, accounts, searchTerm]);

    const handleSearch = (e) => {
        const search = e.target.value;
        setSearchTerm(search);
        const filteredAccounts = accounts.filter((account) => {
            return account.email.toLowerCase().includes(search.toLowerCase());
        });
        setFilteredAccounts(filteredAccounts);
    };

    const handleToolbarClick = (buttonName) => {
        if (buttonName === 'add') {
            setShowAddAccountModal(true);
        }
    };

    return (
        <>
            <Offcanvas show={show} onHide={onClose} style={{ width: 550 }}>
                <Offcanvas.Header className='py-1' closeButton>
                    <Offcanvas.Title>Accounts</Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className='overflow-hidden'>
                    <div className='d-flex flex-column gap-2 justify-content-start align-items-center h-100'>
                        <AccountsToolbar onClick={handleToolbarClick} />
                        <div>
                            <input
                                type='search'
                                placeholder='Search'
                                className='form-control'
                                onChange={handleSearch}
                                autoFocus
                            />
                        </div>
                        <AccountsCount accounts={accounts} />
                        {(((accounts && accounts.length === 0) || !accounts) && (
                            <div className='text-center'>
                                <h5>No accounts found</h5>
                            </div>
                        )) || (
                            <div className='overflow-auto w-100' style={{ maxHeight: '100%' }}>
                                {accountsToRender.map((account) => (
                                    <AccountCard
                                        key={account._id}
                                        data={account}
                                        onSave={() => setShowNotification(true)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Offcanvas.Body>
            </Offcanvas>
            {showAddAccountModal && (
                <AddAccountModal show={showAddAccountModal} onClose={() => setShowAddAccountModal(false)} />
            )}
            <Notification
                show={showNotification}
                message='Changes made succesfully'
                onClose={() => setShowNotification(false)}
            />
        </>
    );
};

export default AccountsOffcanvas;
