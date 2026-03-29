document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Interactive Canvas Background (Network Particles) --- */
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Mouse Interaction
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
        
        // Create nodes
        const numberOfParticles = (width * height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = Math.random() * (width - size * 2) + size * 2;
            let y = Math.random() * (height - size * 2) + size * 2;
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = 'rgba(59, 130, 246, 0.4)'; // Soft Accent Blue

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

            // Mouse interaction
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

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
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
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue > 0 ? opacityValue * 0.2 : 0})`;
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
        
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typeWriterElement.textContent = currentText.substring(0, charIndex);

        let typeSpeed = parseInt(Math.random() * 100) + 50;

        if (isDeleting) { typeSpeed /= 2; }

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typeSpeed = 500; // Pause before next word
        }
        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 1000); // Start delay

    /* --- 3. Custom Cursor Integration --- */
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    const interactiveElements = document.querySelectorAll('a, .minimal-link, .grid-card');
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

    /* --- 4. The WOW Pop-Up Scroll Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const popObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If this is a parent container, stagger its children sequentially
                const children = entry.target.querySelectorAll('.pop-up-stagger');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('active');
                    }, index * 150); // 150ms delay between each child popping up
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const popCards = document.querySelectorAll('.pop-up');
    popCards.forEach(card => popObserver.observe(card));
});
