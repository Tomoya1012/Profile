/**
 * Allen Paul Cabic — Portfolio Interactions
 * Handles mobile menu, active nav highlighting, subtle architectural canvas
 * background motion, scroll reveal, 3D pointer perspective, and email copy.
 */

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // 1. Dynamic Footer Year
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Mobile Navigation Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  // 3. Active Section Highlighting on Scroll
  const sections = document.querySelectorAll("main section[id]");
  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 140;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  };
  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // 4. Subtle Scroll Reveal
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  // 5. Subtle 3D Mouse Perspective (Desktop & Motion-Safe Only)
  if (!prefersReducedMotion && !isTouchDevice) {
    const heroStage = document.getElementById("hero-3d-stage");
    if (heroStage) {
      heroStage.addEventListener("mousemove", (e) => {
        const rect = heroStage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = (x * 8).toFixed(2);
        const rotateX = (-y * 8).toFixed(2);
        heroStage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      heroStage.addEventListener("mouseleave", () => {
        heroStage.style.transform = "rotateX(0deg) rotateY(0deg)";
      });
    }

    const tiltCards = document.querySelectorAll("[data-tilt]");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = (x * 4).toFixed(2);
        const rotateX = (-y * 4).toFixed(2);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  // 6. Restraint-First Architectural Background Canvas
  // Draws slow-moving orthogonal signal pulses along a faint drafting lattice
  const canvas = document.getElementById("bg-schematic-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let pulses = [];
    const GRID_STEP = 112;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const createPulse = () => {
      const horizontal = Math.random() > 0.5;
      const cols = Math.max(1, Math.floor(width / GRID_STEP));
      const rows = Math.max(1, Math.floor(height / GRID_STEP));
      return {
        horizontal,
        x: horizontal ? -120 : Math.floor(Math.random() * cols) * GRID_STEP,
        y: horizontal ? Math.floor(Math.random() * rows) * GRID_STEP : -120,
        length: 70 + Math.random() * 80,
        speed: 0.35 + Math.random() * 0.45,
        alpha: 0.08 + Math.random() * 0.08,
        cyan: Math.random() > 0.45
      };
    };

    resizeCanvas();
    const pulseCount = width < 768 ? 5 : 9;
    pulses = Array.from({ length: pulseCount }, () => {
      const p = createPulse();
      if (p.horizontal) p.x = Math.random() * width;
      else p.y = Math.random() * height;
      return p;
    });

    window.addEventListener("resize", resizeCanvas, { passive: true });

    const renderBackground = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        const color = p.cyan ? `84, 214, 232` : `67, 141, 255`;

        if (p.horizontal) {
          const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.length, p.y);
          grad.addColorStop(0, `rgba(${color}, 0)`);
          grad.addColorStop(0.5, `rgba(${color}, ${p.alpha})`);
          grad.addColorStop(1, `rgba(${color}, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.length, p.y);
          ctx.stroke();

          ctx.fillStyle = `rgba(${color}, ${p.alpha * 1.8})`;
          ctx.fillRect(p.x + p.length * 0.5 - 1.5, p.y - 1.5, 3, 3);

          p.x += p.speed;
          if (p.x > width + 140) pulses[i] = createPulse();
        } else {
          const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.length);
          grad.addColorStop(0, `rgba(${color}, 0)`);
          grad.addColorStop(0.5, `rgba(${color}, ${p.alpha})`);
          grad.addColorStop(1, `rgba(${color}, 0)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + p.length);
          ctx.stroke();

          ctx.fillStyle = `rgba(${color}, ${p.alpha * 1.8})`;
          ctx.fillRect(p.x - 1.5, p.y + p.length * 0.5 - 1.5, 3, 3);

          p.y += p.speed;
          if (p.y > height + 140) pulses[i] = createPulse();
        }
      }

      requestAnimationFrame(renderBackground);
    };

    requestAnimationFrame(renderBackground);
  }

  // 7. Copy Email Interaction
  const copyBtn = document.getElementById("copy-email-btn");
  const copyLabel = document.getElementById("copy-btn-label");
  const copyStatus = document.getElementById("copy-status");

  if (copyBtn && copyLabel) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.getAttribute("data-email") || "allenpaul.cabic@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
        copyLabel.textContent = "Email Copied";
        if (copyStatus) {
          copyStatus.textContent = "Email address copied to clipboard.";
        }
        setTimeout(() => {
          copyLabel.textContent = "Copy Email";
          if (copyStatus) copyStatus.textContent = "";
        }, 2500);
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  }
});
