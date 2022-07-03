import { Button } from 'react-bootstrap';

const Toolbar = ({ onClick }) => {
    return (
        <div className='d-flex gap-2' onClick={onClick}>
            <Button name='accounts'>Accounts</Button>
            <Button name='blocks' variant='danger'>
                Blocks
            </Button>
            <Button name='favorites' variant='info'>
                Favorites
            </Button>
            <Button name='proxies' variant='warning'>
                Proxies
            </Button>
            {/* <Button name='settings' variant='secondary'>
                Settings
            </Button> */}
            <Button name='logout' variant='danger'>
                Logout
            </Button>
        </div>
    );
};

export default Toolbar;
