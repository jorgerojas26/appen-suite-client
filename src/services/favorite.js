const API_URL = process.env.REACT_APP_API_URL;

const token = localStorage.getItem('token');

export const createFavorite = async (item) => {
    const response = await fetch(`${API_URL}/favorites`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...item }),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const toggleFavoriteActive = async (accountId, favoriteId, active) => {
    console.log('toggleFavoriteActive', accountId, favoriteId, active);
    const response = await fetch(`${API_URL}/favorites/${accountId}/${favoriteId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const toggleFavoriteActiveInAllAccounts = async (favoriteId, active) => {
    const response = await fetch(`${API_URL}/favorites/undefined/${favoriteId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ active }),
    });

    const data = await response.json();

    return { status: response.status, data };
};
