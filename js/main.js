/**
 * MANIKANDAN A - DEVELOPER PORTFOLIO JAVASCRIPT
 * Features: Typewriter, Particle Canvas, Project Filtering, Interactive Modals, Clipboard & Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initParticleCanvas();
  initNavbar();
  initProjectFilters();
  initProjectModals();
  initResumeModal();
  initCopyButtons();
  initContactForm();
  initBackToTop();
  initFooterYear();
});

/* ==========================================================================
   1. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter-text');
  if (!typewriterElement) return;

  const roles = [
    'scalable backend architectures.',
    'modern full-stack web apps.',
    'high-speed database systems.',
    'Python & JavaScript solutions.',
    'Java & OOP enterprise systems.'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause at end of sentence
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   2. Interactive Particle Canvas Background
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * 2 + 1;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, 0.45)' : 'rgba(6, 182, 212, 0.45)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse repulsion
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * 2.5;
          const directionY = (dy / distance) * force * 2.5;
          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Navbar Scroll & Mobile Navigation
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Sticky Navbar Blur Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy: Active nav link highlighting
    let currentSection = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Hamburger Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ==========================================================================
   4. Project Category Filtering
   ========================================================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Project Details Modal & Data
   ========================================================================== */
const projectData = {
  petition: {
    title: 'Petition Digitalizer — Modern Grievance & Tracking Platform',
    category: 'Full Stack Web Platform (PERN Stack)',
    date: 'July 2025',
    overview:
      'A comprehensive digital petition management platform built to modernize traditional manual paper-based grievance systems. Followed structured SDLC practices from initial requirements gathering to architecture design, iterative component development, and full validation before deployment.',
    keyFeatures: [
      'Role-based dashboards catering separately to citizens/petitioners and administrative authorities.',
      'Secure User Authentication & Authorization using JWT and role-level permission guards.',
      'Real-time petition tracking engine with dynamic status updates (Submitted, Under Review, Escalated, Resolved).',
      'Interactive analytical views providing administrators with category-wise workload insights and resolution metrics.',
      'Comprehensive test coverage across API endpoints and frontend workflows to guarantee zero downtime.'
    ],
    techStack: ['React.js', 'Express.js', 'PostgreSQL', 'Node.js', 'REST APIs', 'JWT Auth', 'SDLC'],
    impact: 'Replaced slow, manual paperwork with a transparent, highly accessible digital workflow, providing users with live status feedback.',
    github: 'https://github.com/Manikandan16A/Petition-Digitalizer'
  },
  'farmer-crate': {
    title: 'FarmerCrate — Agri-Commerce & Supply Chain Logistics',
    category: 'Full Stack AgriTech Platform',
    date: '2025',
    overview:
      'A multi-stakeholder agricultural supply chain and commerce platform connecting farmers directly with logistics transporters, wholesalers, and consumers.',
    keyFeatures: [
      'Multi-role architecture with dedicated workflows for Farmers, Transporters, and Platform Administrators.',
      'Automated transport charge computation algorithm based on load weight and delivery proximity.',
      'Order dispatch and transaction verification pipeline with hard-delete data cascade protection.',
      'Integrated Google OAuth and token authentication with Neon PostgreSQL database backend.',
      'Companion Flutter mobile frontend application for on-the-go driver routing and order tracking.'
    ],
    techStack: ['Node.js', 'Express.js', 'PostgreSQL (Neon DB)', 'Google OAuth', 'REST APIs', 'Flutter/Dart'],
    impact: 'Streamlined farm-to-doorstep supply chain coordination with transparent logistics fee estimation.',
    github: 'https://github.com/Manikandan16A/FarmerCrate'
  },
  'product-search': {
    title: 'Product Listing & Multi-Filter Search Engine',
    category: 'Backend & Database Systems (PHP & MySQL)',
    date: 'June 2025 (Hudsmer Business Solutions)',
    overview:
      'An enterprise e-commerce product discovery and query engine engineered using PHP and MySQL. Designed to handle high-frequency search requests across complex product catalogs with sub-second response times.',
    keyFeatures: [
      'Structured and normalized MySQL database schemas with optimized compound indexing for rapid search discovery.',
      'Dynamic multi-criteria filtering algorithms (price ranges, categories, specifications, and availability).',
      'Streamlined SQL query building to eliminate redundant full-table scans and minimize memory overhead.',
      'Seamless API integration between backend query modules and responsive frontend display components.'
    ],
    techStack: ['PHP', 'MySQL', 'Database Indexing', 'RESTful Endpoints', 'HTML5/CSS3', 'Bootstrap'],
    impact: 'Significantly improved search response speeds and product discoverability across extensive business catalogs.',
    github: 'https://github.com/Manikandan16A/Product-Listing-and-Searching'
  },
  billing: {
    title: 'Enterprise Billing & Invoice Management Software',
    category: 'Python Application & Database Automation',
    date: 'October 2024 (Shanmuga AI Technologies)',
    overview:
      'A dedicated Python billing and accounting application developed to replace error-prone manual invoicing and receipt processing workflows for business operations.',
    keyFeatures: [
      'Engineered core financial computational logic including automatic tax deductions, discount formulas, and line-item totals.',
      'Designed normalized relational database schemas to securely maintain customer ledgers, payment transactions, and historical invoices.',
      'Implemented automated invoice generation and client transaction logging with search and export features.',
      'Rigorous edge-case and regression testing suites guaranteeing 100% mathematical accuracy across all billing records.'
    ],
    techStack: ['Python', 'Relational Database', 'Software Testing', 'Data Modeling', 'Financial Pipelines'],
    impact: 'Automated end-to-end invoice creation, cutting billing cycle time by over 50% while preventing transactional errors.',
    github: 'https://github.com/Manikandan16A/Billing_Software'
  },
  airline: {
    title: 'Airline Reservation & Flight Management System',
    category: 'Java Enterprise & Object-Oriented System',
    date: 'October 2024',
    overview:
      'A robust, object-oriented desktop application built in Java to manage complete flight scheduling, passenger registrations, seat allocations, dynamic ticket bookings, and cancellations.',
    keyFeatures: [
      'Object-Oriented architecture adhering to SOLID principles with well-structured passenger and flight entities.',
      'Real-time seat availability verification and automated reservation record updates.',
      'Passenger manifest tracking and dynamic flight cancellation handling routines.',
      'Efficient in-memory data structures and relational persistence for seamless transaction management.'
    ],
    techStack: ['Java', 'OOP', 'Data Structures', 'Relational DB / SQL', 'Software Engineering'],
    impact: 'Engineered a scalable core booking engine that simplifies airline ticket management and passenger tracking.',
    github: 'https://github.com/Manikandan16A/Airline_Reservation_System'
  },
  skillgig: {
    title: 'SkillGig — Freelancer & Client Marketplace Portal',
    category: 'Web Application & Marketplace',
    date: 'June 2025',
    overview:
      'An interactive freelancing marketplace portal enabling talented freelancers to publish specialized service gigs and clients to browse, filter, and commission projects efficiently.',
    keyFeatures: [
      'Modern, highly responsive marketplace UI built with clean semantic HTML5, CSS3, and JavaScript.',
      'Interactive service category filtering and gig search features.',
      'Freelancer portfolio profile view and client project inquiry forms.',
      'Mobile-first responsive design ensuring seamless experience across phones, tablets, and desktops.'
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design', 'UI/UX'],
    impact: 'Delivered an intuitive, lightweight web portal for freelancing talent discovery.',
    github: 'https://github.com/Manikandan16A/SkillGig_Freelancer_Portal'
  },
  attendance: {
    title: 'Automatic Attendance Management System',
    category: 'Python Automation & Data Processing',
    date: 'June 2025',
    overview:
      'An automated Python system designed to streamline daily attendance capturing, eliminate tedious manual paperwork, prevent duplicate entries, and generate automated performance summaries.',
    keyFeatures: [
      'Automated attendance record logging with precise timestamp tracking.',
      'Data parsing and export pipelines creating structured spreadsheets (CSV/Excel).',
      'Attendance summary calculations including total present days, leaves, and percentages.',
      'Built-in validation checks to prevent duplicate submissions on the same calendar day.'
    ],
    techStack: ['Python', 'Automation', 'Data Analysis', 'CSV / Excel Pipelines', 'File I/O'],
    impact: 'Eliminated manual attendance errors and expedited batch attendance calculation workflows.',
    github: 'https://github.com/Manikandan16A/Automatic-Attendance-System'
  },
  faculty: {
    title: 'Faculty Profile Responsive Web Portal',
    category: 'Frontend Web Application',
    date: '2024',
    overview:
      'A clean, responsive web application designed to highlight academic faculty profiles, educational backgrounds, research publications, teaching schedules, and institutional achievements.',
    keyFeatures: [
      'Fully responsive UI layout crafted with semantic HTML5, CSS3 flexbox/grid, and JavaScript.',
      'Structured presentation of academic credentials, research papers, and subject specializations.',
      'Interactive navigation allowing students and peers to easily contact or view faculty office hours.'
    ],
    techStack: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design', 'UI Layout'],
    impact: 'Enhanced departmental faculty visibility and streamlined research paper access.',
    github: 'https://github.com/Manikandan16A/Faculty_Profile'
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const closeBtn = document.getElementById('modal-close');
  const triggers = document.querySelectorAll('.project-modal-trigger');

  if (!modal || !modalContent) return;

  triggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      modalContent.innerHTML = `
        <div class="modal-project-header">
          <span class="period-badge"><i class="fa-regular fa-calendar"></i> ${data.date}</span>
          <h3 class="modal-project-title" style="margin-top: 0.5rem;">${data.title}</h3>
          <span class="modal-project-category"><i class="fa-solid fa-layer-group"></i> ${data.category}</span>
        </div>

        <p class="modal-project-desc">${data.overview}</p>

        <h4 class="modal-section-h4"><i class="fa-solid fa-star text-warning"></i> Key Architecture &amp; Features</h4>
        <ul class="modal-features-list">
          ${data.keyFeatures.map((f) => `<li><i class="fa-solid fa-circle-check"></i> <span>${f}</span></li>`).join('')}
        </ul>

        <div class="timeline-impact" style="margin-bottom: 1.25rem;">
          <strong><i class="fa-solid fa-chart-line text-emerald"></i> Measurable Impact:</strong> ${data.impact}
        </div>

        <h4 class="modal-section-h4"><i class="fa-solid fa-code text-cyan"></i> Tech Stack &amp; Tools</h4>
        <div class="timeline-skills" style="margin-bottom: 1.75rem;">
          ${data.techStack.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
          <a href="#contact" onclick="document.getElementById('project-modal').classList.remove('active'); document.body.style.overflow='auto';" class="btn btn-sm btn-glass">
            <i class="fa-regular fa-comments"></i> Inquire About This Project
          </a>
        </div>
      `;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Resume / CV Preview Modal
   ========================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('btn-open-resume');
  const closeBtn = document.getElementById('resume-modal-close');

  if (!resumeModal || !openBtn) return;

  function openResume() {
    resumeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  openBtn.addEventListener('click', openResume);
  if (closeBtn) closeBtn.addEventListener('click', closeResume);

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeResume();
    }
  });
}

/* ==========================================================================
   7. Copy to Clipboard with Toast Notification
   ========================================================================== */
function showToast(message, icon = 'fa-solid fa-check') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="${icon} text-emerald"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            showToast(`Copied "${textToCopy}" to clipboard!`);
          })
          .catch(() => {
            showToast(`Copied text: ${textToCopy}`);
          });
      }
    });
  });
}

/* ==========================================================================
   8. Contact Form Handling (Mailto with Feedback)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'fa-solid fa-triangle-exclamation');
      return;
    }

    const mailtoBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
    const mailtoUrl = `mailto:manikandanmk1657@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry')}&body=${mailtoBody}`;

    window.location.href = mailtoUrl;
    showToast('Opening your default email client...', 'fa-solid fa-paper-plane');
    form.reset();
  });
}

/* ==========================================================================
   9. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   10. Dynamic Copyright Year
   ========================================================================== */
function initFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
