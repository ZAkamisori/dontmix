(() => {
  /* =========================
     STAR FX (canvas particles)
     ========================= */
  const canvas = document.getElementById("starFx");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const DPR = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W = 0, H = 0, dpr = 1;
  let particles = [];
  let rafId = 0;

  const resize = () => {
    if (!canvas) return;
    dpr = DPR();
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const rand = (a, b) => a + Math.random() * (b - a);

  const makeStar = (x, y) => {
    // 星っぽい「十字スパーク」＋小粒の混在（重くしない）
    const angle = rand(0, Math.PI * 2);
    const speed = rand(3.2, 8.6);
    const life = rand(360, 680); // ms
    const size = rand(1.2, 3.6);
    const spin = rand(-0.18, 0.18);

    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - rand(0.8, 2.4),
      g: rand(0.10, 0.18),
      life,
      born: performance.now(),
      size,
      rot: rand(0, Math.PI * 2),
      spin,
      // 少しだけ色味（あなたの配色に合わせた軽い発色）
      hue: rand(310, 360), // pink〜magenta
      sat: rand(85, 100),
      light: rand(70, 92)
    };
  };

  const burstStars = (cx, cy, count = 42) => {
    if (!canvas || !ctx) return;
    resize();
    particles = [];
    for (let i = 0; i < count; i++) particles.push(makeStar(cx, cy));

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  };

  const drawSpark = (p, alpha) => {
    // 十字＋小さな菱形を重ねて“星”っぽく見せる（軽量）
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    ctx.globalAlpha = alpha;
    ctx.strokeStyle = `hsl(${p.hue} ${p.sat}% ${p.light}%)`;
    ctx.lineWidth = 2;

    const s = p.size * 4;
    ctx.beginPath();
    ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
    ctx.moveTo(0, -s); ctx.lineTo(0, s);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.55;
    ctx.fillStyle = `hsl(${p.hue} ${p.sat}% ${Math.min(98, p.light + 6)}%)`;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 2.6);
    ctx.lineTo(p.size * 2.2, 0);
    ctx.lineTo(0, p.size * 2.6);
    ctx.lineTo(-p.size * 2.2, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  };

  const tick = (t) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);

    const now = t || performance.now();
    particles = particles.filter(p => (now - p.born) < p.life);

    for (const p of particles) {
      const age = now - p.born;
      const k = age / p.life;
      const alpha = Math.max(0, 1 - k);

      // update
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.rot += p.spin;

      drawSpark(p, alpha);
    }

    if (particles.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  };

  window.addEventListener("resize", resize, { passive: true });
  resize();

  /* =========================
     ENTER FX (index only)
     ========================= */
  const btn = document.querySelector(".gate__btn, .enter");
  const links = document.querySelector(".links");

  const trigger = (ev) => {
    // クリック位置 or 画面中央でバースト
    const x = (ev && typeof ev.clientX === "number") ? ev.clientX : window.innerWidth * 0.5;
    const y = (ev && typeof ev.clientY === "number") ? ev.clientY : window.innerHeight * 0.46;

    document.body.classList.add("is-fx");

    // 星を散らす（数はここで調整）
    burstStars(x, y, 52);

    // 少し遅らせてリンク解放
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

  /* =========================
     reveal (about etc.)
     ========================= */
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
