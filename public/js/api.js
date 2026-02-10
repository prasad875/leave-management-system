const API_URL = (window.location.port !== '5001' && window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:5001/api'
    : '/api';

const api = {
    cache: new Map(),

    async request(endpoint, method = 'GET', body = null) {
        // Fast-Path: Client-side Caching for GET requests
        if (method === 'GET' && this.cache.has(endpoint)) {
            return this.cache.get(endpoint);
        }

        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        const options = {
            method,
            headers,
            ...(body && { body: JSON.stringify(body) })
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);

            // Handle non-JSON or empty responses gracefully
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.indexOf("application/json") !== -1) {
                data = await response.json();
            } else {
                data = { message: 'Unexpected server response format' };
            }

            if (!response.ok) {
                throw new Error(data.message || `Server error: ${response.status}`);
            }

            // Cache successful GET requests
            if (method === 'GET') {
                this.cache.set(endpoint, data);
                // Invalidate after 5 seconds for "near real-time" feel but instant navigation
                setTimeout(() => this.cache.delete(endpoint), 5000);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            ui.toast(error.message, 'error');
            throw error;
        }
    }
};

const ui = {
    toast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `px-6 py-4 rounded-2xl glass-card backdrop-blur-xl border-l-4 ${type === 'error' ? 'border-red-500' : 'border-blue-500'
            } transition-all transform translate-x-full opacity-0`;
        toast.innerHTML = `<p class="font-semibold">${message}</p>`;

        container.appendChild(toast);

        // GSAP animate in
        gsap.to(toast, { x: 0, opacity: 1, duration: 0.5 });

        setTimeout(() => {
            gsap.to(toast, { x: 100, opacity: 0, duration: 0.5, onComplete: () => toast.remove() });
        }, 3000);
    },

    setLoading(btn, loading) {
        if (loading) {
            btn.dataset.original = btn.innerHTML;
            btn.innerHTML = '<span class="loader w-5 h-5 border-2"></span>';
            btn.disabled = true;
        } else {
            btn.innerHTML = btn.dataset.original;
            btn.disabled = false;
        }
    }
};
