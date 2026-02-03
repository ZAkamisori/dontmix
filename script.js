(() => {
  // ====== unlock (index) ======
  const btn = document.querySelector(".gate__btn");
  const links = document.querySelector(".links");

  if (btn && links) {
    btn.addEventListener("click", () => {
      links.classList.remove("is-locked");
      links.classList.add("is-unlocked");
      document.body.classList.add("is-entered");
    });
  }

  // ====== reveal (sub pages) ======
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();
