document.addEventListener('DOMContentLoaded', () => {

    /* --- Theme Toggle (Dark / Light Mode) --- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check saved preference or default to light
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    if(currentTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    });

    /* --- Uptime Easter Egg (Fake Ping) --- */
    const pingCounter = document.getElementById('ping-counter');
    if (pingCounter) {
        setInterval(() => {
            // Random ping between 8ms and 24ms
            let randomPing = Math.floor(Math.random() * (24 - 8 + 1)) + 8;
            pingCounter.textContent = randomPing;
        }, 2500); // Updates every 2.5 seconds
    }


    /* --- 1. Interactive Canvas Background (Network Particles) --- */
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        
        const numberOfParticles = (width * height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = Math.random() * (width - size * 2) + size * 2;
            let y = Math.random() * (height - size * 2) + size * 2;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(56, 189, 248, 0.5)'; // Cyber Blue

            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;

            if (mouse.x && mouse.y) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.x -= dx / 30; // Push particles softly
                    this.y -= dy / 30;
                }
            }
            this.draw();
        }
    }

    function animateCanvas() {
        requestAnimationFrame(animateCanvas);
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) { particles[i].update(); }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                             + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                
                if (distance < (width/7) * (height/7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacityValue > 0 ? opacityValue * 0.3 : 0})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateCanvas();

    /* --- 2. Typewriter Effect --- */
    const typeWriterElement = document.getElementById('typewriter');
    const textArray = ["Network Specialist", "SD-WAN Expert", "Cybersecurity Enthusiast", "Problem Solver"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) charIndex--;
        else charIndex++;

        typeWriterElement.textContent = currentText.substring(0, charIndex);

        let typeSpeed = parseInt(Math.random() * 100) + 50;
        if (isDeleting) typeSpeed /= 2;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500;
        }
        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000);

    /* --- 3. Custom Cursor Integration --- */
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    const interactiveElements = document.querySelectorAll('a, .minimal-link, .grid-card, .btn-submit, #theme-toggle');
    let trailX = 0, trailY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
            mouse.x = e.clientX; mouse.y = e.clientY; 
        });

        function animateCursorTrail() {
            if (mouse.x && mouse.y) {
                trailX += (mouse.x - trailX) * 0.2;
                trailY += (mouse.y - trailY) * 0.2;
                cursorTrail.style.transform = `translate(${trailX - 4}px, ${trailY - 4}px)`;
            }
            requestAnimationFrame(animateCursorTrail);
        }
        animateCursorTrail();

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.transform = `translate(${mouse.x - 20}px, ${mouse.y - 20}px) scale(1.5)`);
            el.addEventListener('mouseleave', () => cursor.style.transform = `translate(${mouse.x - 20}px, ${mouse.y - 20}px) scale(1)`);
        });
    }

    /* --- 4. Pop-Up Scroll Animations --- */
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const popObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const children = entry.target.querySelectorAll('.pop-up-stagger');
                children.forEach((child, index) => {
                    setTimeout(() => child.classList.add('active'), index * 150);
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.pop-up').forEach(card => popObserver.observe(card));
});
