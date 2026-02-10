const auth = {
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    getToken() {
        return localStorage.getItem('token');
    },

    async login(email, password) {
        const data = await api.request('/auth/login', 'POST', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        ui.toast('Logged in successfully', 'success');

        if (data.user.role === 'Student') router.navigate('/student-dashboard');
        else router.navigate('/teacher-dashboard');
    },

    async register(userData) {
        await api.request('/auth/register', 'POST', userData);
        ui.toast('Registration successful! Please login.', 'success');
        router.navigate('/login');
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        ui.toast('Logged out');
        router.navigate('/');
    },

    async refreshSession() {
        try {
            const user = await api.request('/auth/me');
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (err) {
            console.error('Session refresh failed:', err);
            return null;
        }
    }
};
