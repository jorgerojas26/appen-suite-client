const statistics = [];

for (let i = 0; i < 13; i++) {
    statistics.push({
        account_id: i,
        email: 'm' + Math.random().toString(36).substring(7) + '@gmail.com',
        task_status: 'collecting',
        fetch_count: Math.floor(Math.random() * 1000),
        foundCount: Math.floor(Math.random() * 10),
    });
}

export default statistics;
