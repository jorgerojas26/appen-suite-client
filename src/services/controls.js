const API_URL = process.env.REACT_APP_API_URL;

const token = localStorage.getItem('token');

export const start = async ({ scraping_email, scraping_delay }) => {
    const response = await fetch(`${API_URL}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ scraping_email, scraping_delay }),
    });

    const data = await response.json();

    return { status: response.status, data };
};

export const stop = async () => {
    const response = await fetch(`${API_URL}/stop`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    return { status: response.status, data };
};
