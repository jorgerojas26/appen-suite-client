import { useState } from 'react';
import { Card } from 'react-bootstrap';
import { BookmarkCheckFill, BookmarkDashFill, CaretDown, Eye, EyeSlash, Trash } from 'react-bootstrap-icons';
import ConfirmDialog from 'components/ConfirmDialog';

const AccountCard = ({ data, onSave }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [formData, setFormData] = useState({
        email: data?.email ?? '',
        password: data?.password ?? '',
        active: data?.status === 'active' ?? false,
        emailError: false,
        passwordError: false,
    });

    const [viewPassword, setViewPassword] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        // TODO: API call to save account changes to server database
        if (!formData.email) {
            setFormData({ ...formData, emailError: true });
        }
        if (!formData.password) {
            setFormData({ ...formData, passwordError: true });
        }
        onSave && onSave(formData);
        console.log('submitting', formData);
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleDelete = () => {
        // TODO: API call to delete account from server database
        console.log('deleting', data);
    };

    const toggleViewPassword = (event) => {
        setViewPassword(!viewPassword);
    };

    const toggleAccountActive = () => {
        setFormData({
            ...formData,
            active: !formData.active,
        });
    };

    return (
        <>
            <Card className='col-12'>
                <Card.Header
                    className='d-flex justify-content-between'
                    onClick={() => setIsExpanded(!isExpanded)}
                    role='button'
                >
                    <div>
                        <Trash
                            size={20}
                            role='button'
                            color='red'
                            onClick={(event) => {
                                event.stopPropagation();
                                setShowConfirmDialog(true);
                            }}
                        />
                    </div>
                    <div className='d-flex gap-2 align-items-center'>
                        {data?.status === 'active' ? (
                            <BookmarkCheckFill size={20} color='green' />
                        ) : (
                            <BookmarkDashFill size={20} color='red' />
                        )}
                        <label className='mr-4' role='button'>
                            {data.email}
                        </label>
                    </div>
                    <CaretDown size={20} />
                </Card.Header>
                <Card.Body className={(!isExpanded && 'd-none') || ''}>
                    <form className='d-flex gap-2' onSubmit={handleSubmit}>
                        <div className='d-flex align-items-center'>
                            {formData.active ? (
                                <BookmarkCheckFill
                                    size={20}
                                    color='green'
                                    role='button'
                                    onClick={toggleAccountActive}
                                />
                            ) : (
                                <BookmarkDashFill size={20} color='red' role='button' onClick={toggleAccountActive} />
                            )}
                        </div>
                        <div className='form-floating'>
                            <input
                                id='accountEmail'
                                name='email'
                                type='email'
                                className='form-control'
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor='accountEmail'>Email</label>
                        </div>
                        <div className='form-floating'>
                            <input
                                id='accountPassword'
                                name='password'
                                type={viewPassword ? 'text' : 'password'}
                                className='form-control pe-5'
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor='accountPassword'>Password</label>
                            <div className='position-absolute top-50 end-0 start-75 translate-middle'>
                                {viewPassword ? (
                                    <EyeSlash size={25} onClick={toggleViewPassword} role='button' />
                                ) : (
                                    <Eye size={25} onClick={toggleViewPassword} role='button' />
                                )}
                            </div>
                        </div>

                        <button className='btn btn-primary'>Save</button>
                    </form>
                </Card.Body>
            </Card>
            {showConfirmDialog && (
                <ConfirmDialog
                    show={showConfirmDialog}
                    message='Are you sure you want to delete this account?'
                    onConfirm={handleDelete}
                    onClose={() => setShowConfirmDialog(false)}
                />
            )}
        </>
    );
};

export default AccountCard;
