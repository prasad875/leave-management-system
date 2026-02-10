const router = {
    routes: {
        '': 'home',
        '#/': 'home',
        '#/login': 'login',
        '#/register': 'register',
        '#/student-dashboard': 'studentDashboard',
        '#/teacher-dashboard': 'teacherDashboard'
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    navigate(path) {
        // Path should be like '/login' -> will become '#/login'
        window.location.hash = path;
    },

    handleRoute() {
        let hash = window.location.hash || '#/';

        const route = this.routes[hash] || 'home';
        console.log('Routing to:', route, 'for hash:', hash);
        this.render(route);
        this.updateNav();
    },

    updateNav() {
        const user = auth.getUser();
        const authButtons = document.getElementById('nav-auth-buttons');
        const userInfo = document.getElementById('nav-user-info');
        const userName = document.getElementById('nav-user-name');

        if (user) {
            authButtons.classList.add('hidden');
            userInfo.classList.remove('hidden');
            userName.innerText = `${user.name} (${user.role})`;
        } else {
            authButtons.classList.remove('hidden');
            userInfo.classList.add('hidden');
        }
    },

    render(page) {
        const container = document.getElementById('app-container');
        // Clear container
        container.innerHTML = '';

        const user = auth.getUser();

        // Route protection
        if (page === 'studentDashboard' && (!user || user.role !== 'Student')) {
            this.navigate('/login');
            return;
        }
        if (page === 'teacherDashboard' && (!user || user.role !== 'Teacher')) {
            this.navigate('/login');
            return;
        }

        switch (page) {
            case 'home':
                container.innerHTML = this.templates.home;
                app.initHome();
                break;
            case 'login':
                container.innerHTML = this.templates.login;
                app.initLogin();
                break;
            case 'register':
                container.innerHTML = this.templates.register;
                app.initRegister();
                break;
            case 'studentDashboard':
                container.innerHTML = this.templates.studentDashboard;
                dashboard.initStudent();
                break;
            case 'teacherDashboard':
                container.innerHTML = this.templates.teacherDashboard;
                dashboard.initTeacher();
                break;
        }
    },

    templates: {
        home: `
            <section id="hero" class="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                <div class="absolute inset-0 z-0">
                    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
                    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
                </div>
                <div class="relative z-10 max-w-4xl">
                    <h1 id="hero-title" class="text-5xl md:text-8xl font-extrabold mb-6 leading-tight">
                        Effortless Leave <br/>
                        <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic">Management</span>
                    </h1>
                    <p id="hero-subtitle" class="text-gray-400 text-lg md:text-xl mb-10">
                        Experience the future of campus leave tracking. Streamlined workflows for students and educators with automated verification and real-time alerts.
                    </p>
                    <div id="hero-cta" class="flex flex-col md:flex-row gap-6 justify-center">
                        <button onclick="router.navigate('/register')" class="px-10 py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            Get Started
                        </button>
                        <button onclick="router.navigate('/login')" class="px-10 py-4 rounded-xl border border-white/20 hover:bg-white/5 transition-all text-lg backdrop-blur-sm">
                            Teacher Portal
                        </button>
                    </div>

                </div>

                <!-- Floating 3D Elements - Moved outside max-w container to prevent overlap -->
                <div id="floating-cards" class="absolute inset-0 pointer-events-none">
                    <div class="absolute top-20 left-[5%] w-32 h-32 bg-blue-500/10 backdrop-blur-xl border border-white/10 rounded-2xl rotate-12 glass-card animate-float" style="--rot: 12deg"></div>
                    <div class="absolute bottom-20 right-[5%] w-48 h-48 bg-purple-500/10 backdrop-blur-xl border border-white/10 rounded-3xl -rotate-12 glass-card animate-float" style="--rot: -12deg; animation-delay: 1s"></div>
                    <div class="absolute top-1/2 left-[85%] w-24 h-24 bg-pink-500/10 backdrop-blur-xl border border-white/10 rounded-xl rotate-45 glass-card animate-float" style="--rot: 45deg; animation-delay: 2s"></div>
                </div>
            </section>

            <!-- Stats Section -->
            <section class="py-20 px-6 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <div class="text-center p-8 glass-card rounded-3xl border-b-4 border-blue-500 reveal">
                    <h3 class="text-4xl font-extrabold mb-2">10k+</h3>
                    <p class="text-gray-400">Active Students</p>
                </div>
                <div class="text-center p-8 glass-card rounded-3xl border-b-4 border-purple-500 reveal" style="transition-delay: 0.1s">
                    <h3 class="text-4xl font-extrabold mb-2">500+</h3>
                    <p class="text-gray-400">Total Teachers</p>
                </div>
                <div class="text-center p-8 glass-card rounded-3xl border-b-4 border-pink-500 reveal" style="transition-delay: 0.2s">
                    <h3 class="text-4xl font-extrabold mb-2">99.9%</h3>
                    <p class="text-gray-400">Uptime Rate</p>
                </div>
                <div class="text-center p-8 glass-card rounded-3xl border-b-4 border-green-500 reveal" style="transition-delay: 0.3s">
                    <h3 class="text-4xl font-extrabold mb-2">Instant</h3>
                    <p class="text-gray-400">Email Alerts</p>
                </div>
            </section>

            <!-- About Section -->
            <section id="about" class="py-24 px-6 max-w-7xl mx-auto">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div class="reveal">
                        <h2 class="text-4xl font-bold mb-6 italic">About <span class="text-blue-500">LeaveMS</span></h2>
                        <p class="text-gray-400 text-lg leading-relaxed mb-6">
                            LeaveMS was born out of the need for a more efficient, transparent, and reliable way to manage academic leaves. Traditional paper-based systems are slow, prone to loss, and lack real-time visibility. Our platform provides a bridge of trust between the institution and the students.
                        </p>
                        <p class="text-gray-400 text-lg leading-relaxed">
                            By centralizing all requests in a digital ecosystem, we ensure that no leave application is ever ignored or delayed. Every interaction is timestamped, verified, and backed by a robust notification layer.
                        </p>
                    </div>
                    <div class="glass-card p-8 rounded-[40px] border-l-4 border-blue-500 reveal" style="transition-delay: 0.2s">
                        <h3 class="text-2xl font-bold mb-4">Our Mission</h3>
                        <p class="text-gray-400 italic">
                            "To digitize campus administration, making leave management as simple as a single click while ensuring complete accountability for all stakeholders."
                        </p>
                    </div>
                </div>
            </section>

            <!-- Features Section -->
            <section id="features" class="py-32 px-6 max-w-7xl mx-auto">
                <div class="text-center mb-20 reveal">
                    <h2 class="text-4xl md:text-6xl font-bold mb-6 italic">Powerful <span class="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Capabilities</span></h2>
                    <p class="text-gray-400 max-w-2xl mx-auto">Everything you need to manage academic leaves in one unified, beautiful dashboard.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div class="p-10 glass-card rounded-[40px] hover:scale-105 transition-transform duration-500 group reveal">
                        <div class="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                            <svg class="w-8 h-8 text-blue-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                            </svg>
                        </div>
                        <h4 class="text-2xl font-bold mb-4">Smart Submission</h4>
                        <p class="text-gray-400">Quick leave application with automatic day calculation and teacher assignment.</p>
                    </div>
                    <div class="p-10 glass-card rounded-[40px] hover:scale-105 transition-transform duration-500 group reveal" style="transition-delay: 0.1s">
                        <div class="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                            <svg class="w-8 h-8 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                        </div>
                        <h4 class="text-2xl font-bold mb-4">Triple-Layer Alerts</h4>
                        <p class="text-gray-400">Automated synchronization between Student, Teacher, and Parent via real-time dashboard and email notifications.</p>
                    </div>
                    <div class="p-10 glass-card rounded-[40px] hover:scale-105 transition-transform duration-500 group reveal" style="transition-delay: 0.2s">
                        <div class="w-16 h-16 bg-pink-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors">
                            <svg class="w-8 h-8 text-pink-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                        </div>
                        <h4 class="text-2xl font-bold mb-4">Teacher Portal</h4>
                        <p class="text-gray-400">Dedicated dashboard for educators to filter, view, and approve requests seamlessly.</p>
                    </div>
                </div>
            </section>

            <!-- Technical Architecture -->
            <section id="tech" class="py-24 px-6 bg-white/5">
                <div class="max-w-7xl mx-auto">
                    <h2 class="text-4xl font-bold mb-16 text-center reveal">Technical <span class="text-purple-500">Core</span></h2>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div class="tech-stack-item p-6 glass-card rounded-2xl border border-white/10 reveal">
                            <h4 class="text-xl font-bold mb-3 text-blue-400">Frontend</h4>
                            <p class="text-sm text-gray-400">Pure HTML5, Vanilla JavaScript, and Tailwind CSS for a lightweight yet powerful UI.</p>
                        </div>
                        <div class="tech-stack-item p-6 glass-card rounded-2xl border border-white/10 reveal" style="transition-delay: 0.1s">
                            <h4 class="text-xl font-bold mb-3 text-purple-400">Animations</h4>
                            <p class="text-sm text-gray-400">GSAP (GreenSock) for high-performance 3D transforms and smooth scroll interactions.</p>
                        </div>
                        <div class="tech-stack-item p-6 glass-card rounded-2xl border border-white/10 reveal" style="transition-delay: 0.2s">
                            <h4 class="text-xl font-bold mb-3 text-pink-400">Communication</h4>
                            <p class="text-sm text-gray-400">Automated synchronization via <span class="text-pink-400 font-bold">Nodemailer</span>, powering our Triple-Layer Alert system for students, teachers, and parents.</p>
                        </div>
                        <div class="tech-stack-item p-6 glass-card rounded-2xl border border-white/10 reveal" style="transition-delay: 0.3s">
                            <h4 class="text-xl font-bold mb-3 text-green-400">Database</h4>
                            <p class="text-sm text-gray-400">MySQL with Sequelize for reliable, relational data storage ensuring ACID compliance.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- System Modules -->
            <section id="modules" class="py-24 px-6 max-w-7xl mx-auto">
                <h2 class="text-4xl font-bold mb-16 text-center italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400 reveal">Advanced Modules</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div class="p-8 glass-card rounded-[40px] border-t-4 border-blue-500 reveal">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-2xl">🎓</div>
                            <h3 class="text-2xl font-bold">Student Module</h3>
                        </div>
                        <ul class="space-y-4 text-gray-400">
                            <li class="flex gap-2"><span>•</span> Instant Leave Application</li>
                            <li class="flex gap-2"><span>•</span> Real-time Status Tracking</li>
                            <li class="flex gap-2"><span>•</span> Automated Day Calculation</li>
                            <li class="flex gap-2"><span>•</span> History of Past Requests</li>
                        </ul>
                    </div>
                    <div class="p-8 glass-card rounded-[40px] border-t-4 border-purple-500 reveal" style="transition-delay: 0.2s">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-2xl">👨‍🏫</div>
                            <h3 class="text-2xl font-bold">Teacher Module</h3>
                        </div>
                        <ul class="space-y-4 text-gray-400">
                            <li class="flex gap-2"><span>•</span> Unified Request Inbox</li>
                            <li class="flex gap-2"><span>•</span> One-Click Processing</li>
                            <li class="flex gap-2"><span>•</span> Advanced Search & Filtering</li>
                            <li class="flex gap-2"><span>•</span> Commenting & Feedback System</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- Benefits Section -->
            <section class="py-32 px-6 bg-gradient-to-b from-transparent to-blue-900/10">
                <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div class="reveal">
                        <h2 class="text-4xl md:text-5xl font-bold mb-8 italic">Precision Built for <br /><span class="text-blue-500 underline decoration-blue-500/30">Educational Success</span></h2>
                        <ul class="space-y-6">
                            <li class="flex gap-4">
                                <div class="w-8 h-8 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shrink-0">✓</div>
                                <p class="text-gray-300"><strong>Triple-Layer Alerts:</strong> Real-time synchronization for Students, Teachers, and Parents via automated Nodemailer services.</p>
                            </li>
                            <li class="flex gap-4">
                                <div class="w-8 h-8 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center shrink-0">✓</div>
                                <p class="text-gray-300"><strong>Real-time Speed:</strong> Built using the latest SPA architecture for instantaneous role-based view switching.</p>
                            </li>
                            <li class="flex gap-4">
                                <div class="w-8 h-8 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center shrink-0">✓</div>
                                <p class="text-gray-300"><strong>Modern UX:</strong> 3D GSAP animations provide a premium interface that students and teachers enjoy using.</p>
                            </li>
                        </ul>
                    </div>
                    <div class="grid grid-cols-2 gap-4 reveal" style="transition-delay: 0.2s">
                        <div class="h-64 bg-gradient-to-br from-blue-600/20 to-transparent border border-white/10 rounded-3xl p-6 hover-3d transition-3d glass-card">
                            <p class="text-4xl mb-4">🛡️</p>
                            <h6 class="font-bold">Encrypted</h6>
                            <p class="text-xs text-gray-400 mt-2">JWT protected sessions and Bcrypt hashed passwords.</p>
                        </div>
                        <div class="h-64 mt-12 bg-gradient-to-br from-purple-600/20 to-transparent border border-white/10 rounded-3xl p-6 hover-3d transition-3d glass-card">
                            <p class="text-4xl mb-4">⚡</p>
                            <h6 class="font-bold">Fast</h6>
                            <p class="text-xs text-gray-400 mt-2">Optimized MySQL queries for sub-millisecond responses.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Working Process -->
            <section class="py-32 px-6 max-w-7xl mx-auto">
                <h2 class="text-4xl md:text-5xl font-bold mb-20 text-center reveal">Seamless <span class="text-blue-500">Workflow</span></h2>
                <div class="relative">
                    <div class="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 -translate-y-1/2 opacity-20"></div>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        <div class="text-center group reveal">
                            <div class="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform">1</div>
                            <h5 class="text-xl font-bold mb-2">Registration</h5>
                            <p class="text-gray-400 text-sm">Join as a student or teacher to access your portal.</p>
                        </div>
                        <div class="text-center group reveal" style="transition-delay: 0.1s">
                            <div class="w-20 h-20 bg-purple-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-6 shadow-[0_0_30px_rgba(147,51,234,0.4)] group-hover:scale-110 transition-transform">2</div>
                            <h5 class="text-xl font-bold mb-2">Submission</h5>
                            <p class="text-gray-400 text-sm">Apply for leave with a beautiful, simple form.</p>
                        </div>
                        <div class="text-center group reveal" style="transition-delay: 0.2s">
                            <div class="w-20 h-20 bg-pink-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-6 shadow-[0_0_30px_rgba(236,72,153,0.4)] group-hover:scale-110 transition-transform">3</div>
                            <h5 class="text-xl font-bold mb-2">Review</h5>
                            <p class="text-gray-400 text-sm">Teachers review and process requests instantly.</p>
                        </div>
                        <div class="text-center group reveal" style="transition-delay: 0.3s">
                            <div class="w-20 h-20 bg-green-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform">4</div>
                            <h5 class="text-xl font-bold mb-2">Approval</h5>
                            <p class="text-gray-400 text-sm">Get notified via email and track your live status.</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Testimonials -->
            <section class="py-32 px-6">
                <h2 class="text-4xl md:text-5xl font-bold mb-20 text-center italic reveal">What Our <span class="text-purple-500">Users Say</span></h2>
                <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="p-8 glass-card rounded-[40px] reveal">
                        <div class="flex gap-1 text-yellow-500 mb-6">★★★★★</div>
                        <p class="text-gray-400 mb-8 italic">"The automated email notifications are a life saver. I no longer have to check the dashboard every hour to see if my sick leave was approved."</p>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">R</div>
                            <div>
                                <h6 class="font-bold">Rahul Verma</h6>
                                <p class="text-xs text-gray-500">Computer Science Student</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-8 glass-card rounded-[40px] reveal" style="transition-delay: 0.1s">
                        <div class="flex gap-1 text-yellow-500 mb-6">★★★★★</div>
                        <p class="text-gray-400 mb-8 italic">"As a teacher with 60+ students, being able to filter requests and process them with one click has saved me hours of administrative work."</p>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold">P</div>
                            <div>
                                <h6 class="font-bold">Prof. Priya Das</h6>
                                <p class="text-xs text-gray-500">Department Head</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-8 glass-card rounded-[40px] reveal" style="transition-delay: 0.2s">
                        <div class="flex gap-1 text-yellow-500 mb-6">★★★★★</div>
                        <p class="text-gray-400 mb-8 italic">"The 3D interface is stunning. It feels like using a top-tier modern app. Highly recommend for any institution looking to modernize."</p>
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center font-bold">A</div>
                            <div>
                                <h6 class="font-bold">Ankit Sharma</h6>
                                <p class="text-xs text-gray-500">Engineering Student</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FAQ Section -->
            <section class="py-32 px-6 max-w-4xl mx-auto">
                <h2 class="text-4xl font-bold mb-16 text-center reveal">Common <span class="text-blue-400">Questions</span></h2>
                <div class="space-y-6">
                    <div class="p-6 glass-card rounded-2xl reveal">
                        <h6 class="font-bold text-lg mb-2">How do I track my leave?</h6>
                        <p class="text-gray-400">Log in to your Student Dashboard to see live status updates and historical records of all your applications.</p>
                    </div>
                    <div class="p-6 glass-card rounded-2xl reveal" style="transition-delay: 0.1s">
                        <h6 class="font-bold text-lg mb-2">Can I apply for multiple days?</h6>
                        <p class="text-gray-400">Yes! Our system automatically calculates the total duration based on your start and end dates.</p>
                    </div>
                    <div class="p-6 glass-card rounded-2xl reveal" style="transition-delay: 0.2s">
                        <h6 class="font-bold text-lg mb-2">Are my details secure?</h6>
                        <p class="text-gray-400">Absolutely. We use industry-standard encryption for passwords and session management.</p>
                    </div>
                </div>
            </section>

            <!-- Call to Action -->
            <section class="py-32 px-6">
                <div class="max-w-5xl mx-auto glass-card rounded-[50px] p-20 text-center relative overflow-hidden group reveal">
                    <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <h2 class="text-5xl font-bold mb-8 relative z-10">Ready to simplify leave tracking?</h2>
                    <p class="text-xl text-gray-400 mb-12 relative z-10">Join hundreds of institutions using LeaveMS today.</p>
                    <button onclick="router.navigate('/register')" class="relative z-10 px-12 py-5 bg-white text-black font-extrabold rounded-2xl hover:scale-110 transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.1)]">Create Free Account</button>
                </div>
            </section>
        `,
        login: `
            <div class="min-h-[80vh] flex items-center justify-center p-6">
                <div class="max-w-md w-full glass-card rounded-[40px] p-10 relative overflow-hidden reveal shadow-[0_0_100px_rgba(59,130,246,0.15)]">
                    <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px]"></div>
                    <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/10 blur-[80px]"></div>
                    
                    <div class="text-center mb-10">
                        <div class="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                            </svg>
                        </div>
                        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">Welcome Back</h2>
                        <p class="text-gray-400 mt-2">Access your portal to manage leaves.</p>
                    </div>

                    <form id="login-form" class="space-y-6 relative z-10">
                        <div class="space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" id="email" required placeholder="name@institution.com" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-700">
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                            <input type="password" id="password" required placeholder="••••••••" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-gray-700">
                        </div>
                        <button type="submit" class="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 font-extrabold hover:shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:-translate-y-1 transition-all">Sign In to Dashboard</button>
                    </form>
                    
                    <div class="mt-8 text-center text-sm">
                        <span class="text-gray-500">Don't have an account?</span>
                        <a href="#" onclick="router.navigate('/register')" class="text-blue-400 font-bold hover:underline ml-1">Create Account</a>
                    </div>
                </div>
            </div>
        `,
        register: `
            <div class="min-h-[90vh] flex items-center justify-center p-6">
                <div class="max-w-2xl w-full glass-card rounded-[50px] p-12 relative overflow-hidden reveal shadow-[0_0_120px_rgba(147,51,234,0.1)]">
                    <div class="absolute -top-32 -left-32 w-64 h-64 bg-purple-600/10 blur-[100px]"></div>
                    <div class="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-600/10 blur-[100px]"></div>

                    <div class="text-center mb-10">
                        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent italic">Join LeaveMS</h2>
                        <p class="text-gray-400 mt-2">Set up your profile and start syncing today.</p>
                    </div>

                    <form id="register-form" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
                        <div class="md:col-span-2 space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                            <input type="text" id="name" required placeholder="John Doe" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all">
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" id="email" required placeholder="john@example.com" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all">
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                            <input type="password" id="password" required placeholder="••••••••" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all">
                        </div>
                        <div class="space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Role</label>
                            <select id="role" required onchange="app.toggleRoleFields(this.value)" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all text-white">
                                <option value="Student" selected>Student</option>
                                <option value="Teacher">Teacher</option>
                            </select>
                        </div>
                        <div id="student-only-class" class="space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Class/Section</label>
                            <input type="text" id="className" placeholder="e.g., CS-2024" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all">
                        </div>
                        <div id="student-only-teacher" class="md:col-span-2 space-y-2">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Assigned Supervisor (Teacher)</label>
                            <select id="teacherId" class="w-full bg-[#030712] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-all text-white">
                                <!-- Teachers populated via JS -->
                            </select>
                        </div>
                        <div class="md:col-span-2 mt-4">
                            <button type="submit" class="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-extrabold hover:shadow-[0_20px_40px_rgba(147,51,234,0.3)] hover:-translate-y-1 transition-all">Create Professional Account</button>
                        </div>
                    </form>
                    
                    <div class="mt-8 text-center text-sm">
                        <span class="text-gray-500">Already have an account?</span>
                        <a href="#" onclick="router.navigate('/login')" class="text-purple-400 font-bold hover:underline ml-1">Sign In</a>
                    </div>
                </div>
            </div>
        `,
        studentDashboard: `
            <div class="max-w-6xl mx-auto p-6 space-y-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 reveal">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span class="text-[10px] uppercase font-bold tracking-widest text-green-500/80">Live Sync Active</span>
                        </div>
                        <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">Welcome, <span id="student-name-header">Student</span></h1>
                        <p class="text-gray-400 mt-2 text-sm tracking-wide">Syncing status: <span class="text-blue-500 font-bold">Encrypted Node</span></p>
                    </div>
                    <button onclick="dashboard.openLeaveModal()" class="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center gap-3">
                        <span class="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                            </svg>
                        </span>
                        Submit New Request
                    </button>
                </div>

                <!-- Summary Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 reveal" style="transition-delay: 0.1s">
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-blue-500">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Filed</p>
                        <h4 id="stat-total" class="text-3xl font-bold mt-1">0</h4>
                    </div>
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-yellow-500">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Pending</p>
                        <h4 id="stat-pending" class="text-3xl font-bold mt-1">0</h4>
                    </div>
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-green-500">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Approved</p>
                        <h4 id="stat-approved" class="text-3xl font-bold mt-1">0</h4>
                    </div>
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-red-500">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Rejected</p>
                        <h4 id="stat-rejected" class="text-3xl font-bold mt-1">0</h4>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Notifications -->
                    <div class="glass-card rounded-3xl p-6 h-fit reveal" style="transition-delay: 0.2s">
                        <h3 class="text-xl font-bold mb-6 flex items-center gap-3">
                            <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                            </div>
                            Recent Alerts
                        </h3>
                        <div id="notification-list" class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                             <div class="animate-pulse space-y-4">
                                <div class="h-16 bg-white/5 rounded-xl"></div>
                                <div class="h-16 bg-white/5 rounded-xl"></div>
                             </div>
                        </div>
                    </div>

                <div class="lg:col-span-2 glass-card rounded-3xl p-8 reveal shadow-2xl" style="transition-delay: 0.3s">
                    <h3 class="text-xl font-bold mb-6 flex items-center gap-3">
                        <div class="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </div>
                        Application History
                    </h3>
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left">
                            <thead class="text-gray-400 border-b border-white/10 text-sm uppercase tracking-widest">
                                <tr>
                                    <th class="pb-6">Request Type</th>
                                    <th class="pb-6">Dates</th>
                                    <th class="pb-6">Duration</th>
                                    <th class="pb-6">Status</th>
                                    <th class="pb-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="student-requests-table" class="divide-y divide-white/5">
                                <!-- Requests populated via JS -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- QoS Footer -->
                <div class="flex justify-between items-center py-6 border-t border-white/5 opacity-50 text-[10px] uppercase tracking-widest font-bold reveal">
                    <div class="flex items-center gap-4">
                        <span>System ID: LMS-PRD-001</span>
                        <span class="h-1 w-1 rounded-full bg-gray-600"></span>
                        <span>Security: Triple-Layer AES</span>
                    </div>
                    <div>&copy; 2026 LeaveMS Global Infrastructure</div>
                </div>
            </div>

            <!-- Apply for Leave Modal -->
            <div id="leave-modal" class="hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="glass-card w-full max-w-lg rounded-3xl p-6 relative overflow-y-auto max-h-[90vh]">
                    <button onclick="dashboard.closeLeaveModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white z-20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <!-- Form State -->
                    <div id="leave-form-container">
                        <form id="leave-form" class="space-y-4">
                            <div class="text-center mb-6">
                                <h2 class="text-3xl font-extrabold italic bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Submit Leave</h2>
                                <p class="text-xs text-gray-500 mt-1">Fill out the details below to notify your teacher.</p>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Leave Type</label>
                                    <select id="leaveType" required class="w-full bg-[#030712] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
                                        <option value="sick">Sick Leave</option>
                                        <option value="casual">Casual Leave</option>
                                        <option value="academic">Academic Leave</option>
                                        <option value="emergency">Emergency</option>
                                    </select>
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Parent Contact</label>
                                    <input type="text" id="parentContact" required placeholder="e.g., 9876543210" class="w-full bg-[#030712] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Parent Email (Auto-Sync)</label>
                                <input type="email" id="parentEmail" required placeholder="parent@example.com" class="w-full bg-[#030712] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Start Date</label>
                                    <input type="date" id="startDate" required class="w-full bg-[#030712] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
                                </div>
                                <div class="space-y-1">
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">End Date</label>
                                    <input type="date" id="endDate" required class="w-full bg-[#030712] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm">
                                </div>
                            </div>

                            <div class="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl flex justify-between items-center">
                                <span class="text-xs font-bold text-blue-400 uppercase tracking-widest pl-1">Calculated Duration</span>
                                <span class="text-lg font-black"><span id="totalDaysDisplay">0</span> Days</span>
                            </div>

                            <div class="space-y-1">
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Reason for Leave</label>
                                <textarea id="reason" required rows="2" placeholder="Provide a brief explanation..." class="w-full bg-[#030712] border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-sm"></textarea>
                            </div>

                            <button type="submit" class="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 font-extrabold hover:shadow-[0_10px_30px_rgba(59,130,246,0.3)] transition-all">Send for Teacher Approval</button>
                        </form>
                    </div>

                    <!-- Success State (hidden by default) -->
                    <div id="leave-success" class="hidden text-center py-10 space-y-6 animate-fade-in">
                        <div class="w-24 h-24 bg-green-500/10 rounded-full mx-auto flex items-center justify-center">
                            <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 class="text-3xl font-bold italic">Application Filed!</h3>
                        <p class="text-gray-400">Your request has been synchronized with our Triple-Layer Alert system.</p>
                        <button onclick="dashboard.closeLeaveModal()" class="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all">Back to Dashboard</button>
                    </div>
                </div>
            </div>

            <!-- Details Modal -->
            <div id="details-modal" class="hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="glass-card w-full max-w-xl rounded-3xl p-8 relative shadow-2xl">
                    <button onclick="dashboard.closeDetailsModal()" class="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h3 id="details-title" class="text-2xl font-bold mb-6 italic text-blue-400">Request Details</h3>
                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-gray-500 uppercase">Type</p>
                                <p id="details-type" class="font-bold capitalize">-</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 uppercase">Status</p>
                                <span id="details-status" class="status-badge capitalize">-</span>
                            </div>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 uppercase">Reason</p>
                            <p id="details-reason" class="text-gray-300 mt-1 italic">-</p>
                        </div>
                        <div id="details-comment-box" class="p-4 bg-white/5 rounded-xl border border-white/10 hidden">
                            <p class="text-xs text-gray-500 uppercase mb-1">Teacher's Comment</p>
                            <p id="details-comment" class="text-blue-400">-</p>
                        </div>
                    </div>
                </div>
            </div>
        `,
        teacherDashboard: `
            <div class="max-w-6xl mx-auto p-6 space-y-8">
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 reveal">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span class="relative flex h-2 w-2">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span class="text-[10px] uppercase font-bold tracking-widest text-green-500/80">Bridge of Trust Active</span>
                        </div>
                        <h1 class="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent italic">Welcome, <span id="teacher-name-header">Professor</span></h1>
                        <p class="text-gray-400 mt-2 text-sm tracking-wide">Infrastructure: <span class="text-purple-500 font-bold">Bridge of Trust</span></p>
                    </div>
                </div>

                <!-- Teacher Stats -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 reveal" style="transition-delay: 0.1s">
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-blue-500">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Received</p>
                        <h4 id="stat-teacher-total" class="text-3xl font-bold mt-1">0</h4>
                    </div>
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-yellow-500 transition-all">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Pending Review</p>
                        <h4 id="stat-teacher-pending" class="text-3xl font-bold mt-1 text-yellow-500">0</h4>
                    </div>
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-green-500">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Processed Today</p>
                        <h4 id="stat-teacher-today" class="text-3xl font-bold mt-1">0</h4>
                    </div>
                    <div class="glass-card p-6 rounded-3xl border-l-4 border-purple-500">
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Approval Rate</p>
                        <h4 id="stat-teacher-rate" class="text-3xl font-bold mt-1">0%</h4>
                    </div>
                </div>

                <div class="flex gap-4 mb-4 overflow-x-auto pb-2 reveal" style="transition-delay: 0.2s">
                    <button onclick="dashboard.filterRequests('all')" class="px-8 py-2.5 rounded-xl glass-card hover:bg-white/10 active-filter transition-all">All</button>
                    <button onclick="dashboard.filterRequests('pending')" class="px-8 py-2.5 rounded-xl glass-card hover:bg-white/10 transition-all">Pending</button>
                    <button onclick="dashboard.filterRequests('approved')" class="px-8 py-2.5 rounded-xl glass-card hover:bg-white/10 transition-all">Approved</button>
                    <button onclick="dashboard.filterRequests('rejected')" class="px-8 py-2.5 rounded-xl glass-card hover:bg-white/10 transition-all">Rejected</button>
                </div>

                <div class="glass-card rounded-[40px] p-8 overflow-hidden reveal shadow-2xl" style="transition-delay: 0.3s">
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left">
                            <thead class="text-gray-400 border-b border-white/10 text-sm uppercase tracking-widest">
                                <tr>
                                    <th class="pb-6">Student Info</th>
                                    <th class="pb-6">Class</th>
                                    <th class="pb-6">Request Type</th>
                                    <th class="pb-6">Duration</th>
                                    <th class="pb-6">Status</th>
                                    <th class="pb-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="teacher-requests-table" class="divide-y divide-white/5">
                                <!-- Requests populated via JS -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- QoS Footer -->
                <div class="flex justify-between items-center py-6 border-t border-white/5 opacity-50 text-[10px] uppercase tracking-widest font-bold reveal">
                    <div class="flex items-center gap-4">
                        <span>Supervisor Node: NODE-04</span>
                        <span class="h-1 w-1 rounded-full bg-gray-600"></span>
                        <span>SLA: 99.9% Uptime</span>
                    </div>
                    <div>Verified LeaveMS Authority</div>
                </div>
            </div>

            <!-- Process Modal -->
            <div id="process-modal" class="hidden fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div class="glass-card w-full max-w-xl rounded-3xl p-8 relative">
                    <button onclick="dashboard.closeProcessModal()" class="absolute top-6 right-6 text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 class="text-3xl font-bold mb-2 italic bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Process Request</h2>
                    <p id="process-student-name" class="text-gray-400 mb-6"></p>
                    <form id="process-form" class="space-y-6">
                        <input type="hidden" id="process-leave-id">
                        <div>
                            <label class="block text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Decision</label>
                            <select id="process-status" required class="w-full bg-[#030712] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 text-white transition-all">
                                <option value="approved">Approve Leave</option>
                                <option value="rejected">Reject Leave</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-2 font-bold uppercase tracking-wider">Teacher's Remark (Sent via Email)</label>
                            <textarea id="process-comment" rows="3" placeholder="Provide context for your decision..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all"></textarea>
                        </div>
                        <div class="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                            <p class="text-[10px] text-yellow-500 uppercase font-bold tracking-widest flex items-center gap-2">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 11.586V6z"/></svg>
                                Bridge of Trust Remider
                            </p>
                            <p class="text-xs text-gray-500 mt-1">Your decision will be instantly synchronized with the Student and Parent via our Triple-Layer Alert system.</p>
                        </div>
                        <button type="submit" class="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-extrabold hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all">Finalize Decision</button>
                    </form>
                </div>
            </div>
        `
    }
};
