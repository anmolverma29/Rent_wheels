/**
 * RentWheels Main Application Logic
 * Handles Routing and Initialization
 */

const app = {
    currentPage: 'home',
    root: document.getElementById('app-root'),

    init: async function () {
        console.log('RentWheels App Initialized');
        await store.init();
        this.checkAuth();
        this.navigate('home');
    },

    checkAuth: function () {
        // Check if user is logged in (mock)
        const user = store.getUser();
        const authBtns = document.getElementById('auth-buttons');
        if (user) {
            authBtns.innerHTML = `
                <a href="#" class="nav-link" onclick="app.navigate('messages')" title="Messages">
                    <i data-lucide="message-square" style="width:20px;"></i>
                </a>
                <a href="#" class="nav-link" onclick="app.navigate('profile')">
                    <i data-lucide="user" style="width:18px;"></i> ${user.name}
                </a>
            `;
            lucide.createIcons();
        } else {
            authBtns.innerHTML = `
                <a href="#" class="btn btn-outline" style="padding: 0.5rem 1rem;" onclick="app.navigate('login')">Log In</a>
                <a href="#" class="btn btn-primary" style="padding: 0.5rem 1rem;" onclick="app.navigate('signup')">Sign Up</a>
            `;
        }
    },

    navigate: function (viewName, params = {}) {
        this.currentPage = viewName;
        this.root.innerHTML = ''; // Clear content
        window.scrollTo(0, 0);

        let content = '';

        switch (viewName) {
            case 'home':
                content = RenterViews.home();
                break;
            case 'login':
                content = AuthViews.login();
                break;
            case 'signup':
                content = AuthViews.signup();
                break;
            case 'search':
                content = RenterViews.search();
                break;
            case 'my-vehicles':
                content = OwnerViews.dashboard();
                break;
            case 'add-vehicle':
                content = OwnerViews.addVehicle();
                break;
            case 'profile':
                content = SharedViews.profile();
                break;
            case 'messages':
                content = SharedViews.messages();
                break;
            case 'bookings':
                content = SharedViews.bookings();
                break;
            case 'notifications':
                content = SharedViews.notifications();
                break;
            case 'help':
                content = SharedViews.help();
                break;
            case 'vehicle':
                // params.id is passed from the navigate call
                content = RenterViews.details(params.id);
                break;
            // Add other routes here
            default:
                content = `
                    <div class="flex flex-col items-center justify-center" style="min-height: 50vh;">
                        <h1>404</h1>
                        <p class="text-muted">Page not found</p>
                        <button class="btn btn-primary mt-4" onclick="app.navigate('home')">Go Home</button>
                    </div>
                `;
        }

        this.root.innerHTML = content;

        // Re-initialize icons for new content
        lucide.createIcons();

        // Run post-render scripts (e.g., map init)
        if (viewName === 'search') {
            RenterViews.initMap();
        }
    }
};

// Initialize after DOM load
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
