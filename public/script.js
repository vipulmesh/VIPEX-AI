const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function appendMessage(role, text) {
    if (!chatBox) return;
    const message = document.createElement("div");
    message.className = `message ${role}`;
    message.textContent = text;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function createLoadingMessage() {
    const loadingMessage = document.createElement("div");
    loadingMessage.className = "message ai loading";
    loadingMessage.innerHTML = `
        <span class="spinner"></span>
        <span class="typing-dots" aria-label="AI is typing">
            <span></span><span></span><span></span>
        </span>
    `;
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
    return loadingMessage;
}

async function sendMessage() {
    if (!chatBox || !input || !sendButton) return;
    const message = input.value.trim();
    if (!message) return;

    appendMessage("user", message);
    input.value = "";
    sendButton.disabled = true;
    const loadingMessage = createLoadingMessage();

    try {
        // Keep backend API integration unchanged.
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });
        if (!response.ok) throw new Error("Server request failed");

        const data = await response.json();
        loadingMessage.remove();
        appendMessage("ai", data.reply || "I could not generate a reply right now.");
    } catch (error) {
        loadingMessage.remove();
        appendMessage("ai", "Something went wrong. Please try again.");
        console.error("Chat error:", error);
    } finally {
        sendButton.disabled = false;
        input.focus();
    }
}

function setupChat() {
    if (!input || !sendButton || !chatBox) return;
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
    appendMessage("ai", "Welcome to VIPEX AI. How can I assist you today?");
}

function setupNavbar() {
    if (!menuToggle || !navLinks) return;
    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

function setupRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach((item) => observer.observe(item));
}

function setupCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = Number(counter.getAttribute("data-counter"));
        let current = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = target >= 1000 ? `${Math.round(current / 1000)}K+` : `${current}+`;
        }, 25);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach((counter) => observer.observe(counter));
}

function setupRippleButtons() {
    document.querySelectorAll(".ripple-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            const ripple = document.createElement("span");
            ripple.className = "ripple";
            const rect = button.getBoundingClientRect();
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
            button.appendChild(ripple);
            setTimeout(() => ripple.remove(), 650);
        });
    });
}

function setupContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const button = form.querySelector("button");
        if (button) {
            button.textContent = "Message Sent";
            button.disabled = true;
            setTimeout(() => {
                form.reset();
                button.textContent = "Submit Message";
                button.disabled = false;
            }, 2000);
        }
    });
}

function initParticles() {
    const canvas = document.getElementById("particles-canvas");
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let particles = [];
    const particleCount = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.7 + 0.7,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            alpha: Math.random() * 0.55 + 0.2
        }));
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            context.fillStyle = `rgba(114, 158, 255, ${particle.alpha})`;
            context.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();
    window.addEventListener("resize", () => {
        resize();
        createParticles();
    });
}

setupNavbar();
setupChat();
setupRevealAnimations();
setupCounters();
setupRippleButtons();
setupContactForm();
initParticles();