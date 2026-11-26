/* Pathwise AI — reusable module cards (home + learn pages) */
(function () {
  "use strict";
  const ICONS = {
    foundations: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7l3 4M7 17l3-4M14 11l3-4M14 13l3 4"/></svg>',
    tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20l9-9M15 4l1.2 2.8L19 8l-2.8 1.2L15 12l-1.2-2.8L11 8l2.8-1.2z"/></svg>',
    ethics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18M7 21h10M5 7h14M5 7l-3 6h6zM19 7l-3 6h6z"/></svg>',
  };
  function render(el) {
    const D = window.MODULE_DATA;
    el.innerHTML = Object.keys(D).map(k => {
      const m = D[k], p = Progress.moduleProgress(k);
      const mins = m.lessons.reduce((s, l) => s + l.minutes, 0);
      const label = p.complete ? "Review" : p.done ? "Continue" : "Start";
      return `<article class="card card-hover module-card reveal in" data-module="${k}">
        <div class="mc-top">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div class="feature-icon" style="margin:0">${ICONS[k]}</div>
            ${p.complete ? '<span class="pill ok">✓ Complete</span>' : `<span class="mc-num">MODULE ${m.num}</span>`}
          </div>
          <h3 style="margin-top:1rem">${m.title}</h3>
          <p class="muted" style="margin:0;font-size:.95rem">${m.tagline}</p>
        </div>
        <div class="mc-body">
          <div class="meta-row"><span class="pill accent">${m.lessons.length} lessons</span><span class="pill">⏱ ~${mins} min</span><span class="pill">+ quiz</span></div>
          <ul>${m.lessons.map(l => `<li>${l.title}</li>`).join("")}</ul>
          <div>
            <div class="progress-label"><span>${p.done} of ${p.steps} steps</span><span>${p.pct}%</span></div>
            <div class="progress"><span style="width:${p.pct}%;background:var(--accent)"></span></div>
          </div>
          <div class="mc-foot"><a class="btn btn-primary btn-sm" href="module.html?m=${k}" aria-label="${label} ${m.title}">${label} module →</a></div>
        </div></article>`;
    }).join("");
  }
  window.ModuleCards = { render };
})();
