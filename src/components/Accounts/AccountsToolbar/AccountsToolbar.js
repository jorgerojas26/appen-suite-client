import { Button } from 'react-bootstrap';

const AccountsToolbar = ({ onClick }) => {
    const handleClick = (event) => {
        event.preventDefault();
        onClick(event.target.name);
    };

    return (
        <div className='d-flex pb-2 border-bottom border-dark w-100 justify-content-center gap-2'>
            <Button name='add' onClick={handleClick}>
                Add
            </Button>
            <Button name='earnings' variant='success' className='' onClick={handleClick}>
                Earnings
            </Button>
            <Button name='withdraw' variant='success' onClick={handleClick}>
                Withdraw
            </Button>
            <Button name='import' variant='info' onClick={handleClick}>
                Import
            </Button>
            <Button onClick={handleClick}>Export</Button>
        </div>
    );
};

export default AccountsToolbar;
