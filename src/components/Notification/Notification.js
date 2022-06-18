import { ToastContainer, Toast } from 'react-bootstrap';

function Notification({ show, message, onClose, delay }) {
    return (
        <ToastContainer position='bottom-end' style={{ zIndex: 1000000 }}>
            <Toast onClose={onClose} show={show} delay={delay ?? 5000} autohide>
                <Toast.Header className='d-flex justify-content-between'>
                    <strong className='mr-auto'>Notification</strong>
                </Toast.Header>
                <Toast.Body>
                    <p>{message}</p>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default Notification;
