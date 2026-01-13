/**
 * Auth View Components
 */
const AuthViews = {
    login: function () {
        return `
            <div class="fade-in flex justify-center items-center" style="min-height: 70vh;">
                <div class="card" style="width: 100%; max-width: 400px;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h2>Welcome Back</h2>
                        <p class="text-muted">Login to continue to RentWheels</p>
                    </div>
                    
                    <form onsubmit="AuthViews.handleLogin(event)" class="flex flex-col gap-4">
                        <div>
                            <label class="text-sm font-bold" style="margin-bottom: 0.5rem; display: block;">Email</label>
                            <input type="email" id="email" class="input" placeholder="you@example.com" required value="demo@rentwheels.com">
                        </div>
                        <div>
                            <label class="text-sm font-bold" style="margin-bottom: 0.5rem; display: block;">Password</label>
                            <input type="password" id="password" class="input" placeholder="••••••••" required value="password">
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Log In</button>
                    </form>

                    <div style="margin-top: 1.5rem; text-align: center;">
                        <p class="text-sm text-muted">
                            Don't have an account? 
                            <a href="#" class="text-primary font-bold" onclick="app.navigate('signup')">Sign Up</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    signup: function () {
        return `
             <div class="fade-in flex justify-center items-center" style="min-height: 70vh;">
                <div class="card" style="width: 100%; max-width: 400px;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h2>Create Account</h2>
                        <p class="text-muted">Join the RentWheels community</p>
                    </div>
                    
                    <form onsubmit="AuthViews.handleSignup(event)" class="flex flex-col gap-4">
                         <div>
                            <label class="text-sm font-bold" style="margin-bottom: 0.5rem; display: block;">Full Name</label>
                            <input type="text" id="signup-name" class="input" placeholder="John Doe" required>
                        </div>
                        <div>
                            <label class="text-sm font-bold" style="margin-bottom: 0.5rem; display: block;">Email</label>
                            <input type="email" id="signup-email" class="input" placeholder="you@example.com" required>
                        </div>
                        <div>
                            <label class="text-sm font-bold" style="margin-bottom: 0.5rem; display: block;">Location</label>
                            <select id="signup-location" class="input" required>
                                <option value="" disabled selected>Select your city (Delhi, Bangalore, Mumbai)</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Bangalore">Bangalore</option>
                                <option value="Mumbai">Mumbai</option>
                            </select>
                        </div>
                        <div>
                            <label class="text-sm font-bold" style="margin-bottom: 0.5rem; display: block;">Password</label>
                            <input type="password" id="signup-password" class="input" placeholder="••••••••" required>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Sign Up</button>
                    </form>

                     <div style="margin-top: 1.5rem; text-align: center;">
                        <p class="text-sm text-muted">
                            Already have an account? 
                            <a href="#" class="text-primary font-bold" onclick="app.navigate('login')">Log In</a>
                        </p>
                    </div>
                </div>
            </div>
        `;
    },

    handleLogin: async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = e.target.querySelector('button');

        btn.textContent = 'Logging in...';
        btn.disabled = true;

        const result = await store.login(email, password);

        if (result.success) {
            app.checkAuth();
            app.navigate('home');
        } else {
            alert(result.message || 'Login failed');
            btn.textContent = 'Log In';
            btn.disabled = false;
        }
    },

    handleSignup: async function (e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const location = document.getElementById('signup-location').value;
        const password = document.getElementById('signup-password').value;
        const btn = e.target.querySelector('button');

        btn.textContent = 'Creating Account...';
        btn.disabled = true;

        const result = await store.signup(name, email, password, location);

        if (result.success) {
            app.checkAuth();
            app.navigate('home');
        } else {
            alert(result.message || 'Signup failed');
            btn.textContent = 'Sign Up';
            btn.disabled = false;
        }
    }
};
