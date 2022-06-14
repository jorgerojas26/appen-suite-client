const accounts = [];

for (let i = 0; i < 13; i++) {
    accounts.push({
        id: i,
        email: 'm' + Math.random().toString(36).substring(7) + '@gmail.com',
        password: 'm' + Math.random().toString(36).substring(7),
        active: i % 2 === 0,
    });
}

export default accounts;
