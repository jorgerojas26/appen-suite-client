import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

function Signin() {
    const navigate = useNavigate();

    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) navigate('/');
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password, rememberMe } = e.target.elements;

        if (!email.value || !password.value) {
            setFormError('Please fill in all fields');
            return;
        }

        if (rememberMe) {
            localStorage.setItem('rememberMe', rememberMe.checked);
            localStorage.setItem('email', email.value);
        }

        try {
            const response = await login(email.value, password.value);

            if (response && response.status === 200) {
                localStorage.setItem('token', response.data.token);
                navigate('/');
            } else {
                setFormError(response ? response.data.message : 'Something went wrong');
            }
        } catch (err) {
            setFormError(err.message);
        }
    };

    return (
        <div className='d-flex justify-content-center align-items-center h-100 mx-3'>
            <Card style={{ width: '100%', maxWidth: 400 }}>
                <Card.Body className>
                    <div className='text-center mb-3'>
                        <Card.Title>Sign In</Card.Title>
                        <Card.Text>Sign in to your account</Card.Text>
                    </div>
                    <Card.Text>
                        <form className='d-flex flex-column gap-2' onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <input
                                    type='email'
                                    className='form-control'
                                    name='email'
                                    placeholder='Enter email'
                                    defaultValue={localStorage.getItem('email')}
                                    autoFocus={!localStorage.getItem('rememberMe')}
                                />
                            </div>
                            <div className='form-group'>
                                <input
                                    type='password'
                                    className='form-control'
                                    name='password'
                                    placeholder='Password'
                                    autoFocus={localStorage.getItem('rememberMe') === 'true'}
                                />
                            </div>
                            <div className='form-check'>
                                <input
                                    type='checkbox'
                                    className='form-check-input'
                                    name='rememberMe'
                                    defaultChecked={localStorage.getItem('rememberMe') === 'true'}
                                    onChange={(e) => localStorage.setItem('rememberMe', e.target.checked)}
                                />
                                <label className='form-check-label' htmlFor='rememberMe'>
                                    Remember me
                                </label>
                            </div>
                            {formError && <p className='text-danger text-center'>{formError}</p>}
                            <button type='submit' className='btn btn-primary mt-1'>
                                Submit
                            </button>
                        </form>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Signin;
