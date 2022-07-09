import { useState } from 'react';
import { Card, Button, Badge, Container } from 'react-bootstrap';

const STATUS_COLOR = {
    active: 'success',
    mixed: 'warning',
    inactive: 'danger',
};

const Task = ({
    title,
    pay,
    level,
    onStatistics,
    collecting_count,
    paused_count,
    expired_count,
    waiting_for_resolution_count,
    onPause,
    onResume,
    onDelete,
    status,
}) => {
    const [paused, setPaused] = useState(status === 'inactive');

    const stateText = paused ? 'Resume' : 'Pause';
    const colorState = paused ? 'danger' : 'success';

    return (
        <Card>
            <Card.Header
                className={`fw-bold d-flex justify-content-between align-items-center gap-2 px-1 bg-${STATUS_COLOR[status]}`}
            >
                <Badge bg='light' className='text-dark'>
                    {pay}
                </Badge>
                <span
                    title={title}
                    className={`d-inline-block text-nowrap text-truncate bg-${STATUS_COLOR[status]}`}
                    style={{ maxWidth: '100%' }}
                >
                    {title}
                </span>
                <Badge>Level {level}</Badge>
            </Card.Header>
            <Card.Body>
                <Container className='d-flex flex-wrap gap-2 justify-content-center'>
                    <Badge>{waiting_for_resolution_count} resolving</Badge>
                    <Badge bg='success'>{collecting_count} collecting</Badge>
                    <Badge bg='danger'>{paused_count} paused</Badge>
                    <Badge bg='secondary'>{expired_count} expired</Badge>
                </Container>
            </Card.Body>
            <Card.Footer className='d-flex justify-content-center align-items-center gap-2 flex-wrap'>
                <Button variant='info' onClick={onStatistics}>
                    Stats
                </Button>
                <Button
                    variant='primary'
                    onClick={() => {
                        setPaused(!paused);
                        if (paused) {
                            onResume();
                        } else {
                            onPause();
                        }
                    }}
                >
                    {stateText}
                </Button>
                <Button variant='danger' onClick={onDelete}>
                    Delete
                </Button>
            </Card.Footer>
        </Card>
    );
};

export default Task;
