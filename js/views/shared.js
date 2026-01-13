/**
 * Shared View Components (Profile, Messages, etc.)
 */
const SharedViews = {
    profile: function () {
        const user = store.getUser();
        if (!user) return app.navigate('login');

        // Mock switching roles
        const toggleRole = () => {
            alert('Role switching is a backend feature. For this demo, you have access to both!');
        };

        return `
            <div class="fade-in container my-8" style="padding-top: 2rem; max-width: 800px;">
                <div class="glass-panel" style="border-radius: var(--radius-xl); padding: 3rem; text-align: center;">
                    <div style="width: 120px; height: 120px; background: var(--border); border-radius: 50%; margin: 0 auto 1.5rem; overflow: hidden; border: 4px solid white; box-shadow: var(--shadow-lg);">
                        <img src="https://ui-avatars.com/api/?name=${user.name}&background=2563EB&color=fff&size=256" style="width: 100%; height: 100%;">
                    </div>
                    <h1 style="margin-bottom: 0.5rem;">${user.name}</h1>
                    <p class="text-muted" style="margin-bottom: 2rem;">${user.email}</p>

                    <div class="flex justify-center gap-4 mb-8">
                       <span class="badge badge-blue">Verified Driver</span>
                       <span class="badge badge-green">Super Host</span>
                    </div>

                    <div class="grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left; margin-bottom: 2rem;">
                     <div class="card cursor-pointer hover:border-primary" onclick="app.navigate('bookings')">
                    <div class="flex items-center gap-3">
                         <div style="background: rgba(37, 99, 235, 0.1); padding: 0.75rem; border-radius: 50%;">
                             <i data-lucide="calendar" class="text-primary"></i>
                         </div>
                         <div class="text-left">
                             <strong>My Trips</strong>
                             <p class="text-xs text-muted">View history</p>
                         </div>
                    </div>
                 </div>
                    <div class="card cursor-pointer hover:border-primary" onclick="document.getElementById('license-upload').click()">
                        <div class="flex items-center gap-3">
                             <div style="background: ${user.licenseUploaded ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; padding: 0.75rem; border-radius: 50%;">
                                 <i data-lucide="${user.licenseUploaded ? 'check-circle' : 'alert-circle'}" class="${user.licenseUploaded ? 'text-success' : 'text-danger'}"></i>
                             </div>
                             <div class="text-left">
                                 <strong>${user.licenseUploaded ? 'License Verified' : 'Verify License'}</strong>
                                 <p class="text-xs text-muted">${user.licenseUploaded ? 'Ready to drive' : 'Upload to book'}</p>
                             </div>
                             <input type="file" id="license-upload" hidden accept="image/*" onchange="SharedViews.uploadLicense(this)">
                        </div>
                     </div>
                 </div>

                 <div class="list-group">
                    <a href="#" class="list-item slide-in delay-100" onclick="app.navigate('my-vehicles')">
                        <i data-lucide="car"></i> My Vehicles
                        <i data-lucide="chevron-right" style="margin-left: auto; width: 16px;"></i>
                    </a>
                    <a href="#" class="list-item slide-in delay-200" onclick="app.navigate('bookings')">
                       <i data-lucide="calendar"></i> My Trips
                       <i data-lucide="chevron-right" style="margin-left: auto; width: 16px;"></i>
                   </a>
                    <a href="#" class="list-item slide-in delay-300" onclick="app.navigate('messages')">
                        <i data-lucide="message-square"></i> Messages
                        <i data-lucide="chevron-right" style="margin-left: auto; width: 16px;"></i>
                    </a>
                    <a href="#" class="list-item slide-in delay-300" style="animation-delay: 400ms;" onclick="app.navigate('notifications')">
                        <i data-lucide="bell"></i> Notifications
                        <i data-lucide="chevron-right" style="margin-left: auto; width: 16px;"></i>
                    </a>
                     <a href="#" class="list-item slide-in delay-300" style="animation-delay: 500ms;" onclick="app.navigate('help')">
                        <i data-lucide="help-circle"></i> Help & Support
                        <i data-lucide="chevron-right" style="margin-left: auto; width: 16px;"></i>
                    </a>
                     <a href="#" class="list-item slide-in delay-300" style="animation-delay: 600ms;" onclick="app.navigate('settings')">
                        <i data-lucide="settings"></i> Account Settings
                        <i data-lucide="chevron-right" style="margin-left: auto; width: 16px;"></i>
                    </a>
                </div>
                    <button class="btn btn-outline" style="color: var(--danger); border-color: var(--danger);" onclick="store.logout(); location.reload();">
                        Log Out
                    </button>
                </div>
            </div>
        `;
    },

    messages: function () {
        return `
            <div class="fade-in container" style="padding-top: 2rem; max-width: 800px;">
                <button class="btn btn-outline" style="margin-bottom: 2rem;" onclick="app.navigate('profile')">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <h1 style="margin-bottom: 2rem;">Messages</h1>
                
                <div class="glass-panel" style="border-radius: var(--radius-lg); overflow: hidden;">
                    <!-- Message Item 1 -->
                    <div class="slide-in delay-100" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; gap: 1rem; align-items: center; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.02)'" onmouseout="this.style.background='transparent'">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: #e2e8f0; overflow: hidden;">
                            <img src="https://ui-avatars.com/api/?name=Sarah+J&background=random" style="width: 100%;">
                        </div>
                        <div style="flex: 1;">
                            <div class="flex justify-between mb-1">
                                <strong>Sarah J.</strong>
                                <span class="text-xs text-muted">2 mins ago</span>
                            </div>
                            <p class="text-muted text-sm line-clamp-1">Hey! Is the car available for pickup earlier tomorrow?</p>
                        </div>
                        <div style="width: 10px; height: 10px; background: var(--primary); border-radius: 50%;"></div>
                    </div>

                    <!-- Message Item 2 -->
                    <div class="slide-in delay-200" style="padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; gap: 1rem; align-items: center; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.02)'" onmouseout="this.style.background='transparent'">
                        <div style="width: 50px; height: 50px; border-radius: 50%; background: #e2e8f0; overflow: hidden;">
                             <img src="https://ui-avatars.com/api/?name=Mike+R&background=random" style="width: 100%;">
                        </div>
                        <div style="flex: 1;">
                            <div class="flex justify-between mb-1">
                                <strong>Mike R.</strong>
                                <span class="text-xs text-muted">Yesterday</span>
                            </div>
                            <p class="text-muted text-sm text-clamp-1">Thanks for the rental! The bike was awesome.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    notifications: function () {
        return `
            <div class="fade-in container" style="padding-top: 2rem; max-width: 800px;">
                <button class="btn btn-outline" style="margin-bottom: 2rem;" onclick="app.navigate('profile')">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <h1 style="margin-bottom: 2rem;">Notifications</h1>
                
                <div class="glass-panel" style="border-radius: var(--radius-lg); padding: 1rem;">
                    <div style="padding: 1rem; border-bottom: 1px solid var(--border); display: flex; gap: 1rem; align-items: start;">
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 0.5rem; border-radius: 50%; color: var(--success);">
                            <i data-lucide="check-circle" style="width: 20px;"></i>
                        </div>
                        <div>
                            <p style="margin-bottom: 0.25rem;"><strong>Booking Confirmed</strong></p>
                            <p class="text-sm text-muted">Your booking for Tesla Model 3 has been confirmed by the owner.</p>
                            <span class="text-xs text-muted">2 hours ago</span>
                        </div>
                    </div>
                    <div style="padding: 1rem; display: flex; gap: 1rem; align-items: start;">
                        <div style="background: rgba(37, 99, 235, 0.1); padding: 0.5rem; border-radius: 50%; color: var(--primary);">
                            <i data-lucide="tag" style="width: 20px;"></i>
                        </div>
                        <div>
                            <p style="margin-bottom: 0.25rem;"><strong>New Discount Available</strong></p>
                            <p class="text-sm text-muted">Get 10% off your next weekend trip with code WEEKEND10.</p>
                            <span class="text-xs text-muted">1 day ago</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    bookings: function () {
        setTimeout(async () => {
            const user = store.getUser();
            if (!user) return;
            const bookings = await store.getBookings(user.id);
            SharedViews._renderBookingsList(bookings);
        }, 0);

        return `
            <div class="fade-in container" style="padding-top: 2rem; max-width: 800px;">
                <button class="btn btn-outline" style="margin-bottom: 2rem;" onclick="app.navigate('profile')">
                    <i data-lucide="arrow-left"></i> Back
                </button>
                <h1 style="margin-bottom: 2rem;">My Trips</h1>

                <div id="bookings-list" class="flex flex-col gap-4">
                     <div class="text-center text-muted py-8">Loading your trips...</div>
                </div>
            </div>
        `;
    },

    _renderBookingsList: function (bookings) {
        const container = document.getElementById('bookings-list');
        if (!container) return;

        if (bookings.length === 0) {
            container.innerHTML = '<div class="text-center text-muted py-8">No trips yet. Book your first ride!</div>';
            return;
        }

        container.innerHTML = bookings.map(b => `
            <div class="glass-panel scale-up" style="border-radius: var(--radius-lg); padding: 1.5rem; border-left: 4px solid var(--primary);">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <span class="badge badge-blue mb-2">${b.status}</span>
                        <h3>${b.vehicle.make} ${b.vehicle.model}</h3>
                        <p class="text-muted text-sm">${b.startDate} - ${b.endDate}</p>
                    </div>
                    <span style="font-weight: 700;">₹${b.totalPrice}</span>
                </div>
                 <div class="flex gap-2">
                     <button class="btn btn-primary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">View Ticket</button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    },

    help: function () {
        return `
            <div class="fade-in container py-8" style="max-width: 800px;">
                <button class="btn btn-outline mb-4" onclick="app.navigate('profile')">
                    <i data-lucide="arrow-left"></i> Back to Profile
                </button>

                <div class="glass-panel" style="padding: 2rem; border-radius: var(--radius-xl);">
                    <h1 style="margin-bottom: 0.5rem;">Help & Support</h1>
                    <p class="text-muted" style="margin-bottom: 2rem;">Common questions and support contact.</p>

                    <div style="margin-bottom: 3rem;">
                        <h3 style="margin-bottom: 1rem;">Frequently Asked Questions</h3>
                        
                        <div style="display: flex; flex-direction: column; gap: 1rem;">
                            <details style="background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem; cursor: pointer;">
                                <summary style="font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                                    How does insurance work?
                                    <i data-lucide="chevron-down" style="width: 16px;"></i>
                                </summary>
                                <p class="text-muted text-sm mt-2" style="padding-top: 0.5rem; border-top: 1px dashed var(--border);">
                                    Every trip includes comprehensive insurance coverage. In case of an accident, contact our 24/7 support immediately.
                                </p>
                            </details>

                            <details style="background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem; cursor: pointer;">
                                <summary style="font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                                    Can I cancel my booking?
                                    <i data-lucide="chevron-down" style="width: 16px;"></i>
                                </summary>
                                <p class="text-muted text-sm mt-2" style="padding-top: 0.5rem; border-top: 1px dashed var(--border);">
                                    Yes, you can cancel for free up to 24 hours before the trip starts. Late cancellations may incur a fee.
                                </p>
                            </details>

                            <details style="background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1rem; cursor: pointer;">
                                <summary style="font-weight: 600; list-style: none; display: flex; justify-content: space-between; align-items: center;">
                                    How do I verify my ID?
                                    <i data-lucide="chevron-down" style="width: 16px;"></i>
                                </summary>
                                <p class="text-muted text-sm mt-2" style="padding-top: 0.5rem; border-top: 1px dashed var(--border);">
                                    Go to Account Settings > Verification to upload your driver's license and selfie. Approval takes about 1 hour.
                                </p>
                            </details>
                        </div>
                    </div>

                    <div>
                        <h3 style="margin-bottom: 1rem;">Contact Support</h3>
                        <form onsubmit="event.preventDefault(); alert('Message sent! Support will reply within 24 hours.');" class="flex flex-col gap-4">
                            <div>
                                <label class="text-sm font-bold mb-2 block">Subject</label>
                                <select class="input">
                                    <option>General Inquiry</option>
                                    <option>Billing Issue</option>
                                    <option>Technical Problem</option>
                                    <option>Report a User</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-sm font-bold mb-2 block">Message</label>
                                <textarea class="input" rows="4" placeholder="Describe your issue..." required></textarea>
                            </div>
                            <button class="btn btn-primary" style="align-self: flex-start;">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    uploadLicense: function (input) {
        if (input.files && input.files[0]) {
            const user = store.getUser();
            if (!user) return;

            // In a real app, we would upload the file here.
            // For now, we just signal the backend to verify the user.

            store.uploadLicense(user.id).then(success => {
                if (success) {
                    alert('License verified successfully!');
                    app.navigate('profile');
                } else {
                    alert('Failed to verify license.');
                }
            });
        }
    }
};
