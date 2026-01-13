/**
 * Renter View Components
 */
const RenterViews = {
    currentFilter: 'all', // 'all', 'car', 'bike'

    home: function () {
        const vehicles = store.getVehicles().slice(0, 4); // Show 4 items
        const vehicleCards = vehicles.map((v, index) => this._renderCard(v, index)).join('');

        return `
            <!-- Fixed Full-Screen Background (3D City) -->
            <div id="hero-bg-image" style="position: fixed; inset: 0; background-image: url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1920&auto=format&fit=crop'); background-size: cover; background-position: center; transition: transform 0.1s ease-out; transform: scale(1.1); z-index: 0;"></div>
            <div style="position: fixed; inset: 0; background: linear-gradient(to bottom, rgba(248, 250, 252, 0.2), rgba(248, 250, 252, 0.9) 80%); z-index: 0; pointer-events: none;"></div>
            <canvas id="hero-canvas" style="position: fixed; inset: 0; z-index: 0; pointer-events: none;"></canvas>

            <!-- Scrollable Content -->
            <div style="position: relative; z-index: 10;">
                
                <!-- Hero Section -->
                <section class="fade-in" style="min-height: 90vh; display: flex; align-items: center; justify-content: center; padding-top: 80px;">
                    <div style="text-align: center; width: 100%; max-width: 1200px; padding: 0 1.5rem; display: flex; flex-direction: column; align-items: center;">
                        
                        <div style="margin-bottom: 3rem;">
                            <h1 style="font-size: 4rem; line-height: 1; margin-bottom: 0.5rem; text-shadow: 0 4px 20px rgba(255,255,255,0.8);">
                                Make Every Mile <span class="text-primary">Joyful</span>
                            </h1>
                            <p style="font-size: 1.5rem; color: #334155; font-weight: 500; text-shadow: 0 2px 10px rgba(255,255,255,0.5);">
                                Your perfect ride is waiting. Authentic cars, real owners.
                            </p>
                        </div>



                        <div class="flex gap-4 justify-center mt-8">
                            <button class="btn btn-primary" style="padding: 1rem 2.5rem; font-size: 1.15rem; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);" onclick="app.navigate('search')">
                                Explore All Vehicles
                            </button>
                            <button class="btn btn-outline" style="padding: 1rem 2rem; font-size: 1.15rem; background: rgba(255,255,255,0.8); border: 1px solid white; backdrop-filter: blur(4px); color: #0f172a;" onclick="app.navigate('search')">
                                <i data-lucide="map-pin" class="text-primary"></i> ${store.getVehicles().length} Vehicles Near Me
                            </button>
                        </div>

                    </div>
                </section>

                <!-- How It Works (Glass Panel) -->
                <section class="fade-in container glass-panel" style="margin-bottom: 6rem; text-align: center; padding: 4rem 2rem; border-radius: var(--radius-xl);">
                    <h2 style="margin-bottom: 3rem;">How it Works</h2>
                    <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                        <div class="card" style="text-align: center; border: none; box-shadow: none; background: transparent;">
                            <div style="background: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: var(--shadow-lg);">
                                <i data-lucide="search" class="text-primary" style="width: 32px; height: 32px;"></i>
                            </div>
                            <h3>1. Browse</h3>
                            <p class="text-muted">Find the perfect car or bike near you from our verified fleet.</p>
                        </div>
                        <div class="card" style="text-align: center; border: none; box-shadow: none; background: transparent;">
                            <div style="background: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: var(--shadow-lg);">
                                <i data-lucide="calendar-check" class="text-primary" style="width: 32px; height: 32px;"></i>
                            </div>
                            <h3>2. Book</h3>
                            <p class="text-muted">Choose your dates and book instantly via our secure platform.</p>
                        </div>
                        <div class="card" style="text-align: center; border: none; box-shadow: none; background: transparent;">
                            <div style="background: white; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; box-shadow: var(--shadow-lg);">
                                <i data-lucide="key" class="text-primary" style="width: 32px; height: 32px;"></i>
                            </div>
                            <h3>3. Drive</h3>
                            <p class="text-muted">Unlock via the app or meet the owner to pick up your keys.</p>
                        </div>
                    </div>
                </section>

                <!-- Why Choose Us -->
                <section class="fade-in container" style="margin-bottom: 6rem;">
                    <div class="glass-panel" style="border-radius: var(--radius-xl); padding: 4rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 4rem;">
                        <div>
                            <h2 style="margin-bottom: 1.5rem;">Why RentWheels?</h2>
                            <ul class="flex flex-col gap-4">
                                <li class="flex items-center gap-3">
                                    <i data-lucide="check-circle" class="text-primary"></i> <span>Fully Insured Trip Options</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <i data-lucide="check-circle" class="text-primary"></i> <span>Verified Owners & Vehicles</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <i data-lucide="check-circle" class="text-primary"></i> <span>24/7 Roadside Assistance</span>
                                </li>
                                <li class="flex items-center gap-3">
                                    <i data-lucide="check-circle" class="text-primary"></i> <span>No Hidden Fees</span>
                                </li>
                            </ul>
                        </div>
                        <div style="background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); border-radius: var(--radius-lg); padding: 2rem; color: white; display: flex; flex-direction: column; justify-content: center;">
                            <h1 style="color: white; font-size: 3rem;">₹0</h1>
                            <h3 style="color: rgba(255,255,255,0.9);">Listing Fees</h3>
                            <p style="color: rgba(255,255,255,0.8); margin-top: 1rem;">It's free to list your vehicle. You keep 85% of the trip price.</p>
                        </div>
                    </div>
                </section>

                <!-- Testimonials Section -->
                <section class="fade-in container" style="margin-bottom: 6rem;">
                    <h2 class="text-center" style="margin-bottom: 3rem;">Trusted by Thousands</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                        <!-- Review 1 -->
                        <div class="glass-panel slide-in delay-100" style="padding: 2rem; border-radius: var(--radius-lg);">
                            <div class="flex items-center gap-3 mb-4">
                                <img src="https://ui-avatars.com/api/?name=Rahul+K&background=random" style="width: 50px; height: 50px; border-radius: 50%;">
                                <div>
                                    <h4 style="margin: 0;">Rahul Kumar</h4>
                                    <div class="flex text-warning" style="font-size: 0.8rem;">
                                        <i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i>
                                    </div>
                                </div>
                            </div>
                            <p class="text-muted">"RentWheels made my weekend trip to Coorg absolutely seamless. The Thar was in perfect condition!"</p>
                        </div>
                        
                        <!-- Review 2 -->
                        <div class="glass-panel slide-in delay-200" style="padding: 2rem; border-radius: var(--radius-lg);">
                            <div class="flex items-center gap-3 mb-4">
                                <img src="https://ui-avatars.com/api/?name=Priya+Sharma&background=random" style="width: 50px; height: 50px; border-radius: 50%;">
                                <div>
                                    <h4 style="margin: 0;">Priya Sharma</h4>
                                    <div class="flex text-warning" style="font-size: 0.8rem;">
                                        <i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i>
                                    </div>
                                </div>
                            </div>
                            <p class="text-muted">"Excellent service and very affordable prices compared to other rentals in Bangalore. Highly recommend!"</p>
                        </div>

                        <!-- Review 3 -->
                        <div class="glass-panel slide-in delay-300" style="padding: 2rem; border-radius: var(--radius-lg);">
                            <div class="flex items-center gap-3 mb-4">
                                <img src="https://ui-avatars.com/api/?name=Arjun+Reddy&background=random" style="width: 50px; height: 50px; border-radius: 50%;">
                                <div>
                                    <h4 style="margin: 0;">Arjun Reddy</h4>
                                    <div class="flex text-warning" style="font-size: 0.8rem;">
                                        <i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i><i data-lucide="star" fill="#eab308"></i>
                                    </div>
                                </div>
                            </div>
                            <p class="text-muted">"Rented a Classic 350 for a city ride. The process was super fast and the bike was well maintained."</p>
                        </div>
                    </div>
                </section>

                <!-- Featured Section (Only if logged in) -->
                ${store.getUser() ? `
                <section class="fade-in container" style="animation-delay: 0.1s; margin-bottom: 6rem;">
                    <div class="glass-panel" style="border-radius: var(--radius-xl); padding: 2rem;">
                        <div class="flex justify-between items-center" style="margin-bottom: 2.5rem;">
                            <div>
                                <h2>Featured Fleet</h2>
                                <p class="text-muted">Top rated vehicles near you</p>
                            </div>
                            <a href="#" class="btn btn-outline" onclick="app.navigate('search')">
                                View All <i data-lucide="arrow-right"></i>
                            </a>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem;">
                            ${vehicleCards}
                        </div>
                    </div>
                </section>
                ` : ''}

                <!-- Authentication CTA (Visible if not logged in) -->
                ${!store.getUser() ? `
                <section class="fade-in container" style="margin-bottom: 4rem;">
                    <div class="glass-panel" style="animation-delay: 0.2s; padding: 4rem 2rem; border-radius: var(--radius-xl); text-align: center;">
                    <h2 style="margin-bottom: 1rem;">Join the RentWheels Community</h2>
                    <p class="text-muted" style="margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Sign up today to book your first ride or start earning money by listing your vehicle.
                    </p>
                    <div class="flex gap-4 justify-center">
                        <button class="btn btn-primary" onclick="app.navigate('signup')">Create Account</button>
                        <button class="btn btn-outline" onclick="app.navigate('login')">Log In</button>
                    </div>
                    </div>
                </section>
                ` : ''}
            </div>
            <script>
                // Initialize Header Animation immediately after render
                setTimeout(() => {
                    RenterViews.initHeroAnimation();
                }, 0);
            </script>
        `;
    },

    search: function () {
        const user = store.getUser();
        let vehicles = store.getVehicles();

        // 1. Filter by Type
        if (this.currentFilter !== 'all') {
            vehicles = vehicles.filter(v => v.type === this.currentFilter);
        }

        // 2. Filter by User Location
        if (user && user.location) {
            vehicles = vehicles.filter(v => v.city === user.location);
        }

        const listItems = vehicles.map((v, index) => this._renderListCard(v, index)).join('');

        return `
            <div class="fade-in" style="height: calc(100vh - 120px); display: grid; grid-template-columns: 380px 1fr; gap: 2rem; overflow: hidden;">
                <!-- List View -->
                <div class="glass-panel" style="overflow-y: auto; padding: 1.5rem; border-radius: var(--radius-lg); display: flex; flex-direction: column;">
                    <h2 style="margin-bottom: 1.5rem;">Available Vehicles</h2>
                    
                    <!-- Filters -->
                    <div style="margin-bottom: 1.5rem;">
                        <span class="text-xs font-bold text-muted uppercase tracking-wider" style="display: block; margin-bottom: 0.75rem;">Filter by Type</span>
                        <div class="flex gap-2" style="flex-wrap: wrap;">
                            <button class="btn ${this.currentFilter === 'all' ? 'btn-primary' : 'btn-outline'}" 
                                style="padding: 0.5rem 1rem; font-size: 0.85rem; ${this.currentFilter !== 'all' ? 'background: white;' : ''}" 
                                onclick="RenterViews.filter('all')">
                                <i data-lucide="layout-grid" style="width: 14px; margin-right: 4px;"></i> All
                            </button>
                            <button class="btn ${this.currentFilter === 'car' ? 'btn-primary' : 'btn-outline'}" 
                                style="padding: 0.5rem 1rem; font-size: 0.85rem; ${this.currentFilter !== 'car' ? 'background: white;' : ''}" 
                                onclick="RenterViews.filter('car')">
                                <i data-lucide="car-front" style="width: 14px; margin-right: 4px;"></i> Cars
                            </button>
                            <button class="btn ${this.currentFilter === 'bike' ? 'btn-primary' : 'btn-outline'}" 
                                style="padding: 0.5rem 1rem; font-size: 0.85rem; ${this.currentFilter !== 'bike' ? 'background: white;' : ''}" 
                                onclick="RenterViews.filter('bike')">
                                <i data-lucide="bike" style="width: 14px; margin-right: 4px;"></i> Motorbikes
                            </button>
                            <button class="btn ${this.currentFilter === 'zap' ? 'btn-primary' : 'btn-outline'}" 
                                style="padding: 0.5rem 1rem; font-size: 0.85rem; ${this.currentFilter !== 'zap' ? 'background: white;' : ''}" 
                                onclick="RenterViews.filter('zap')">
                                <i data-lucide="zap" style="width: 14px; margin-right: 4px;"></i> Electric
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        ${listItems}
                    </div>
                </div>
                
                <!-- Map View -->
                <div id="map-container" style="background: #e2e8f0; border-radius: var(--radius-lg); overflow: hidden; height: 100%; box-shadow: var(--shadow-md); position: relative;">
                    <div id="map" style="width: 100%; height: 100%;"></div>
                </div>
            </div>
        `;
    },

    filter: function (type) {
        this.currentFilter = type;
        app.navigate('search'); // Re-render
    },

    initMap: function () {
        // Wait for DOM to update
        setTimeout(() => {
            const user = store.getUser();
            let center = [12.9716, 77.5946]; // Default Bangalore

            // Filter vehicles
            let vehicles = store.getVehicles();

            // 1. Filter by Type
            if (this.currentFilter !== 'all') {
                vehicles = vehicles.filter(v => v.type === this.currentFilter);
            }

            // 2. Filter by User Location (if logged in)
            if (user && user.location) {
                vehicles = vehicles.filter(v => v.city === user.location);

                if (user.location === 'Delhi') center = [28.6139, 77.2090];
                if (user.location === 'Mumbai') center = [19.0760, 72.8777];
            }

            const map = L.map('map').setView(center, 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            vehicles.forEach(v => {
                L.marker(v.location)
                    .addTo(map)
                    .bindPopup(`<b>${v.make} ${v.model}</b><br>₹${v.price}/day`);
            });
        }, 100);
    },

    initHeroAnimation: function () {
        // 1. Parallax Background
        const bg = document.getElementById('hero-bg-image');
        if (!bg) return;

        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            if (bg) bg.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
        });

        // 2. Sunny "Dust Motes" Particles
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 3 + 1;
                this.opacity = Math.random() * 0.3 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`; // Gold/Sun color
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            if (!document.getElementById('hero-canvas')) return; // Stop if navigated away
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        });
    },

    details: function (id) {
        const vehicle = store.getVehicles().find(v => v.id == id);
        if (!vehicle) return '<div class="container py-8">Vehicle not found</div>';

        return `
            <div class="fade-in container" style="padding-top: 2rem; max-width: 1000px;">
                <button class="btn btn-outline" style="margin-bottom: 2rem;" onclick="app.navigate('search')">
                    <i data-lucide="arrow-left"></i> Back to Search
                </button>

                <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 3rem; align-items: start;">
                    <!-- Left Column: Images & Info -->
                    <div>
                        <div style="height: 400px; border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 2rem; box-shadow: var(--shadow-lg);">
                            <img src="${vehicle.image}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                        
                        <div class="glass-panel" style="padding: 2rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
                            <h2 style="margin-bottom: 1rem;">Vehicle Features</h2>
                            <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div class="flex items-center gap-3">
                                    <div style="background: rgba(37, 99, 235, 0.1); padding: 0.5rem; border-radius: 50%;">
                                        <i data-lucide="settings-2" class="text-primary" style="width: 20px;"></i>
                                    </div>
                                    <span>Automatic Transmission</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div style="background: rgba(37, 99, 235, 0.1); padding: 0.5rem; border-radius: 50%;">
                                        <i data-lucide="users" class="text-primary" style="width: 20px;"></i>
                                    </div>
                                    <span>${vehicle.type === 'bike' ? '2 Seats' : '5 Seats'}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div style="background: rgba(37, 99, 235, 0.1); padding: 0.5rem; border-radius: 50%;">
                                        <i data-lucide="fuel" class="text-primary" style="width: 20px;"></i>
                                    </div>
                                    <span>${vehicle.type === 'zap' ? 'Electric' : 'Petrol'}</span>
                                </div>
                                <div class="flex items-center gap-3">
                                    <div style="background: rgba(37, 99, 235, 0.1); padding: 0.5rem; border-radius: 50%;">
                                        <i data-lucide="navigation" class="text-primary" style="width: 20px;"></i>
                                    </div>
                                    <span>GPS Navigation</span>
                                </div>
                            </div>
                        </div>

                        <div class="glass-panel" style="padding: 2rem; border-radius: var(--radius-lg);">
                            <h2 style="margin-bottom: 1rem;">Reviews</h2>
                            <div class="flex items-center gap-2 mb-4" style="margin-bottom: 1.5rem;">
                                <i data-lucide="star" fill="#eab308" style="color: #eab308;"></i>
                                <span style="font-size: 1.25rem; font-weight: 700;">${vehicle.rating}</span>
                                <span class="text-muted">(${vehicle.trips} trips)</span>
                            </div>
                            <div style="border-bottom: 1px solid var(--border); padding-bottom: 1rem; margin-bottom: 1rem;">
                                <div class="flex justify-between" style="margin-bottom: 0.5rem;">
                                    <strong>Alex M.</strong>
                                    <span class="text-muted text-sm">2 days ago</span>
                                </div>
                                <p class="text-muted">Great car, very clean and smooth drive!</p>
                            </div>
                             <div>
                                <div class="flex justify-between" style="margin-bottom: 0.5rem;">
                                    <strong>Sarah J.</strong>
                                    <span class="text-muted text-sm">1 week ago</span>
                                </div>
                                <p class="text-muted">Easy pickup and dropoff. Highly recommended.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Booking Card -->
                    <div class="card" style="padding: 2.5rem; position: sticky; top: 100px;">
                        <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">${vehicle.make} ${vehicle.model}</h1>
                        <p class="text-muted" style="margin-bottom: 2rem;">${vehicle.year}</p>

                        <div class="flex justify-between items-end" style="margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid var(--border);">
                            <div>
                                <span style="font-size: 2.5rem; font-weight: 800; color: var(--primary);">₹${(vehicle.price / 24).toFixed(0)}</span>
                                <span class="text-muted">/hr</span>
                            </div>
                            <div class="badge badge-green">Available Now</div>
                        </div>

                        <form onsubmit="RenterViews.handleBooking(event, ${vehicle.id})" class="flex flex-col gap-4">
                            <div>
                                <label class="text-sm font-bold mb-2 block">Pick-up</label>
                                <div class="flex gap-2">
                                    <input type="date" id="pickup-date" class="input" required style="flex: 2;" onchange="RenterViews.calculateTotal(${vehicle.price})">
                                    <select id="pickup-time" class="input" style="flex: 1;" onchange="RenterViews.calculateTotal(${vehicle.price})">${this._getTimeOptions()}</select>
                                </div>
                            </div>
                            <div>
                                <label class="text-sm font-bold mb-2 block">Return</label>
                                <div class="flex gap-2">
                                    <input type="date" id="return-date" class="input" required style="flex: 2;" onchange="RenterViews.calculateTotal(${vehicle.price})">
                                    <select id="return-time" class="input" style="flex: 1;" onchange="RenterViews.calculateTotal(${vehicle.price})">${this._getTimeOptions()}</select>
                                </div>
                            </div>
                            
                            <div style="background: #F8FAFC; padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem;">
                                <div class="flex justify-between mb-2">
                                    <span class="text-muted">Total Hours</span>
                                    <span id="total-days">0</span>
                                </div>
                                <div class="flex justify-between font-bold">
                                    <span>Total (Estimate)</span>
                                    <span id="total-price">₹${(vehicle.price / 24).toFixed(0)}</span>
                                </div>
                            </div>

                            ${store.getUser() ? `
                                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                                    Confirm Booking
                                </button>
                            ` : `
                                <div style="margin-top: 1rem; text-align: center; background: rgba(37, 99, 235, 0.05); padding: 1rem; border-radius: var(--radius-md); border: 1px dashed var(--primary);">
                                    <p class="text-sm text-muted font-bold" style="margin-bottom: 0.5rem;">Login required to title</p>
                                    <div class="flex gap-2">
                                        <button type="button" class="btn btn-primary" style="flex: 1; padding: 0.5rem;" onclick="app.navigate('login')">Log In</button>
                                        <button type="button" class="btn btn-outline" style="flex: 1; padding: 0.5rem;" onclick="app.navigate('signup')">Sign Up</button>
                                    </div>
                                </div>
                            `}
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    handleBooking: async function (e, id) {
        e.preventDefault();
        const user = store.getUser();
        if (!user) {
            alert("Please log in to book this vehicle.");
            app.navigate('login');
            return;
        }

        if (!user.licenseUploaded) {
            if (confirm("You must upload a valid Driving License to book a vehicle.\n\nGo to Profile to upload now?")) {
                app.navigate('profile');
            }
            return;
        }

        const totalPriceText = document.getElementById('total-price').innerText.replace(/[^0-9]/g, '');
        const bookingData = {
            userId: user.id,
            vehicleId: id,
            startDate: document.getElementById('pickup-date').value,
            endDate: document.getElementById('return-date').value,
            totalPrice: parseInt(totalPriceText) || 0
        };

        const btn = e.target.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Processing...';

        const result = await store.book(bookingData);

        if (result.success) {
            alert(`Booking Confirmed! \n\nCheck your email for details.`);
            app.navigate('bookings');
        } else {
            alert('Booking failed: ' + result.message);
            btn.disabled = false;
            btn.textContent = 'Confirm Booking';
        }
    },

    _renderCard: function (vehicle, index = 0) {
        const typeIcon = vehicle.type === 'bike' ? 'bike' : 'car';
        const delayClass = `delay-${Math.min((index + 1) * 100, 300)}`;
        return `
            <div class="card fade-in ${delayClass}" onclick="app.navigate('vehicle', {id: ${vehicle.id}})" style="padding: 0; overflow: hidden; cursor: pointer; display: flex; flex-direction: column;">
                <div style="height: 220px; position: relative; overflow: hidden;">
                    <img src="${vehicle.image}" alt="${vehicle.make}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.6); color: white; padding: 0.25rem 0.75rem; border-radius: 99px; backdrop-filter: blur(4px); font-size: 0.85rem; font-weight: 600;">
                        <i data-lucide="star" style="width: 12px; height: 12px; display: inline; vertical-align: middle; margin-bottom: 2px;"></i> ${vehicle.rating}
                    </div>
                </div>
                <div style="padding: 1.5rem; flex: 1; display: flex; flex-direction: column;">
                    <div class="flex justify-between items-start" style="margin-bottom: 0.5rem;">
                        <div>
                            <span class="text-xs font-bold text-muted uppercase tracking-wider">${vehicle.make}</span>
                            <h3 style="font-size: 1.35rem; margin-top: 2px;">${vehicle.model}</h3>
                        </div>
                        <div style="background: #F1F5F9; padding: 6px; border-radius: 50%;">
                            <i data-lucide="${typeIcon}" class="text-muted" style="width: 18px; height: 18px;"></i>
                        </div>
                    </div>
                    
                    <div class="flex gap-3 text-sm text-muted" style="margin-bottom: 1.5rem;">
                        <span>${vehicle.year}</span>
                        <span>•</span>
                        <span>${vehicle.trips} trips</span>
                    </div>

                    <div class="flex justify-between items-center mt-auto" style="border-top: 1px solid var(--border); padding-top: 1rem;">
                        <div>
                            <span style="font-size: 1.5rem; font-weight: 800; color: var(--text-main);">₹${(vehicle.price / 24).toFixed(0)}</span>
                            <span class="text-muted text-sm">/hr</span>
                        </div>
                        <button class="btn btn-primary" style="padding: 0.5rem 1.25rem;">Book</button>
                    </div>
                </div>
            </div>
        `;
    },

    _renderListCard: function (vehicle, index = 0) {
        const typeIcon = vehicle.type === 'bike' ? 'bike' : 'car';
        const delayClass = `delay-${Math.min((index + 1) * 100, 300)}`; // Cap delay at 300ms
        return `
            <div class="card slide-in ${delayClass}" onclick="app.navigate('vehicle', {id: ${vehicle.id}})" style="padding: 1rem; display: flex; gap: 1rem; align-items: center; transition: all 0.2s; cursor: pointer;">
                <img src="${vehicle.image}" alt="${vehicle.make}" style="width: 100px; height: 80px; object-fit: cover; border-radius: var(--radius-md);">
                <div style="flex: 1;">
                    <div class="flex justify-between">
                         <h4 style="font-size: 1.1rem;">${vehicle.make} ${vehicle.model}</h4>
                         <span class="badge ${vehicle.type === 'bike' ? 'badge-green' : 'badge-blue'}">${vehicle.type}</span>
                    </div>
                    <p class="text-muted text-sm" style="margin-top: 4px;">${vehicle.year} • 0.5 miles</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span style="font-weight: 700; color: var(--primary);">₹${(vehicle.price / 24).toFixed(0)}</span>
                        <span class="text-sm text-muted">/hr</span>
                    </div>
                </div>
                 <button class="btn btn-outline" style="padding: 0.5rem; border-radius: 50%; width: 40px; height: 40px; padding: 0;">
                    <i data-lucide="chevron-right" style="width: 20px;"></i>
                 </button>
            </div>
        `;
    },

    calculateTotal: function (pricePerDay) {
        const pickupDate = document.getElementById('pickup-date').value;
        const pickupTime = document.getElementById('pickup-time').value;
        const returnDate = document.getElementById('return-date').value;
        const returnTime = document.getElementById('return-time').value;

        const totalDisplay = document.getElementById('total-price');
        const daysDisplay = document.getElementById('total-days');

        if (pickupDate && pickupTime && returnDate && returnTime) {
            // Helper to parse "10:30 AM" into hours/minutes
            const parseTime = (timeStr) => {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':');
                if (hours === '12') {
                    hours = '00';
                }
                if (modifier === 'PM') {
                    hours = parseInt(hours, 10) + 12;
                }
                return { h: parseInt(hours), m: parseInt(minutes) };
            };

            const start = new Date(pickupDate);
            const t1 = parseTime(pickupTime);
            start.setHours(t1.h, t1.m);

            const end = new Date(returnDate);
            const t2 = parseTime(returnTime);
            end.setHours(t2.h, t2.m);

            // Calculate hours difference
            const diffMs = end - start;
            if (diffMs <= 0) {
                if (daysDisplay) daysDisplay.innerText = "0";
                if (totalDisplay) totalDisplay.innerText = "₹0";
                return;
            }

            const diffHours = diffMs / (1000 * 60 * 60);

            // Hourly rate = Daily / 24
            const hourlyRate = pricePerDay / 24;
            let total = diffHours * hourlyRate;

            if (daysDisplay) daysDisplay.innerText = diffHours.toFixed(1) + " hrs";
            if (totalDisplay) totalDisplay.innerText = '₹' + Math.round(total);
        }
    },

    _getTimeOptions: function () {
        let options = '';
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += 30) {
                const hour = i;
                const min = j === 0 ? '00' : '30';
                const ampm = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour % 12 || 12;
                const time = `${displayHour}:${min} ${ampm}`;
                // Default to 10:00 AM for demo
                const selected = (hour === 10 && j === 0) ? 'selected' : '';
                options += `<option value="${time}" ${selected}>${time}</option>`;
            }
        }
        return options;
    }
};
