/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';

import TimeStarter from 'components/TimeStarter';
import FavoritesModal from 'components/Favorites/FavoritesModal';
import BlocksModal from 'components/Blocks/BlocksModal';
import AccountsModal from 'components/Accounts/AccountsModal';
import TaskStatistics from 'components/TaskStatistics';
import TaskListTable from 'components/TaskListTable';
import Toolbar from 'components/Toolbar';
import Task from 'components/Task';
import ProxiesModal from 'components/ProxiesModal';

import favoritesMock from 'mocks/favorites';
import blocksMock from 'mocks/blocks';
import { Navigate, useNavigate } from 'react-router-dom';

import { create_tab } from '../browser/tabs';
import { start, stop } from '../services/controls';
import { getStatus } from '../services/status';
import useSWR from 'swr';

function Home() {
    const navigate = useNavigate();

    /* if (browser && browser?.contextualIdentities) {
        browser.contextualIdentities.query({}).then((identities) => {
            console.log('identities', identities);
        });
    } */

    const [showStatistics, setShowStatistics] = useState(false);
    const [selectedTask, setSelectedTask] = useState({
        id: '',
        title: '',
    });
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [showBlocksModal, setShowBlocksModal] = useState(false);
    const [showAccountsModal, setShowAccountsModal] = useState(false);
    const [showProxiesModal, setShowProxiesModal] = useState(false);
    const [paused, setPaused] = useState(true);
    const [delay, setDelay] = useState(1000);
    const [scrapingEmail, setScrapingEmail] = useState();
    const [pauseLoading, setPauseLoading] = useState(false);

    const { data: statusData, mutate: updateStatusData } = useSWR('/status', null, {
        refreshInterval: Number(delay) / 2,
        revalidateOnFocus: false,
        //revalidateIfStale: true,
        refreshWhenHidden: true,
        errorRetryCount: 3,
        shouldRetryOnError: false,
        isPaused: () => paused,
    });

    const { data: accounts } = useSWR('/accounts');

    const selected_task_statistics = statusData?.current_collecting_tasks
        ? statusData.current_collecting_tasks[selectedTask.id]?.accounts
        : {};

    const onToolbarClick = (event) => {
        switch (event.target.name) {
            case 'accounts':
                setShowAccountsModal(true);
                break;
            case 'blocks':
                setShowBlocksModal(true);
                break;
            case 'favorites':
                setShowFavoritesModal(true);
                break;
            case 'proxies':
                setShowProxiesModal(true);
                break;
            case 'logout':
                localStorage.removeItem('token');
                navigate('/signin');
                break;
            default:
        }
    };

    const showStatisticsHandler = (task) => {
        if (task.id === selectedTask) {
            return setShowStatistics(!showStatistics);
        }

        setSelectedTask({ id: task.id, title: task.title });
        setShowStatistics(true);
    };

    useEffect(() => {
        getStatus().then((response) => {
            console.log('updateFirstStatusData', response);
            if (response.status !== 200 || !response.data || response.data.error === 'No scraping is running') {
                return setPaused(true);
            } else if (response.data && response.data.scraping_stopped === false) {
                setPaused(false);
                setScrapingEmail(response.data.scraping_email);
            }
        });
    }, []);

    useEffect(() => {
        if (accounts && accounts.length) {
            setScrapingEmail(accounts[0].email);
        }
    }, [accounts]);

    /* useEffect(() => {
        if (window.browser) {
            create_tab({
                url: 'https://whoer.net',
                proxy: 'http://31.40.227.231:8800',
                cookies: [],
                task_id: '1120571',
                account_email: 'fluby87555@hotmail.com',
            });
        }
    }, []); */

    useEffect(() => {
        // BINGO! This method can catch proxy info.
        const proxyListener = async (requestDetails) => {
            const cookieStoreId = requestDetails.cookieStoreId;
            const identity = await browser.contextualIdentities.get(cookieStoreId);
            const proxy_string = identity.name.split('-')[1];
            const proxy_url = new URL(proxy_string);
            const proxy_host = proxy_url.hostname;
            const proxy_port = proxy_url.port || 80;

            if (proxy_string) {
                return {
                    type: 'http',
                    host: proxy_host,
                    port: proxy_port,
                };
            }

            return null;
        };

        const proxyErrorListener = (details) => {
            console.log('ERROR details', details);
        };

        const filter = { urls: ['<all_urls>'] };

        if (window.browser) {
            window.browser.proxy.onRequest.addListener(proxyListener, filter);
            window.browser.proxy.onError.addListener(proxyErrorListener);
        }

        return () => {
            if (window.browser) {
                window.browser.proxy.onRequest.removeListener(proxyListener);
                window.browser.proxy.onError.removeListener(proxyErrorListener);
            }
        };
    }, []);

    /* useEffect(() => {
        if (statusData) {
            statusData.accounts.forEach((account) => {
                if (account.tasks_waiting_for_resolution && account.tasks_waiting_for_resolution.length) {
                    account.tasks_waiting_for_resolution.forEach((task) => {
                        if (window.browser) {
                            window.browser.tabs.create({
                                active: true,
                                url: `${task.url}&proxy=${task.proxy.host}`,
                            });
                        }
                    });
                }
            });
        }
    }, [statusData]); */

    if (!localStorage.getItem('token')) {
        return <Navigate to='/signin' />;
    }

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
                                response = await start({
                                    scraping_email: scrapingEmail,
                                    scraping_delay: delay,
                                });
                            } else {
                                response = await stop();
                            }

                            if (response.status === 200) {
                                if (paused === false) {
                                    updateStatusData();
                                }
                                setPaused(paused);
                                setDelay(delay);
                            } else {
                                alert(response.data.error);
                            }
                        } catch (error) {
                            alert(error);
                        } finally {
                            setPauseLoading(false);
                        }
                    }}
                    disabled={!scrapingEmail || !delay}
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
                    {statusData &&
                        statusData.current_collecting_tasks &&
                        Object.keys(statusData.current_collecting_tasks).map((key) => {
                            const task_name = statusData.current_collecting_tasks[key].title;
                            const pay = statusData.current_collecting_tasks[key].pay;
                            const level = statusData.current_collecting_tasks[key].level;
                            const accounts = statusData.current_collecting_tasks[key].accounts;

                            const collecting_count = accounts.reduce((acc, account) => {
                                if (account.task_status === 'collecting') {
                                    return acc + 1;
                                }

                                return acc;
                            }, 0);

                            const paused_count = accounts.reduce((acc, account) => {
                                if (account.task_status === 'paused') {
                                    return acc + 1;
                                }

                                return acc;
                            }, 0);

                            const expired_count = accounts.reduce((acc, account) => {
                                if (account.task_status === 'expired') {
                                    return acc + 1;
                                }

                                return acc;
                            }, 0);

                            const waiting_for_resolution_count = accounts.reduce((acc, account) => {
                                if (account.task_status === 'waiting-for-resolution') {
                                    return acc + 1;
                                }

                                return acc;
                            }, 0);

                            return (
                                <Task
                                    key={key}
                                    title={task_name}
                                    pay={pay}
                                    level={level}
                                    waiting_for_resolution_count={waiting_for_resolution_count}
                                    collecting_count={collecting_count}
                                    paused_count={paused_count}
                                    expired_count={expired_count}
                                    onStatistics={() => showStatisticsHandler({ id: key, title: task_name })}
                                />
                            );
                        })}
                </div>
            </Container>
            <Container fluid className='pt-4 border-top'>
                <Row>
                    <Col xs='12'>
                        <Container fluid className='d-flex justify-content-around mb-2'>
                            <h4 className='text-light'>Task List</h4>
                            <div className='d-flex flex-column align-items-center'>
                                <select
                                    className='py-0 px-3 m-0'
                                    onChange={(value) => setScrapingEmail(value)}
                                    value={scrapingEmail}
                                    disabled={!accounts || !accounts.length}
                                >
                                    {accounts?.map((account) => (
                                        <option key={account._id} value={account.email}>
                                            {account.email}
                                        </option>
                                    ))}
                                </select>
                                {(accounts?.length === 0 || !accounts) && (
                                    <h6 className='text-danger'>No accounts found. Please add one.</h6>
                                )}
                            </div>
                            <h4 className='text-light'>New Tasks</h4>
                        </Container>
                    </Col>
                    <Col xs='12' md='6'>
                        <TaskListTable data={statusData?.task_list} />
                    </Col>
                    <Col xs='6'>
                        {/* TODO: Add new tasks logic */}
                        <TaskListTable data={[]} />
                    </Col>
                </Row>
            </Container>
            {showStatistics && (
                <TaskStatistics
                    show={showStatistics}
                    taskTitle={selectedTask.title}
                    onClose={() => setShowStatistics(false)}
                    statistics={selected_task_statistics}
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
            {showProxiesModal && <ProxiesModal show={showProxiesModal} onClose={() => setShowProxiesModal(false)} />}
        </Container>
    );
}

export default Home;
