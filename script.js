(() => {
  // ENTERボタン（タイポ版 .gate__btn でも、画像版 .enter でも拾う）
  const btn = document.querySelector(".gate__btn, .enter");
  const links = document.querySelector(".links");

  const trigger = () => {
    document.body.classList.add("is-fx");

    window.setTimeout(() => {
      if (links) {
        links.classList.remove("is-locked");
        links.classList.add("is-unlocked");
      }
    }, 180);

    window.setTimeout(() => {
      document.body.classList.remove("is-fx");
    }, 650);
  };

  if (btn && links) btn.addEventListener("click", trigger);

  // about等の reveal
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
