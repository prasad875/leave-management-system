const app = {
    init() {
        console.log('App initializing...');
        router.init();
        this.initGlobalUX();

        // High-Fidelity Splash Transition
        const splash = document.getElementById('system-splash');
        if (splash) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    splash.style.opacity = '0';
                    splash.style.visibility = 'hidden';
                }, 800); // Allow GSAP to prime before full reveal
            });
        }
    },

    initGlobalUX() {
        // Scroll to Top Global Logic
        const scrollBtn = document.getElementById('scroll-to-top');
        if (scrollBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    scrollBtn.classList.remove('opacity-0', 'pointer-events-none');
                    scrollBtn.classList.add('opacity-100');
                } else {
                    scrollBtn.classList.add('opacity-0', 'pointer-events-none');
                    scrollBtn.classList.remove('opacity-100');
                }
            });

            scrollBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    },

    initHome() {
        if (!document.getElementById('hero-title')) return;

        // GSAP Animations for Hero
        const tl = gsap.timeline();
        tl.from('#hero-title', { opacity: 0, y: 50, duration: 1, ease: 'power4.out' })
            .from('#hero-subtitle', { opacity: 0, y: 30, duration: 1, ease: 'power4.out' }, '-=0.6')
            .from('#hero-cta', { opacity: 0, y: 20, duration: 1, ease: 'power4.out' }, '-=0.6')
            .from('#floating-cards', { opacity: 0, duration: 1 }, '-=0.4');

        // Floating animation for cards
        if (document.querySelectorAll('#floating-cards .glass-card').length) {
            gsap.to('#floating-cards .glass-card', {
                y: '-=20',
                rotation: '+=5',
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.5
            });
        }

        // Scroll reveals
        gsap.utils.toArray('.reveal').forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });
    },

    async initLogin() {
        const form = document.getElementById('login-form');
        if (!form) return;

        // Trigger entrance animations
        this.initReveal();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            ui.setLoading(btn, true);
            try {
                await auth.login(
                    document.getElementById('email').value,
                    document.getElementById('password').value
                );
            } catch (err) { }
            ui.setLoading(btn, false);
        });
    },

    async initRegister() {
        const form = document.getElementById('register-form');
        if (!form) return;

        // Trigger entrance animations
        this.initReveal();

        // Load teachers list
        try {
            const teachers = await api.request('/auth/teachers');
            const select = document.getElementById('teacherId');
            if (select) {
                if (teachers.length === 0) {
                    select.innerHTML = `<option value="">No teachers available - register a teacher first!</option>`;
                } else {
                    select.innerHTML = teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
                }
            }
        } catch (err) {
            console.error('Failed to load teachers:', err);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            ui.setLoading(btn, true);

            const role = document.getElementById('role').value;
            const teacherSelect = document.getElementById('teacherId');

            const payload = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                role: role,
                className: role === 'Student' ? document.getElementById('className').value : null,
                teacherId: role === 'Student' ? (teacherSelect ? teacherSelect.value : null) : null,
                teacherName: role === 'Student' ? (teacherSelect && teacherSelect.selectedIndex >= 0 ? teacherSelect.options[teacherSelect.selectedIndex].text : null) : null
            };

            try {
                await auth.register(payload);
            } catch (err) { }
            ui.setLoading(btn, false);
        });
    },

    toggleRoleFields(role) {
        const classField = document.getElementById('student-only-class');
        const teacherField = document.getElementById('student-only-teacher');
        if (role === 'Teacher') {
            if (classField) classField.classList.add('hidden');
            if (teacherField) teacherField.classList.add('hidden');
        } else {
            if (classField) classField.classList.remove('hidden');
            if (teacherField) teacherField.classList.remove('hidden');
        }
    },

    initReveal() {
        // Trigger reveal animations
        gsap.utils.toArray('.reveal').forEach(elem => {
            gsap.from(elem, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.2
            });
        });
    }
};

// Global event delegation for dynamic forms
document.addEventListener('submit', (e) => {
    if (e.target.id === 'leave-form') dashboard.submitLeave(e);
    if (e.target.id === 'process-form') dashboard.submitProcess(e);
});

// Start app
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
