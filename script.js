// --- Configuración del Canvas (Hojas cayendo) ---
const canvas = document.getElementById('hero-canvas');
let ctx = null;
let leaves = [];
let mouseParallaxX = 0;
let mouseParallaxY = 0;
const colorPalette = ['#face3dff', '#b90909ff', '#000000ff', '#6e0b0bff'];

if (canvas) {
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
        const container = document.getElementById('canvas-container') || document.body;
        canvas.width = container.offsetWidth || window.innerWidth;
        canvas.height = container.offsetHeight || window.innerHeight;
    }

    class Leaf {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = (Math.random() * canvas.height * 2) - canvas.height;
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 1.2 + 0.3;
            this.speedX = Math.random() * 1 - 0.5;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.03;
            this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            this.swayOffset = Math.random() * Math.PI * 2;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.015 + this.swayOffset) * 0.8;
            this.rotation += this.rotationSpeed;
            if (this.y > canvas.height + this.size) {
                this.y = -this.size * 2;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            if (!ctx) return;
            ctx.save();
            const drawX = this.x + (mouseParallaxX * (this.size * 0.1) * 8);
            const drawY = this.y + (mouseParallaxY * (this.size * 0.1) * 8);
            ctx.translate(drawX, drawY);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.quadraticCurveTo(this.size * 0.8, 0, 0, this.size);
            ctx.quadraticCurveTo(-this.size * 0.8, 0, 0, -this.size);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.8);
            ctx.lineTo(0, this.size * 0.8);
            ctx.stroke();
            ctx.restore();
        }
    }

    function initLeaves() {
        leaves = [];
        const windowArea = window.innerWidth * window.innerHeight;
        const leafCount = Math.floor(windowArea / 15000);
        for (let i = 0; i < leafCount; i++) {
            leaves.push(new Leaf());
        }
    }

    function animate() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        leaves.forEach(leaf => {
            leaf.update();
            leaf.draw();
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initLeaves();
    });

    resizeCanvas();
    initLeaves();
    animate();
}

// --- Parallax del Ratón para Información Personal ---
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    mouseParallaxX = xAxis;
    mouseParallaxY = yAxis;

    const photo = document.querySelector('.photo-placeholder');
    const nameBox = document.querySelector('.name-box');
    const roleBox = document.querySelector('.role-box');

    if (photo) photo.style.transform = `translate(${xAxis * 0.5}px, ${yAxis * 0.5}px)`;
    if (nameBox) nameBox.style.transform = `translate(${xAxis * 1.5}px, ${yAxis * 1.5}px)`;
    if (roleBox) roleBox.style.transform = `translate(${xAxis * -1}px, ${yAxis * -1}px)`;
});

// --- Scroll Effects para Títulos ---
window.addEventListener('scroll', () => {
    const titles = document.querySelectorAll('.section-title');
    const windowHeight = window.innerHeight;

    titles.forEach(title => {
        const rect = title.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
            const absoluteDistanceFromCenter = Math.abs((rect.top + rect.height / 2) - (windowHeight / 2));
            const maxDistance = windowHeight / 2;
            let centerRatio = Math.max(0, 1 - (absoluteDistanceFromCenter / maxDistance));
            const opacity = 0.2 + (0.8 * centerRatio);
            const scale = 0.9 + (0.1 * centerRatio);
            title.style.transform = `scale(${scale})`;
            title.style.opacity = opacity.toFixed(2);
            title.style.transition = 'transform 0.1s ease-out, opacity 0.1s ease-out';
        }
    });
});

// --- Iluminación Interactiva Fotos ---
const photoContainer = document.querySelector('.photo-placeholder');
if (photoContainer) {
    photoContainer.addEventListener('mousemove', (e) => {
        const rect = photoContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const span = photoContainer.querySelector('span');
        if (span) {
            span.style.setProperty('--x', `${x}px`);
            span.style.setProperty('--y', `${y}px`);
        }
    });
}

// --- Shadow Pulse Botones Navegación ---
document.querySelectorAll('.portada-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.remove('shadow-pulse');
        void this.offsetWidth;
        this.classList.add('shadow-pulse');
        setTimeout(() => this.classList.remove('shadow-pulse'), 600);
    });
});

// --- Lógica de Carruseles Multi-instancia ---
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const indicatorsContainer = carousel.querySelector('.carousel-indicators');
        let currentIndex = 0;

        // Limpiar indicadores existentes (si los hay por error)
        if (indicatorsContainer) {
            indicatorsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                indicatorsContainer.appendChild(indicator);
            });
        }

        const indicators = indicatorsContainer ? Array.from(indicatorsContainer.children) : [];

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            slides.forEach((slide, index) => {
                slide.classList.toggle('active', index === currentIndex);
            });
            indicators.forEach((ind, index) => {
                ind.classList.toggle('active', index === currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        // Gestos táctiles
        let touchStartX = 0;
        carousel.addEventListener('touchstart', e => { 
            touchStartX = e.changedTouches[0].screenX; 
        }, {passive: true});
        
        carousel.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                currentIndex = (currentIndex + 1) % slides.length;
                updateCarousel();
            } else if (touchEndX - touchStartX > 50) {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateCarousel();
            }
        }, {passive: true});

        // Inicializar este carrusel
        updateCarousel();
    });
});
