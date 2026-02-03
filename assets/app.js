// Loader: 700msで消す（rapstazの“始まり”の空気だけ）
const loader = document.getElementById("loader");
window.addEventListener("load", () => {
  setTimeout(() => {
    loader.hidden = true;
  }, 700);
});

// Scroll reveal
const els = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) e.target.classList.add("is-in");
  }
}, { threshold: 0.15 });

els.forEach(el => io.observe(el));
