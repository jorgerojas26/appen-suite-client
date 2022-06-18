const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        return { status: response.status, data };
    } catch (error) {
        console.log(error);
    }
};
