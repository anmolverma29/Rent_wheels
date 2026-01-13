/**
 * Owner View Components
 */
const OwnerViews = {
    dashboard: function () {
        const user = store.getUser();
        if (!user) {
            // Redirect or show login prompt if not authenticated
            return `
                <div class="fade-in flex flex-col items-center justify-center text-center" style="min-height: 60vh;">
                     <div style="background: rgba(37, 99, 235, 0.1); padding: 2rem; border-radius: 50%; margin-bottom: 2rem;">
                        <i data-lucide="lock" style="width: 48px; height: 48px; color: var(--primary);"></i>
                    </div>
                    <h1>Owner Access</h1>
                    <p class="text-muted" style="margin-bottom: 2rem;">You need to be logged in to manage your vehicles.</p>
                    <button class="btn btn-primary" onclick="app.navigate('login')">Log In to Continue</button>
                </div>
            `;
        }

        // Filter vehicles for this mocked user (in a real app, API would do this)
        // For demo, we'll just show all vehicles or specific ones
        const myVehicles = store.getVehicles();

        const vehicleRows = myVehicles.map((v, index) => this._renderVehicleRow(v, index)).join('');

        return `
            <div class="fade-in container my-8">
                <div class="flex justify-between items-center mb-8" style="margin-bottom: 2rem;">
                    <div>
                        <h1>My Fleet</h1>
                        <p class="text-muted">Manage your listed vehicles and earnings.</p>
                    </div>
                    <button class="btn btn-primary" onclick="app.navigate('add-vehicle')">
                        <i data-lucide="plus"></i> Add Vehicle
                    </button>
                </div>

                <!-- Stats Overview -->
                <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 4rem;">
                    <div class="card flex items-center gap-4">
                        <div style="background: rgba(37, 99, 235, 0.1); padding: 1rem; border-radius: 50%;">
                            <i data-lucide="dollar-sign" class="text-primary"></i>
                        </div>
                        <div>
                            <p class="text-sm text-muted font-bold">Total Earnings</p>
                            <h3>₹25,000</h3>
                        </div>
                    </div>
                    <div class="card flex items-center gap-4">
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 50%;">
                             <i data-lucide="calendar" style="color: var(--accent);"></i>
                        </div>
                        <div>
                            <p class="text-sm text-muted font-bold">Active Bookings</p>
                            <h3>3 Upcoming</h3>
                        </div>
                    </div>
                     <div class="card flex items-center gap-4">
                        <div style="background: #F1F5F9; padding: 1rem; border-radius: 50%;">
                             <i data-lucide="car"></i>
                        </div>
                        <div>
                            <p class="text-sm text-muted font-bold">Total Vehicles</p>
                            <h3>${myVehicles.length} Listed</h3>
                        </div>
                    </div>
                </div>

                <div class="glass-panel" style="border-radius: var(--radius-lg); overflow: hidden; padding: 1rem;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 1px solid var(--border);">
                                <th style="padding: 1rem;" class="text-muted text-sm uppercase">Vehicle</th>
                                <th style="padding: 1rem;" class="text-muted text-sm uppercase">Status</th>
                                <th style="padding: 1rem;" class="text-muted text-sm uppercase">Price/Day</th>
                                <th style="padding: 1rem;" class="text-muted text-sm uppercase">Trips</th>
                                <th style="padding: 1rem;" class="text-muted text-sm uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${vehicleRows}
                        </tbody>
                    </table>
                     ${myVehicles.length === 0 ? '<div class="p-8 text-center text-muted">No vehicles listed yet.</div>' : ''}
                </div>
            </div>
        `;
    },

    addVehicle: function () {
        return `
            <div class="fade-in container glass-panel" style="max-width: 800px; padding: 2.5rem; border-radius: var(--radius-xl); margin: 2rem auto;">
                 <div style="margin-bottom: 2rem;">
                    <button class="btn btn-outline" style="padding: 0.5rem 1rem; margin-bottom: 1rem;" onclick="app.navigate('my-vehicles')">
                        <i data-lucide="arrow-left"></i> Back
                    </button>
                    <h2>List your Vehicle</h2>
                    <p class="text-muted">Earn money by sharing your car or bike.</p>
                </div>

                <form onsubmit="OwnerViews.handleSubmit(event)" class="flex flex-col gap-6">
                    <!-- Photo Upload Mock -->
                    <div style="border: 2px dashed var(--border); border-radius: var(--radius-lg); padding: 3rem; text-align: center; cursor: pointer; transition: 0.2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
                        <i data-lucide="image" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;"></i>
                        <p class="text-muted font-bold">Click to upload photos</p>
                        <p class="text-sm text-muted">Supports JPG, PNG (Mock)</p>
                    </div>

                    <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <div>
                            <label class="text-sm font-bold mb-2 block">Make</label>
                            <input type="text" name="make" class="input" placeholder="e.g. Tesla" required>
                        </div>
                        <div>
                            <label class="text-sm font-bold mb-2 block">Model</label>
                            <input type="text" name="model" class="input" placeholder="e.g. Model 3" required>
                        </div>
                    </div>

                    <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;">
                         <div>
                            <label class="text-sm font-bold mb-2 block">Year</label>
                            <input type="number" name="year" class="input" placeholder="2023" required>
                        </div>
                         <div>
                             <label class="text-sm font-bold mb-2 block">Type</label>
                             <select name="type" class="input">
                                <option value="car">Car</option>
                                <option value="bike">Motorcycle/Scooter</option>
                             </select>
                        </div>
                        <div>
                            <label class="text-sm font-bold mb-2 block">Price per Day (₹)</label>
                            <input type="number" name="price" class="input" placeholder="85" required>
                        </div>
                    </div>

                    <div>
                        <label class="text-sm font-bold mb-2 block">Description</label>
                        <textarea name="description" class="input" rows="4" placeholder="Tell renters about your vehicle features..."></textarea>
                    </div>

                    <div class="flex justify-end gap-4 mt-4">
                        <button type="button" class="btn btn-outline" onclick="app.navigate('my-vehicles')">Cancel</button>
                        <button type="submit" class="btn btn-primary">List Vehicle</button>
                    </div>
                </form>
            </div>
        `;
    },

    handleSubmit: function (e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Mock saving data
        const newVehicle = {
            id: Date.now(),
            make: formData.get('make'),
            model: formData.get('model'),
            year: formData.get('year'),
            price: formData.get('price'),
            type: formData.get('type'),
            // Random mock image based on type
            image: formData.get('type') === 'bike'
                ? 'https://images.unsplash.com/photo-1558981806-ec527fa84f3d?auto=format&fit=crop&w=800&q=80'
                : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
            rating: 5.0,
            trips: 0,
            location: [12.9716, 77.5946] // Default location (Bangalore)
        };

        store.state.vehicles.push(newVehicle);
        alert('Vehicle Listed Successfully!');
        app.navigate('my-vehicles');
    },

    _renderVehicleRow: function (v, index = 0) {
        const delayClass = `delay-${Math.min((index + 1) * 100, 300)}`;
        return `
            <tr class="slide-in ${delayClass}" style="border-bottom: 1px solid var(--border);">
                <td style="padding: 1rem;">
                    <div class="flex items-center gap-4">
                        <img src="${v.image}" style="width: 64px; height: 48px; object-fit: cover; border-radius: var(--radius-md);">
                        <div>
                            <div class="font-bold">${v.make} ${v.model}</div>
                            <div class="text-xs text-muted">${v.year} • ${v.type}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 1rem;">
                    <span class="badge badge-green">Active</span>
                </td>
                <td style="padding: 1rem; font-weight: 600;">
                    ₹${v.price}
                </td>
                <td style="padding: 1rem;">
                    ${v.trips}
                </td>
                <td style="padding: 1rem;">
                    <button class="btn btn-outline" style="padding: 0.5rem; width: 32px; height: 32px; border-radius: 50%;">
                        <i data-lucide="edit-2" style="width: 14px;"></i>
                    </button>
                </td>
            </tr>
        `;
    }
};
