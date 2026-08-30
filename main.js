// Modern interactions: sticky header, scroll reveal, mobile nav
(function () {
  "use strict";

  // Header shrink on scroll
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close menu when a link is clicked
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  // Stagger children via inline --i
  document.querySelectorAll(".stagger").forEach(group => {
    Array.from(group.children).forEach((child, i) => {
      child.style.setProperty("--i", i);
    });
  });

  // Welcome host — show after a short delay, remember dismissal
  const host = document.querySelector(".welcome-host");
  if (host) {
    const hideWelcome = () => {
      host.classList.remove("show");
      setTimeout(() => host.classList.add("hidden"), 700);
      try { sessionStorage.setItem("welcomeShown", "1"); } catch (e) {}
    };

    const closeBtn = host.querySelector(".welcome-close");
    if (closeBtn) closeBtn.addEventListener("click", hideWelcome);

    let alreadyShown = false;
    try { alreadyShown = sessionStorage.getItem("welcomeShown") === "1"; } catch (e) {}

    if (!alreadyShown) {
      setTimeout(() => host.classList.add("show"), 1400);
    } else {
      host.classList.add("hidden");
    }
  }

  // Contact form — build and send an order via WhatsApp
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const val = (field) => (field && field.value || "").trim();

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const el = contactForm.elements;
      const name = val(el.name);
      const email = val(el.email);
      const time = val(el.pickup_time);
      const message = val(el.message);

      if (!name || !message) {
        showFormMessage(contactForm, "Please add your name and your order.", true);
        return;
      }

      let text = `Hello Backyard Butchery! I'm ${name}.`;
      if (email) text += `\nEmail: ${email}`;
      if (time) text += `\nPickup time: ${time}`;
      text += `\n\nMy order:\n${message || "Please share what's available."}`;

      const url = "https://wa.me/254722850962?text=" + encodeURIComponent(text);
      // Show a confirmation and open WhatsApp in a new tab
      showFormMessage(
        contactForm,
        "Thank you! We're opening WhatsApp so you can send your order. If it doesn't open, call 0722 850962."
      );
      window.open(url, "_blank", "noopener");
    });
  }
})();

function showFormMessage(form, text, isError) {
  const wrap = document.createElement("div");
  wrap.className = "form-message" + (isError ? " error" : "");
  wrap.textContent = text;
  form.replaceChildren(wrap);
}
