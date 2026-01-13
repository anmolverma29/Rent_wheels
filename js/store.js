/**
 * Mock Store and Data Management
 */
const store = {
    API_URL: '/api',

    state: {
        user: JSON.parse(localStorage.getItem('rw_user')) || null,
        token: localStorage.getItem('rw_token') || null,
        vehicles: []
    },

    init: async function () {
        try {
            const res = await fetch(`${this.API_URL}/vehicles`);
            if (res.ok) {
                this.state.vehicles = await res.json();
                console.log('Vehicles loaded:', this.state.vehicles.length);
            }
        } catch (e) {
            console.error('Failed to load vehicles:', e);
        }
    },

    login: async function (email, password) {
        try {
            const res = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                this._setUser(data.user, data.token);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    signup: async function (name, email, password, location) {
        try {
            const res = await fetch(`${this.API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, location })
            });
            const data = await res.json();

            if (res.ok) {
                this._setUser(data.user, data.token);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (e) {
            return { success: false, message: 'Network error' };
        }
    },

    logout: function () {
        this.state.user = null;
        this.state.token = null;
        localStorage.removeItem('rw_user');
        localStorage.removeItem('rw_token');
    },

    _setUser: function (user, token) {
        this.state.user = user;
        this.state.token = token;
        localStorage.setItem('rw_user', JSON.stringify(user));
        localStorage.setItem('rw_token', token);
    },

    getUser: function () {
        return this.state.user;
    },

    getVehicles: function () {
        return this.state.vehicles;
    },

    book: async function (bookingData) {
        try {
            const res = await fetch(`${this.API_URL}/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            const data = await res.json();
            return { success: res.ok, message: data.message };
        } catch (e) {
            console.error(e);
            return { success: false, message: 'Network error' };
        }
    },

    getBookings: async function (userId) {
        try {
            const res = await fetch(`${this.API_URL}/my-bookings?userId=${userId}`);
            if (res.ok) {
                return await res.json();
            }
            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    getAllUsers: async function () {
        try {
            const res = await fetch(`${this.API_URL}/users`);
            if (res.ok) {
                return await res.json();
            }
            return [];
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    uploadLicense: async function (userId) {
        try {
            const res = await fetch(`${this.API_URL}/upload-license`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            if (res.ok) {
                // Update local state
                this.state.user.licenseUploaded = true;
                localStorage.setItem('rw_user', JSON.stringify(this.state.user));
                return true;
            }
            return false;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};
