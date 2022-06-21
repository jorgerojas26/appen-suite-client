import { useState } from 'react';

import { Button, Spinner } from 'react-bootstrap';

const TimeStarter = ({ paused, onToggle, loading, disabled }) => {
    const [delay, setDelay] = useState(1000);

    const toggle = () => {
        onToggle && onToggle({ paused: !paused, delay });
    };

    const changeDelay = (e) => {
        setDelay(e.target.value);
    };

    return (
        <div className='d-flex gap-2'>
            <div className='input-group'>
                <input
                    type='number'
                    min={1000}
                    step={1000}
                    value={delay}
                    className='text-end form-control'
                    onChange={changeDelay}
                />
                <span className='input-group-text'>ms</span>
            </div>
            <Button variant={paused ? 'success' : 'danger'} onClick={toggle} disabled={disabled}>
                {loading ? <Spinner animation='border' size='sm' /> : paused ? 'Start' : 'Pause'}
            </Button>
        </div>
    );
};

export default TimeStarter;
