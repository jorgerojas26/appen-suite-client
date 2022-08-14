const API_URL = process.env.REACT_APP_API_URL;

export const createFavorite = async (item) => {
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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
    const token = localStorage.getItem('token');
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

export const deleteFavorite = async (favoriteId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    return { status: response.status, data };
};
