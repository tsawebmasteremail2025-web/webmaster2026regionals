/* ==========================================================================
   Pathwise AI — Progress & Gamification Engine
   Stores learner progress in the browser (localStorage). No accounts,
   no servers, no personal data leaves the device.
   ========================================================================== */
(function () {
  "use strict";

  const STORAGE_KEY = "pathwise.progress.v1";

  /* ---- Module metadata (lesson counts drive progress math) ---- */
  const MODULES = {
    foundations: { title: "AI Foundations", short: "Foundations", lessons: 4, color: "var(--mod-foundations)" },
    tools:       { title: "AI Tools & Techniques", short: "Tools", lessons: 4, color: "var(--mod-tools)" },
    ethics:      { title: "Ethical AI Use", short: "Ethics", lessons: 4, color: "var(--mod-ethics)" },
  };

  const XP = { lesson: 50, activity: 40, quizCorrect: 20, quizPerfect: 50, module: 100, badge: 25, term: 5 };
  const PASS_RATIO = 0.6;

  /* ---- Levels ---- */
  const LEVELS = [
    { min: 0,    name: "Curious Beginner" },
    { min: 100,  name: "Data Scout" },
    { min: 250,  name: "Pattern Finder" },
    { min: 450,  name: "Model Builder" },
    { min: 700,  name: "Prompt Crafter" },
    { min: 1000, name: "Critical Thinker" },
    { min: 1350, name: "Ethics Champion" },
    { min: 1800, name: "AI Navigator" },
  ];

  /* ---- Badges ---- */
  const BADGES = [
    { id: "first-steps",   name: "First Steps",     desc: "Complete your first lesson.",                 icon: "spark",  hue: 260 },
    { id: "neuron-tuner",  name: "Neuron Tuner",    desc: "Beat the neuron challenge.",                  icon: "neuron", hue: 250 },
    { id: "foundations",   name: "Foundation Builder", desc: "Finish the AI Foundations module.",       icon: "cube",   hue: 248 },
    { id: "prompt-pro",    name: "Prompt Pro",      desc: "Score 85+ in the Prompt Builder.",            icon: "wand",   hue: 190 },
    { id: "fact-checker",  name: "Fact Checker",    desc: "Catch every hallucination.",                  icon: "lens",   hue: 175 },
    { id: "toolsmith",     name: "Toolsmith",       desc: "Finish the AI Tools & Techniques module.",    icon: "tool",   hue: 188 },
    { id: "integrity",     name: "Integrity Ace",   desc: "Make the right call in every dilemma.",       icon: "scale",  hue: 330 },
    { id: "guardian",      name: "Ethics Guardian", desc: "Finish the Ethical AI Use module.",           icon: "shield", hue: 325 },
    { id: "quiz-whiz",     name: "Quiz Whiz",       desc: "Ace any module quiz with a perfect score.",   icon: "star",   hue: 45 },
    { id: "perfectionist", name: "Perfectionist",   desc: "Perfect scores on all three quizzes.",        icon: "crown",  hue: 40 },
    { id: "word-nerd",     name: "Word Nerd",       desc: "Learn 10 terms in the glossary.",             icon: "book",   hue: 150 },
    { id: "streak-3",      name: "On a Roll",       desc: "Learn on 3 days in a row.",                   icon: "flame",  hue: 20 },
    { id: "graduate",      name: "AI Graduate",     desc: "Complete all three modules.",                 icon: "cap",    hue: 280 },
  ];

  /* ---- Storage (always guarded: private mode / blocked storage) ---- */
  function blank() {
    return { v: 1, xp: 0, name: "", lessons: {}, activities: {}, quizzes: {}, modules: {}, badges: {}, terms: {}, days: [], log: [], created: Date.now() };
  }
  let memoryFallback = null;
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return memoryFallback || blank();
      return Object.assign(blank(), JSON.parse(raw));
    } catch (e) { return memoryFallback || blank(); }
  }
  function save(s) {
    memoryFallback = s;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) { /* storage unavailable */ }
  }

  let state = load();
  const queue = []; // events for UI: {type:'xp'|'badge'|'level', ...}

  function today() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function levelInfo(xp) {
    let idx = 0;
    for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].min) idx = i;
    const cur = LEVELS[idx], next = LEVELS[idx + 1];
    const into = xp - cur.min;
    const span = next ? next.min - cur.min : 1;
    return {
      level: idx + 1, name: cur.name, xp,
      nextName: next ? next.name : null,
      toNext: next ? next.min - xp : 0,
      pct: next ? Math.min(100, Math.round((into / span) * 100)) : 100,
      max: !next,
    };
  }

  function addXP(amount, label) {
    if (!amount) return;
    const before = levelInfo(state.xp).level;
    state.xp += amount;
    state.log.unshift({ t: Date.now(), label, xp: amount });
    state.log = state.log.slice(0, 60);
    const d = today();
    if (!state.days.includes(d)) state.days.push(d);
    queue.push({ type: "xp", amount, label });
    const after = levelInfo(state.xp);
    if (after.level > before) queue.push({ type: "level", info: after });
  }

  function streak() {
    if (!state.days.length) return 0;
    const set = new Set(state.days);
    let count = 0;
    const d = new Date();
    // streak can be "alive" if last activity was today or yesterday
    if (!set.has(fmt(d))) d.setDate(d.getDate() - 1);
    while (set.has(fmt(d))) { count++; d.setDate(d.getDate() - 1); }
    return count;
    function fmt(x) { return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); }
  }

  /* ---- Module progress ---- */
  function lessonsDone(mod) {
    const n = MODULES[mod].lessons; let c = 0;
    for (let i = 0; i < n; i++) if (state.lessons[mod + ":" + i]) c++;
    return c;
  }
  function quizPassed(mod) {
    const q = state.quizzes[mod];
    return !!(q && q.best / q.total >= PASS_RATIO);
  }
  function moduleProgress(mod) {
    const n = MODULES[mod].lessons;
    const steps = n + 1; // lessons + quiz
    const done = lessonsDone(mod) + (quizPassed(mod) ? 1 : 0);
    return { done, steps, pct: Math.round((done / steps) * 100), complete: done === steps, lessonsDone: lessonsDone(mod), quiz: state.quizzes[mod] || null };
  }
  function overall() {
    let done = 0, steps = 0;
    Object.keys(MODULES).forEach(m => { const p = moduleProgress(m); done += p.done; steps += p.steps; });
    return { done, steps, pct: Math.round((done / steps) * 100) };
  }

  /* ---- Badges ---- */
  function award(id) {
    if (state.badges[id]) return;
    const b = BADGES.find(x => x.id === id);
    if (!b) return;
    state.badges[id] = Date.now();
    queue.push({ type: "badge", badge: b });
    addXP(XP.badge, "Badge earned: " + b.name);
  }

  function evaluate() {
    // module completion bonuses
    Object.keys(MODULES).forEach(m => {
      if (moduleProgress(m).complete && !state.modules[m]) {
        state.modules[m] = Date.now();
        addXP(XP.module, "Module complete: " + MODULES[m].title);
      }
    });
    if (Object.keys(state.lessons).length >= 1) award("first-steps");
    if (state.modules.foundations) award("foundations");
    if (state.modules.tools) award("toolsmith");
    if (state.modules.ethics) award("guardian");
    if (state.activities["neuron"]) award("neuron-tuner");
    if (state.activities["prompt-builder"]) award("prompt-pro");
    if (state.activities["hallucination"]) award("fact-checker");
    if (state.activities["dilemmas"]) award("integrity");
    const qs = Object.values(state.quizzes);
    if (qs.some(q => q.best === q.total)) award("quiz-whiz");
    if (Object.keys(MODULES).every(m => state.quizzes[m] && state.quizzes[m].best === state.quizzes[m].total)) award("perfectionist");
    if (Object.keys(state.terms).length >= 10) award("word-nerd");
    if (streak() >= 3) award("streak-3");
    if (Object.keys(MODULES).every(m => state.modules[m])) award("graduate");
  }

  function commit() {
    evaluate();
    save(state);
    const events = queue.splice(0);
    document.dispatchEvent(new CustomEvent("progress:change", { detail: { events, state } }));
  }

  /* ---- Public actions ---- */
  function completeLesson(mod, idx, title) {
    const key = mod + ":" + idx;
    if (state.lessons[key]) return false;
    state.lessons[key] = Date.now();
    addXP(XP.lesson, "Lesson: " + (title || key));
    commit();
    return true;
  }
  function completeActivity(id, label) {
    if (state.activities[id]) return false;
    state.activities[id] = Date.now();
    addXP(XP.activity, "Activity: " + (label || id));
    commit();
    return true;
  }
  /* XP is only awarded for improving your best score, so retakes can't be farmed. */
  function recordQuiz(mod, correct, total) {
    const prev = state.quizzes[mod] || { best: 0, total, attempts: 0 };
    const gain = Math.max(0, correct - prev.best);
    const firstPerfect = correct === total && prev.best !== total;
    state.quizzes[mod] = { best: Math.max(prev.best, correct), total, attempts: prev.attempts + 1, last: correct };
    if (gain) addXP(gain * XP.quizCorrect, MODULES[mod].short + " quiz: +" + gain + " new correct");
    if (firstPerfect) addXP(XP.quizPerfect, MODULES[mod].short + " quiz: perfect score bonus");
    if (!state.days.includes(today())) state.days.push(today());
    commit();
    return { gain, firstPerfect };
  }
  function learnTerm(id, on) {
    if (on) {
      if (state.terms[id]) return;
      state.terms[id] = Date.now();
      addXP(XP.term, "Glossary term learned");
    } else {
      delete state.terms[id]; // un-marking never removes XP already earned
    }
    commit();
  }
  function setName(name) { state.name = String(name || "").slice(0, 60); save(state); }
  function reset() { state = blank(); memoryFallback = null; try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} commit(); }
  function exportCode() { try { return btoa(unescape(encodeURIComponent(JSON.stringify(state)))); } catch (e) { return ""; } }
  function importCode(code) {
    try {
      const obj = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if (typeof obj.xp !== "number") throw new Error("bad");
      state = Object.assign(blank(), obj); commit(); return true;
    } catch (e) { return false; }
  }

  window.Progress = {
    MODULES, BADGES, LEVELS, XP, PASS_RATIO,
    get: () => state,
    levelInfo: () => levelInfo(state.xp),
    moduleProgress, overall, streak,
    isLessonDone: (mod, i) => !!state.lessons[mod + ":" + i],
    isActivityDone: id => !!state.activities[id],
    isTermLearned: id => !!state.terms[id],
    completeLesson, completeActivity, recordQuiz, learnTerm, setName, reset, exportCode, importCode,
  };
})();
