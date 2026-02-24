const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

const isMobile = window.innerWidth < 768;

let particlesArray = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * (isMobile ? 1.5 : 2) + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(56,189,248,0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particlesArray = [];
    const count = isMobile ? 35 : 80; // optimisation mobile
    for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });

    animationId = requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

/* ===== Scroll animations optimisées ===== */

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: "0px 0px -80px 0px"
});

document.querySelectorAll('.fade').forEach(el => observer.observe(el));

/* Pause animation si onglet inactif (Lighthouse boost) */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else animate();
});
