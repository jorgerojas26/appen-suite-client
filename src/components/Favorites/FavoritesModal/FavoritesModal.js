import { useMemo, useState } from 'react';

import { Offcanvas, Button } from 'react-bootstrap';
import FavoritesAccountsModal from '../FavoritesAccountsModal';
import FavoritesItem from '../FavoritesItem';
import AddItemModal from 'components/AddItemModal';

const FavoritesModal = ({ data = [], show, onClose }) => {
    const [selectedFavorite, setSelectedFavorite] = useState(null);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    // This is a temporal workaround to toggle active
    const [favoritesData, setFavoritesData] = useState(data);

    // This should be done server side
    const favoritesDataWithStatus = useMemo(() => {
        return favoritesData.map((favorite) => {
            const activeFavorites = favorite.accounts.filter((account) => account.active);
            const allActive = activeFavorites.length === favorite.accounts.length;
            const someActive = !allActive && activeFavorites.length > 0;

            return {
                ...favorite,
                status: allActive ? 'active' : someActive ? 'mixed' : 'inactive',
            };
        });
    }, [favoritesData]);

    const renderIncludeList = () => {
        return (
            <div className='container hstack gap-2'>
                {favoritesDataWithStatus.map((item) => {
                    return (
                        <FavoritesItem
                            key={item._id}
                            title={item.title}
                            status={item.status}
                            onClick={(event) => {
                                if (event.ctrlKey) {
                                    toggleActive({ favoriteId: item._id });
                                } else {
                                    setSelectedFavorite(item);
                                }
                            }}
                        />
                    );
                })}
            </div>
        );
    };

    const toggleActive = ({ favoriteId, accountId }) => {
        if (favoriteId) {
            if (accountId) {
                // TODO: toggle active this particular favorite on this particular account on server
                const accountFavorite = favoritesData
                    .find((favorite) => favorite._id === favoriteId)
                    .accounts.find((account) => account._id === accountId);
                accountFavorite.active = !accountFavorite.active;
                setFavoritesData([...favoritesData]);
            } else {
                // TODO: toggle active this particular favorite on all accounts on server
                const allActive = favoritesData
                    .find((favorite) => favorite._id === favoriteId)
                    .accounts.every((account) => account.active);

                if (allActive) {
                    favoritesData
                        .find((favorite) => favorite._id === favoriteId)
                        .accounts.map((account) => {
                            account.active = false;
                            return account;
                        });
                } else {
                    favoritesData
                        .find((favorite) => favorite._id === favoriteId)
                        .accounts.map((account) => {
                            account.active = true;
                            return account;
                        });
                }
                setFavoritesData([...favoritesData]);
            }
        }
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
                    toggleActive={(accountId) => toggleActive({ favoriteId: selectedFavorite._id, accountId })}
                />
            )}
            {showAddItemModal && (
                <AddItemModal
                    show={showAddItemModal}
                    onClose={() => setShowAddItemModal(false)}
                    onSubmit={(item) => {
                        setShowAddItemModal(false);
                    }}
                />
            )}
        </>
    );
};

export default FavoritesModal;
