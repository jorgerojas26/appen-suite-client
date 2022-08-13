import { Table } from 'react-bootstrap';

const TaskListTable = ({ data }) => {
    return (
        <Table bordered hover variant='dark' size='sm'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>JOB TITLE</th>
                    <th>LEVEL</th>
                    <th>PAY / TASK</th>
                    <th># OF TASKS</th>
                    <th>RATING</th>
                </tr>
            </thead>
            <tbody className='animated-rows'>
                {data &&
                    data.map((task) => (
                        <tr key={task.id}>
                            <td>{task.id}</td>
                            <td>
                                <a href={task.url}>{task.jobTitle}</a>
                            </td>
                            <td>{task.level}</td>
                            <td>{task.pay}</td>
                            <td>{task.numOfTasks}</td>
                            <td>{task.rating}</td>
                        </tr>
                    ))}
            </tbody>
        </Table>
    );
};

export default TaskListTable;
