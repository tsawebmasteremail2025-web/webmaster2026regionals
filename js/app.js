/* ==========================================================================
   Pathwise AI — Site shell: header, footer, theme, toasts, celebrations
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const page = document.body.dataset.page || "";

  /* ---------- Icons (inline SVG, original) ---------- */
  const ICON = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  };

  const LOGO = `<svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
    <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c6cff"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
    <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#lg)"/>
    <path d="M11 27 L17 18 L23 22 L29 12" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="11" cy="27" r="2.6" fill="#fff"/><circle cx="17" cy="18" r="2.6" fill="#fff"/><circle cx="23" cy="22" r="2.6" fill="#fff"/><circle cx="29" cy="12" r="3.2" fill="#fff"/>
  </svg>`;

  const NAV = [
    ["index.html", "Home", "home"],
    ["learn.html", "Learn", "learn"],
    ["dashboard.html", "Dashboard", "dashboard"],
    ["glossary.html", "Glossary", "glossary"],
    ["about.html", "About", "about"],
    ["references.html", "References", "references"],
  ];

  /* ---------- Theme ---------- */
  function storedTheme() { try { return localStorage.getItem("pathwise.theme"); } catch (e) { return null; } }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    const btn = $("#theme-toggle");
    if (btn) {
      btn.innerHTML = t === "dark" ? ICON.sun : ICON.moon;
      btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }
  const initialTheme = storedTheme() || (window.matchMedia && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", initialTheme);

  /* ---------- Header / footer ---------- */
  function buildHeader() {
    const header = document.createElement("header");
    header.className = "site-header";
    const links = NAV.map(([href, label, key]) => {
      const cur = key === page || (key === "learn" && page === "module");
      return `<a href="${href}"${cur ? ' aria-current="page"' : ""}>${label}</a>`;
    }).join("");
    header.innerHTML = `
      <div class="container">
        <a class="logo" href="index.html" aria-label="Pathwise AI home">${LOGO}<span>Pathwise<span class="grad-text"> AI</span></span></a>
        <nav class="nav" id="site-nav" aria-label="Main">${links}</nav>
        <div class="header-tools">
          <a class="xp-chip" href="dashboard.html" id="xp-chip" aria-label="Your progress">
            <span class="lvl" id="chip-lvl">1</span><span><span id="chip-xp">0</span> XP<span class="xp-label"> · <span id="chip-name">Beginner</span></span></span>
          </a>
          <button class="icon-btn" id="theme-toggle" type="button"></button>
          <button class="icon-btn menu-toggle" id="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">${ICON.menu}</button>
        </div>
      </div>`;
    document.body.prepend(header);

    const skip = document.createElement("a");
    skip.className = "skip-link"; skip.href = "#main"; skip.textContent = "Skip to main content";
    document.body.prepend(skip);

    $("#theme-toggle").addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      try { localStorage.setItem("pathwise.theme", next); } catch (e) {}
      applyTheme(next);
    });
    const mt = $("#menu-toggle"), nav = $("#site-nav");
    mt.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      mt.setAttribute("aria-expanded", String(open));
      mt.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); mt.setAttribute("aria-expanded", "false"); mt.focus(); } });
    applyTheme(initialTheme);
  }

  function buildFooter() {
    const f = document.createElement("footer");
    f.className = "site-footer";
    f.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="logo" href="index.html">${LOGO}<span>Pathwise AI</span></a>
            <p class="muted" style="margin-top:1rem;max-width:40ch">A free, interactive learning portal that helps high school students understand AI, use it well, and use it responsibly.</p>
          </div>
          <div><h4>Learn</h4><ul>
            <li><a href="module.html?m=foundations">AI Foundations</a></li>
            <li><a href="module.html?m=tools">Tools &amp; Techniques</a></li>
            <li><a href="module.html?m=ethics">Ethical AI Use</a></li></ul></div>
          <div><h4>Explore</h4><ul>
            <li><a href="dashboard.html">My Dashboard</a></li>
            <li><a href="glossary.html">Glossary</a></li>
            <li><a href="learn.html#educators">For Educators</a></li></ul></div>
          <div><h4>Project</h4><ul>
            <li><a href="about.html">About</a></li>
            <li><a href="references.html">References &amp; Copyright</a></li>
            <li><a href="work-log.html">Work Log</a></li></ul></div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} Pathwise AI · Created for the TSA High School Webmaster event.</span>
          <span>Progress is saved only in your browser. No account, no tracking.</span>
        </div>
      </div>`;
    document.body.appendChild(f);
  }

  /* ---------- XP chip ---------- */
  function updateChip() {
    if (!window.Progress) return;
    const L = Progress.levelInfo();
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("chip-lvl", L.level); set("chip-xp", L.xp.toLocaleString()); set("chip-name", L.name);
    const chip = $("#xp-chip");
    if (chip) chip.setAttribute("aria-label", `Level ${L.level}, ${L.name}, ${L.xp} XP. Open dashboard`);
  }

  /* ---------- Toasts ---------- */
  let stack;
  function toast(title, msg, iconHTML) {
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack"; stack.setAttribute("role", "status"); stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<div class="toast-icon">${iconHTML || "XP"}</div><div><strong></strong><span></span></div>`;
    t.querySelector("strong").textContent = title;
    t.querySelector("span").textContent = msg;
    stack.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 320); }, 3600);
  }

  /* ---------- Confetti ---------- */
  function confetti() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const c = document.createElement("canvas"); c.id = "confetti"; document.body.appendChild(c);
    const ctx = c.getContext("2d"); const dpr = window.devicePixelRatio || 1;
    c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.scale(dpr, dpr);
    const colors = ["#7c6cff", "#22d3ee", "#f472b6", "#fbbf24", "#34d399"];
    const parts = Array.from({ length: 140 }, () => ({
      x: innerWidth / 2 + (Math.random() - .5) * 200, y: innerHeight / 2.5,
      vx: (Math.random() - .5) * 14, vy: Math.random() * -14 - 4, r: Math.random() * 6 + 3,
      c: colors[(Math.random() * colors.length) | 0], a: Math.random() * Math.PI, va: (Math.random() - .5) * .3,
    }));
    let frame = 0;
    (function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (++frame < 150) requestAnimationFrame(tick); else c.remove();
    })();
  }

  /* ---------- Level up modal ---------- */
  function levelModal(info) {
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `<div class="modal" role="dialog" aria-modal="true" aria-labelledby="lvl-title">
      <p class="eyebrow" style="justify-content:center">Level up</p>
      <div class="big-level grad-text">${info.level}</div>
      <h2 id="lvl-title" style="font-size:1.6rem">${info.name}</h2>
      <p class="muted">${info.max ? "You've reached the top rank. Amazing work!" : `${info.toNext} XP until <strong>${info.nextName}</strong>.`}</p>
      <button class="btn btn-primary" type="button">Keep going</button></div>`;
    document.body.appendChild(back);
    const btn = back.querySelector("button"); const prev = document.activeElement;
    btn.focus();
    const close = () => { back.remove(); if (prev) prev.focus(); };
    btn.addEventListener("click", close);
    back.addEventListener("click", e => { if (e.target === back) close(); });
    back.addEventListener("keydown", e => { if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); if (e.key === "Escape") close(); } });
    confetti();
  }

  /* ---------- Badge artwork (generated SVG) ---------- */
  const GLYPH = {
    spark: '<path d="M32 18l3.5 9.5L45 31l-9.5 3.5L32 44l-3.5-9.5L19 31l9.5-3.5z"/>',
    neuron: '<circle cx="32" cy="32" r="5"/><circle cx="20" cy="22" r="3"/><circle cx="20" cy="42" r="3"/><circle cx="44" cy="32" r="3"/><path d="M22.5 23.5l6 6M22.5 40.5l6-6M37 32h4" stroke="#fff" stroke-width="2.5" fill="none"/>',
    cube: '<path d="M32 18l12 7v14l-12 7-12-7V25z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M20 25l12 7 12-7M32 32v14" fill="none" stroke="#fff" stroke-width="3"/>',
    wand: '<path d="M21 43l17-17" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M40 17l1.8 4.2L46 23l-4.2 1.8L40 29l-1.8-4.2L34 23l4.2-1.8z"/>',
    lens: '<circle cx="29" cy="29" r="9" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M36 36l8 8" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    tool: '<path d="M38 18a8 8 0 0 0-7.6 10.4L19 39.8l5.2 5.2 11.4-11.4A8 8 0 0 0 46 26l-4.6 4.6-4.4-1.2-1.2-4.4z"/>',
    scale: '<path d="M32 17v28M22 45h20M20 23h24" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M20 23l-5 10h10zM44 23l-5 10h10z"/>',
    shield: '<path d="M32 16l13 5v9c0 8-5.5 14.5-13 17-7.5-2.5-13-9-13-17v-9z"/><path d="M26 31l4.5 4.5L39 27" stroke-width="3" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    star: '<path d="M32 16l4.7 9.6 10.6 1.5-7.7 7.5 1.8 10.5L32 40.1l-9.4 5 1.8-10.5-7.7-7.5 10.6-1.5z"/>',
    crown: '<path d="M18 42l-2-17 9 7 7-12 7 12 9-7-2 17z"/><rect x="18" y="44" width="28" height="4" rx="2"/>',
    book: '<path d="M18 20h11a3 3 0 0 1 3 3v23a3 3 0 0 0-3-3H18zM46 20H35a3 3 0 0 0-3 3v23a3 3 0 0 1 3-3h11z"/>',
    flame: '<path d="M32 15c1 7 9 10 9 19a9 9 0 0 1-18 0c0-5 3-7 4-11 1 3 2 4 4 5 1-4 0-8 1-13z"/>',
    cap: '<path d="M32 19l18 8-18 8-18-8z"/><path d="M22 31v8c3 3 7 4 10 4s7-1 10-4v-8l-10 4.5z"/><path d="M48 28v10" stroke="#fff" stroke-width="2.5"/>',
  };
  function badgeSVG(b) {
    const id = "bg-" + b.id;
    return `<svg viewBox="0 0 64 64" aria-hidden="true">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="hsl(${b.hue} 85% 66%)"/><stop offset="1" stop-color="hsl(${(b.hue + 40) % 360} 80% 48%)"/></linearGradient></defs>
      <path d="M32 3l25 14.5v29L32 61 7 46.5v-29z" fill="url(#${id})"/>
      <path d="M32 8l20.7 12v24L32 56 11.3 44V20z" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <g fill="#fff" style="color:hsl(${b.hue} 70% 45%)">${GLYPH[b.icon] || ""}</g></svg>`;
  }

  /* ---------- Progress events → UI ---------- */
  document.addEventListener("progress:change", e => {
    updateChip();
    const events = e.detail.events || [];
    let lvl = null;
    events.forEach((ev, i) => {
      setTimeout(() => {
        if (ev.type === "xp") toast("+" + ev.amount + " XP", ev.label);
        if (ev.type === "badge") toast("Badge unlocked!", ev.badge.name + " · " + ev.badge.desc, badgeSVG(ev.badge));
      }, i * 350);
      if (ev.type === "level") lvl = ev.info;
    });
    if (lvl) setTimeout(() => levelModal(lvl), events.length * 350 + 300);
  });

  /* ---------- Reveal on scroll ---------- */
  function reveals() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Animated neural network (home hero) ---------- */
  function neuralCanvas() {
    const c = document.getElementById("neural-canvas");
    if (!c) return;
    const ctx = c.getContext("2d");
    const layers = [3, 5, 5, 2];
    let W, H, nodes = [], pulses = [];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    function size() {
      const r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      W = r.width; H = r.height; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = layers.map((n, li) => Array.from({ length: n }, (_, ni) => ({
        x: W * (0.12 + li * (0.76 / (layers.length - 1))), y: H * ((ni + 1) / (n + 1)), act: Math.random(),
      })));
    }
    function spawn() {
      const li = (Math.random() * (layers.length - 1)) | 0;
      const a = nodes[li][(Math.random() * nodes[li].length) | 0];
      const b = nodes[li + 1][(Math.random() * nodes[li + 1].length) | 0];
      pulses.push({ a, b, t: 0, s: .012 + Math.random() * .012 });
    }
    function draw() {
      const style = getComputedStyle(document.documentElement);
      const c1 = style.getPropertyValue("--brand").trim(), c2 = style.getPropertyValue("--brand-2").trim(), line = style.getPropertyValue("--surface-line").trim();
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1; ctx.strokeStyle = line;
      for (let l = 0; l < nodes.length - 1; l++) nodes[l].forEach(a => nodes[l + 1].forEach(b => { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }));
      pulses.forEach(p => {
        p.t += p.s;
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.beginPath(); ctx.fillStyle = c2; ctx.shadowColor = c2; ctx.shadowBlur = 12; ctx.arc(x, y, 3, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
        if (p.t >= 1) p.b.act = 1;
      });
      pulses = pulses.filter(p => p.t < 1);
      nodes.flat().forEach(n => {
        n.act = Math.max(.15, n.act * .985);
        ctx.beginPath(); ctx.fillStyle = c1; ctx.globalAlpha = .25 + n.act * .75; ctx.shadowColor = c1; ctx.shadowBlur = 18 * n.act;
        ctx.arc(n.x, n.y, 9, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      });
      if (Math.random() < .18) spawn();
      if (!reduce) requestAnimationFrame(draw);
    }
    size(); addEventListener("resize", size);
    for (let i = 0; i < 10; i++) spawn();
    draw();
  }

  /* ---------- Boot ---------- */
  buildHeader();
  buildFooter();
  updateChip();
  reveals();
  neuralCanvas();

  window.UI = { toast, confetti, badgeSVG, $, };
})();
