import { Badge } from 'react-bootstrap';

const STATUS_COLOR = {
    active: 'success',
    mixed: 'warning',
    inactive: 'danger',
};

const FavoritesItem = ({ title, status, onClick }) => {
    return (
        <Badge
            bg={STATUS_COLOR[status]}
            style={{ color: 'black' }}
            onClick={onClick}
            className='p-2 cursor-pointer'
            role='button'
            title='Ctrl + click to toggle all'
        >
            {title}
        </Badge>
    );
};

export default FavoritesItem;
