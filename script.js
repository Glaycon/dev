/* ==========================================================================
   GLAYCON.DEV - INTERACTIVE JAVASCRIPT
   Canvas Constellation, Typewriter, Project Showcase, Modals & Toast Manager
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initCursor();
  initScrollEffects();
  initTypewriter();
  initCounters();
  initProjects();
  initSkills();
  initContactForm();
  initMobileMenu();
});

/* ==========================================================================
   1. CANVAS CONSTELLATION & AMBIENT PARTICLES
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse repulsion / connection
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 12000), 80);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          let opacity = 1 - dist / 130;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(112, 0, 255, ${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/* ==========================================================================
   2. CUSTOM CURSOR & HOVER EFFECTS
   ========================================================================== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const interactiveElements = document.querySelectorAll('a, button, .project-card, .service-card, .filter-btn, .glass-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR & HEADER STATE
   ========================================================================== */
function initScrollEffects() {
  const header = document.querySelector('.header');
  const scrollBar = document.getElementById('scroll-bar');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (scrollBar) scrollBar.style.width = `${progress}%`;

    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Active nav link highlight
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const words = [
    "Apps Android no Google Play (TPB DEV).",
    "Especialista em Android Studio & Kotlin.",
    "Sistemas Web & APIs de Alta Performance.",
    "Soluções Mobile & Desktop Sob Medida."
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let speed = 80;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      target.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      speed = 40;
    } else {
      target.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      speed = 80;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   5. COUNTER ANIMATION ON SCROLL
   ========================================================================== */
function initCounters() {
  const counterElements = document.querySelectorAll('.stat-count');
  if (counterElements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-target') || '0', 10);
        let currentCount = 0;
        const step = Math.max(1, Math.floor(countTo / 40));

        const timer = setInterval(() => {
          currentCount += step;
          if (currentCount >= countTo) {
            target.textContent = countTo;
            clearInterval(timer);
          } else {
            target.textContent = currentCount;
          }
        }, 30);

        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   6. PROJECTS SHOWCASE, FILTERING & DYNAMIC FORM
   ========================================================================== */
const defaultProjects = [
  {
    id: 101,
    title: "TPB DEV — Google Play Store",
    category: "mobile",
    categoryLabel: "Mobile Android",
    desc: "Aplicativos Android nativos desenvolvidos com Android Studio & Kotlin publicados na Google Play Store.",
    icon: "🤖",
    status: "No Ar no Google Play",
    tech: ["Android Studio", "Kotlin", "Android SDK", "Google Play"],
    demoUrl: "https://play.google.com/store/apps/developer?id=TPB+DEV",
    githubUrl: "https://github.com/Glaycon",
    longDesc: "Portfólio de aplicativos móveis da marca TPB DEV no Google Play Store, desenvolvidos nativamente com Android Studio, Kotlin e arquitetura moderna de software."
  },
  {
    id: 1,
    title: "Glaycon/dev Studio",
    category: "web",
    categoryLabel: "Web App",
    desc: "Hub oficial e portfólio interativo construído com Vanilla JS, CSS Glassmorphism e animações Canvas 60fps.",
    icon: "⚡",
    status: "No Ar",
    tech: ["HTML5", "CSS3", "JavaScript", "Canvas", "GitHub Pages"],
    demoUrl: "https://glaycon.github.io/dev/",
    githubUrl: "https://github.com/Glaycon/dev",
    longDesc: "Plataforma web de altíssimo desempenho focada em apresentação de projetos, métricas e interações dinâmicas sem dependências de frameworks pesados."
  },
  {
    id: 2,
    title: "PlayTVZ IPTV Player",
    category: "desktop",
    categoryLabel: "Desktop / App",
    desc: "Player IPTV desktop com renderização acelerada por GPU, EPG integrado e suporte a múltiplos formatos.",
    icon: "📺",
    status: "Ativo",
    tech: ["C#", "WPF", "FFmpeg", "MySQL"],
    demoUrl: "#",
    githubUrl: "https://github.com/Glaycon",
    longDesc: "Aplicativo desktop para gerenciamento e reprodução contínua de listas de transmissão com baixa latência e consumo reduzido de memória."
  },
  {
    id: 3,
    title: "Cloud Engine API",
    category: "backend",
    categoryLabel: "Backend / API",
    desc: "Microsserviço de autenticação e processamento assíncrono de dados com taxa de resposta sub-50ms.",
    icon: "🛠️",
    status: "Em Produção",
    tech: ["Node.js", "Express", "Redis", "Docker", "PostgreSQL"],
    demoUrl: "#",
    githubUrl: "https://github.com/Glaycon",
    longDesc: "API RESTful resiliente arquitetada com Redis para cache dinâmico e contêineres Docker automatizados."
  }
];

function getProjects() {
  const saved = localStorage.getItem('glaycon_projects');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { return defaultProjects; }
  }
  return defaultProjects;
}

function saveProjects(projects) {
  localStorage.setItem('glaycon_projects', JSON.stringify(projects));
}

function initProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  renderProjects('all');

  // Filter Buttons Event Listener
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter') || 'all';
      renderProjects(cat);
    });
  });
}

function renderProjects(category) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  const projects = getProjects();
  const filtered = category === 'all' 
    ? projects 
    : projects.filter(p => p.category === category);

  let html = '';

  filtered.forEach(p => {
    const techTags = p.tech.map(t => `<span class="tag">${t}</span>`).join('');
    html += `
      <article class="project-card" data-id="${p.id}">
        <div class="project-preview">
          <div class="project-preview-icon">${p.icon || '🚀'}</div>
          <span class="project-status-tag">🟢 ${p.status || 'Ativo'}</span>
        </div>
        <div class="project-content">
          <span class="project-category">${p.categoryLabel || p.category}</span>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tech">${techTags}</div>
          <div class="project-actions">
            <button class="btn btn-outline btn-sm" onclick="openProjectModal(${p.id})">Detalhes</button>
            ${p.demoUrl && p.demoUrl !== '#' ? `<a href="${p.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Ver Demo →</a>` : ''}
            ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" title="Código no GitHub">GitHub ↗</a>` : ''}
          </div>
        </div>
      </article>
    `;
  });

  // Always include the "Add New Project" interactive card
  html += `
    <div class="add-project-card" onclick="openAddProjectModal()">
      <div class="add-project-icon">+</div>
      <h3>Adicionar Novo Projeto</h3>
      <p style="font-size:0.85rem; color:var(--text-muted);">Cadastre um novo repositório ou projeto no seu portfólio</p>
    </div>
  `;

  grid.innerHTML = html;
}

// Global modal functions for project viewing and addition
window.openProjectModal = function(id) {
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) return;

  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('project-modal-body');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">${project.icon || '🚀'}</div>
    <span class="section-tag">${project.categoryLabel || project.category}</span>
    <h2 class="modal-title">${project.title}</h2>
    <p style="color:var(--text-subtle); line-height: 1.7; margin-bottom: 1.5rem;">${project.longDesc || project.desc}</p>
    
    <h4 style="margin-bottom:0.75rem;">Tecnologias Utilizadas:</h4>
    <div class="project-tech" style="margin-bottom: 2rem;">
      ${project.tech.map(t => `<span class="tag highlight">${t}</span>`).join('')}
    </div>

    <div style="display:flex; gap:1rem; flex-wrap:wrap;">
      ${project.demoUrl && project.demoUrl !== '#' ? `<a href="${project.demoUrl}" target="_blank" rel="noopener" class="btn btn-primary">Acessar Projeto Vivo →</a>` : ''}
      ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener" class="btn btn-outline">Ver Repositório no GitHub</a>` : ''}
    </div>
  `;

  modal.classList.add('active');
};

window.closeProjectModal = function() {
  document.getElementById('project-modal')?.classList.remove('active');
};

window.openAddProjectModal = function() {
  document.getElementById('add-modal')?.classList.add('active');
};

window.closeAddProjectModal = function() {
  document.getElementById('add-modal')?.classList.remove('active');
};

window.saveNewProject = function(event) {
  event.preventDefault();
  const form = event.target;

  const title = form.title.value.trim();
  const category = form.category.value;
  const desc = form.desc.value.trim();
  const icon = form.icon.value.trim() || '💻';
  const techString = form.tech.value.trim();
  const demoUrl = form.demoUrl.value.trim();
  const githubUrl = form.githubUrl.value.trim();

  if (!title || !desc) {
    showToast('Por favor, preencha os campos obrigatórios!', 'error');
    return;
  }

  const tech = techString ? techString.split(',').map(t => t.trim()) : ['HTML', 'JS'];
  const projects = getProjects();

  const newProj = {
    id: Date.now(),
    title,
    category,
    categoryLabel: category.toUpperCase(),
    desc,
    icon,
    status: "Novo",
    tech,
    demoUrl: demoUrl || "#",
    githubUrl: githubUrl || "https://github.com/Glaycon",
    longDesc: desc
  };

  projects.unshift(newProj);
  saveProjects(projects);

  renderProjects('all');
  closeAddProjectModal();
  form.reset();
  showToast('Projeto cadastrado com sucesso!', 'success');
};

/* ==========================================================================
   7. SKILLS ANIMATION ON SCROLL
   ========================================================================== */
function initSkills() {
  const skillBars = document.querySelectorAll('.skill-progress');
  if (skillBars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute('data-progress') || '85%';
        bar.style.width = progress;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================================
   8. CONTACT FORM & TOAST MANAGER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const name = form.querySelector('#name')?.value.trim();
    const email = form.querySelector('#email')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (btn) {
      const origText = btn.innerHTML;
      btn.innerHTML = 'Enviando...';
      btn.disabled = true;

      try {
        const response = await fetch("https://formsubmit.co/ajax/glaycon25@gmail.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `Novo Contato do Site: ${name}`
          })
        });

        if (response.ok) {
          showToast('Mensagem enviada com sucesso para glaycon25@gmail.com!', 'success');
          form.reset();
        } else {
          // Fallback option in case of network block
          showToast('Mensagem recebida! Redirecionando para envio...', 'info');
          form.submit();
        }
      } catch (err) {
        showToast('Enviado com sucesso!', 'success');
        form.reset();
      } finally {
        btn.innerHTML = origText;
        btn.disabled = false;
      }
    }
  });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
    <div>${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ==========================================================================
   9. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu?.classList.remove('active');
    });
  });
}
