import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

const AddAccountModal = ({ show, onClose }) => {
    const [formData, setFormData] = useState({
        accountEmail: '',
        accountPassword: '',
        validateBeforeSaving: true,
    });

    const handleChange = (e) => {
        if (e.target.type === 'checkbox' || e.target.type === 'radio') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.checked,
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };

    return (
        <Modal show={show} onHide={onClose} enforceFocus autoFocus>
            <Modal.Header className='py-1' closeButton>
                <Modal.Title>Add Account</Modal.Title>
            </Modal.Header>
            <form>
                <Modal.Body>
                    <div className='form-group'>
                        <label htmlFor='accountEmail'>Account Email</label>
                        <input
                            type='text'
                            className='form-control'
                            name='accountEmail'
                            id='accountEmail'
                            value={formData.accountEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='accountPassword'>Account Password</label>
                        <input
                            type='password'
                            className='form-control'
                            name='accountPassword'
                            id='accountPassword'
                            value={formData.accountPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <label>
                        <input
                            title='Attempt to login to the account before saving to the database'
                            type='checkbox'
                            id='validateBeforeSaving'
                            name='validateBeforeSaving'
                            className='me-1 mt-2'
                            checked={formData.validateBeforeSaving}
                            onChange={handleChange}
                        />
                        validate?
                    </label>
                </Modal.Body>
                <Modal.Footer>
                    <Button type='submit' variant='success'>
                        Send
                    </Button>
                    <Button type='button' variant='danger' onClick={onClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default AddAccountModal;
