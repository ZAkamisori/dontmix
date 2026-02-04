(() => {
  /* =========================
     STAR FX (mobile-first)
     ========================= */
  const canvas = document.getElementById("starFx");
  const ctx = canvas ? canvas.getContext("2d") : null;

  const DPR = () => Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W = 0, H = 0, dpr = 1;
  let particles = [];
  let rafId = 0;

  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  const resize = () => {
    if (!canvas || !ctx) return;
    dpr = DPR();
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const rand = (a, b) => a + Math.random() * (b - a);

  const makeStar = (x, y) => {
    const angle = rand(0, Math.PI * 2);

    // モバイルは「大きめ・遅め・長め」で“見える”を優先
    const mobile = isMobile();
    const speed = mobile ? rand(2.2, 5.4) : rand(3.2, 8.6);
    const life  = mobile ? rand(900, 1500) : rand(420, 760);
    const size  = mobile ? rand(2.2, 5.2) : rand(1.2, 3.6);
    const spin  = rand(-0.16, 0.16);

    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (mobile ? rand(0.2, 1.4) : rand(0.8, 2.4)),
      g: mobile ? rand(0.06, 0.10) : rand(0.10, 0.18),
      life,
      born: performance.now(),
      size,
      rot: rand(0, Math.PI * 2),
      spin,
      // ピンク〜水色〜黄色を混ぜて「派手」だが統一感
      hue: [330, 195, 55][Math.floor(rand(0, 3))] + rand(-10, 10),
      sat: rand(88, 100),
      light: rand(70, 92),
      // 尾を引く用
      px: x,
      py: y
    };
  };

  const drawStar = (p, alpha) => {
    // 1) 尾（残像）…スマホで“出てる感”が増える
    ctx.globalAlpha = alpha * 0.35;
    ctx.strokeStyle = `hsl(${p.hue} ${p.sat}% ${p.light}%)`;
    ctx.lineWidth = Math.max(1.2, p.size * 0.6);
    ctx.beginPath();
    ctx.moveTo(p.px, p.py);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();

    // 2) 星本体（十字＋菱形）
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    const s = p.size * 4.8;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = Math.max(1.6, p.size * 0.7);
    ctx.beginPath();
    ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
    ctx.moveTo(0, -s); ctx.lineTo(0, s);
    ctx.stroke();

    ctx.globalAlpha = alpha * 0.70;
    ctx.fillStyle = `hsl(${p.hue} ${p.sat}% ${Math.min(98, p.light + 8)}%)`;
    ctx.beginPath();
    ctx.moveTo(0, -p.size * 3.0);
    ctx.lineTo(p.size * 2.6, 0);
    ctx.lineTo(0, p.size * 3.0);
    ctx.lineTo(-p.size * 2.6, 0);
    ctx.closePath();
    ctx.fill();

    // 3) 中心の発光（見える派手さ）
    ctx.globalAlpha = alpha * 0.55;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
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

      // update (保存して尾を描く)
      p.px = p.x; p.py = p.y;

      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.988;
      p.vy *= 0.988;
      p.rot += p.spin;

      drawStar(p, alpha);
    }

    if (particles.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  };

  const burst = (count) => {
    if (!canvas || !ctx) return;
    resize();

    // スマホは“中央固定”で必ず見えるようにする
    const cx = W * 0.5;
    const cy = H * 0.42;

    // 連続バースト（2段）で派手に見せる
    particles = [];
    for (let i = 0; i < count; i++) particles.push(makeStar(cx, cy));
    for (let i = 0; i < Math.floor(count * 0.35); i++) particles.push(makeStar(cx + rand(-16, 16), cy + rand(-16, 16)));

    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  };

  window.addEventListener("resize", resize, { passive: true });
  resize();

  /* =========================
     ENTER FX (index only)
     ========================= */
  const btn = document.querySelector(".gate__btn, .enter");
  const links = document.querySelector(".links");

  const trigger = () => {
    document.body.classList.add("is-fx");

    // スマホ前提：数は「見える密度」へ（多すぎると潰れる）
    burst(isMobile() ? 60 : 52);

    // リンク解放
    window.setTimeout(() => {
      if (links) {
        links.classList.remove("is-locked");
        links.classList.add("is-unlocked");
      }
    }, 180);

    window.setTimeout(() => {
      document.body.classList.remove("is-fx");
    }, 900); // モバイルは余韻を残す
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
