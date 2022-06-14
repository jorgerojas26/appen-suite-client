import { useState } from 'react';
import { Card, Button, Badge, Container } from 'react-bootstrap';

const Task = ({ title, pay, level, onStatistics, onPause, onDelete }) => {
    const [paused, setPaused] = useState(false);

    const stateText = paused ? 'Resume' : 'Pause';
    const colorState = paused ? 'danger' : 'success';

    return (
        <Card>
            <Card.Header
                className={`fw-bold d-flex justify-content-between align-items-center gap-2 px-1 bg-${colorState}`}
            >
                <Badge bg="light" className="text-dark">
                    ${pay}
                </Badge>
                <span
                    title={title}
                    className={`d-inline-block text-nowrap text-truncate bg-${colorState}`}
                    style={{ maxWidth: '100%' }}
                >
                    {title}
                </span>
                <Badge>Level {level}</Badge>
            </Card.Header>
            <Card.Body>
                <Container className="d-flex flex-wrap gap-2 justify-content-center">
                    <Badge bg="success">7 collecting</Badge>
                    <Badge bg="danger">3 paused</Badge>
                    <Badge bg="secondary">2 expired</Badge>
                </Container>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                <Button variant="info" onClick={onStatistics}>
                    Statistics
                </Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        setPaused(!paused);
                        onPause && onPause();
                    }}
                >
                    {stateText}
                </Button>
                <Button variant="danger" onClick={onDelete}>
                    Delete
                </Button>
            </Card.Footer>
        </Card>
    );
};

export default Task;
