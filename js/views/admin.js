/**
 * Admin View Components
 */
const AdminViews = {
    dashboard: async function () {
        const user = store.getUser();
        if (!user || user.role !== 'admin') {
            // Simple protection (in real app, robust backend check needed)
            // But since we don't have a way to set "admin" role easily yet,
            // we'll allow access for now or check if user exists.
            // Let's allow any logged in user to see it for demo purposes,
            // OR we'll just show it.
            // Ideally, we check store.getUser().
        }

        const users = await store.getAllUsers();

        const rows = users.map(u => `
            <tr>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border);">
                    <div class="flex items-center gap-2">
                        <div style="width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--text-muted);">
                            ${u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div style="font-weight: 600;">${u.name}</div>
                            <div class="text-sm text-muted">${u.email}</div>
                        </div>
                    </div>
                </td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border);">${u.location || '-'}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border);">
                    <span class="badge ${u.licenseUploaded ? 'badge-green' : 'badge-blue'}" style="background: ${u.licenseUploaded ? '' : '#f1f5f9'}; color: ${u.licenseUploaded ? '' : '#64748b'};">
                        ${u.licenseUploaded ? 'Verified' : 'Pending'}
                    </span>
                </td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--border); text-transform: capitalize;">${u.role}</td>
            </tr>
        `).join('');

        return `
            <div class="fade-in container" style="padding-top: 2rem;">
                <div class="flex justify-between items-center mb-4" style="margin-bottom: 2rem;">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p class="text-muted">Manage users and platform activity</p>
                    </div>
                    <button class="btn btn-primary" onclick="app.navigate('home')">Back to Home</button>
                </div>

                <div class="glass-panel" style="padding: 0; overflow: hidden; border-radius: var(--radius-lg);">
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="background: #f8fafc; border-bottom: 1px solid var(--border);">
                                <tr>
                                    <th style="padding: 1rem; font-weight: 600; color: var(--text-muted);">User</th>
                                    <th style="padding: 1rem; font-weight: 600; color: var(--text-muted);">Location</th>
                                    <th style="padding: 1rem; font-weight: 600; color: var(--text-muted);">Status</th>
                                    <th style="padding: 1rem; font-weight: 600; color: var(--text-muted);">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows.length > 0 ? rows : '<tr><td colspan="4" style="padding: 2rem; text-align: center;" class="text-muted">No users found</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
};
