const AccountsCount = ({ accounts = [] }) => {
    return (
        <div className='d-flex justify-content-center gap-2 w-100'>
            <label>Total:</label>
            <strong>{accounts.length}</strong>
            <label className='text-success'>Active:</label>
            <strong className='text-success'>
                {accounts.reduce((acc, current) => {
                    return current.status === 'active' ? acc + 1 : acc;
                }, 0)}
            </strong>
            <label className='text-danger'>Inactive:</label>
            <strong className='text-danger'>
                {accounts.reduce((acc, current) => {
                    return current.status !== 'active' ? acc + 1 : acc;
                }, 0)}
            </strong>
        </div>
    );
};

export default AccountsCount;
