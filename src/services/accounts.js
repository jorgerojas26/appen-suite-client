const API_URL = process.env.REACT_APP_API_URL;

export const createAccount = async (accountData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(accountData),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const updateAccount = async (id, accountData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(accountData),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const deleteAccount = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/accounts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
    });

    return { status: response.status };
};
