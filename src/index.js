import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SWRConfig } from 'swr';

const API_URL = process.env.REACT_APP_API_URL;
const fetcher = (key, ...args) => fetch(`${API_URL}${key}`, ...args).then((res) => res.json());

ReactDOM.render(
    <React.StrictMode>
        <SWRConfig value={{ fetcher }}>
            <App />
        </SWRConfig>
    </React.StrictMode>,
    document.getElementById('root')
);
