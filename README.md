# Pathwise AI: AI Learning Portal

**TSA High School Webmaster 2027 · Theme: Artificial Intelligence (AI) learning portal**

Pathwise AI is an interactive, gamified portal that teaches high school students (grades 9–12) how AI works, how to use AI tools effectively, and how to use AI ethically in school.

## Required elements → where they are

| Requirement | Implementation |
|---|---|
| Educational module: fundamental AI concepts | `module.html?m=foundations`: 4 lessons + 3 labs (learning-type sorter, neuron tuner, "be the language model") + quiz |
| Educational module: practical AI tools/techniques | `module.html?m=tools`: 4 lessons + Prompt Builder Lab + Spot the Hallucination + quiz |
| Educational module: ethical AI usage | `module.html?m=ethics`: 4 lessons + Integrity Dilemmas + quiz |
| Gamification | XP, 8 levels, 13 generated SVG badges, level-up celebrations, day streaks, certificate |
| Progress tracking | `dashboard.html`: level ring, per-module progress, badge collection, activity log, export/import |

## Pages
`index.html` · `learn.html` · `module.html` · `dashboard.html` · `glossary.html` · `about.html` · `references.html` · `work-log.html`

## Tech
Hand-written HTML5, CSS3 and vanilla JavaScript. No frameworks, libraries or templates. Progress is stored in `localStorage`. No accounts, cookies or tracking.

```
css/styles.css        design system (tokens, light/dark themes, components)
js/progress.js        XP / level / badge / streak engine
js/app.js             header, footer, theme, toasts, level-up modal, confetti, hero animation
js/modules-data.js    all lesson + quiz content
js/activities.js      the 6 interactive labs
js/module.js          lesson/quiz player
js/dashboard.js       dashboard
js/glossary.js        searchable glossary
js/cards.js           module cards
```

## Run locally
Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Hosting
Works on GitHub Pages as is (Settings → Pages → deploy from this branch, root folder).
