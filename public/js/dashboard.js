const dashboard = {
    // --- Student Methods ---
    async initStudent() {
        await auth.refreshSession();
        await this.loadStudentRequests();
        await this.loadNotifications();
        // Removed redundant renderStudentStats() call that was overriding data with empty defaults
        this.initReveal();
    },

    renderStudentStats(requests = []) {
        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            rejected: requests.filter(r => r.status === 'rejected').length
        };

        if (document.getElementById('stat-total')) {
            document.getElementById('stat-total').innerText = stats.total;
            document.getElementById('stat-pending').innerText = stats.pending;
            document.getElementById('stat-approved').innerText = stats.approved;
            document.getElementById('stat-rejected').innerText = stats.rejected;
        }
    },

    async loadStudentRequests() {
        const user = auth.getUser();
        const requests = await api.request(`/leave/requests/student?studentId=${user.id}`);
        const tbody = document.getElementById('student-requests-table');

        tbody.innerHTML = requests.map(req => `
            <tr class="reveal hover:bg-white/[0.02] transition-colors">
                <td class="py-5 font-medium capitalize text-gray-200">${req.leaveType}</td>
                <td class="py-5 text-gray-400 text-sm">${req.startDate} to ${req.endDate}</td>
                <td class="py-5 font-bold text-blue-400">${req.totalDays}</td>
                <td class="py-5">
                    <span class="status-badge status-${req.status}">${req.status}</span>
                </td>
                <td class="py-5 text-right">
                    <button onclick="dashboard.viewDetails('${req.id}')" class="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm">View Details</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="5" class="py-12 text-center text-gray-500 italic">No applications found in history.</td></tr>';

        this.renderStudentStats(requests);
    },

    async loadNotifications() {
        const user = auth.getUser();
        const notifications = await api.request(`/leave/student/${user.id}/notifications`);
        const list = document.getElementById('notification-list');

        list.innerHTML = notifications.map(n => `
            <div class="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all reveal">
                <div class="flex justify-between items-start mb-2">
                    <p class="font-bold text-sm">${n.title}</p>
                    <span class="status-badge status-${n.type.toLowerCase()} !text-[8px] !px-2 !py-0.5">${n.type}</span>
                </div>
                <p class="text-xs text-gray-400 leading-relaxed">${n.message}</p>
                <span class="text-[10px] text-gray-600 block mt-3 font-medium">${new Date(n.createdAt).toLocaleDateString()}</span>
            </div>
        `).join('') || '<p class="text-gray-500 text-center py-8 italic">No notifications yet</p>';
    },

    openLeaveModal() {
        document.getElementById('leave-modal').classList.remove('hidden');
        gsap.from('#leave-modal > div', { scale: 0.9, opacity: 0, duration: 0.3 });

        // Add real-time duration sync
        const startInput = document.getElementById('startDate');
        const endInput = document.getElementById('endDate');

        if (startInput && endInput) {
            const syncCalc = () => this.calculateDays();
            startInput.addEventListener('input', syncCalc);
            endInput.addEventListener('input', syncCalc);
        }
    },

    closeLeaveModal() {
        document.getElementById('leave-modal').classList.add('hidden');
        // Reset state for next time
        document.getElementById('leave-form').classList.remove('hidden');
        document.getElementById('leave-success').classList.add('hidden');
        document.getElementById('leave-form').reset();
        document.getElementById('totalDaysDisplay').innerText = '0';
    },

    async viewDetails(id) {
        try {
            const req = await api.request(`/leave/requests/${id}`);
            document.getElementById('details-type').innerText = req.leaveType;
            document.getElementById('details-reason').innerText = req.reason;

            const statusElem = document.getElementById('details-status');
            statusElem.innerText = req.status;
            statusElem.className = `status-badge status-${req.status} capitalize`;

            const commentBox = document.getElementById('details-comment-box');
            if (req.teacherComment) {
                document.getElementById('details-comment').innerText = req.teacherComment;
                commentBox.classList.remove('hidden');
            } else {
                commentBox.classList.add('hidden');
            }

            document.getElementById('details-modal').classList.remove('hidden');
            gsap.from('#details-modal > div', { scale: 0.9, opacity: 0, duration: 0.3 });
        } catch (err) {
            console.error('Failed to load details:', err);
        }
    },

    closeDetailsModal() {
        document.getElementById('details-modal').classList.add('hidden');
    },

    calculateDays() {
        const start = new Date(document.getElementById('startDate').value);
        const end = new Date(document.getElementById('endDate').value);
        if (start && end && end >= start) {
            const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            document.getElementById('totalDaysDisplay').innerText = diff;
        } else {
            document.getElementById('totalDaysDisplay').innerText = '0';
        }
    },

    async submitLeave(e) {
        e.preventDefault();
        const user = auth.getUser();
        const btn = e.target.querySelector('button[type="submit"]');
        ui.setLoading(btn, true);

        const payload = {
            studentId: user.id,
            studentName: user.name,
            studentEmail: user.email,
            className: user.className,
            teacherId: user.teacherId,
            teacherName: user.teacherName,
            leaveType: document.getElementById('leaveType').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            totalDays: parseInt(document.getElementById('totalDaysDisplay').innerText),
            reason: document.getElementById('reason').value,
            parentContact: document.getElementById('parentContact').value,
            parentEmail: document.getElementById('parentEmail').value
        };

        try {
            await api.request('/leave/requests', 'POST', payload);

            // Transition to success state
            document.getElementById('leave-form').classList.add('hidden');
            document.getElementById('leave-success').classList.remove('hidden');
            gsap.from('#leave-success > div', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' });

            this.loadStudentRequests();
            this.loadNotifications(); // Refresh notifications to show the 'FILED' alert
        } catch (err) { }
        ui.setLoading(btn, false);
    },

    // --- Teacher Methods ---
    async initTeacher() {
        await this.loadTeacherRequests();
        // Removed redundant renderTeacherStats() call that was overriding data with zeros
        this.initReveal();
    },

    renderTeacherStats(requests = []) {
        const stats = {
            total: requests.length,
            pending: requests.filter(r => r.status === 'pending').length,
            approved: requests.filter(r => r.status === 'approved').length,
            today: requests.filter(r => {
                const todayStr = new Date().toISOString().split('T')[0];
                return r.processedAt && r.processedAt.includes(todayStr);
            }).length
        };

        const rate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

        if (document.getElementById('stat-teacher-total')) {
            document.getElementById('stat-teacher-total').innerText = stats.total;
            document.getElementById('stat-teacher-pending').innerText = stats.pending;
            document.getElementById('stat-teacher-today').innerText = stats.today;
            document.getElementById('stat-teacher-rate').innerText = `${rate}%`;
        }
    },

    initReveal() {
        // Trigger reveal animations for the dashboard components
        gsap.utils.toArray('.reveal').forEach(elem => {
            gsap.from(elem, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.2
            });
        });
    },

    async loadTeacherRequests(filter = 'all') {
        const user = auth.getUser();
        const allRequests = await api.request(`/leave/requests?teacherId=${user.id}`);
        let requests = [...allRequests];

        if (filter !== 'all') {
            requests = requests.filter(r => r.status === filter);
        }

        const tbody = document.getElementById('teacher-requests-table');
        tbody.innerHTML = requests.map(req => `
            <tr class="reveal hover:bg-white/[0.02] transition-colors">
                <td class="py-5">
                    <p class="font-bold text-gray-200 text-sm">${req.studentName}</p>
                    <p class="text-[10px] text-gray-500 font-medium">${req.studentEmail}</p>
                </td>
                <td class="py-5 text-gray-400 font-medium text-xs tracking-wider uppercase">${req.className}</td>
                <td class="py-5 font-bold capitalize text-gray-300 text-sm italic">${req.leaveType}</td>
                <td class="py-5 text-xs text-gray-400">
                    <div class="flex items-center gap-2 mb-1">
                        <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        <span>${req.startDate} to ${req.endDate}</span>
                    </div>
                    <span class="text-blue-500 font-bold">${req.totalDays} Days</span>
                </td>
                <td class="py-5">
                    <span class="status-badge status-${req.status}">${req.status}</span>
                </td>
                <td class="py-5 text-right">
                    ${req.status === 'pending' ? `
                        <button onclick="dashboard.openProcessModal('${req.id}', '${req.studentName}')" class="px-6 py-2.5 bg-white text-black text-xs font-black rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 active:scale-95 transition-all">Process Decision</button>
                    ` : `
                        <div class="flex flex-col items-end opacity-50">
                            <span class="text-[9px] text-gray-500 uppercase font-black tracking-widest text-right">Completed</span>
                            <span class="text-[10px] text-gray-400 font-bold">${new Date(req.processedAt).toLocaleDateString()}</span>
                        </div>
                    `}
                </td>
            </tr>
        `).join('') || '<tr><td colspan="6" class="py-16 text-center text-gray-500 italic text-sm">Queue is clear. No requests found.</td></tr>';

        this.renderTeacherStats(allRequests);
    },

    filterRequests(status) {
        // Update UI buttons
        document.querySelectorAll('.active-filter').forEach(b => b.classList.remove('active-filter', 'bg-white/10'));
        event.target.classList.add('active-filter', 'bg-white/10');
        this.loadTeacherRequests(status);
    },

    openProcessModal(id, name) {
        document.getElementById('process-leave-id').value = id;
        document.getElementById('process-student-name').innerText = `Request from: ${name}`;
        document.getElementById('process-modal').classList.remove('hidden');
    },

    closeProcessModal() {
        document.getElementById('process-modal').classList.add('hidden');
    },

    async submitProcess(e) {
        e.preventDefault();
        const user = auth.getUser();
        const id = document.getElementById('process-leave-id').value;
        const status = document.getElementById('process-status').value;
        const comment = document.getElementById('process-comment').value;
        const btn = e.target.querySelector('button[type="submit"]');

        ui.setLoading(btn, true);
        try {
            await api.request(`/leave/requests/${id}/process`, 'POST', {
                status,
                teacherComment: comment,
                processedBy: user.name
            });
            ui.toast(`Request ${status} successfully!`, 'success');
            this.closeProcessModal();
            this.loadTeacherRequests();
        } catch (err) { }
        ui.setLoading(btn, false);
    }
};
