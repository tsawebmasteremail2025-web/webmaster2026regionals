/* Pathwise AI — Dashboard rendering */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const D = window.MODULE_DATA;

  function timeAgo(t) {
    const s = (Date.now() - t) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + "m ago";
    if (s < 86400) return Math.floor(s / 3600) + "h ago";
    return Math.floor(s / 86400) + "d ago";
  }

  function render() {
    const st = Progress.get(), L = Progress.levelInfo();
    if (st.name) $("dash-greet").textContent = "Welcome back, " + st.name;

    // level ring
    const C = 326.7;
    $("ring-fill").style.strokeDashoffset = C - (C * L.pct) / 100;
    $("d-level").textContent = L.level;
    $("d-lname").textContent = L.name;
    $("d-xp").textContent = L.xp.toLocaleString() + " XP";
    $("d-pct").textContent = L.pct + "%";
    $("d-lvlbar").style.width = L.pct + "%";
    $("d-lvlbar-wrap").setAttribute("aria-valuenow", L.pct);
    $("d-next").innerHTML = L.max ? "Max level reached. You're an AI Navigator!" : `<strong>${L.toNext} XP</strong> to Level ${L.level + 1}: ${esc(L.nextName)}`;

    // stats
    const lessonTotal = Object.values(Progress.MODULES).reduce((s, m) => s + m.lessons, 0);
    $("s-lessons").textContent = Object.keys(st.lessons).length + "/" + lessonTotal;
    $("s-badges").textContent = Object.keys(st.badges).length + "/" + Progress.BADGES.length;
    const sk = Progress.streak();
    $("s-streak").textContent = sk + " 🔥";
    const days = new Set(st.days); const row = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      row.push(`<span class="${days.has(k) ? "on" : ""}">${"SMTWTFS"[d.getDay()]}</span>`);
    }
    $("streak-days").innerHTML = row.join("");
    const qs = Object.values(st.quizzes);
    $("s-quiz").textContent = qs.length ? Math.round(qs.reduce((s, q) => s + q.best / q.total, 0) / qs.length * 100) + "%" : "–";

    // modules
    $("overall-pill").textContent = Progress.overall().pct + "% overall";
    $("mod-progress").innerHTML = Object.keys(D).map(k => {
      const p = Progress.moduleProgress(k), q = p.quiz;
      return `<div class="module-card card" data-module="${k}" style="padding:1.2rem">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:.5rem"><h3 style="font-size:1.05rem">${esc(D[k].title)}</h3><strong style="color:var(--accent)">${p.pct}%</strong></div>
        <div class="progress" style="margin:.5rem 0 .8rem"><span style="width:${p.pct}%;background:var(--accent)"></span></div>
        <p class="muted" style="font-size:.88rem;margin-bottom:.8rem">${p.lessonsDone}/${D[k].lessons.length} lessons · Quiz ${q ? `best ${q.best}/${q.total}` : "not taken"}</p>
        <a class="btn btn-ghost btn-sm" href="module.html?m=${k}">${p.complete ? "Review" : p.done ? "Continue" : "Start"} →</a></div>`;
    }).join("");

    // badges
    $("badges").innerHTML = Progress.BADGES.map(b => {
      const got = st.badges[b.id];
      return `<div class="badge ${got ? "earned" : "locked"}" role="img" aria-label="${esc(b.name)} badge, ${got ? "earned" : "locked"}: ${esc(b.desc)}">
        <div class="badge-icon">${UI.badgeSVG(b)}</div><h4>${esc(b.name)}</h4><p>${got ? "Earned " + new Date(got).toLocaleDateString() : esc(b.desc)}</p></div>`;
    }).join("");

    // log
    $("log").innerHTML = st.log.length
      ? st.log.slice(0, 25).map(e => `<li><span>${esc(e.label)}<br><time datetime="${new Date(e.t).toISOString()}">${timeAgo(e.t)}</time></span><span class="xp">+${e.xp} XP</span></li>`).join("")
      : `<li><span>No activity yet. <a href="module.html?m=foundations#lesson-1">Start your first lesson →</a></span></li>`;

    // certificate
    const grad = !!st.badges.graduate;
    const ctl = $("cert-controls");
    $("cert").style.opacity = grad ? "1" : ".55";
    $("cert-name").textContent = st.name || "Your Name";
    $("cert-meta").textContent = grad ? "Completed " + new Date(st.badges.graduate).toLocaleDateString() + " · " + L.xp + " XP · Level " + L.level + " " + L.name : "";
    if (grad) {
      ctl.innerHTML = `<div class="field" style="max-width:320px;margin:0 auto 1rem;text-align:left"><label for="cert-input">Name on certificate</label><input id="cert-input" maxlength="60" value="${esc(st.name)}" autocomplete="name"></div>
        <button type="button" class="btn btn-primary" id="print">🖨 Print / save as PDF</button>`;
      $("cert-input").addEventListener("input", e => { Progress.setName(e.target.value); $("cert-name").textContent = e.target.value || "Your Name"; });
      $("print").addEventListener("click", () => window.print());
    } else {
      const left = Object.keys(D).filter(k => !Progress.moduleProgress(k).complete).map(k => D[k].title);
      ctl.innerHTML = `<p class="pill">🔒 Locked: complete ${left.map(esc).join(", ")} to unlock</p>`;
    }
  }

  // data tools
  $("export").addEventListener("click", () => {
    const code = Progress.exportCode();
    const fb = $("data-fb");
    const ok = () => { fb.className = "feedback good"; fb.textContent = "Progress code copied to clipboard."; };
    try { navigator.clipboard.writeText(code).then(ok, () => { $("import-box").hidden = false; $("import-code").value = code; fb.textContent = "Copy the code from the box above."; }); }
    catch (e) { $("import-box").hidden = false; $("import-code").value = code; }
  });
  $("import").addEventListener("click", () => { $("import-box").hidden = !$("import-box").hidden; if (!$("import-box").hidden) $("import-code").focus(); });
  $("import-go").addEventListener("click", () => {
    const fb = $("data-fb");
    if (Progress.importCode($("import-code").value)) { fb.className = "feedback good"; fb.textContent = "Progress loaded!"; $("import-box").hidden = true; render(); }
    else { fb.className = "feedback bad"; fb.textContent = "That code didn't work. Check that you copied all of it."; }
  });
  $("reset").addEventListener("click", () => {
    if (confirm("Reset ALL progress? This permanently deletes your XP, badges, and quiz scores from this browser.")) { Progress.reset(); render(); }
  });

  document.addEventListener("progress:change", render);
  render();
})();
