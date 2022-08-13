import { useState, useEffect } from 'react';

import { Offcanvas, Button } from 'react-bootstrap';
import FavoritesAccountsModal from '../FavoritesAccountsModal';
import FavoritesItem from '../FavoritesItem';
import AddItemModal from 'components/AddItemModal';

import { toggleFavoriteActiveInAllAccounts, createFavorite, deleteFavorite } from '../../../services/favorite';

import useSWR from 'swr';

const FavoritesModal = ({ show, onClose }) => {
    const { data: favorites, mutate: updateFavorites } = useSWR('/favorites');

    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    useEffect(() => {
        if (selectedFavorite) {
            setSelectedFavorite((old) => {
                return favorites.find((favorite) => favorite._id.toString() === old._id.toString());
            });
        }
    }, [favorites, selectedFavorite]);

    const renderIncludeList = () => {
        return (
            <div className='container hstack gap-2'>
                {favorites &&
                    favorites.map((favorite) => {
                        const id = favorite._id;
                        const name = favorite.name;

                        const activeInAllAccounts = favorite.accounts.every((account) => account.favorite_active);
                        const activeInSomeAccounts = favorite.accounts.some((account) => account.favorite_active);

                        const status = activeInAllAccounts
                            ? 'active'
                            : !activeInAllAccounts && activeInSomeAccounts
                            ? 'mixed'
                            : 'inactive';

                        return (
                            <FavoritesItem
                                key={id}
                                title={name}
                                status={status}
                                onClick={async (event) => {
                                    if (event.shiftKey) {
                                        await toggleFavoriteActiveInAllAccounts(
                                            id,
                                            status === 'mixed' || status === 'active' ? false : true
                                        );
                                        updateFavorites();
                                    } else {
                                        setSelectedFavorite(favorite);
                                    }
                                }}
                                onDelete={async () => {
                                    const confirm = window.confirm(`Are you sure you want to delete ${name}?`);
                                    if (confirm) {
                                        await deleteFavorite(id);
                                        updateFavorites();
                                    }
                                }}
                            />
                        );
                    })}
            </div>
        );
    };

    return (
        <>
            <Offcanvas show={show} onHide={onClose} placement='top' className='bg-dark'>
                <Offcanvas.Header closeButton className='py-0 text-center bg-light'>
                    <div className='d-flex justify-content-center w-100'>
                        <Offcanvas.Title>Favorites</Offcanvas.Title>
                    </div>
                </Offcanvas.Header>
                <Offcanvas.Body>{renderIncludeList()}</Offcanvas.Body>
                <div className='border-top my-1 py-2 px-2'>
                    <div className='d-flex justify-content-center gap-2 h-100'>
                        <Button variant='success' onClick={() => setShowAddItemModal(true)}>
                            Add Item
                        </Button>
                        <Button variant='danger' onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </Offcanvas>
            {selectedFavorite && (
                <FavoritesAccountsModal
                    show={selectedFavorite}
                    data={selectedFavorite?.accounts}
                    onClose={() => setSelectedFavorite(null)}
                    onToggle={() => {
                        updateFavorites();
                    }}
                    // toggleActive={(accountId) => toggleActive({ favoriteId: selectedFavorite._id, accountId })}
                />
            )}
            {showAddItemModal && (
                <AddItemModal
                    show={showAddItemModal}
                    onClose={() => setShowAddItemModal(false)}
                    onSubmit={async (favoriteName) => {
                        await createFavorite({
                            name: favoriteName,
                            max_accounts_per_proxy: 3,
                        });
                        updateFavorites();
                        setShowAddItemModal(false);
                    }}
                />
            )}
        </>
    );
};

export default FavoritesModal;
