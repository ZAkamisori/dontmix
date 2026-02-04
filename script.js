(() => {
  const btn = document.querySelector(".enter");
  const links = document.querySelector(".links");

  const trigger = () => {
    // FX開始
    document.body.classList.add("is-fx");

    // リンク解放は少し遅らせる（儀式感）
    window.setTimeout(() => {
      if (links) {
        links.classList.remove("is-locked");
        links.classList.add("is-unlocked");
      }
    }, 180);

    // FXクラスは自動で外す（次に影響させない）
    window.setTimeout(() => {
      document.body.classList.remove("is-fx");
    }, 650);
  };

  if (btn) btn.addEventListener("click", trigger);

  // reveal（about等）
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
