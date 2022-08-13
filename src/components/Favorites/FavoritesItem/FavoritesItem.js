import { Badge } from 'react-bootstrap';
import { X } from 'react-feather';

const STATUS_COLOR = {
    active: 'success',
    mixed: 'warning',
    inactive: 'danger',
};

const FavoritesItem = ({ title, status, onClick, onDelete }) => {
    return (
        <div className='position-relative'>
            <Badge
                bg='light'
                pill
                className='p-0 position-absolute'
                style={{ top: '-3px', right: '-3px' }}
                role='button'
                onClick={onDelete}
            >
                <X color='black' size={15} />
            </Badge>
            <Badge
                bg={STATUS_COLOR[status]}
                style={{ color: 'black' }}
                onClick={onClick}
                className='py-3 cursor-pointer'
                role='button'
                title='Ctrl + click to toggle all'
            >
                {title}
            </Badge>
        </div>
    );
};

export default FavoritesItem;
