const API_URL = process.env.REACT_APP_API_URL;

export const saveProxy = async (proxyUrl) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/proxies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proxyUrl }),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const saveProxyBulk = async (proxies) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/proxies/bulk`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ proxies }),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const deleteProxy = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/proxies/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    return { status: response.status, data };
};
