(() => {
  // ========== ENTER unlock (index) ==========
  const enter = document.querySelector(".enter");
  const links = document.querySelector(".links");

  if (enter && links) {
    enter.addEventListener("click", () => {
      links.classList.remove("is-locked");
      links.classList.add("is-unlocked");
    });
  }

  // ========== reveal (about etc.) ==========
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
