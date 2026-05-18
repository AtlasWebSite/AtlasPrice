(function () {
  "use strict";

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const navLinks = document.querySelectorAll(".nav-menu [data-nav-link]");
  const smoothLinks = document.querySelectorAll("[data-nav-link]");
  const contactForm = document.querySelector("[data-contact-form]");
  const counters = document.querySelectorAll("[data-count]");
  const sections = document.querySelectorAll("main section[id]");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const cursor = document.querySelector("[data-cursor]");
  const cursorFollower = document.querySelector("[data-cursor-follower]");
  const spinningItems = document.querySelectorAll("[data-spin-speed]");
  const body = document.body;

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  const closeMenu = () => {
    if (!menuToggle || !menu) return;
    menuToggle.classList.remove("is-active");
    menu.classList.remove("is-open");
    body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (!menuToggle || !menu) return;
    menuToggle.classList.add("is-active");
    menu.classList.add("is-open");
    body.classList.add("nav-open");
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const toggleMenu = () => {
    if (!menuToggle || !menu) return;

    const isOpen = menu.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  };

  const scrollToTarget = (event, link) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setActiveLink = (id) => {
    if (!id) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const animateCounter = (counter) => {
    if (counter.dataset.done === "true") return;

    const target = Number(counter.dataset.count);
    if (!Number.isFinite(target)) return;

    counter.dataset.done = "true";
    const duration = 1300;
    const start = performance.now();

    const update = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);

      if (progress >= 1) return;
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const setupReveal = () => {
    if (!revealItems.length) return;

    const showAll = () => {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      counters.forEach(animateCounter);
    };

    if (!("IntersectionObserver" in window)) {
      showAll();
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  };

  const setupActiveSection = () => {
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveLink(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -46% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  };

  const setupContactForm = () => {
    if (!contactForm) return;

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const company = String(data.get("company") || "").trim();
      const plan = String(data.get("plan") || "").trim();
      const message = String(data.get("message") || "").trim();
      const text = [
        "Olá, quero criar um site com a AtlasWeb.",
        name ? `Nome: ${name}` : "",
        company ? `Empresa: ${company}` : "",
        plan ? `Interesse: ${plan}` : "",
        message ? `Mensagem: ${message}` : ""
      ].filter(Boolean).join("\n");

      const url = `https://wa.me/553199256152?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener");
      contactForm.reset();
    });
  };

  const setupCustomCursor = () => {
    if (!cursor || !cursorFollower || !window.matchMedia("(pointer: fine)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let followerX = targetX;
    let followerY = targetY;

    const setHoverState = (isHovered) => {
      cursor.classList.toggle("is-hovered", isHovered);
      cursorFollower.classList.toggle("is-hovered", isHovered);
      if (!body.classList.contains("is-pointer-active")) return;
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = isHovered ? "0.36" : "0.68";
    };

    const animateFollower = () => {
      followerX += (targetX - followerX) * 0.12;
      followerY += (targetY - followerY) * 0.12;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(animateFollower);
    };

    document.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.left = `${targetX}px`;
      cursor.style.top = `${targetY}px`;
      body.classList.add("is-pointer-active");
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = cursorFollower.classList.contains("is-hovered") ? "0.36" : "0.68";
    });

    document.addEventListener("mouseleave", () => {
      body.classList.remove("is-pointer-active");
      cursor.style.opacity = "0";
      cursorFollower.style.opacity = "0";
      setHoverState(false);
    });

    document.querySelectorAll("a, button, .portfolio-card, .service-card, .plan-card, input, select, textarea").forEach((item) => {
      item.addEventListener("mouseenter", () => setHoverState(true));
      item.addEventListener("mouseleave", () => setHoverState(false));
    });

    animateFollower();
  };

  const setupAdSpinner = () => {
    if (!spinningItems.length) return;

    const start = performance.now();

    const spin = (time) => {
      const elapsed = (time - start) / 1000;

      spinningItems.forEach((item) => {
        const speed = Number(item.dataset.spinSpeed);
        if (!Number.isFinite(speed)) return;
        item.style.transform = `rotate(${elapsed * speed}deg)`;
      });

      requestAnimationFrame(spin);
    };

    requestAnimationFrame(spin);
  };

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  smoothLinks.forEach((link) => {
    link.addEventListener("click", (event) => scrollToTarget(event, link));
  });

  window.addEventListener("scroll", setHeaderState, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenu();
  });

  setHeaderState();
  setupReveal();
  setupActiveSection();
  setupContactForm();
  setupCustomCursor();
  setupAdSpinner();
})();
