const statistics = [];

for (let i = 0; i < 13; i++) {
    statistics.push({
        accountId: i,
        accountEmail: 'm' + Math.random().toString(36).substring(7) + '@gmail.com',
        status: 'collecting',
        fetchCount: Math.floor(Math.random() * 1000),
        foundCount: Math.floor(Math.random() * 10),
    });
}

export default statistics;
