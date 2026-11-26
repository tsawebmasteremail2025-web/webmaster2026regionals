/* ==========================================================================
   Pathwise AI — Module content
   All lesson text is original writing by the Pathwise AI team.
   Facts are drawn from the sources listed on references.html.
   ========================================================================== */
window.MODULE_DATA = {

  /* ======================================================================
     MODULE 1 — AI FOUNDATIONS
     ====================================================================== */
  foundations: {
    num: "01",
    title: "AI Foundations",
    tagline: "What AI actually is, how machines learn, and what's going on inside a chatbot.",
    outcomes: [
      "Explain the difference between AI, machine learning, and deep learning",
      "Describe the three main ways machines learn",
      "Model how an artificial neuron turns inputs into a decision",
      "Explain why large language models predict words, and why that causes hallucinations",
    ],
    lessons: [
      {
        title: "What Is AI, Really?",
        minutes: 6,
        html: `
          <p><strong>Artificial intelligence (AI)</strong> is the field of building computer systems that perform tasks we normally associate with human thinking: recognizing images, understanding language, making predictions, and making decisions.</p>
          <p>That definition is broad on purpose. A chess engine, the spam filter in your email, the face unlock on a phone, and a chatbot that writes essays are all AI. What they share is that they <em>find patterns in data</em> and use those patterns to act.</p>
          <h3>AI, machine learning, and deep learning</h3>
          <p>You'll hear these three terms used as if they mean the same thing. They don't. Think of them as circles inside circles:</p>
          <div class="nested-circles" role="img" aria-label="Diagram: Deep learning sits inside machine learning, which sits inside artificial intelligence.">
            <svg viewBox="0 0 400 300" aria-hidden="true">
              <ellipse cx="200" cy="150" rx="190" ry="140" fill="color-mix(in srgb, var(--mod-foundations) 12%, transparent)" stroke="var(--mod-foundations)" stroke-width="2"/>
              <ellipse cx="200" cy="175" rx="130" ry="100" fill="color-mix(in srgb, var(--brand-2) 14%, transparent)" stroke="var(--brand-2)" stroke-width="2"/>
              <ellipse cx="200" cy="200" rx="70" ry="58" fill="color-mix(in srgb, var(--brand-3) 18%, transparent)" stroke="var(--brand-3)" stroke-width="2"/>
              <text x="200" y="45" text-anchor="middle" fill="currentColor" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="17">Artificial Intelligence</text>
              <text x="200" y="110" text-anchor="middle" fill="currentColor" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="16">Machine Learning</text>
              <text x="200" y="205" text-anchor="middle" fill="currentColor" font-family="Space Grotesk, sans-serif" font-weight="700" font-size="15">Deep Learning</text>
            </svg>
          </div>
          <ul>
            <li><strong>Artificial intelligence</strong> is the whole field, including older "rule-based" systems where humans wrote every rule by hand.</li>
            <li><strong>Machine learning (ML)</strong> is the part of AI where the computer <em>learns the rules itself</em> from examples instead of being told them.</li>
            <li><strong>Deep learning</strong> is a kind of machine learning that uses large <em>neural networks</em> with many layers. It powers today's image generators and chatbots.</li>
          </ul>
          <h3>Narrow AI vs. general AI</h3>
          <p>Every AI system that exists today is <strong>narrow AI</strong>: it is built for a specific kind of task. A model that's great at writing can be terrible at arithmetic. <strong>Artificial general intelligence (AGI)</strong>, meaning a system that can learn and reason across any task as flexibly as a person, is still a research goal and a subject of debate. It is not something you're using in your browser.</p>
          <div class="callout tip"><strong>Myth buster</strong>AI doesn't "understand" the way you do. It's extremely good at spotting statistical patterns. That's powerful, but it's also why it can sound confident and still be wrong.</div>
          <h3>A 70-year story in one paragraph</h3>
          <p>The term "artificial intelligence" was coined for a 1956 summer workshop at Dartmouth College. Early researchers hand-coded logic rules, and progress came in waves of excitement followed by "AI winters" when funding dried up. Three things changed in the 2010s: huge amounts of digital data, powerful graphics processors (GPUs), and better neural-network techniques. That combination led to the deep learning boom, and in 2017 a new design called the <em>transformer</em> made today's large language models possible.</p>`,
        takeaways: [
          "AI is the broad field. Machine learning learns from data. Deep learning uses many-layered neural networks.",
          "All current AI is narrow AI, built for specific kinds of tasks.",
          "AI recognizes patterns. It does not think or understand like a human.",
        ],
      },
      {
        title: "How Machines Learn",
        minutes: 7,
        activity: "learn-sort",
        html: `
          <p>Traditional programming works like a recipe: a human writes the rules, the computer follows them. Machine learning flips that around. You give the computer <strong>examples</strong>, and it figures out the rules.</p>
          <div class="table-wrap"><table class="compare-table">
            <thead><tr><th scope="col"></th><th scope="col">Traditional programming</th><th scope="col">Machine learning</th></tr></thead>
            <tbody>
              <tr><th scope="row">Input</th><td>Rules + data</td><td>Data + correct answers (or a goal)</td></tr>
              <tr><th scope="row">Output</th><td>Answers</td><td>A <em>model</em>: learned rules that can make new predictions</td></tr>
              <tr><th scope="row">Example</th><td>"If the email contains 'FREE MONEY', mark it spam"</td><td>Show it 100,000 labeled emails and let it learn what spam looks like</td></tr>
            </tbody></table></div>
          <h3>The three main types of learning</h3>
          <p><strong>1. Supervised learning: learning with an answer key.</strong> Every training example comes with a label ("cat" / "not cat", "spam" / "not spam", the sale price of a house). The model makes a guess, compares it to the label, and adjusts itself to be less wrong next time. Most everyday AI works this way.</p>
          <p><strong>2. Unsupervised learning: finding hidden structure.</strong> There are no labels. The model looks for groups and patterns on its own. A streaming service might use it to discover that some viewers cluster around "true-crime documentaries + cooking shows" without anyone defining that group.</p>
          <p><strong>3. Reinforcement learning: learning by trial and error.</strong> An <em>agent</em> takes actions in an environment and gets <em>rewards</em> or <em>penalties</em>. Over many attempts it learns a strategy that earns the most reward. This is how AI systems learned to master games like Go and how robots learn to walk.</p>
          <div class="callout"><strong>Training vs. using a model</strong><em>Training</em> is the expensive learning phase, often weeks on thousands of chips. <em>Inference</em> is when the finished model is used to answer your question. When you chat with an AI, you're doing inference; you are not teaching it in real time.</div>
          <h3>Data is everything</h3>
          <p>A model can only be as good as the data it learned from. If the data is incomplete, outdated, or unbalanced, the model will be too. Computer scientists sum this up as <strong>"garbage in, garbage out."</strong> You'll see why this matters a lot when we get to bias in the Ethics module.</p>`,
        takeaways: [
          "Machine learning learns rules from examples instead of being programmed with them.",
          "Supervised = labeled examples. Unsupervised = find patterns. Reinforcement = rewards for good actions.",
          "Model quality depends on data quality: garbage in, garbage out.",
        ],
      },
      {
        title: "Inside a Neural Network",
        minutes: 8,
        activity: "neuron",
        html: `
          <p>A <strong>neural network</strong> is a math system loosely inspired by the brain. It's built from simple units called <strong>artificial neurons</strong>, connected in layers.</p>
          <h3>One neuron, step by step</h3>
          <ol>
            <li><strong>Inputs.</strong> The neuron receives numbers, for example: how sunny it is, whether your homework is done, whether a friend is going.</li>
            <li><strong>Weights.</strong> Each input is multiplied by a <em>weight</em> that says how much it matters. A big positive weight means "this pushes toward yes." A negative weight pushes toward no.</li>
            <li><strong>Bias.</strong> A constant added at the end, like a default mood. A positive bias makes "yes" easier to reach.</li>
            <li><strong>Activation.</strong> The total is squeezed through an <em>activation function</em> into a final output, here a probability between 0% and 100%.</li>
          </ol>
          <p>In math form: <code>output = activation(w₁·x₁ + w₂·x₂ + w₃·x₃ + bias)</code>. That's it. Every giant AI model is made of millions or billions of these tiny calculations.</p>
          <h3>Layers make it powerful</h3>
          <p>One neuron can only make simple decisions. Stack them in layers (an <em>input layer</em>, one or more <em>hidden layers</em>, and an <em>output layer</em>) and the network can learn incredibly complex patterns. In an image model, early layers might detect edges, middle layers detect shapes like eyes or wheels, and later layers recognize "face" or "car."</p>
          <h3>So how does it <em>learn</em>?</h3>
          <p>At first the weights are random, so the network's answers are random. During training, it makes a prediction, measures how wrong it was (the <strong>loss</strong>), and then nudges every weight slightly in the direction that would have made it less wrong. This nudging process is called <strong>backpropagation</strong> with <strong>gradient descent</strong>. Repeat it millions of times and the weights settle into values that work.</p>
          <div class="callout tip"><strong>Try it below</strong>In the activity, <em>you</em> play the role of training. Adjust the weights and bias by hand to make the neuron give the right answer. Real training does exactly this, automatically, for billions of weights.</div>`,
        takeaways: [
          "A neuron multiplies inputs by weights, adds a bias, and passes the result through an activation function.",
          "Layers of neurons let networks learn complex patterns, from edges up to whole objects.",
          "Training means adjusting weights to reduce error, over and over.",
        ],
      },
      {
        title: "How Chatbots Work: Large Language Models",
        minutes: 8,
        activity: "next-token",
        html: `
          <p>Chat assistants are powered by <strong>large language models (LLMs)</strong>: neural networks trained on enormous amounts of text from books, websites, and code. Their core skill sounds surprisingly simple:</p>
          <div class="callout"><strong>An LLM predicts the next token.</strong>Given some text, it calculates which small chunk of text (a <em>token</em>) is most likely to come next, adds it, and repeats.</div>
          <h3>Tokens</h3>
          <p>Models don't read whole words. They break text into <strong>tokens</strong>, which are common words or pieces of words. "Unbelievable" might become <code>un</code> + <code>believ</code> + <code>able</code>. A rough rule of thumb is that 100 tokens ≈ 75 English words.</p>
          <h3>From autocomplete to assistant</h3>
          <p>Your phone keyboard also predicts the next word, but it only looks at a few words. An LLM weighs the <em>entire</em> conversation at once using a mechanism called <strong>attention</strong>, part of the transformer design. Because it trained on so much text, predicting the next token well forces it to pick up grammar, facts, writing styles, and reasoning patterns. After pre-training, developers fine-tune models with human feedback so they follow instructions and respond helpfully and safely.</p>
          <h3>Temperature: creativity vs. predictability</h3>
          <p>The model doesn't always choose the single most likely token. A setting called <strong>temperature</strong> controls how adventurous it is. Low temperature means focused and repetitive. High temperature means more creative, and sometimes more random. You'll experiment with this in the activity below.</p>
          <h3>Why AI "hallucinates"</h3>
          <p>Here's the catch: an LLM is optimized to produce text that <em>sounds</em> right, not text that is verified to <em>be</em> right. It has no built-in fact database. When it doesn't know something, it may still produce a fluent, confident answer, like a made-up statistic or a book citation that doesn't exist. This is called a <strong>hallucination</strong>.</p>
          <div class="callout warn"><strong>Remember this for every assignment</strong>Fluent does not mean factual. Treat AI output as a first draft from a fast, well-read, but unreliable partner. You'll learn a verification workflow in Module 2.</div>
          <h3>Knowledge cutoff</h3>
          <p>A model's knowledge stops at its <strong>training cutoff</strong> date. Unless a tool connects it to web search, it may not know about recent events and may not realize that it doesn't know.</p>`,
        takeaways: [
          "LLMs generate text one token at a time by predicting what is most likely to come next.",
          "Temperature controls how predictable or creative the output is.",
          "Hallucinations happen because models optimize for plausible text, not verified truth.",
        ],
      },
    ],
    quiz: [
      { q: "Which statement best describes the relationship between AI, machine learning, and deep learning?",
        options: ["They are three names for the same thing", "Deep learning is a type of machine learning, which is a part of AI", "AI is a type of deep learning", "Machine learning is older than AI and replaced it"],
        answer: 1, explain: "They're nested: AI is the broad field, machine learning is AI that learns from data, and deep learning is ML using many-layered neural networks." },
      { q: "A model is trained on thousands of X-ray images, each labeled \"fracture\" or \"no fracture.\" What type of learning is this?",
        options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Rule-based programming"],
        answer: 0, explain: "Every example comes with a correct label (an answer key), which is what makes it supervised learning." },
      { q: "In an artificial neuron, what does a large negative weight on an input mean?",
        options: ["The input is ignored", "The input pushes the output toward \"no\"", "The input is an error", "The neuron stops working"],
        answer: 1, explain: "Weights scale each input's influence. A negative weight means a higher input value lowers the output." },
      { q: "What is a large language model fundamentally trained to do?",
        options: ["Search the internet for answers", "Look up facts in a verified database", "Predict the next token in a sequence of text", "Copy and paste sentences from websites"],
        answer: 2, explain: "LLMs generate text by repeatedly predicting the most likely next token. They don't look things up unless connected to a separate tool." },
      { q: "Why can an AI chatbot confidently state something false?",
        options: ["It is programmed to lie", "It produces plausible-sounding text without verifying facts", "Its internet connection failed", "It only happens with old computers"],
        answer: 1, explain: "This is a hallucination. The model optimizes for text that sounds right, not text that has been checked." },
    ],
  },

  /* ======================================================================
     MODULE 2 — AI TOOLS & TECHNIQUES
     ====================================================================== */
  tools: {
    num: "02",
    title: "AI Tools & Techniques",
    tagline: "The AI toolbox, prompting that gets results, studying smarter, and checking every answer.",
    outcomes: [
      "Choose the right kind of AI tool for a task",
      "Write clear prompts using the RTCF framework",
      "Use AI as a tutor that builds your skills instead of replacing them",
      "Verify AI output with a repeatable fact-checking workflow",
    ],
    lessons: [
      {
        title: "Your AI Toolbox",
        minutes: 6,
        html: `
          <p>"AI" isn't one tool. It's a whole toolbox, and different jobs need different tools. Here are the main categories you'll run into as a student. Specific products change fast, so focus on <em>what each category is good and bad at</em>.</p>
          <div class="table-wrap"><table class="compare-table">
            <thead><tr><th scope="col">Category</th><th scope="col">Good for</th><th scope="col">Watch out for</th></tr></thead>
            <tbody>
              <tr><th scope="row">Chat assistants</th><td>Explaining concepts, brainstorming, feedback on drafts, practice questions</td><td>Hallucinations; may not know recent events</td></tr>
              <tr><th scope="row">AI-powered search &amp; research tools</th><td>Finding sources, summarizing articles, answering with links you can check</td><td>Summaries can misrepresent the source, so always open the link</td></tr>
              <tr><th scope="row">Writing &amp; grammar assistants</th><td>Catching errors, improving clarity, adjusting tone</td><td>Can flatten your personal voice; may cross your teacher's line</td></tr>
              <tr><th scope="row">Image, audio &amp; video generators</th><td>Concept art, storyboards, presentation visuals</td><td>Copyright questions; must be labeled as AI-generated</td></tr>
              <tr><th scope="row">Coding assistants</th><td>Explaining errors, suggesting code, learning syntax</td><td>Code can look right but be buggy or insecure</td></tr>
              <tr><th scope="row">Study &amp; tutoring tools</th><td>Flashcards, quizzes, step-by-step hints</td><td>Easy to slip into answer-copying instead of learning</td></tr>
              <tr><th scope="row">Accessibility tools</th><td>Speech-to-text, text-to-speech, live captions, translation</td><td>Accuracy varies with accents, audio quality, and language</td></tr>
            </tbody></table></div>
          <h3>Before you open any AI tool, ask</h3>
          <ol>
            <li><strong>Is AI allowed for this assignment?</strong> Check your syllabus or ask your teacher. Policies differ by class.</li>
            <li><strong>What's my actual goal?</strong> To <em>learn</em> something, or just to <em>finish</em> something? AI can help with both, but only one helps on the test.</li>
            <li><strong>What am I sharing?</strong> Never paste personal info, passwords, or other people's private data into an AI tool.</li>
            <li><strong>Does this tool meet the age requirements?</strong> Many AI services set minimum ages in their terms of use, and some schools provide approved tools.</li>
          </ol>
          <div class="callout tip"><strong>Pro move</strong>The best AI users switch tools on purpose: chat to understand an idea, a search tool to find real sources, their own brain to write the final draft.</div>`,
        takeaways: [
          "Different AI tools are built for different jobs. Match the tool to the task.",
          "Every category has strengths and specific risks.",
          "Check the policy, your goal, and your privacy before you start.",
        ],
      },
      {
        title: "Prompting Fundamentals",
        minutes: 8,
        activity: "prompt-builder",
        html: `
          <p>A <strong>prompt</strong> is the instruction you give an AI. Vague prompts get vague answers. The skill of writing clear prompts is often called <strong>prompt engineering</strong>, and you can learn it in minutes.</p>
          <h3>The RTCF framework</h3>
          <p>Strong prompts usually cover four things:</p>
          <ul>
            <li><strong>R: Role.</strong> Who should the AI act as? <em>"Act as a patient chemistry tutor…"</em></li>
            <li><strong>T: Task.</strong> Exactly what do you want? Use an action verb. <em>"Explain…", "Quiz me on…", "Give feedback on…"</em></li>
            <li><strong>C: Context.</strong> Who you are and what you already know. <em>"I'm a 10th grader who understands atoms but is confused by moles."</em></li>
            <li><strong>F: Format.</strong> How the answer should look. <em>"Use 3 bullet points and one real-world example. Keep it under 150 words."</em></li>
          </ul>
          <div class="table-wrap"><table class="compare-table">
            <thead><tr><th scope="col">Weak prompt</th><th scope="col">Strong prompt</th></tr></thead>
            <tbody><tr>
              <td><code>explain photosynthesis</code></td>
              <td><code>Act as a biology tutor. Explain photosynthesis to a 9th grader who keeps mixing it up with cellular respiration. Compare the two in a short table, then ask me 2 questions to check my understanding.</code></td>
            </tr></tbody></table></div>
          <h3>Power techniques</h3>
          <ul>
            <li><strong>Give examples.</strong> Show the style you want ("Here's one flashcard I like, so make 10 more like it"). This is called <em>few-shot prompting</em>.</li>
            <li><strong>Ask for step-by-step reasoning.</strong> For math and logic, asking the AI to work through steps tends to produce more careful answers.</li>
            <li><strong>Set constraints.</strong> Word limits, reading level, "don't give me the final answer."</li>
            <li><strong>Iterate.</strong> Your first prompt is a starting point. Follow up: "Simpler," "Give a different example," "What did you assume?"</li>
            <li><strong>Ask it to ask you.</strong> "Before you answer, ask me any questions you need." This catches missing context.</li>
          </ul>
          <div class="callout warn"><strong>Prompting isn't magic</strong>A great prompt reduces errors. It doesn't eliminate them. Verification (Lesson 4) is still required.</div>`,
        takeaways: [
          "Use RTCF: Role, Task, Context, Format.",
          "Examples, constraints, and step-by-step requests improve results.",
          "Prompting is a conversation. Iterate and refine.",
        ],
      },
      {
        title: "AI as a Study Partner",
        minutes: 7,
        html: `
          <p>Research on learning keeps finding the same thing: you remember what you <em>struggle with and retrieve</em>, not what you passively read. AI can either supercharge that struggle or let you skip it entirely. Here's how to make it a coach, not a crutch.</p>
          <h3>Six study techniques that actually work</h3>
          <ol>
            <li><strong>The Socratic tutor.</strong> <code>Help me understand ___ by asking me questions one at a time. Don't give me the answer; give hints if I'm stuck.</code></li>
            <li><strong>Practice testing.</strong> <code>Make a 10-question practice quiz on ___ for a high school level. Mix multiple choice and short answer. Show answers only after I respond.</code> Retrieval practice is one of the most effective study strategies ever measured.</li>
            <li><strong>Explain it back.</strong> Write your own explanation of a concept and ask: <code>What did I get wrong or leave out?</code></li>
            <li><strong>Multiple explanations.</strong> <code>Explain ___ three different ways: with an analogy, with a diagram described in words, and with a real-world example.</code></li>
            <li><strong>Feedback, not rewriting.</strong> <code>Here is my essay draft. Point out the 3 weakest arguments and explain why, but do not rewrite it for me.</code></li>
            <li><strong>Study planning.</strong> <code>My exam is Friday and covers these 4 units. Build me a 5-day plan with 30-minute sessions that uses spaced review.</code></li>
          </ol>
          <h3>Crutch vs. coach</h3>
          <div class="table-wrap"><table class="compare-table">
            <thead><tr><th scope="col">Crutch (skips learning)</th><th scope="col">Coach (builds learning)</th></tr></thead>
            <tbody>
              <tr><td>"Solve problem 7."</td><td>"I got x = 4 on problem 7 but the key says 6. Where did my steps go wrong?"</td></tr>
              <tr><td>"Write my lab conclusion."</td><td>"Does my conclusion actually connect back to my hypothesis?"</td></tr>
              <tr><td>"Summarize chapter 5 so I don't have to read it."</td><td>"I read chapter 5. Quiz me on it to see what I missed."</td></tr>
            </tbody></table></div>
          <div class="callout tip"><strong>The test question</strong>After using AI, ask yourself: <em>"Could I do this on my own now?"</em> If the answer is no, you used a crutch.</div>`,
        takeaways: [
          "Use AI to question you, quiz you, and give feedback, not to do the work.",
          "Retrieval practice and explaining things back build real understanding.",
          "Ask yourself: could I do this without AI now?",
        ],
      },
      {
        title: "Trust, but Verify",
        minutes: 7,
        activity: "hallucination",
        html: `
          <p>Since AI can hallucinate, every fact, statistic, quote, or citation it gives you is a <em>claim to check</em>, not a truth to copy. Professional fact-checkers use a technique called <strong>lateral reading</strong>: instead of staying on one page and judging it, they open new tabs and see what <em>other</em> reliable sources say.</p>
          <h3>The V.E.R.I.F.Y. workflow</h3>
          <ul>
            <li><strong>V: View it as a draft.</strong> Assume AI output may contain errors.</li>
            <li><strong>E: Extract the claims.</strong> Pick out names, dates, numbers, quotes, and citations.</li>
            <li><strong>R: Read laterally.</strong> Search each claim in a new tab. Look for credible sources: .gov, .edu, established news, academic databases, your school library.</li>
            <li><strong>I: Inspect the citations.</strong> If AI names a book, article, or study, confirm it really exists and really says that. Fake citations are one of the most common hallucinations.</li>
            <li><strong>F: Find two sources.</strong> Important claims should be confirmed by at least two independent, reliable sources.</li>
            <li><strong>Y: Your judgment decides.</strong> You are the author. Keep what's verified, cut what isn't.</li>
          </ul>
          <h3>Red flags</h3>
          <ul>
            <li>Very precise numbers with no source ("73.4% of students…")</li>
            <li>Quotes attributed to famous people that you can't find anywhere else</li>
            <li>Citations with real-sounding authors but titles you can't locate</li>
            <li>Answers that change when you ask the same question again</li>
            <li>Claims about recent events (the model may be past its knowledge cutoff)</li>
          </ul>
          <div class="callout"><strong>Ask the AI, too</strong>Follow-ups like <em>"How confident are you in that?"</em> or <em>"What would make this wrong?"</em> can surface weak spots. But the AI's answer still needs checking. It can be confidently wrong about its own confidence.</div>`,
        takeaways: [
          "Treat AI facts, numbers, and citations as claims to check.",
          "Read laterally: confirm claims with independent, credible sources.",
          "Fake citations are common, so always confirm a source exists.",
        ],
      },
    ],
    quiz: [
      { q: "In the RTCF prompting framework, what does the \"C\" stand for?",
        options: ["Creativity", "Context", "Citation", "Code"],
        answer: 1, explain: "Context tells the AI who you are, what you already know, and what situation you're in." },
      { q: "Which prompt is most likely to help you actually learn the material?",
        options: ["\"Write my answer to question 4.\"", "\"Summarize the chapter so I can skip it.\"", "\"Ask me questions one at a time to help me understand this, and give hints but not answers.\"", "\"Make my essay sound smarter.\""],
        answer: 2, explain: "A Socratic, hints-only approach makes you do the thinking, and that's what builds understanding." },
      { q: "What is \"lateral reading\"?",
        options: ["Reading a page from left to right carefully", "Checking a claim by opening other sources to see what they say", "Asking the AI to re-read its own answer", "Skimming only the headings"],
        answer: 1, explain: "Fact-checkers leave the original source and verify claims across other independent, credible sources." },
      { q: "An AI gives you a citation for a study that sounds perfect for your paper. What should you do first?",
        options: ["Add it to your bibliography right away", "Confirm the study actually exists and says what the AI claims", "Ask the AI if it's sure, and trust its answer", "Use it, but only in a footnote"],
        answer: 1, explain: "AI frequently invents realistic-looking citations. Find the real source before you use it." },
      { q: "Before using AI on a school assignment, what should you check first?",
        options: ["Whether your friends are using it", "Your teacher's or school's AI policy for that assignment", "Which tool has the coolest logo", "Whether the AI can write in your font"],
        answer: 1, explain: "AI policies vary by class and assignment. Always check what's allowed before you start." },
    ],
  },

  /* ======================================================================
     MODULE 3 — ETHICAL AI USE
     ====================================================================== */
  ethics: {
    num: "03",
    title: "Ethical AI Use",
    tagline: "Academic integrity, bias, privacy, and being a responsible citizen in an AI world.",
    outcomes: [
      "Apply the AI-use spectrum and disclose AI use properly",
      "Identify how bias enters AI systems and what to do about it",
      "Protect your own privacy and others' when using AI",
      "Recognize deepfakes and weigh AI's wider impacts on society",
    ],
    lessons: [
      {
        title: "Academic Integrity in the AI Era",
        minutes: 8,
        activity: "dilemmas",
        html: `
          <p><strong>Academic integrity</strong> means being honest about what work is yours. AI doesn't change that principle. It just creates new gray areas. The key question is no longer "Did you use AI?" but <strong>"How did you use it, was it allowed, and did you say so?"</strong></p>
          <h3>The AI-use spectrum</h3>
          <p>Many schools describe AI use as levels. Your teacher decides which level applies to each assignment.</p>
          <div class="table-wrap"><table class="compare-table">
            <thead><tr><th scope="col">Level</th><th scope="col">What it looks like</th></tr></thead>
            <tbody>
              <tr><th scope="row">0 · No AI</th><td>All work is your own. Common for tests, in-class writing, and skill checks.</td></tr>
              <tr><th scope="row">1 · AI for ideas</th><td>Brainstorming topics or getting a concept explained. The writing and work are 100% yours.</td></tr>
              <tr><th scope="row">2 · AI for feedback</th><td>AI critiques your draft or checks grammar. You make every change yourself.</td></tr>
              <tr><th scope="row">3 · AI as collaborator</th><td>AI helps draft or create pieces, and you edit, verify, and clearly disclose it.</td></tr>
              <tr><th scope="row">4 · AI as subject</th><td>The assignment is about using or evaluating AI itself.</td></tr>
            </tbody></table></div>
          <h3>Golden rules</h3>
          <ol>
            <li><strong>Follow the policy for that specific assignment.</strong> If it's unclear, ask before you start, not after.</li>
            <li><strong>Disclose your use.</strong> Say which tool you used, what you used it for, and how you changed the output.</li>
            <li><strong>Never submit AI output as your own words or ideas.</strong> That is plagiarism, even if no human wrote the original.</li>
            <li><strong>You are responsible for everything you submit,</strong> including any AI errors.</li>
          </ol>
          <h3>How to cite AI</h3>
          <p>Style guides now include formats for generative AI. Formats get updated, so check the latest guidance or ask your teacher. Here are common patterns:</p>
          <ul>
            <li><strong>MLA:</strong> <code>"Text of your prompt" prompt. <em>Name of AI Tool</em>, version, Company, Date of use, URL.</code></li>
            <li><strong>APA:</strong> <code>Company. (Year). <em>Name of AI tool</em> (Version) [Large language model]. URL</code>. In your text, describe the prompt you used.</li>
          </ul>
          <div class="callout"><strong>Sample disclosure statement</strong><em>"I used an AI chat assistant to brainstorm three possible thesis statements and to get feedback on my second paragraph's clarity. I chose and rewrote the thesis myself and made all revisions in my own words."</em></div>
          <div class="callout warn"><strong>About AI detectors</strong>Tools that claim to detect AI writing are known to make mistakes, including flagging human writing. That's another reason to save your drafts and notes: your process is your proof.</div>`,
        takeaways: [
          "Integrity = honesty about what's yours. Follow each assignment's AI policy.",
          "Disclose the tool, the purpose, and how you changed the output.",
          "You're responsible for every word you submit, including AI mistakes.",
        ],
      },
      {
        title: "Bias & Fairness",
        minutes: 7,
        html: `
          <p>AI learns from data created by people, and people's data reflects history, including unfairness. When a model absorbs those patterns, it can repeat them at massive scale. This is called <strong>algorithmic bias</strong>.</p>
          <h3>Where bias comes from</h3>
          <ul>
            <li><strong>Unrepresentative data.</strong> If a face-recognition system trains mostly on lighter-skinned faces, it performs worse on darker-skinned faces. Research such as the <em>Gender Shades</em> project found exactly these accuracy gaps in commercial systems.</li>
            <li><strong>Historical bias.</strong> A hiring model trained on a company's past hires can learn to favor whoever was hired before, even if those decisions were unfair.</li>
            <li><strong>Labeling bias.</strong> Humans label training data, and their assumptions get baked in.</li>
            <li><strong>Proxy variables.</strong> Even if a model never sees race or gender, things like ZIP code or name can act as stand-ins.</li>
          </ul>
          <h3>Why it matters</h3>
          <p>AI is increasingly used in decisions that affect people's lives: loans, job screening, medical tools, school software, and policing. A small bias multiplied across millions of decisions becomes a big injustice, and because AI looks objective, it can be harder to notice and challenge.</p>
          <h3>Bias in everyday AI use</h3>
          <p>You might notice bias as a student too: an image generator that always shows "a scientist" or "a CEO" as the same type of person, or a chatbot that defaults to one cultural perspective. When you notice it, you can:</p>
          <ul>
            <li>Ask for diverse perspectives explicitly: <code>Give me viewpoints from at least three different cultural or regional perspectives.</code></li>
            <li>Question the defaults: "Who is missing from this answer?"</li>
            <li>Cross-check with sources written by people with lived experience of the topic.</li>
          </ul>
          <div class="callout tip"><strong>Fairness is a design choice</strong>Developers reduce bias by testing models across different groups, improving datasets, auditing results, and keeping humans in the loop for high-stakes decisions. Asking "fair for whom?" is part of building and using AI responsibly.</div>`,
        takeaways: [
          "AI can learn and amplify unfair patterns that exist in its training data.",
          "Bias comes from data, history, labeling, and proxy variables.",
          "Question defaults and ask for diverse perspectives.",
        ],
      },
      {
        title: "Privacy & Your Data",
        minutes: 6,
        html: `
          <p>Every prompt you type is data. Depending on the service and its settings, conversations may be stored, reviewed by people for safety, or used to improve future models. Smart AI users think before they paste.</p>
          <h3>Never share with an AI tool</h3>
          <ul>
            <li>Passwords, login codes, or account details</li>
            <li>Your full name combined with your address, phone number, school schedule, or birthday</li>
            <li>Private information about <em>other people</em>: friends' messages, classmates' grades, family health details</li>
            <li>Photos of other people without their permission</li>
            <li>Student ID numbers, Social Security numbers, financial information</li>
          </ul>
          <h3>Privacy habits</h3>
          <ol>
            <li><strong>Read the data settings.</strong> Many tools let you turn off chat history or opt out of training.</li>
            <li><strong>Anonymize.</strong> Replace real names with placeholders: "Student A," "my friend."</li>
            <li><strong>Use school-approved tools</strong> when available. Schools often have agreements that protect student data under laws like FERPA and COPPA.</li>
            <li><strong>Check age requirements</strong> in a tool's terms of service.</li>
            <li><strong>Assume permanence.</strong> If you wouldn't post it publicly, don't paste it into an AI.</li>
          </ol>
          <div class="callout warn"><strong>AI and scams</strong>Scammers use AI to write convincing phishing messages and even clone voices from short audio clips. If a message creates urgency ("Send this now!"), verify it through another channel, like calling the person directly.</div>`,
        takeaways: [
          "Prompts are data. They may be stored or reviewed.",
          "Never share passwords, personal identifiers, or other people's private info.",
          "Anonymize, check settings, and prefer school-approved tools.",
        ],
      },
      {
        title: "Deepfakes, Impact & Responsible Citizenship",
        minutes: 7,
        html: `
          <p>Generative AI can create realistic images, audio, and video of things that never happened. These are known as <strong>deepfakes</strong> or synthetic media. They can be used for art and entertainment, but also for misinformation, scams, and harassment.</p>
          <h3>Spotting synthetic media</h3>
          <p>Visual clues (odd hands, warped backgrounds, unnatural blinking, mismatched lighting) are getting harder to see as tools improve. So the most reliable checks are about <strong>context</strong>, not pixels:</p>
          <ul>
            <li><strong>Source:</strong> Who posted it first? Is it a credible outlet?</li>
            <li><strong>Corroboration:</strong> Are trusted news organizations reporting the same thing?</li>
            <li><strong>Emotion check:</strong> Is it designed to make you furious or shocked? That's a reason to slow down.</li>
            <li><strong>Reverse image search</strong> to find where an image first appeared.</li>
            <li><strong>Content credentials:</strong> Some platforms and cameras attach provenance labels showing how media was made.</li>
          </ul>
          <div class="callout warn"><strong>A hard line</strong>Creating or sharing fake sexual or humiliating images of real people is a serious form of harassment. In many places it's illegal, and schools treat it as a severe disciplinary issue. If it happens to you or someone you know, tell a trusted adult and report it.</div>
          <h3>The bigger picture</h3>
          <ul>
            <li><strong>Environment:</strong> Training and running large models uses significant electricity and water for data centers. Use AI when it adds real value.</li>
            <li><strong>Creators' rights:</strong> Many artists and writers are concerned about their work being used to train AI without permission or pay. Courts and lawmakers are still working this out.</li>
            <li><strong>Jobs &amp; skills:</strong> AI will change many careers. The people who thrive will combine AI skills with human strengths like judgment, creativity, communication, and ethics.</li>
            <li><strong>Accessibility:</strong> On the positive side, AI tools like live captions, image descriptions, and translation open doors for many people.</li>
          </ul>
          <h3>Your responsible-AI pledge</h3>
          <p>A responsible AI user is <strong>honest</strong> (discloses use), <strong>skeptical</strong> (verifies claims), <strong>respectful</strong> (protects others' privacy and dignity), <strong>fair</strong> (questions bias), and <strong>thoughtful</strong> (uses AI to grow, not to skip growing).</p>`,
        takeaways: [
          "Check context, source, and corroboration, not just visual glitches.",
          "Never create or share synthetic media that harms real people.",
          "Weigh AI's costs and benefits: environment, creators, jobs, and accessibility.",
        ],
      },
    ],
    quiz: [
      { q: "Your teacher allows AI \"for feedback only\" on an essay. Which use is appropriate?",
        options: ["Having AI write the conclusion", "Asking AI to point out unclear sentences, then fixing them yourself", "Pasting your essay in and asking AI to rewrite it", "Asking AI to write a new intro in your style"],
        answer: 1, explain: "Feedback-only means AI can critique your work, but every change must be made by you." },
      { q: "Which is the best way to disclose AI use on an assignment?",
        options: ["Don't mention it if the work is good", "Write \"AI was used\" at the bottom", "Name the tool, explain what you used it for, and describe how you changed the output", "Only mention it if the teacher asks"],
        answer: 2, explain: "Good disclosure is specific: which tool, for what purpose, and what you did with the result." },
      { q: "A hiring AI was trained on 10 years of a company's past hiring decisions. What is the main fairness risk?",
        options: ["It will be too slow", "It may learn and repeat unfair patterns from past decisions", "It will refuse to hire anyone", "There is no risk because computers are objective"],
        answer: 1, explain: "This is historical bias. The model learns from past decisions, including any unfairness in them." },
      { q: "Which of these is safest to paste into a public AI chatbot?",
        options: ["A screenshot of your friend's private group chat", "Your login code to the school portal", "A paragraph you wrote, with names replaced by \"Student A\"", "Your home address and class schedule"],
        answer: 2, explain: "Anonymized content you wrote yourself is low risk. The others expose personal or other people's private data." },
      { q: "You see a shocking video of a celebrity that's going viral. What's the most reliable first step to check whether it's a deepfake?",
        options: ["Look closely for weird blinking", "Check whether credible news sources are reporting it and find the original source", "Share it and ask your followers", "Assume it's real because it looks realistic"],
        answer: 1, explain: "As fakes get more convincing, context checks like source and corroboration are more reliable than visual clues." },
    ],
  },
};
