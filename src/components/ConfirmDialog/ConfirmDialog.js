import { Modal } from 'react-bootstrap';

const ConfirmDialog = ({ message, show, onConfirm, onClose, confirmLoading }) => {
    return (
        <Modal show={show} backdrop='static'>
            <Modal.Header>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message || 'Are you sure you want to delete this item?'}</p>
            </Modal.Body>
            <Modal.Footer>
                <button className='btn btn-primary' onClick={onConfirm} disabled={confirmLoading}>
                    {confirmLoading ? 'Loading...' : 'Yes'}
                </button>
                <button className='btn btn-default' onClick={onClose}>
                    No
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmDialog;
