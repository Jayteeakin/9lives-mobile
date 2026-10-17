import axios from 'axios';

const BASE_URL = 'https://avata.pythonanywhere.com';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch and store CSRF token
let csrfToken = null;

const getCSRFToken = async () => {
    if (csrfToken) return csrfToken;
    try {
        const res = await api.get('/api/csrf/');
        csrfToken = res.data.csrfToken;
        return csrfToken;
    } catch (e) {
        return null;
    }
};

// Attach CSRF token to every POST request
api.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
        const token = await getCSRFToken();
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }
    }
    return config;
});

export const startGame    = (difficulty) => api.post('/api/start/', { difficulty });
export const newRound     = ()            => api.get('/api/new_round/');
export const submitGuess  = (guess)       => api.post('/api/guess/', { guess });
export const getLeaderboard = ()          => api.get('/api/leaderboard/');
export const startDaily   = ()            => api.get('/api/daily/');
export const registerUser = (username, password) => api.post('/api/register/', { username, password });
export const loginUser    = (username, password) => api.post('/api/login/', { username, password });
export const logoutUser   = ()            => api.post('/api/logout/', {});

export default api;

api.interceptors.request.use(async (config) => {
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
        const token = await getCSRFToken();
        console.log('CSRF Token:', token);
        console.log('Request URL:', config.url);
        if (token) {
            config.headers['X-CSRFToken'] = token;
        }
    }
    return config;
});