import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import Task from 'components/Task';
import TaskStatistics from 'components/TaskStatistics';
import TaskListTable from 'components/TaskListTable';
import Toolbar from 'components/Toolbar';

import FavoritesModal from 'components/Favorites/FavoritesModal';
import BlocksModal from 'components/Blocks/BlocksModal';
import AccountsModal from 'components/Accounts/AccountsModal';

import { tasks as tasksMock, taskList as taskListMock } from 'mocks/tasks';
import favoritesMock from 'mocks/favorites';
import statisticsMock from 'mocks/statistics';
import accountsMock from 'mocks/accounts';
import blocksMock from 'mocks/blocks';
import TimeStarter from 'components/TimeStarter';
import { start, stop } from './services/controls';

import useSWR from 'swr';

function App() {
    const [showStatistics, setShowStatistics] = useState(false);
    const [selectedTaskTitle, setSelectedTaskTitle] = useState('');
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [showBlocksModal, setShowBlocksModal] = useState(false);
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const [paused, setPaused] = useState(true);
    const [delay, setDelay] = useState(1000);
    const [scrapingEmail, setScrapingEmail] = useState();
    const [pauseLoading, setPauseLoading] = useState(false);
    const { data } = useSWR(!paused && delay ? '/status' : null, null, {
        refreshInterval: Number(delay) / 2,
        revalidateOnFocus: false,
        //revalidateIfStale: true,
        refreshWhenHidden: true,
    });

    const { data: accounts } = useSWR('/accounts');

    const onToolbarClick = (event) => {
        switch (event.target.name) {
            case 'favorites':
                setShowFavoritesModal(true);
                break;
            case 'blocks':
                setShowBlocksModal(true);
                break;
            case 'accounts':
                setShowAccountsModal(true);
                break;
            default:
        }
    };

    const showStatisticsHandler = (task) => {
        if (task.title === selectedTaskTitle) {
            return setShowStatistics(!showStatistics);
        }

        setSelectedTaskTitle(task.title);
        setShowStatistics(true);
    };

    useEffect(() => {
        if (accounts && accounts.length) {
            setScrapingEmail(accounts[0].email);
        }
    }, [accounts]);

    return (
        <Container fluid className='p-0'>
            <Container
                fluid
                className='d-flex p-2 align-items-center justify-content-between border-bottom border-light gap-2'
            >
                <TimeStarter
                    paused={paused}
                    loading={pauseLoading}
                    onToggle={async ({ paused, delay }) => {
                        let response;

                        try {
                            setPauseLoading(true);
                            if (paused === false) {
                                response = await start({ scraping_email: scrapingEmail, scraping_delay: delay });
                            } else {
                                response = await stop();
                            }

                            if (response.status === 200) {
                                setPaused(paused);
                                setDelay(delay);
                            }
                        } catch (error) {
                            alert(error);
                        } finally {
                            setPauseLoading(false);
                        }
                    }}
                />
                <Toolbar onClick={onToolbarClick} />
            </Container>
            <Container fluid className='d-flex mb-4 '></Container>
            <Container fluid className='mb-5 p-0'>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 10,
                    }}
                >
                    {tasksMock.map((task, index) => (
                        <Task
                            key={index}
                            title={task.title}
                            pay={task.pay}
                            level={task.level}
                            onStatistics={() => showStatisticsHandler(task)}
                        />
                    ))}
                </div>
            </Container>
            <Container fluid className='pt-4 border-top'>
                <Row>
                    <Col xs='12'>
                        <Container fluid className='d-flex justify-content-around mb-2'>
                            <h4 className='text-light'>Task List</h4>
                            <select
                                className='py-0 px-3 m-0'
                                onChange={(value) => setScrapingEmail(value)}
                                value={scrapingEmail}
                            >
                                {accounts?.map((account, index) => (
                                    <option key={account._id} value={account.email}>
                                        {account.email}
                                    </option>
                                ))}
                            </select>
                            <h4 className='text-light'>New Tasks</h4>
                        </Container>
                    </Col>
                    <Col xs='12' md='6'>
                        <TaskListTable data={taskListMock} />
                    </Col>
                    <Col xs='6'>
                        <TaskListTable data={taskListMock} />
                    </Col>
                </Row>
            </Container>
            {showStatistics && (
                <TaskStatistics
                    show={showStatistics}
                    taskTitle={selectedTaskTitle}
                    onClose={() => setShowStatistics(false)}
                    statistics={statisticsMock}
                />
            )}
            {showFavoritesModal && (
                <FavoritesModal
                    data={favoritesMock}
                    show={showFavoritesModal}
                    onClose={() => setShowFavoritesModal(false)}
                />
            )}
            {showBlocksModal && (
                <BlocksModal
                    data={blocksMock}
                    show={showBlocksModal}
                    onClose={() => setShowBlocksModal(false)}
                    onDelete={(item) => console.log(item)}
                />
            )}
            {showAccountsModal && (
                <AccountsModal show={showAccountsModal} onClose={() => setShowAccountsModal(false)} />
            )}
        </Container>
    );
}

export default App;
