import { Modal, Badge } from 'react-bootstrap';
import { toggleFavoriteActive } from '../../../services/favorite';

const FavoritesAccountsModal = ({ data = [], show, onClose, onToggle }) => {
    return (
        <Modal show={show} onHide={onClose} size='lg'>
            <Modal.Body>
                <div className='d-flex gap-2 flex-wrap'>
                    {data.map((account, index) => {
                        return (
                            <div key={index}>
                                <Badge
                                    title='Click to toggle active'
                                    bg={account.favorite_active ? 'success' : 'danger'}
                                    onClick={async () => {
                                        await toggleFavoriteActive(
                                            account._id,
                                            account.favorite_id,
                                            !account.favorite_active
                                        );
                                        onToggle();
                                    }}
                                    role='button'
                                >
                                    {account.email}
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
