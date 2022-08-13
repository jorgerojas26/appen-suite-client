const API_URL = process.env.REACT_APP_API_URL;

export const getStatus = async () => {
    const response = await fetch(`${API_URL}/status`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const data = await response.json();

    return { status: response.status, data };
};
