/* eslint-disable no-undef */
import { useState, useEffect, useMemo } from 'react';
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
import { useNavigate } from 'react-router-dom';

import { create_tab } from '../browser/tabs';
import { start, stop } from '../services/controls';
import {
    setTaskAsResolved,
    pauseTaskInAllAccounts,
    resumeTaskInAllAccounts,
    deleteTaskInAllAccounts,
    pauseTask,
    resumeTask,
} from '../services/task';
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
    const [resolvingTasks, setResolvingTasks] = useState([]);

    const { data: statusData, mutate: updateStatusData } = useSWR('/status', null, {
        refreshInterval: Number(delay) / 2,
        revalidateOnFocus: false,
        //revalidateIfStale: true,
        refreshWhenHidden: true,
        errorRetryCount: 3,
        shouldRetryOnError: false,
        isPaused: () => paused,
    });

    const { data: accounts, mutate: updateAccounts } = useSWR('/accounts');

    const current_collecting_tasks = useMemo(() => {
        if (!statusData) {
            return [];
        }

        if (!statusData.accounts) {
            return [];
        }

        const collecting_tasks = {};

        statusData.accounts.forEach((account) => {
            account.current_collecting_tasks.forEach((task) => {
                const account_object = {
                    account_id: account._id,
                    email: account.email,
                    account_status: account.status,
                    fetch_count: task.fetch_count,
                    task_status: task.status,
                    loginError: account.loginError,
                    task_error_text: task.error_text,
                    pay: task.payout,
                    level: task.level,
                };
                collecting_tasks[task.id] = {
                    title: task.name,
                    pay: task.payout,
                    level: task.level,
                    status: task.status,
                    accounts: collecting_tasks[task.id]?.accounts
                        ? [...collecting_tasks[task.id].accounts, account_object]
                        : [account_object],
                };
            });
        });

        return collecting_tasks;
    }, [statusData]);

    const selected_task_statistics = current_collecting_tasks
        ? current_collecting_tasks[selectedTask.id]?.accounts
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
                setShowStatistics(false);
                setSelectedTask({ id: '', title: '' });
                setShowFavoritesModal(false);
                setShowBlocksModal(false);
                setShowAccountsModal(false);
                setShowProxiesModal(false);
                setScrapingEmail();
                setPauseLoading(false);
                setResolvingTasks([]);
                updateStatusData(() => null);
                updateAccounts(() => []);
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
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
        }
    }, []);

    useEffect(() => {
        getStatus().then((response) => {
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
                proxy: 'http://23.226.16.157:29842',
                cookies: [],
                task_id: '1120571',
                account_email: 'fluby87555@hotmail.com',
            });
        }
    }, []); */

    useEffect(() => {
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

        /* const proxyErrorListener = (details) => {
            console.log('ERROR details', details);
        }; */

        const filter = { urls: ['<all_urls>'] };

        if (window.browser) {
            window.browser.proxy.onRequest.addListener(proxyListener, filter);
            // window.browser.proxy.onError.addListener(proxyErrorListener);
        }

        return () => {
            if (window.browser) {
                window.browser.proxy.onRequest.removeListener(proxyListener);
                // window.browser.proxy.onError.removeListener(proxyErrorListener);
            }
        };
    }, []);

    useEffect(() => {
        if (statusData) {
            statusData.accounts.forEach((account) => {
                if (account.tasks_waiting_for_resolution && account.tasks_waiting_for_resolution.length) {
                    account.tasks_waiting_for_resolution.forEach((task) => {
                        const already_resolving = resolvingTasks.find(
                            (t) => t.id === task.id && t.account_email === account.email
                        );

                        if (!already_resolving) {
                            console.log('being resolving ', task.id, account.email);
                            setResolvingTasks((old) => [...old, { id: task.id, account_email: account.email }]);
                            if (window.browser) {
                                create_tab({
                                    url: task.url,
                                    proxy: task.proxy && `http://${task.proxy.host}:${task.proxy.port}`,
                                    cookies: account.cookieJar.cookies,
                                    task_id: task.id,
                                    account_email: account.email,
                                    onResolved: async () => {
                                        await setTaskAsResolved(account._id, task.id);
                                        updateStatusData((data) => ({
                                            ...data,
                                            accounts: data.accounts.map((a) => {
                                                if (a._id === account._id) {
                                                    return {
                                                        ...a,
                                                        tasks_waiting_for_resolution:
                                                            a.tasks_waiting_for_resolution.filter(
                                                                (t) => t.id !== task.id
                                                            ),
                                                    };
                                                }
                                                return a;
                                            }),
                                        }));
                                        setResolvingTasks((old) => old.filter((t) => t.id !== task.id));
                                    },
                                });
                            }
                        } else {
                            console.log('this task is already resolving', task, 'by this account', account.email);
                        }
                    });
                }
            });
        }
    }, [statusData]);

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
                    {current_collecting_tasks &&
                        Object.keys(current_collecting_tasks).map((key) => {
                            const task_name = current_collecting_tasks[key].title;
                            const pay = current_collecting_tasks[key].pay;
                            const level = current_collecting_tasks[key].level;
                            const accounts = current_collecting_tasks[key].accounts;

                            const collecting_count = accounts.reduce((acc, account) => {
                                if (account.task_status === 'collecting' && account.account_status === 'active') {
                                    return acc + 1;
                                }

                                return acc;
                            }, 0);

                            const paused_count = accounts.reduce((acc, account) => {
                                if (
                                    account.task_status === 'paused' ||
                                    account.task_status === 'error' ||
                                    account.account_status === 'inactive'
                                ) {
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

                            const allCollecting = accounts.every(
                                (account) => account.task_status === 'collecting' && account.account_status === 'active'
                            );
                            const someCollecting = accounts.some(
                                (account) => account.task_status === 'collecting' && account.account_status === 'active'
                            );

                            const allResolving = accounts.every(
                                (account) =>
                                    account.task_status === 'waiting-for-resolution' &&
                                    account.account_status === 'active'
                            );

                            const status = allCollecting
                                ? 'active'
                                : !allCollecting && someCollecting
                                ? 'mixed'
                                : allResolving
                                ? 'all_resolving'
                                : 'inactive';

                            return (
                                <Task
                                    key={key}
                                    status={status}
                                    title={task_name}
                                    pay={pay}
                                    level={level}
                                    waiting_for_resolution_count={waiting_for_resolution_count}
                                    collecting_count={collecting_count}
                                    paused_count={paused_count}
                                    expired_count={expired_count}
                                    onStatistics={() => showStatisticsHandler({ id: key, title: task_name })}
                                    onPause={() => pauseTaskInAllAccounts(key)}
                                    onResume={() => resumeTaskInAllAccounts(key)}
                                    onDelete={() => deleteTaskInAllAccounts(key)}
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
                                    onChange={(e) => setScrapingEmail(e.target.value)}
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
                    onPause={(account_id) => {
                        pauseTask(account_id, selectedTask.id);
                    }}
                    onResume={(account_id) => {
                        resumeTask(account_id, selectedTask.id);
                    }}
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
