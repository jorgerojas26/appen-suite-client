const API_URL = process.env.REACT_APP_API_URL;

const token = localStorage.getItem('token');

export const setTaskAsResolved = async (account_id, taskId) => {
    const response = await fetch(`${API_URL}/tasks/${account_id}/${taskId}/resolve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return true;
    }

    return false;
};

export const pauseTask = async (account_id, taskId) => {
    const response = await fetch(`${API_URL}/tasks/${account_id}/${taskId}/pause`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return true;
    }

    return false;
};

export const resumeTask = async (account_id, taskId) => {
    const response = await fetch(`${API_URL}/tasks/${account_id}/${taskId}/resume`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return true;
    }

    return false;
};

export const pauseTaskInAllAccounts = async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/pause/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return true;
    }

    return false;
};

export const resumeTaskInAllAccounts = async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/resume/${taskId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return true;
    }

    return false;
};

export const deleteTaskInAllAccounts = async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/undefined/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 200) {
        return true;
    }

    return false;
};
