import { useState } from 'react';
import { Modal } from 'react-bootstrap';

const AddItemModal = ({ show, onClose, onSubmit }) => {
    const [itemName, setItemName] = useState('');

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Add Item</Modal.Title>
            </Modal.Header>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit(itemName);
                }}
            >
                <Modal.Body>
                    <input
                        ref={(input) => input && setTimeout(() => input.focus())}
                        type='text'
                        placeholder='Item name'
                        className='form-control'
                        onChange={({ target: { value } }) => setItemName(value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <button type='submit' className='btn btn-primary'>
                        Add
                    </button>
                    <button type='button' className='btn btn-secondary' data-dismiss='modal' onClick={onClose}>
                        Close
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default AddItemModal;
