import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SWRConfig } from 'swr';
import { BrowserRouter } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const token = localStorage.getItem('token');

const fetcher = (key, ...args) =>
    fetch(`${API_URL}${key}`, {
        ...args,
        headers: {
            ...args.headers,
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => res.json());

ReactDOM.render(
    <React.StrictMode>
        <SWRConfig value={{ fetcher }}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SWRConfig>
    </React.StrictMode>,
    document.getElementById('root')
);
