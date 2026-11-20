/**
 * Allen Paul Cabic — Portfolio Interactions
 * Handles mobile menu, active nav highlighting, subtle 3D pointer perspective,
 * clipboard email copy, and dynamic footer year.
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

  // 4. Subtle 3D Mouse Perspective (Desktop & Motion-Safe Only)
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

  // 5. Copy Email Interaction
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
        // Fallback if clipboard API is restricted
        window.location.href = `mailto:${email}`;
      }
    });
  }
});
