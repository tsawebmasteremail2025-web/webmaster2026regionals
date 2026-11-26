/* ==========================================================================
   Pathwise AI — Module player (lessons, activities, quiz)
   URL: module.html?m=foundations#lesson-1  |  #quiz
   ========================================================================== */
(function () {
  "use strict";
  const params = new URLSearchParams(location.search);
  const modKey = params.get("m");
  const mod = window.MODULE_DATA[modKey];
  const root = document.getElementById("module-root");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  if (!mod) {
    root.innerHTML = `<section class="container section center"><h1>Module not found</h1><p class="lead">That learning module doesn't exist.</p><a class="btn btn-primary" href="learn.html">Browse modules</a></section>`;
    return;
  }

  document.title = mod.title + " | Pathwise AI";
  document.body.style.setProperty("--accent", `var(--mod-${modKey})`);
  const keys = Object.keys(window.MODULE_DATA);
  const nextMod = keys[keys.indexOf(modKey) + 1];
  const N = mod.lessons.length;

  root.innerHTML = `
    <header class="page-head"><div class="container">
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a> / <a href="learn.html">Learn</a> / <span aria-current="page">${esc(mod.title)}</span></nav>
      <p class="eyebrow" style="color:var(--accent)">Module ${mod.num}</p>
      <h1>${esc(mod.title)}</h1>
      <p class="lead">${esc(mod.tagline)}</p>
    </div></header>
    <div class="container module-layout">
      <aside class="module-sidebar" aria-label="Module contents">
        <div class="card">
          <div class="progress-label"><span>Module progress</span><span id="mp-pct">0%</span></div>
          <div class="progress"><span id="mp-bar" style="background:var(--accent)"></span></div>
          <ol class="lesson-nav" id="lesson-nav"></ol>
        </div>
        <div class="card" style="margin-top:1rem">
          <h3 style="font-size:1rem">You'll be able to…</h3>
          <ul style="padding-left:1.1rem;margin:0;font-size:.9rem;color:var(--text-muted)">${mod.outcomes.map(o => `<li>${esc(o)}</li>`).join("")}</ul>
        </div>
      </aside>
      <section id="stage" aria-live="polite" tabindex="-1"></section>
    </div>`;

  const nav = document.getElementById("lesson-nav");
  const stage = document.getElementById("stage");

  function current() {
    const h = location.hash;
    if (h === "#quiz") return N;
    const m = /^#lesson-(\d+)$/.exec(h);
    if (m) return Math.min(Math.max(+m[1] - 1, 0), N - 1);
    // default: first unfinished lesson
    for (let i = 0; i < N; i++) if (!Progress.isLessonDone(modKey, i)) return i;
    return N;
  }

  function renderNav(idx) {
    const q = Progress.get().quizzes[modKey];
    const qDone = q && q.best / q.total >= Progress.PASS_RATIO;
    nav.innerHTML = mod.lessons.map((l, i) => `<li class="${Progress.isLessonDone(modKey, i) ? "done" : ""}">
        <button type="button" data-step="${i}" ${i === idx ? 'aria-current="step"' : ""}><span class="ln-dot"><span>${i + 1}</span></span><span>${esc(l.title)}</span></button></li>`).join("") +
      `<li class="${qDone ? "done" : ""}"><button type="button" data-step="${N}" ${idx === N ? 'aria-current="step"' : ""}><span class="ln-dot"><span>?</span></span><span>Module Quiz${q ? ` · best ${q.best}/${q.total}` : ""}</span></button></li>`;
    nav.querySelectorAll("button").forEach(b => b.addEventListener("click", () => go(+b.dataset.step)));
    const p = Progress.moduleProgress(modKey);
    document.getElementById("mp-pct").textContent = p.pct + "%";
    document.getElementById("mp-bar").style.width = p.pct + "%";
  }

  function go(i) {
    location.hash = i === N ? "quiz" : "lesson-" + (i + 1);
  }

  function renderLesson(i) {
    const l = mod.lessons[i];
    const done = Progress.isLessonDone(modKey, i);
    const act = l.activity && window.ACTIVITIES[l.activity];
    stage.innerHTML = `<article class="lesson card" style="padding:clamp(1.3rem,4vw,2.4rem)">
      <div class="lesson-head">
        <span class="pill accent">Lesson ${i + 1} of ${N}</span>
        <span class="pill">⏱ ${l.minutes} min</span>
        <span class="pill">+${Progress.XP.lesson} XP</span>
        ${act ? `<span class="pill">🧪 Activity +${Progress.XP.activity} XP</span>` : ""}
        ${done ? '<span class="pill ok">✓ Completed</span>' : ""}
      </div>
      <h2 id="lesson-title" tabindex="-1">${esc(l.title)}</h2>
      <div class="lesson-body">${l.html}</div>
      ${act ? `<section class="activity" aria-labelledby="act-title"><div class="activity-head"><h3 id="act-title">🧪 ${esc(act.title)}</h3>
        <span class="activity-status ${Progress.isActivityDone(l.activity) ? "done" : ""}" id="act-status">${Progress.isActivityDone(l.activity) ? "✓ Completed" : "+" + Progress.XP.activity + " XP"}</span></div><div id="act-body"></div></section>` : ""}
      <div class="takeaways"><h4>🔑 Key takeaways</h4><ul>${l.takeaways.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>
      <div class="lesson-actions">
        ${i > 0 ? `<button type="button" class="btn btn-ghost" id="prev">← Previous</button>` : `<a class="btn btn-ghost" href="learn.html">← All modules</a>`}
        <button type="button" class="btn btn-primary" id="next">${done ? (i === N - 1 ? "Go to quiz →" : "Next lesson →") : (i === N - 1 ? "Complete & take quiz →" : "Complete & continue →")}</button>
      </div></article>`;
    if (act) {
      act.render(stage.querySelector("#act-body"), () => {
        if (Progress.completeActivity(l.activity, act.title)) {
          const s = stage.querySelector("#act-status"); s.textContent = "✓ Completed"; s.classList.add("done");
        }
      });
    }
    const prev = stage.querySelector("#prev");
    if (prev) prev.addEventListener("click", () => go(i - 1));
    stage.querySelector("#next").addEventListener("click", () => {
      Progress.completeLesson(modKey, i, l.title);
      go(i + 1);
    });
  }

  function renderQuiz() {
    const qs = mod.quiz;
    const prev = Progress.get().quizzes[modKey];
    stage.innerHTML = `<article class="lesson card quiz" style="padding:clamp(1.3rem,4vw,2.4rem);--accent:var(--mod-${modKey})">
      <div class="lesson-head"><span class="pill accent">Module Quiz</span><span class="pill">${qs.length} questions</span><span class="pill">+${Progress.XP.quizCorrect} XP per new correct</span><span class="pill">Pass: ${Math.ceil(qs.length * Progress.PASS_RATIO)}/${qs.length}</span>
      ${prev ? `<span class="pill ok">Best: ${prev.best}/${prev.total}</span>` : ""}</div>
      <h2 id="lesson-title" tabindex="-1">Check your understanding</h2>
      <p class="muted">Pass the quiz to complete the module. You can retake it anytime. XP is only awarded when you beat your best score.</p>
      <form id="quiz-form" novalidate>
        ${qs.map((q, i) => `<div class="quiz-q"><fieldset><legend>${i + 1}. ${esc(q.q)}</legend>
          ${q.options.map((o, j) => `<label class="quiz-opt"><input type="radio" name="q${i}" value="${j}" required><span>${esc(o)}</span></label>`).join("")}
          <div class="quiz-explain">${esc(q.explain)}</div></fieldset></div>`).join("")}
        <p class="feedback bad" id="quiz-warn" aria-live="assertive"></p>
        <div class="lesson-actions"><button type="button" class="btn btn-ghost" id="prev">← Last lesson</button><button type="submit" class="btn btn-primary">Submit answers</button></div>
      </form>
      <div id="quiz-result"></div></article>`;
    stage.querySelector("#prev").addEventListener("click", () => go(N - 1));
    const form = stage.querySelector("#quiz-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const answers = qs.map((_, i) => { const c = form.querySelector(`input[name="q${i}"]:checked`); return c ? +c.value : null; });
      const missing = answers.findIndex(a => a === null);
      if (missing !== -1) {
        stage.querySelector("#quiz-warn").textContent = `Please answer question ${missing + 1} before submitting.`;
        form.querySelector(`input[name="q${missing}"]`).focus();
        return;
      }
      stage.querySelector("#quiz-warn").textContent = "";
      let correct = 0;
      qs.forEach((q, i) => {
        const opts = form.querySelectorAll(`input[name="q${i}"]`);
        opts.forEach((inp, j) => {
          const lab = inp.closest(".quiz-opt");
          if (j === q.answer) lab.classList.add("correct");
          else if (j === answers[i]) lab.classList.add("wrong");
          inp.disabled = true;
        });
        if (answers[i] === q.answer) correct++;
      });
      stage.querySelector(".quiz").classList.add("graded");
      form.querySelector('button[type="submit"]').remove();
      const pass = correct / qs.length >= Progress.PASS_RATIO;
      Progress.recordQuiz(modKey, correct, qs.length);
      const p = Progress.moduleProgress(modKey);
      const r = stage.querySelector("#quiz-result");
      r.innerHTML = `<div class="quiz-result">
        <div class="big-num grad-text" style="font-size:3rem">${correct}/${qs.length}</div>
        <h3>${correct === qs.length ? "Perfect score! 🎉" : pass ? "You passed! ✅" : "Almost there. Review and retry."}</h3>
        <p class="muted">${p.complete ? "Module complete." : pass ? "Finish any remaining lessons to complete the module." : `You need ${Math.ceil(qs.length * Progress.PASS_RATIO)} correct to pass. Read the explanations above, then try again.`}</p>
        <div style="display:flex;gap:.6rem;justify-content:center;flex-wrap:wrap">
          <button type="button" class="btn btn-ghost" id="retake">↺ Retake quiz</button>
          ${p.complete && nextMod ? `<a class="btn btn-primary" href="module.html?m=${nextMod}">Next module: ${esc(window.MODULE_DATA[nextMod].title)} →</a>` : ""}
          ${p.complete && !nextMod ? `<a class="btn btn-primary" href="dashboard.html">View dashboard →</a>` : ""}
          ${!p.complete && pass ? `<a class="btn btn-primary" href="dashboard.html">View dashboard →</a>` : ""}
        </div></div>`;
      r.querySelector("#retake").addEventListener("click", () => { renderQuiz(); focusTitle(); });
      if (correct === qs.length) UI.confetti();
      r.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function focusTitle() { const t = document.getElementById("lesson-title"); if (t) t.focus({ preventScroll: true }); }

  function route(scroll) {
    const idx = current();
    renderNav(idx);
    idx === N ? renderQuiz() : renderLesson(idx);
    if (scroll) { window.scrollTo({ top: root.querySelector(".module-layout").offsetTop - 90, behavior: "smooth" }); focusTitle(); }
  }
  window.addEventListener("hashchange", () => route(true));
  document.addEventListener("progress:change", () => renderNav(current()));
  route(false);
})();
