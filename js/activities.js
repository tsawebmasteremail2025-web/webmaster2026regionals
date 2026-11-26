/* ==========================================================================
   Pathwise AI — Interactive learning activities
   Each activity: { title, render(el, done) } where done() awards XP once.
   ========================================================================== */
(function () {
  "use strict";
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sigmoid = x => 1 / (1 + Math.exp(-x));

  const A = {};

  /* ---------------- 1. Learning-type sorter ---------------- */
  A["learn-sort"] = {
    title: "Sort It: Which Type of Learning?",
    render(el, done) {
      const items = [
        ["A model learns to tag photos as \"dog\" or \"cat\" from 50,000 labeled pictures.", "Supervised"],
        ["An app groups shoppers into clusters based on their buying habits, with no categories given.", "Unsupervised"],
        ["A robot vacuum gets points for cleaning and loses points for bumping walls, improving over time.", "Reinforcement"],
        ["A model predicts house prices after studying thousands of past sales with known prices.", "Supervised"],
        ["An AI learns to win a video game by playing millions of rounds and keeping strategies that score higher.", "Reinforcement"],
        ["A system finds unusual credit-card purchases that don't fit any normal pattern, with no fraud labels.", "Unsupervised"],
      ];
      const types = ["Supervised", "Unsupervised", "Reinforcement"];
      const solved = new Set();
      el.innerHTML = `<p class="muted">Pick the learning type for each scenario. Get all six right to complete the activity.</p>` +
        items.map((it, i) => `<div class="sort-item" data-i="${i}"><p>${esc(it[0])}</p>
          <div class="choice-row" role="group" aria-label="Learning type for scenario ${i + 1}">${types.map(t => `<button type="button" class="choice" data-t="${t}">${t}</button>`).join("")}</div>
          <div class="feedback" aria-live="polite"></div></div>`).join("") +
        `<p class="feedback" id="ls-score" aria-live="polite"></p>`;
      el.querySelectorAll(".sort-item").forEach(box => {
        const i = +box.dataset.i, fb = box.querySelector(".feedback");
        box.querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
          box.querySelectorAll(".choice").forEach(x => x.classList.remove("correct", "wrong"));
          if (b.dataset.t === items[i][1]) {
            b.classList.add("correct"); fb.className = "feedback good"; fb.textContent = "Correct!"; solved.add(i);
          } else {
            b.classList.add("wrong"); fb.className = "feedback bad";
            fb.textContent = { Supervised: "Hint: is there an answer key?", Unsupervised: "Hint: are there labels or rewards?", Reinforcement: "Hint: are there rewards for actions?" }[b.dataset.t];
            solved.delete(i);
          }
          el.querySelector("#ls-score").textContent = solved.size + " / " + items.length + " correct";
          if (solved.size === items.length) done();
        }));
      });
    },
  };

  /* ---------------- 2. Neuron tuner ---------------- */
  A["neuron"] = {
    title: "Tune the Neuron: Should I Go to the Park?",
    render(el, done) {
      const w = { sun: 1, hw: 1, fr: 1, b: 0 };
      const scen = [
        { label: "Sunny, homework done, friend going", x: [1, 1, 1], goal: "yes", text: "should say YES (≥ 90%)" },
        { label: "Sunny, homework NOT done, friend going", x: [1, 0, 1], goal: "no", text: "should say NO (≤ 10%)" },
      ];
      const slider = (k, label, min, max) => `<div class="slider-row"><label for="n-${k}">${label}</label>
        <input id="n-${k}" type="range" min="${min}" max="${max}" step="0.5" value="${w[k]}"><output id="o-${k}">${w[k]}</output></div>`;
      el.innerHTML = `<p class="muted">This neuron decides whether you go to the park. Inputs are 1 (true) or 0 (false). Adjust the <strong>weights</strong> and <strong>bias</strong> so it gives the right answer in <em>both</em> situations. Hint: which input should matter most?</p>
        ${slider("sun", "Weight: sunny ☀️", -8, 8)}${slider("hw", "Weight: homework ✅", -8, 8)}${slider("fr", "Weight: friend 🧑‍🤝‍🧑", -8, 8)}${slider("b", "Bias", -10, 10)}
        <div id="n-scen"></div>
        <ul class="challenge-list" id="n-goals"></ul>
        <p class="feedback" id="n-fb" aria-live="polite"></p>`;
      const out = el.querySelector("#n-scen"), goals = el.querySelector("#n-goals"), fb = el.querySelector("#n-fb");
      function update() {
        let ok = 0;
        out.innerHTML = scen.map((s, i) => {
          const z = w.sun * s.x[0] + w.hw * s.x[1] + w.fr * s.x[2] + w.b;
          const p = sigmoid(z);
          const met = s.goal === "yes" ? p >= .9 : p <= .1;
          if (met) ok++;
          return `<div class="neuron-out"><div><strong>${esc(s.label)}</strong>
            <div class="muted" style="font-size:.85rem;font-family:var(--font-mono)">z = ${w.sun}·${s.x[0]} + ${w.hw}·${s.x[1]} + ${w.fr}·${s.x[2]} + (${w.b}) = ${z.toFixed(1)}</div>
            <div class="neuron-meter" style="margin-top:.5rem" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(p * 100)}" aria-label="Probability of going"><span style="width:${p * 100}%"></span></div></div>
            <div class="big-num">${Math.round(p * 100)}%</div></div>`;
        }).join("");
        goals.innerHTML = scen.map((s, i) => {
          const z = w.sun * s.x[0] + w.hw * s.x[1] + w.fr * s.x[2] + w.b, p = sigmoid(z);
          const met = s.goal === "yes" ? p >= .9 : p <= .1;
          return `<li class="${met ? "met" : ""}">Situation ${i + 1} ${s.text}</li>`;
        }).join("");
        if (ok === 2) { fb.className = "feedback good"; fb.textContent = "You trained the neuron! Notice that you made homework the deciding factor with a big weight and a negative bias. Real training finds values like these automatically."; done(); }
        else { fb.className = "feedback"; fb.textContent = ok + " of 2 situations correct."; }
      }
      ["sun", "hw", "fr", "b"].forEach(k => {
        const inp = el.querySelector("#n-" + k);
        inp.addEventListener("input", () => { w[k] = +inp.value; el.querySelector("#o-" + k).textContent = w[k]; update(); });
      });
      update();
    },
  };

  /* ---------------- 3. Next-token predictor ---------------- */
  A["next-token"] = {
    title: "Be the Language Model",
    render(el, done) {
      const stages = [
        { prefix: "After school, the students opened their", opts: [["laptops", 38], ["books", 27], ["lockers", 20], ["umbrellas", 10], ["dragons", 5]] },
        { prefix: " and started", opts: [["studying", 40], ["typing", 25], ["talking", 20], ["gaming", 11], ["juggling", 4]] },
        { prefix: " for the", opts: [["test", 42], ["exam", 30], ["game", 15], ["weekend", 9], ["moon", 4]] },
      ];
      let stage = 0, text = "", T = 1;
      el.innerHTML = `<p class="muted">You're the model. At each step, pick the next token, or let the model sample one. Move the <strong>temperature</strong> slider and watch how the probabilities change.</p>
        <div class="slider-row"><label for="nt-temp">Temperature</label><input id="nt-temp" type="range" min="0.2" max="2" step="0.1" value="1"><output id="nt-tv">1.0</output></div>
        <div class="token-sentence" aria-live="polite" id="nt-sent"></div>
        <div class="token-bars" id="nt-bars"></div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem"><button type="button" class="btn btn-ghost btn-sm" id="nt-sample">🎲 Let the model sample</button><button type="button" class="btn btn-ghost btn-sm" id="nt-reset">↺ Start over</button></div>
        <p class="feedback" id="nt-fb" aria-live="polite"></p>`;
      const sent = el.querySelector("#nt-sent"), bars = el.querySelector("#nt-bars"), fb = el.querySelector("#nt-fb");
      function probs(opts) {
        const raw = opts.map(o => Math.pow(o[1], 1 / T)); const sum = raw.reduce((a, b) => a + b, 0);
        return raw.map(r => r / sum);
      }
      function draw() {
        sent.innerHTML = esc(text + (stage < stages.length ? stages[stage].prefix : ".")) + (stage < stages.length ? ' <span class="cursor">&nbsp;</span>' : "");
        if (stage >= stages.length) {
          bars.innerHTML = "";
          fb.className = "feedback good";
          fb.textContent = "Sentence complete! That's how an LLM writes everything: one probable token at a time. At high temperature, unlikely words like \"dragons\" get picked more often.";
          el.querySelector("#nt-sample").disabled = true;
          done(); return;
        }
        const ps = probs(stages[stage].opts);
        bars.innerHTML = stages[stage].opts.map((o, i) => `<button type="button" class="token-bar" data-i="${i}" aria-label="${o[0]}, ${Math.round(ps[i] * 100)} percent">
          <span class="tb-word">${o[0]}</span><span class="tb-track"><span style="width:${ps[i] * 100}%"></span></span><span class="tb-pct">${(ps[i] * 100).toFixed(0)}%</span></button>`).join("");
        bars.querySelectorAll(".token-bar").forEach(b => b.addEventListener("click", () => pick(+b.dataset.i)));
      }
      function pick(i) { text += stages[stage].prefix + " " + stages[stage].opts[i][0]; stage++; draw(); }
      el.querySelector("#nt-sample").addEventListener("click", () => {
        if (stage >= stages.length) return;
        const ps = probs(stages[stage].opts); let r = Math.random(), i = 0;
        while (r > ps[i] && i < ps.length - 1) { r -= ps[i]; i++; }
        pick(i);
      });
      el.querySelector("#nt-reset").addEventListener("click", () => { stage = 0; text = ""; fb.textContent = ""; el.querySelector("#nt-sample").disabled = false; draw(); });
      const temp = el.querySelector("#nt-temp");
      temp.addEventListener("input", () => { T = +temp.value; el.querySelector("#nt-tv").textContent = T.toFixed(1); draw(); });
      draw();
    },
  };

  /* ---------------- 4. Prompt builder ---------------- */
  A["prompt-builder"] = {
    title: "Prompt Builder Lab",
    render(el, done) {
      el.innerHTML = `<p class="muted">Build a study prompt with the RTCF framework. Your prompt is scored live. Reach <strong>85 or higher</strong> to complete the lab and earn the Prompt Pro badge.</p>
        <div class="pb-grid">
          <div>
            <div class="field"><label for="pb-role">R: Role</label>
              <select id="pb-role"><option value="">Choose a role…</option><option>Act as a patient tutor</option><option>Act as a tough but fair writing coach</option><option>Act as a quiz master</option><option>Act as a study planner</option><option>Act as a debate partner who argues the other side</option></select></div>
            <div class="field"><label for="pb-task">T: Task</label><span class="hint" id="pb-task-h">Start with an action verb: explain, quiz, compare, give feedback…</span>
              <textarea id="pb-task" aria-describedby="pb-task-h" placeholder="e.g. Explain the causes of World War I"></textarea></div>
            <div class="field"><label for="pb-ctx">C: Context</label><span class="hint" id="pb-ctx-h">Your grade, what you know, what confuses you</span>
              <textarea id="pb-ctx" aria-describedby="pb-ctx-h" placeholder="e.g. I'm a 10th grader. I understand alliances but not militarism."></textarea></div>
            <div class="field"><label for="pb-fmt">F: Format</label><span class="hint" id="pb-fmt-h">Bullets? Table? Word limit? Steps?</span>
              <input id="pb-fmt" aria-describedby="pb-fmt-h" placeholder="e.g. 4 bullet points, under 150 words"></div>
            <div class="field"><label for="pb-extra">Bonus: Learning guardrail</label><span class="hint" id="pb-extra-h">Make it a coach, not a crutch</span>
              <input id="pb-extra" aria-describedby="pb-extra-h" placeholder="e.g. Then ask me 2 questions to check my understanding"></div>
          </div>
          <div>
            <div class="score-ring"><div class="big-num" id="pb-score">0</div><div style="flex:1"><div class="progress grad"><span id="pb-bar"></span></div><div class="muted" style="font-size:.85rem;margin-top:.3rem">Prompt strength</div></div></div>
            <ul class="challenge-list" id="pb-checks"></ul>
            <h4 style="margin-top:1.2rem">Your prompt</h4>
            <div class="prompt-preview" id="pb-prev" aria-live="polite"></div>
            <button type="button" class="btn btn-ghost btn-sm" id="pb-copy" style="margin-top:.7rem">Copy prompt</button>
          </div>
        </div>`;
      const g = id => el.querySelector(id);
      const verbs = /\b(explain|quiz|compare|summari[sz]e|give|create|make|help|teach|analy[sz]e|list|describe|outline|review|critique|check|generate|build|plan|walk|show|ask|define|contrast)\b/i;
      const fmtWords = /\b(bullet|table|list|steps?|words?|sentences?|paragraphs?|outline|numbered|chart|examples?|short|brief|under|\d+)\b/i;
      const guard = /\b(ask me|question|don'?t|do not|hint|check my|without giving|quiz me|test me|my own)\b/i;
      function calc() {
        const role = g("#pb-role").value, task = g("#pb-task").value.trim(), ctx = g("#pb-ctx").value.trim(), fmt = g("#pb-fmt").value.trim(), ex = g("#pb-extra").value.trim();
        const checks = [
          ["Role chosen", !!role, 15],
          ["Task starts with a clear action verb", verbs.test(task), 15],
          ["Task is specific (25+ characters)", task.length >= 25, 15],
          ["Context explains your level or need", ctx.length >= 20, 20],
          ["Format sets a structure or length", fmtWords.test(fmt), 20],
          ["Guardrail keeps you learning", guard.test(ex) || guard.test(task), 15],
        ];
        const score = checks.reduce((s, c) => s + (c[1] ? c[2] : 0), 0);
        g("#pb-score").textContent = score;
        g("#pb-bar").style.width = score + "%";
        g("#pb-checks").innerHTML = checks.map(c => `<li class="${c[1] ? "met" : ""}">${c[0]} <span class="muted">(+${c[2]})</span></li>`).join("");
        const parts = [role && role + ".", task, ctx, fmt && "Format: " + fmt + (/[.!?]$/.test(fmt) ? "" : "."), ex].filter(Boolean);
        g("#pb-prev").textContent = parts.length ? parts.join(" ") : "Start filling in the fields…";
        if (score >= 85) done();
      }
      el.querySelectorAll("select, textarea, input").forEach(x => x.addEventListener("input", calc));
      g("#pb-copy").addEventListener("click", () => {
        const txt = g("#pb-prev").textContent;
        try { navigator.clipboard.writeText(txt).then(() => UI.toast("Copied!", "Paste it into any AI assistant.")); } catch (e) { /* clipboard unavailable */ }
      });
      calc();
    },
  };

  /* ---------------- 5. Spot the hallucination ---------------- */
  A["hallucination"] = {
    title: "Spot the Hallucination",
    render(el, done) {
      const claims = [
        { t: "The term \"artificial intelligence\" was coined for a 1956 workshop at Dartmouth College.", ok: true, why: "True. This is well documented in the history of computing." },
        { t: "A 2021 Stanford study found that exactly 87.3% of high school students use AI every single day.", ok: false, why: "Hallucination. A suspiciously precise statistic with no checkable source. When you search for it, nothing matches." },
        { t: "The transformer architecture behind modern chatbots was introduced in a 2017 research paper titled \"Attention Is All You Need.\"", ok: true, why: "True. You can find the paper by Vaswani et al. (2017)." },
        { t: "Alan Turing built the first working neural network in 1936.", ok: false, why: "Hallucination. Turing's famous 1936 paper was about computation theory. Early neural-network models came later (e.g., the 1958 perceptron)." },
        { t: "Neural networks are loosely inspired by how neurons in the brain connect.", ok: true, why: "True. This is a standard description, though artificial neurons are far simpler than biological ones." },
        { t: "According to Johnson & Patel (2019) in the Journal of Machine Cognition, AI will replace all teachers by 2030.", ok: false, why: "Hallucination. A fabricated citation. Real-sounding authors and a real-sounding journal, but it can't be found. Classic fake reference." },
      ];
      const flagged = new Set();
      el.innerHTML = `<p class="muted">An AI wrote this answer to <em>"Give me some history and facts about AI for my report."</em> Some claims are true; some are hallucinations. <strong>Click every claim you think is false,</strong> then check your work.</p>
        <div class="ai-response"><span class="ai-label">AI ASSISTANT</span>${claims.map((c, i) => `<button type="button" class="claim" data-i="${i}" aria-pressed="false">${esc(c.t)}</button>`).join(" ")}</div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem"><button type="button" class="btn btn-primary btn-sm" id="h-check">Check my flags</button><button type="button" class="btn btn-ghost btn-sm" id="h-reset">↺ Try again</button></div>
        <div id="h-res" aria-live="polite" style="margin-top:1rem"></div>`;
      const btns = el.querySelectorAll(".claim"), res = el.querySelector("#h-res");
      btns.forEach(b => b.addEventListener("click", () => {
        if (el.dataset.checked) return;
        const i = +b.dataset.i;
        flagged.has(i) ? flagged.delete(i) : flagged.add(i);
        b.classList.toggle("flagged"); b.setAttribute("aria-pressed", String(flagged.has(i)));
      }));
      el.querySelector("#h-check").addEventListener("click", () => {
        el.dataset.checked = "1";
        let caught = 0, falsePos = 0; const fakes = claims.filter(c => !c.ok).length;
        btns.forEach(b => { const c = claims[+b.dataset.i]; b.classList.add(c.ok ? "reveal-true" : "reveal-false");
          if (!c.ok && flagged.has(+b.dataset.i)) caught++; if (c.ok && flagged.has(+b.dataset.i)) falsePos++; });
        res.innerHTML = `<p class="feedback ${caught === fakes ? "good" : "bad"}"><strong>You caught ${caught} of ${fakes} hallucinations${falsePos ? ` and flagged ${falsePos} true claim${falsePos > 1 ? "s" : ""}` : ""}.</strong></p>
          <ul style="font-size:.92rem">${claims.map(c => `<li><strong>${c.ok ? "✓ True" : "✗ False"}:</strong> ${esc(c.why)}</li>`).join("")}</ul>`;
        if (caught === fakes) done();
      });
      el.querySelector("#h-reset").addEventListener("click", () => {
        delete el.dataset.checked; flagged.clear(); res.innerHTML = "";
        btns.forEach(b => { b.className = "claim"; b.setAttribute("aria-pressed", "false"); });
      });
    },
  };

  /* ---------------- 6. Integrity dilemmas ---------------- */
  A["dilemmas"] = {
    title: "Integrity Dilemmas",
    render(el, done) {
      const ds = [
        { s: "Your English teacher says AI is allowed for brainstorming only. You're stuck on a thesis for your essay on <em>The Great Gatsby</em>.",
          o: [["Ask AI for 5 possible angles, then write your own thesis inspired by one", true, "Exactly right. Brainstorming is allowed, and the thesis is still yours."],
              ["Have AI write the thesis and change a few words", false, "That's AI writing your work, which goes beyond brainstorming."],
              ["Avoid AI completely just to be safe", false, "That's allowed, but you'd miss a permitted tool. The policy says brainstorming is OK."]] },
        { s: "Your friend asks you to paste their essay into an AI to \"make it sound better\" before they submit it.",
          o: [["Do it. It's their essay, not yours", false, "Pasting someone else's work shares it without their full understanding of the policy, and rewriting may break integrity rules."],
              ["Suggest they check the teacher's AI policy and ask for feedback (not a rewrite) themselves", true, "Great call. You respect the policy and your friend's ownership of their work."],
              ["Rewrite it yourself instead", false, "That's still submitting work that isn't fully theirs."]] },
        { s: "For a history project where AI is allowed with disclosure, an AI gives you a perfect quote from Abraham Lincoln.",
          o: [["Use it with quotation marks and Lincoln's name", false, "AI often invents quotes. You need to verify it first."],
              ["Search for the quote in reliable sources before using it, and disclose the AI help", true, "Yes: verify, then disclose. Many \"famous quotes\" are fabricated or misattributed."],
              ["Cite the AI as the source of Lincoln's quote", false, "The AI isn't a primary source. Find where Lincoln actually said it."]] },
        { s: "You used AI to get feedback on your lab report's clarity, which your teacher allows. The report is due in an hour.",
          o: [["Submit without mentioning it, since feedback is allowed", false, "Even allowed uses should usually be disclosed. Transparency builds trust."],
              ["Add a short disclosure note explaining the AI gave clarity feedback and you made the edits", true, "Perfect. Specific, honest, and quick."],
              ["Delete your AI chat history so nobody knows", false, "Hiding allowed work only creates suspicion. Keeping your process is your proof."]] },
      ];
      const solved = new Set();
      el.innerHTML = `<p class="muted">Choose the most responsible action in each situation. Get all four right to complete the activity.</p>` +
        ds.map((d, i) => `<div class="sort-item" data-i="${i}"><p><strong>Scenario ${i + 1}.</strong> ${d.s}</p>
          <div class="choice-row" style="flex-direction:column;align-items:stretch">${d.o.map((o, j) => `<button type="button" class="choice" style="text-align:left;border-radius:10px" data-j="${j}">${esc(o[0])}</button>`).join("")}</div>
          <div class="feedback" aria-live="polite"></div></div>`).join("");
      el.querySelectorAll(".sort-item").forEach(box => {
        const i = +box.dataset.i, fb = box.querySelector(".feedback");
        box.querySelectorAll(".choice").forEach(b => b.addEventListener("click", () => {
          const o = ds[i].o[+b.dataset.j];
          box.querySelectorAll(".choice").forEach(x => x.classList.remove("correct", "wrong"));
          b.classList.add(o[1] ? "correct" : "wrong");
          fb.className = "feedback " + (o[1] ? "good" : "bad"); fb.textContent = o[2];
          o[1] ? solved.add(i) : solved.delete(i);
          if (solved.size === ds.length) done();
        }));
      });
    },
  };

  window.ACTIVITIES = A;
})();
