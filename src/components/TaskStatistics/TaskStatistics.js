import { Offcanvas, Badge, Button } from 'react-bootstrap';
import StatisticsLegend, { LEGEND } from './StatisticsLegend';

const TaskStatistics = ({ placement, taskTitle, show, statistics, onClose, onPause, onResume }) => {
    return (
        <Offcanvas
            show={show}
            onHide={onClose}
            placement={placement || 'bottom'}
            backdrop={false}
            enforceFocus={false}
            autoFocus={false}
        >
            <Offcanvas.Header closeButton className='py-0 '>
                <div className='d-flex justify-content-center w-100'>
                    <Offcanvas.Title>{taskTitle}</Offcanvas.Title>
                </div>
            </Offcanvas.Header>
            <Offcanvas.Body className='bg-dark rounded border'>
                <div id='legend' className='mb-3'>
                    <StatisticsLegend />
                </div>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 5,
                    }}
                >
                    {statistics &&
                        statistics.map((account) => {
                            return (
                                <div
                                    key={account.account_id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 50px 25px 20px 20px',
                                        gap: 5,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Badge
                                        bg={LEGEND[account.task_status]}
                                        key={account.account_id}
                                        title={account.email}
                                    >
                                        {account.email}:
                                    </Badge>
                                    <Badge bg='secondary' className='text-light' title={account.fetch_count}>
                                        {account.fetch_count || 0}
                                    </Badge>
                                    <Badge bg='warning' className='text-dark' title={account.foundCount}>
                                        {account.foundCount || 0}
                                    </Badge>
                                    <Button
                                        variant={account.task_status === 'paused' ? 'primary' : 'danger'}
                                        className='py-0 px-1'
                                        title='Pause'
                                        onClick={() => {
                                            if (account.task_status === 'paused') {
                                                onResume(account.account_id);
                                            } else {
                                                onPause(account.account_id);
                                            }
                                        }}
                                    >
                                        {account.task_status === 'paused' ? 'R' : 'P'}
                                    </Button>
                                    <Button variant='danger' className='py-0 px-1' title='Delete'>
                                        D
                                    </Button>
                                </div>
                            );
                        })}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default TaskStatistics;
