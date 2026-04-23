/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

// ---------- TRANSLATIONS ----------
const I18N = {
  en: {
    // Intro
    metaLeft: 'Strategic Canvas / v.01',
    metaMid: '— Economics × Ethics × Design —',
    metaRight: 'Interactive edition',
    heroA: 'AI Social Contract',
    heroB: 'Canvas',
    sub: ['Eight questions. One quiet hour. A clearer view of what your AI deployment is ', 'actually', " doing to the system around it."],
    howRule: 'How this works',
    step1H: 'Answer, one box at a time',
    step1P: ['Eight prompts, in order. A short paragraph each. Stuck? Tap ', 'Show example', ' — we\'ve pre-filled a worked case you can edit over.'],
    step2H: 'Watch the canvas light up',
    step2P: 'Each answer lights its block in the canvas above. Your progress is saved automatically — close the tab and come back.',
    step3H: 'Read your contract',
    step3P: 'At the end: your filled canvas, plus a synthesis that names the tensions your answers reveal. Print it, export it, share it.',
    ctaBegin: 'Begin the canvas',
    ctaResume: (n) => `Resume — ${n}/8 filled`,
    ctaStartFresh: 'Start fresh',
    footnote: 'Roughly 15–25 minutes. Your answers never leave your browser.',
    // Fill
    section: 'Section',
    backToIntro: '← Intro',
    placeholder: 'Your turn. 2–4 sentences is plenty.',
    showExample: '+ Show example',
    hideExample: '× Hide example',
    words: (n) => `${n} words`,
    back: '← Back',
    next: 'Next →',
    seeCanvas: 'See your canvas →',
    kbdHint: ['', ' + ', ' to continue'],
    // Outcome
    yourContract: 'Your AI Social Contract',
    editAnswers: '← Edit answers',
    startOver: 'Start over',
    printPDF: 'Print / Save PDF',
    completed: 'Completed',
    laidOut: 'Your answers, laid out as a single system.',
    sixLenses: 'The six lenses & the response',
    leftSide: 'Left Side — Value Creation',
    rightSide: 'Right Side — System Impact',
    bottomLayer: 'Bottom Layer — System Consequences',
    finalBlockLabel: (num) => `— IV.   Final Block · Design Response · ${num} —`,
    finalTitleA: 'What you are ',
    finalTitleItal: 'intentionally designing',
    finalTitleB: ' to rebalance the system',
    synthLabel: '— Synthesis · What your answers reveal —',
    regen: '↻ Regenerate',
    reading: 'Reading your canvas…',
    writtenBy: 'Written by you',
    notAnswered: '— not answered —',
    confirmReset: 'Clear all answers and start over?',
    synthFallback: "Couldn't generate a synthesis right now — but your filled canvas above tells the story. Read it top-to-bottom and ask: which of these eight answers would I be least comfortable defending in public?",
    synthPromptLang: 'English',
  },
  it: {
    metaLeft: 'Canvas Strategico / v.01',
    metaMid: '— Economia × Etica × Design —',
    metaRight: 'Edizione interattiva',
    heroA: 'Contratto Sociale AI',
    heroB: 'Canvas',
    sub: ['Otto domande. Un\'ora tranquilla. Una visione più chiara di ciò che il tuo sistema AI sta ', 'realmente', ' facendo al sistema che lo circonda.'],
    howRule: 'Come funziona',
    step1H: 'Rispondi, un riquadro alla volta',
    step1P: ['Otto domande, in ordine. Un breve paragrafo ciascuna. Bloccato? Tocca ', 'Mostra esempio', ' — abbiamo precompilato un caso concreto che puoi modificare.'],
    step2H: 'Guarda il canvas accendersi',
    step2P: 'Ogni risposta illumina il suo riquadro nel canvas qui sopra. I tuoi progressi vengono salvati automaticamente — chiudi la scheda e torna quando vuoi.',
    step3H: 'Leggi il tuo contratto',
    step3P: 'Alla fine: il tuo canvas compilato, più una sintesi che mette in luce le tensioni rivelate dalle tue risposte. Stampalo, esportalo, condividilo.',
    ctaBegin: 'Inizia il canvas',
    ctaResume: (n) => `Riprendi — ${n}/8 compilati`,
    ctaStartFresh: 'Ricomincia',
    footnote: 'Circa 15–25 minuti. Le tue risposte restano nel tuo browser.',
    section: 'Sezione',
    backToIntro: '← Intro',
    placeholder: 'Tocca a te. 2–4 frasi sono sufficienti.',
    showExample: '+ Mostra esempio',
    hideExample: '× Nascondi esempio',
    words: (n) => `${n} parole`,
    back: '← Indietro',
    next: 'Avanti →',
    seeCanvas: 'Vedi il tuo canvas →',
    kbdHint: ['', ' + ', ' per continuare'],
    yourContract: 'Il Tuo Contratto Sociale AI',
    editAnswers: '← Modifica risposte',
    startOver: 'Ricomincia',
    printPDF: 'Stampa / Salva PDF',
    completed: 'Completato',
    laidOut: 'Le tue risposte, disposte come un unico sistema.',
    sixLenses: 'Le sei lenti & la risposta',
    leftSide: 'Lato Sinistro — Creazione di Valore',
    rightSide: 'Lato Destro — Impatto Sistemico',
    bottomLayer: 'Strato Inferiore — Conseguenze Sistemiche',
    finalBlockLabel: (num) => `— IV.   Blocco Finale · Risposta di Design · ${num} —`,
    finalTitleA: 'Cosa stai ',
    finalTitleItal: 'progettando intenzionalmente',
    finalTitleB: ' per riequilibrare il sistema',
    synthLabel: '— Sintesi · Cosa rivelano le tue risposte —',
    regen: '↻ Rigenera',
    reading: 'Sto leggendo il tuo canvas…',
    writtenBy: 'Scritto da te',
    notAnswered: '— non risposto —',
    confirmReset: 'Cancellare tutte le risposte e ricominciare?',
    synthFallback: "Non è possibile generare una sintesi al momento — ma il tuo canvas compilato qui sopra racconta la storia. Leggilo dall'inizio alla fine e chiediti: quale di queste otto risposte avrei più difficoltà a difendere in pubblico?",
    synthPromptLang: 'Italian',
  }
};

// ---------- DATA (content per language) ----------
const BLOCKS_BY_LANG = {
  en: [
    { id: 'value_engine', section: 'I', sectionLabel: 'Value Creation', number: '01', title: 'AI Value Engine', question: 'What value is the AI generating?', hint: 'Cost reduction · speed · scalability · margin expansion.', coach: "Start with the obvious win. What does the AI do faster, cheaper, or at a scale humans couldn't?", example: "The AI handles Tier-1 customer support — billing questions, password resets, order status — around the clock. It answers in seconds, speaks 30 languages, and costs roughly 1/20th of a human agent per ticket. Support capacity effectively becomes elastic.", placement: 'left' },
    { id: 'displacement', section: 'I', sectionLabel: 'Value Creation', number: '02', title: 'Displacement & Shift', question: 'What is being removed, reduced, or transformed?', hint: 'Roles · tasks · skills.', coach: "Be specific about who or what this touches. It's okay if it's uncomfortable — that's the point.", example: "Roughly 60% of Tier-1 support roles are no longer needed. Remaining agents shift to complex escalations, emotional conversations, and quality-reviewing AI transcripts. Entry-level pathways into customer operations start to disappear.", placement: 'left' },
    { id: 'capture', section: 'I', sectionLabel: 'Value Creation', number: '03', title: 'Value Capture', question: 'Who captures the economic value created?', hint: 'Company · shareholders · platforms · customers.', coach: "Follow the money. Margin expansion has to land somewhere — who ends up holding it?", example: "Most of the gain flows upward: higher operating margins for the company, a lift in share price for investors, and a large recurring fee for the AI platform vendor. Customers see modest service improvements but no price cut.", placement: 'left' },
    { id: 'distribution', section: 'II', sectionLabel: 'System Impact', number: '04', title: 'Value Distribution', question: 'How is value redistributed back out?', hint: 'Wages · lower prices · reinvestment · new services.', coach: "Value has to leak back out somewhere for the system to stay healthy. Where does it?", example: "Remaining agents get a modest pay bump for handling harder work. A small portion is reinvested in a new proactive-support product. Prices for end customers stay flat. Displaced workers receive severance but no structured re-entry path.", placement: 'right' },
    { id: 'agency', section: 'II', sectionLabel: 'System Impact', number: '05', title: 'Human Agency Layer', question: 'Where does human decision-making still matter?', hint: 'Where judgment still matters vs. full automation.', coach: "Draw the line. What should a human always touch, and why?", example: "Humans own: refund decisions above a threshold, complaints involving vulnerable customers, escalations that reference legal or safety issues, and weekly review of AI transcripts for tone and accuracy. Everything else runs autonomously.", placement: 'right' },
    { id: 'timegap', section: 'II', sectionLabel: 'System Impact', number: '06', title: 'Time Gap Risk', question: 'Is there a delay between value created and value redistributed?', hint: 'What happens in the gap.', coach: "Efficiency arrives fast. Its benefits usually don't. What happens in that gap?", example: "Layoffs happen in Q1; reinvestment and new roles take 18–24 months to materialize. In between: lost income for ex-agents, eroded institutional knowledge, customer trust dips during the transition, and political/regulatory pressure builds.", placement: 'right' },
    { id: 'systemic', section: 'III', sectionLabel: 'System Consequences', number: '07', title: 'Systemic Risk & Externalities', question: "What are we not accounting for?", hint: 'Skill erosion · dependency · inequality · social tension.', coach: "Zoom out. What costs sit outside the P&L but eventually find their way back onto it?", example: "The industry loses its entry-level training ground, so senior talent pipelines thin out in 5–10 years. Dependency on a single AI vendor grows. Communities with large call-center economies lose a stable employer. Public trust in automated service declines.", placement: 'band' },
    { id: 'design', section: 'IV', sectionLabel: 'Design Response', number: '08', title: 'Design Response', question: 'What are you intentionally designing to rebalance the system?', hint: 'Reskilling · new roles · redistribution mechanisms · governance.', coach: "This is the answer the canvas was built for. What are you choosing — not forced — to do?", example: "Fund a 6-month reskilling program for displaced agents into AI-training and quality roles. Share 15% of AI-driven margin gains as a one-time dividend to affected staff. Publish quarterly transparency reports on automation scope. Keep one human-answered line for vulnerable customers, forever.", placement: 'final' },
  ],
  it: [
    { id: 'value_engine', section: 'I', sectionLabel: 'Creazione di Valore', number: '01', title: 'Motore di Valore dell\'AI', question: 'Quale valore sta generando l\'AI?', hint: 'Riduzione costi · velocità · scalabilità · espansione del margine.', coach: "Parti dal beneficio evidente. Cosa fa l'AI più velocemente, a costi minori, o a una scala impossibile per le persone?", example: "L'AI gestisce il supporto clienti di Livello 1 — domande sulla fatturazione, reset password, stato degli ordini — 24 ore su 24. Risponde in pochi secondi, parla 30 lingue e costa circa 1/20 di un agente umano per ticket. La capacità di supporto diventa di fatto elastica.", placement: 'left' },
    { id: 'displacement', section: 'I', sectionLabel: 'Creazione di Valore', number: '02', title: 'Sostituzione & Trasformazione', question: 'Cosa viene rimosso, ridotto o trasformato?', hint: 'Ruoli · mansioni · competenze.', coach: "Sii specifico su chi o cosa viene toccato. Va bene se è scomodo — è proprio il punto.", example: "Circa il 60% dei ruoli di supporto Livello 1 non è più necessario. Gli agenti rimasti passano alle escalation complesse, alle conversazioni emotive e al controllo qualità delle trascrizioni AI. I percorsi di ingresso nelle operazioni clienti iniziano a scomparire.", placement: 'left' },
    { id: 'capture', section: 'I', sectionLabel: 'Creazione di Valore', number: '03', title: 'Cattura del Valore', question: 'Chi cattura il valore economico creato?', hint: 'Azienda · azionisti · piattaforme · clienti.', coach: "Segui il denaro. L'espansione del margine deve atterrare da qualche parte — chi lo trattiene?", example: "La maggior parte del guadagno fluisce verso l'alto: margini operativi più alti per l'azienda, aumento del valore azionario per gli investitori e una grande fee ricorrente per il fornitore della piattaforma AI. I clienti vedono modesti miglioramenti del servizio ma nessuna riduzione di prezzo.", placement: 'left' },
    { id: 'distribution', section: 'II', sectionLabel: 'Impatto Sistemico', number: '04', title: 'Distribuzione del Valore', question: 'Come viene ridistribuito il valore?', hint: 'Salari · prezzi più bassi · reinvestimento · nuovi servizi.', coach: "Il valore deve rifluire da qualche parte perché il sistema resti sano. Dove va?", example: "Gli agenti rimasti ottengono un modesto aumento salariale per gestire lavori più complessi. Una piccola parte viene reinvestita in un nuovo prodotto di supporto proattivo. I prezzi per i clienti finali restano invariati. I lavoratori sostituiti ricevono un'indennità ma nessun percorso strutturato di reinserimento.", placement: 'right' },
    { id: 'agency', section: 'II', sectionLabel: 'Impatto Sistemico', number: '05', title: 'Livello di Agenzia Umana', question: 'Dove resta necessaria la decisione umana?', hint: 'Dove il giudizio conta ancora vs. automazione totale.', coach: "Traccia una linea. Cosa dovrebbe sempre toccare una persona, e perché?", example: "Gli umani decidono: rimborsi sopra una certa soglia, reclami che coinvolgono clienti vulnerabili, escalation con implicazioni legali o di sicurezza, e revisione settimanale delle trascrizioni AI per tono e accuratezza. Tutto il resto funziona in autonomia.", placement: 'right' },
    { id: 'timegap', section: 'II', sectionLabel: 'Impatto Sistemico', number: '06', title: 'Rischio Ritardo Temporale', question: 'C\'è un ritardo tra creazione e redistribuzione del valore?', hint: 'Cosa succede nel frattempo.', coach: "L'efficienza arriva in fretta. I suoi benefici di solito no. Cosa succede nel mezzo?", example: "I licenziamenti avvengono nel Q1; reinvestimento e nuovi ruoli richiedono 18–24 mesi per concretizzarsi. Nel mezzo: perdita di reddito per gli ex-agenti, erosione della conoscenza aziendale, calo della fiducia dei clienti durante la transizione, e pressione politica/normativa crescente.", placement: 'right' },
    { id: 'systemic', section: 'III', sectionLabel: 'Conseguenze Sistemiche', number: '07', title: 'Rischio Sistemico & Esternalità', question: 'Cosa non stiamo considerando?', hint: 'Erosione competenze · dipendenza · disuguaglianza · tensione sociale.', coach: "Allarga lo sguardo. Quali costi stanno fuori dal bilancio ma prima o poi ci tornano dentro?", example: "Il settore perde il suo terreno di formazione per principianti, quindi le pipeline di talenti senior si assottigliano in 5–10 anni. Cresce la dipendenza da un unico fornitore AI. Le comunità con grandi economie di call-center perdono un datore di lavoro stabile. La fiducia pubblica nei servizi automatizzati cala.", placement: 'band' },
    { id: 'design', section: 'IV', sectionLabel: 'Risposta di Design', number: '08', title: 'Risposta di Design', question: 'Cosa stai progettando intenzionalmente per riequilibrare il sistema?', hint: 'Riqualificazione · nuovi ruoli · meccanismi di redistribuzione · governance.', coach: "Questa è la risposta per cui il canvas è stato costruito. Cosa stai scegliendo — non subendo — di fare?", example: "Finanziare un programma di riqualificazione di 6 mesi per gli agenti sostituiti verso ruoli di AI-training e quality. Condividere il 15% dei guadagni di margine AI come dividendo una tantum al personale coinvolto. Pubblicare report trimestrali di trasparenza sull'ambito dell'automazione. Mantenere per sempre una linea con risposta umana per i clienti vulnerabili.", placement: 'final' },
  ]
};

// ---------- APP ----------
function App() {
  const [lang, setLang] = useState(() => localStorage.getItem('ascc_lang_v1') || 'en');
  const [stage, setStage] = useState('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() => {
    try {
      const raw = localStorage.getItem('ascc_answers_v1');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const [showExample, setShowExample] = useState({});
  const [synthesis, setSynthesis] = useState('');
  const [synthLoading, setSynthLoading] = useState(false);

  const t = I18N[lang];
  const BLOCKS = BLOCKS_BY_LANG[lang];

  useEffect(() => { localStorage.setItem('ascc_answers_v1', JSON.stringify(answers)); }, [answers]);
  useEffect(() => { localStorage.setItem('ascc_lang_v1', lang); }, [lang]);

  useEffect(() => {
    const saved = localStorage.getItem('ascc_stage_v1');
    if (saved) setStage(saved);
    const savedCur = localStorage.getItem('ascc_current_v1');
    if (savedCur) setCurrent(Number(savedCur) || 0);
  }, []);

  useEffect(() => { localStorage.setItem('ascc_stage_v1', stage); }, [stage]);
  useEffect(() => { localStorage.setItem('ascc_current_v1', String(current)); }, [current]);

  const completedCount = BLOCKS.filter(b => (answers[b.id] || '').trim().length > 0).length;

  function updateAnswer(id, v) { setAnswers(a => ({ ...a, [id]: v })); }

  function reset() {
    if (!confirm(t.confirmReset)) return;
    setAnswers({});
    setShowExample({});
    setSynthesis('');
    setCurrent(0);
    setStage('intro');
  }

  async function generateSynthesis() {
    setSynthLoading(true);
    setSynthesis('');
    const prompt = `You are helping someone reflect on an "AI Social Contract Canvas" they just completed. They filled in 8 dimensions about an AI deployment. Write your response in ${t.synthPromptLang}. Write a warm, thoughtful synthesis (around 150-180 words, 2 short paragraphs) that:
1. Names the core tension or trade-off their answers reveal.
2. Highlights one thing that looks well-designed and one thing that looks under-designed.
3. Ends with a single, specific question they should sit with.

Do not use bullet points. Do not restate their answers. Speak directly to them. Warm, clear-eyed, coaching tone — not corporate.

Their canvas:
${BLOCKS.map(b => `[${b.number} ${b.title}] ${b.question}\n  → ${answers[b.id] || '(blank)'}`).join('\n\n')}`;

    try {
      const text = await window.claude.complete(prompt);
      setSynthesis(text);
    } catch (e) {
      setSynthesis(t.synthFallback);
    } finally {
      setSynthLoading(false);
    }
  }

  const langProps = { lang, setLang };

  if (stage === 'intro') {
    return <Intro t={t} langProps={langProps}
                  onStart={() => { setStage('fill'); setCurrent(0); }}
                  hasProgress={completedCount > 0}
                  completedCount={completedCount}
                  onResume={() => setStage('fill')} />;
  }

  if (stage === 'fill') {
    return <Fill
      t={t} langProps={langProps} BLOCKS={BLOCKS}
      current={current} setCurrent={setCurrent}
      answers={answers} updateAnswer={updateAnswer}
      showExample={showExample} setShowExample={setShowExample}
      onFinish={() => { setStage('outcome'); generateSynthesis(); }}
      onBack={() => setStage('intro')}
    />;
  }

  return <Outcome t={t} langProps={langProps} BLOCKS={BLOCKS}
    answers={answers} synthesis={synthesis} synthLoading={synthLoading}
    onEdit={() => setStage('fill')}
    onReset={reset}
    onRegenerate={generateSynthesis}
  />;
}

// ---------- LANG SWITCH ----------
function LangSwitch({ lang, setLang, placement }) {
  return (
    <div className={`lang-switch ${placement || ''}`}>
      <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} aria-label="English">EN</button>
      <span className="lang-sep">·</span>
      <button className={lang === 'it' ? 'on' : ''} onClick={() => setLang('it')} aria-label="Italiano">IT</button>
    </div>
  );
}

// ---------- INTRO ----------
function Intro({ t, langProps, onStart, hasProgress, completedCount, onResume }) {
  return (
    <div className="stage intro-stage">
      <LangSwitch {...langProps} placement="intro-lang" />
      <div className="intro-inner">
        <div className="meta-top">
          <span>{t.metaLeft}</span>
          <span>{t.metaMid}</span>
          <span>{t.metaRight}</span>
        </div>

        <h1 className="hero">{t.heroA} <span className="ital">{t.heroB}</span></h1>
        <p className="sub">{t.sub[0]}<em>{t.sub[1]}</em>{t.sub[2]}</p>

        <div className="intro-rule"><span>{t.howRule}</span></div>

        <div className="steps">
          <div className="step">
            <span className="step-num">01</span>
            <div>
              <h4>{t.step1H}</h4>
              <p>{t.step1P[0]}<em>{t.step1P[1]}</em>{t.step1P[2]}</p>
            </div>
          </div>
          <div className="step">
            <span className="step-num">02</span>
            <div>
              <h4>{t.step2H}</h4>
              <p>{t.step2P}</p>
            </div>
          </div>
          <div className="step">
            <span className="step-num">03</span>
            <div>
              <h4>{t.step3H}</h4>
              <p>{t.step3P}</p>
            </div>
          </div>
        </div>

        <div className="cta-row">
          {hasProgress ? (
            <>
              <button className="btn-primary" onClick={onResume}>{t.ctaResume(completedCount)}</button>
              <button className="btn-ghost" onClick={onStart}>{t.ctaStartFresh}</button>
            </>
          ) : (
            <button className="btn-primary" onClick={onStart}>{t.ctaBegin} <span className="arr">→</span></button>
          )}
        </div>

        <p className="footnote">{t.footnote}</p>
      </div>
    </div>
  );
}

// ---------- FILL ----------
function Fill({ t, langProps, BLOCKS, current, setCurrent, answers, updateAnswer, showExample, setShowExample, onFinish, onBack }) {
  const block = BLOCKS[current];
  const taRef = useRef(null);

  useEffect(() => { taRef.current?.focus(); }, [current]);

  const answer = answers[block.id] || '';
  const canNext = answer.trim().length > 0;
  const isLast = current === BLOCKS.length - 1;

  function next() {
    if (isLast) onFinish();
    else setCurrent(c => Math.min(BLOCKS.length - 1, c + 1));
  }
  function prev() { setCurrent(c => Math.max(0, c - 1)); }

  function toggleExample() {
    setShowExample(s => {
      const isOn = !!s[block.id];
      if (!isOn) {
        if (!answer.trim()) updateAnswer(block.id, block.example);
        return { ...s, [block.id]: true };
      }
      if (answer.trim() === block.example.trim()) updateAnswer(block.id, '');
      return { ...s, [block.id]: false };
    });
  }

  function handleKey(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canNext) {
      e.preventDefault();
      next();
    }
  }

  return (
    <div className="stage fill-stage">
      <MiniCanvas t={t} BLOCKS={BLOCKS} current={current} answers={answers} onJump={(i) => setCurrent(i)} />

      <div className="fill-panel">
        <div className="fill-head">
          <div className="crumb">
            <span className="crumb-num">{t.section} {block.section}</span>
            <span className="crumb-sep">·</span>
            <span className="crumb-label">{block.sectionLabel}</span>
            <span className="crumb-sep">·</span>
            <span className="crumb-progress">{current + 1} / {BLOCKS.length}</span>
          </div>
          <div className="fill-head-right">
            <LangSwitch {...langProps} placement="inline" />
            <button className="btn-tiny-ghost" onClick={onBack}>{t.backToIntro}</button>
          </div>
        </div>

        <div className="q-card" key={block.id + langProps.lang}>
          <div className="q-num">{block.number}</div>
          <h2 className="q-title">{block.title}</h2>
          <p className="q-question">{block.question}</p>
          <p className="q-coach">{block.coach}</p>
          <p className="q-hint">{block.hint}</p>

          <div className="q-input-wrap">
            <textarea
              ref={taRef}
              className={`q-input ${showExample[block.id] ? 'is-example' : ''}`}
              placeholder={t.placeholder}
              value={answer}
              onChange={e => {
                updateAnswer(block.id, e.target.value);
                if (showExample[block.id] && e.target.value !== block.example) {
                  setShowExample(s => ({ ...s, [block.id]: false }));
                }
              }}
              onKeyDown={handleKey}
              rows={6}
            />
            <div className="q-input-foot">
              <button
                className={`ex-toggle ${showExample[block.id] ? 'on' : ''}`}
                onClick={toggleExample}
                type="button"
              >
                {showExample[block.id] ? t.hideExample : t.showExample}
              </button>
              <span className="char-count">{answer.trim().length ? t.words(answer.trim().split(/\s+/).length) : ''}</span>
            </div>
          </div>
        </div>

        <div className="fill-nav">
          <button className="btn-ghost" onClick={prev} disabled={current === 0}>{t.back}</button>
          <div className="dots">
            {BLOCKS.map((b, i) => (
              <button
                key={b.id}
                className={`dot ${i === current ? 'active' : ''} ${(answers[b.id] || '').trim() ? 'filled' : ''}`}
                onClick={() => setCurrent(i)}
                title={`${b.number} ${b.title}`}
              />
            ))}
          </div>
          <button className="btn-primary" onClick={next} disabled={!canNext}>
            {isLast ? t.seeCanvas : t.next}
          </button>
        </div>

        <p className="kbd-hint">{t.kbdHint[0]}<kbd>⌘</kbd>{t.kbdHint[1]}<kbd>↵</kbd>{t.kbdHint[2]}</p>
      </div>
    </div>
  );
}

// ---------- MINI CANVAS ----------
function MiniCanvas({ t, BLOCKS, current, answers, onJump }) {
  const left = BLOCKS.filter(b => b.placement === 'left');
  const right = BLOCKS.filter(b => b.placement === 'right');
  const band = BLOCKS.find(b => b.placement === 'band');
  const final = BLOCKS.find(b => b.placement === 'final');

  const status = (b) => {
    const i = BLOCKS.indexOf(b);
    if (i === current) return 'active';
    if ((answers[b.id] || '').trim()) return 'done';
    return 'idle';
  };

  const litCount = BLOCKS.filter(b => (answers[b.id]||'').trim()).length;

  return (
    <div className="mini-canvas">
      <div className="mc-header">
        <span className="mc-title">{t.heroA} {t.heroB}</span>
        <span className="mc-count">{litCount} / 8</span>
      </div>
      <div className="mc-grid">
        <div className="mc-col">
          <div className="mc-col-label"><span className="mc-i">I.</span> {t.leftSide.split('—')[1]?.trim() || t.leftSide}</div>
          {left.map(b => <MCBlock key={b.id} b={b} status={status(b)} onClick={() => onJump(BLOCKS.indexOf(b))} />)}
        </div>
        <div className="mc-col">
          <div className="mc-col-label"><span className="mc-i">II.</span> {t.rightSide.split('—')[1]?.trim() || t.rightSide}</div>
          {right.map(b => <MCBlock key={b.id} b={b} status={status(b)} onClick={() => onJump(BLOCKS.indexOf(b))} />)}
        </div>
      </div>
      <div className="mc-band"><MCBlock b={band} status={status(band)} onClick={() => onJump(BLOCKS.indexOf(band))} wide /></div>
      <div className="mc-final"><MCBlock b={final} status={status(final)} onClick={() => onJump(BLOCKS.indexOf(final))} wide dark /></div>
    </div>
  );
}

function MCBlock({ b, status, onClick, wide, dark }) {
  return (
    <button
      className={`mc-block ${status} ${wide ? 'wide' : ''} ${dark ? 'dark' : ''}`}
      onClick={onClick}
    >
      <span className="mc-num">{b.number}</span>
      <span className="mc-title-small">{b.title}</span>
      {status === 'done' && <span className="mc-check">✓</span>}
      {status === 'active' && <span className="mc-dot" />}
    </button>
  );
}

// ---------- OUTCOME ----------
function Outcome({ t, langProps, BLOCKS, answers, synthesis, synthLoading, onEdit, onReset, onRegenerate }) {
  function downloadPDF() { window.print(); }

  return (
    <div className="stage outcome-stage">
      <div className="outcome-toolbar no-print">
        <div className="tb-left">
          <span className="tb-crumb">{t.yourContract}</span>
        </div>
        <div className="tb-right">
          <LangSwitch {...langProps} placement="inline" />
          <button className="btn-ghost" onClick={onEdit}>{t.editAnswers}</button>
          <button className="btn-ghost" onClick={onReset}>{t.startOver}</button>
          <button className="btn-primary" onClick={downloadPDF}>{t.printPDF}</button>
        </div>
      </div>

      <FilledCanvas t={t} BLOCKS={BLOCKS} answers={answers} />

      <section className="synthesis no-print-border">
        <div className="synth-head">
          <span className="synth-label">{t.synthLabel}</span>
          {!synthLoading && synthesis && (
            <button className="btn-tiny-ghost no-print" onClick={onRegenerate}>{t.regen}</button>
          )}
        </div>
        {synthLoading ? (
          <div className="synth-loading">
            <span className="pulse" />
            <span>{t.reading}</span>
          </div>
        ) : (
          <p className="synth-body">{synthesis}</p>
        )}
      </section>

      <footer className="out-footer">
        <span>{t.heroA} {t.heroB}</span>
        <span>{t.writtenBy} · {new Date().toLocaleDateString(langProps.lang === 'it' ? 'it-IT' : undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </footer>
    </div>
  );
}

// ---------- FILLED CANVAS ----------
function FilledCanvas({ t, BLOCKS, answers }) {
  const left = BLOCKS.filter(b => b.placement === 'left');
  const right = BLOCKS.filter(b => b.placement === 'right');
  const band = BLOCKS.find(b => b.placement === 'band');
  const final = BLOCKS.find(b => b.placement === 'final');

  const A = (b) => (answers[b.id] || '').trim() || <em className="empty">{t.notAnswered}</em>;

  return (
    <div className="filled-canvas">
      <header className="fc-header">
        <div className="meta-top">
          <span>{t.metaLeft}</span>
          <span>{t.metaMid}</span>
          <span>{t.completed}</span>
        </div>
        <h1>{t.heroA} <span className="ital">{t.heroB}</span></h1>
        <p className="subtitle">{t.laidOut}</p>
        <div className="header-rule">{t.sixLenses}</div>
      </header>

      <section className="two-sides">
        <div className="blocks">
          <div className="side-label">
            <span className="num">I.</span>
            <span className="pill">{t.leftSide}</span>
          </div>
          {left.map(b => (
            <div className="block filled" key={b.id}>
              <span className="block-number">{b.number}</span>
              <h3 className="block-title">{b.title}</h3>
              <p className="block-question">{b.question}</p>
              <p className="block-answer">{A(b)}</p>
            </div>
          ))}
        </div>
        <div className="blocks">
          <div className="side-label">
            <span className="num">II.</span>
            <span className="pill">{t.rightSide}</span>
          </div>
          {right.map(b => (
            <div className="block filled" key={b.id}>
              <span className="block-number">{b.number}</span>
              <h3 className="block-title">{b.title}</h3>
              <p className="block-question">{b.question}</p>
              <p className="block-answer">{A(b)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="band filled">
        <div className="band-header">
          <span className="band-label"><span className="num">III.</span> &nbsp;{t.bottomLayer}</span>
          <span className="block-number-band">{band.number}</span>
        </div>
        <h2 className="band-title">{band.title}</h2>
        <p className="band-question">{band.question}</p>
        <p className="band-answer">{A(band)}</p>
      </section>

      <section className="final filled">
        <div className="final-label">{t.finalBlockLabel(final.number)}</div>
        <h2 className="final-title">{t.finalTitleA}<span className="ital">{t.finalTitleItal}</span>{t.finalTitleB}</h2>
        <p className="final-answer">{A(final)}</p>
      </section>
    </div>
  );
}

// ---------- MOUNT ----------
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
