import { Modal, Badge } from 'react-bootstrap';

const FavoritesAccountsModal = ({ data = [], show, onClose, toggleActive }) => {
    return (
        <Modal show={show} onHide={onClose} size='lg'>
            <Modal.Body>
                <div className='d-flex gap-2 flex-wrap'>
                    {data.map((account, index) => {
                        return (
                            <div key={index}>
                                <Badge
                                    title='Click to toggle active'
                                    bg={account.active ? 'success' : 'danger'}
                                    onClick={() => toggleActive(account._id)}
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
