import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// ─── Design tokens ────────────────────────────────────────────────────────────
// Navy: #1B2A5C  |  Accent: #6C63FF  |  Muted: #7A8299
// ─────────────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --navy:   #F7F8FF;
    --navy2:  #2E3F7F;
    --accent: #1d3f89e2; //#6C63FF
    --accent2: #93b3ff;
    --surf:   #060608; //  #F7F8FF
    --dark:   #0D1424;
    --muted:  #7A8299;
    --black:  #060608;
    --green:  #22C55E;
    --yellow: #EAB308;
    --red:    #EF4444;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'Inter', sans-serif;
    background: var(--navy);
    color: var(--white);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* NAV */
  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 60px;
    background: rgba(99, 156, 255, 0.29);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .lp-nav-logo {
    font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
    color: black; display: flex; align-items: center; gap: 10px;
    text-decoration: none;
  }
  .lp-nav-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--accent);
    animation: lp-pulse 2s ease-in-out infinite;
  }
  @keyframes lp-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(110, 138, 208, 0.6); }
    50%       { box-shadow: 0 0 0 6px rgba(108,99,255,0); }
  }
  .lp-nav-links {
    display: flex; align-items: center; gap: 36px; list-style: none;
  }
  .lp-nav-links a {
    font-size: 14px; font-weight: 500;
    color: rgba(7, 7, 7, 0.65); text-decoration: none; transition: color 0.2s;
  }
  .lp-nav-links a:hover { color: var(--white); }
  .lp-nav-cta {
    background: var(--accent) !important;
    color: white !important;
    padding: 9px 22px !important;
    border-radius: 8px !important;
    font-weight: 600 !important;
  }
  .lp-nav-cta:hover { background: #628efd !important; }

  /* HERO */
  .lp-hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 120px 60px 80px;
    position: relative; overflow: hidden;
  }
  .lp-blob {
    position: absolute; border-radius: 50%;
    filter: blur(120px); pointer-events: none;
  }
  .lp-blob-1 {
    width: 600px; height: 600px;
    background: rgba(77, 120, 184, 0.23);
    top: -100px; right: -100px;
  }
  .lp-blob-2 {
    width: 400px; height: 400px;
    background: rgba(34, 116, 197, 0.16);
    bottom: 0; left: 200px;
  }
  .lp-hero-inner {
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; gap: 80px;
    max-width: 1200px; margin: 0 auto; width: 100%;
    position: relative; z-index: 2;
  }
  .lp-eyebrow {
    font-size: 12px; font-weight: 600; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent2); margin-bottom: 20px;
  }
  .lp-hero-title {
    font-size: clamp(38px, 5vw, 60px);
    font-weight: 900; line-height: 1.05;
    letter-spacing: -2px; color: var(--white); margin-bottom: 24px;
  }
  .lp-hero-title .lp-accent { color: var(--accent); }
  .lp-hero-body {
    font-size: 17px; line-height: 1.7;
    color: rgba(0,0,0,0.6); //rgba(255,255,255,0.6)
    max-width: 460px; margin-bottom: 40px;
  }
  .lp-actions { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }

  .lp-btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--accent); color: var(--navy);
    padding: 16px 32px; border-radius: 10px;
    font-size: 15px; font-weight: 700;
    border: none; cursor: pointer; text-decoration: none;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 8px 32px rgba(99, 133, 255, 0.35); //rgba(108,99,255,0.35)
  }
  .lp-btn-primary:hover {
    background: #628efd; transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(99, 148, 255, 0.5);
  }
  .lp-btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    color: rgba(0,0,0,0.7); //rgba(255,255,255,0.7)
    padding: 16px 24px; border-radius: 10px;
    font-size: 15px; font-weight: 500;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer; background: transparent; text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .lp-btn-ghost:hover { border-color: rgba(255,255,255,0.3); color: var(--white); }

  .lp-stats {
    display: flex; gap: 36px; margin-top: 52px;
    padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.08);
  }
  .lp-stat-num {
    font-size: 28px; font-weight: 800; color: var(--white); letter-spacing: -1px;
  }
  .lp-stat-label {
    font-size: 12px; color: var(--muted); font-weight: 500; margin-top: 2px;
  }

  /* GAUGE CARD */
  .lp-gauge-card {
    background: rgba(130, 178, 246, 0.15);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 24px; padding: 44px 40px;
    display: flex; flex-direction: column; align-items: center;
    backdrop-filter: blur(8px);
    position: relative; overflow: hidden;
  }
  .lp-gauge-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(108,99,255,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .lp-gauge-label {
    font-size: 13px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--muted); margin-bottom: 32px;
  }
  .lp-gauge-wrap { position: relative; width: 240px; height: 140px; }
  .lp-gauge-svg { width: 240px; height: 140px; overflow: visible; }
  .lp-needle {
    transform-origin: 120px 100px;
    transition: transform 1.6s cubic-bezier(0.34, 1.2, 0.64, 1);
  }
  .lp-gauge-score-wrap {
    position: absolute; bottom: 0; left: 50%;
    transform: translateX(-50%); text-align: center;
  }
  .lp-gauge-score {
    font-size: 36px; font-weight: 900; letter-spacing: -2px; color: var(--white); opacity: 1.0, ;
    margin-bottom: 30px;
    text-shadow: 0px 0px 10px rgba(20, 46, 92, 0.6);
  }
  .lp-gauge-band {
    font-size: 12px; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
    margin-top: 4px; display: inline-block;

  }
  .lp-band-low    { background: rgba(34,197,94,0.15);  color: var(--green); }
  .lp-band-medium { background: rgba(234,179,8,0.15);  color: var(--yellow); }
  .lp-band-high   { background: rgba(239,68,68,0.15);  color: var(--red); }

  .lp-bars { display: flex; flex-direction: column; gap: 14px; width: 100%; margin-top: 32px; }
  .lp-bar-row { display: flex; align-items: center; gap: 12px; }
  .lp-bar-label { font-size: 12px; color: var(--muted); width: 110px; flex-shrink: 0; }
  .lp-bar-track {
    flex: 1; height: 5px; border-radius: 3px;
    background: rgba(255,255,255,0.06); overflow: hidden;
  }
  .lp-bar-fill { height: 100%; border-radius: 3px; transition: width 1.8s cubic-bezier(0.22, 1, 0.36, 1); }
  .lp-bar-val { font-size: 12px; font-weight: 600; color: var(--white); width: 36px; text-align: right; flex-shrink: 0; }

  .lp-gauge-btn {
    margin-top: 28px; width: 100%;
    background: var(--accent); color: var(--navy);
    padding: 14px; border-radius: 10px;
    font-size: 14px; font-weight: 700;
    border: none; cursor: pointer; text-align: center;
    transition: background 0.2s, transform 0.15s; text-decoration: none; display: block;
  }
  .lp-gauge-btn:hover { background: #4f87ff; transform: translateY(-1px); }

  /* HOW IT WORKS */
  .lp-how-bg { background: rgb(255, 255, 255); }
  .lp-section {
    padding: 100px 60px; max-width: 1200px; margin: 0 auto;
  }
  .lp-section-eyebrow {
    font-size: 12px; font-weight: 600; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent2);
    margin-bottom: 14px; text-align: center;
  }
  .lp-section-title {
    font-size: clamp(28px, 4vw, 44px); font-weight: 800;
    letter-spacing: -1.5px; text-align: center;
    margin-bottom: 60px; color: var(--white);
  }
  .lp-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
  .lp-step-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; padding: 36px 32px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .lp-step-card:hover { border-color: rgba(99, 151, 255, 0.3); transform: translateY(-3px); }
  .lp-step-icon {
    width: 48px; height: 48px; border-radius: 12px;
    background: rgba(118, 158, 253, 0.26);
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px; font-size: 22px;
  }
  .lp-step-title { font-size: 17px; font-weight: 700; color: var(--white); margin-bottom: 10px; }
  .lp-step-body { font-size: 14px; line-height: 1.7; color: rgba(6, 6, 6, 0.5); }

  /* MISSION */
  .lp-mission-band {
    background: rgba(99, 156, 255, 0.2);
    border-top: 1px solid rgba(99, 143, 255, 0.15);
    border-bottom: 1px solid rgba(108,99,255,0.15);
    padding: 80px 60px;
  }
  .lp-mission-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;
  }
  .lp-mission-title {
    font-size: clamp(26px, 3.5vw, 40px); font-weight: 800;
    letter-spacing: -1.5px; color: var(--white); margin-bottom: 20px;
  }
  .lp-mission-body { font-size: 16px; line-height: 1.8; color: rgb(0, 0, 0); }
  .lp-pillars { display: flex; flex-direction: column; gap: 20px; }
  .lp-pillar {
    display: flex; align-items: flex-start; gap: 16px;
    padding: 22px 24px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
  }
  .lp-pillar-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }
  .lp-pillar-title { font-size: 14px; font-weight: 700; color: var(--white); margin-bottom: 4px; }
  .lp-pillar-body { font-size: 13px; color: rgb(0, 0, 0); line-height: 1.6; }

  /* FOOTER CTA */
  .lp-footer-cta {
    padding: 100px 60px; text-align: center;
    position: relative; overflow: hidden;
  }
  .lp-footer-blob {
    position: absolute; width: 500px; height: 500px;
    background: rgba(99, 161, 255, 0.24); border-radius: 50%;
    filter: blur(100px);
    top: 50%; left: 50%; transform: translate(-50%, -50%);
    pointer-events: none;
  }
  .lp-footer-cta-title {
    font-size: clamp(28px, 4vw, 52px); font-weight: 900;
    letter-spacing: -2px; color: var(--white);
    margin-bottom: 16px; position: relative; z-index: 2;
  }
  .lp-footer-cta-sub {
    font-size: 17px; color: rgb(0, 0, 0);
    margin-bottom: 40px; position: relative; z-index: 2;
  }
  .lp-footer-cta .lp-btn-primary { position: relative; z-index: 2; }

  .lp-footer {
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 28px 60px;
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px; color: var(--muted);
  }
  .lp-footer-logo { font-weight: 700; color: white; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .lp-nav { padding: 16px 24px; }
    .lp-nav-links { display: none; }
    .lp-hero { padding: 100px 24px 60px; }
    .lp-hero-inner { grid-template-columns: 1fr; gap: 48px; }
    .lp-stats { flex-wrap: wrap; gap: 24px; }
    .lp-steps { grid-template-columns: 1fr; }
    .lp-mission-inner { grid-template-columns: 1fr; gap: 40px; }
    .lp-section, .lp-mission-band, .lp-footer-cta { padding-left: 24px; padding-right: 24px; }
    .lp-footer { flex-direction: column; gap: 12px; text-align: center; }
  }
`

// ─── SVG arc helper ───────────────────────────────────────────────────────────
function polar(cx, cy, r, deg) {
  const rad = ((deg - 180) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}
function arc(cx, cy, r, a1, a2) {
  const s = polar(cx, cy, r, a1)
  const e = polar(cx, cy, r, a2)
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 1 ${e.x} ${e.y}`
}

// ─── Animated gauge ───────────────────────────────────────────────────────────
function RiskGauge({ score = 32 }) {
  const navigate = useNavigate()
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600)
    return () => clearTimeout(t)
  }, [])

  const needleDeg = -90 + (score / 100) * 180
  const band = score < 35 ? 'low' : score < 65 ? 'medium' : 'high'
  const bandLabel = score < 35 ? 'Low Risk' : score < 65 ? 'Medium Risk' : 'High Risk'

  const bars = [
    { label: 'Credit History', val: 78, color: '#638aff' },
    { label: 'Income Ratio',   val: 55, color: '#93c0ff' },
    { label: 'Loan Amount',    val: 40, color: '#6392ff' },
    { label: 'Employment',     val: 88, color: '#2266c5' },
  ]

  return (
    <div className="lp-gauge-card">
      <p className="lp-gauge-label">Risk Assessment Preview</p>

      <div className="lp-gauge-wrap">
        <svg className="lp-gauge-svg" viewBox="0 0 240 140">
          <path d={arc(120,100,100,0,180)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" strokeLinecap="round"/>
          <path d={arc(120,100,100,0,63)}  fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="round" opacity="0.7"/>
          <path d={arc(120,100,100,63,117)} fill="none" stroke="#EAB308" strokeWidth="14" strokeLinecap="round" opacity="0.7"/>
          <path d={arc(120,100,100,117,180)} fill="none" stroke="#EF4444" strokeWidth="14" strokeLinecap="round" opacity="0.7"/>
          <g className="lp-needle" style={{ transform: `rotate(${animated ? needleDeg : -90}deg)` }}>
            <line x1="120" y1="100" x2="120" y2="8" stroke="#adc5fc" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="120" cy="100" r="7" fill="#adc5fc" opacity="0.9"/>
            <circle cx="120" cy="100" r="3.5" fill="#FFFF"/>
          </g>
        </svg>
        <div className="lp-gauge-score-wrap">
          <div className="lp-gauge-score">{score}</div>
          <div className={`lp-gauge-band lp-band-${band}`}>{bandLabel}</div>
        </div>
      </div>

      <div className="lp-bars">
        {bars.map((b) => (
          <div className="lp-bar-row" key={b.label}>
            <span className="lp-bar-label">{b.label}</span>
            <div className="lp-bar-track">
              <div className="lp-bar-fill" style={{ width: animated ? `${b.val}%` : '0%', background: b.color }}/>
            </div>
            <span className="lp-bar-val">{b.val}%</span>
          </div>
        ))}
      </div>

      <button className="lp-gauge-btn" onClick={() => navigate('/predict')}>
        Run Your Prediction →
      </button>
    </div>
  )
}

// ─── Landing page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()

  const pillars = [
    { icon: '✴︎', title: 'Accuracy First',   body: 'Trained on real-world Home Credit data with rigorous cross-validation to keep false-positive rates low.' },
    { icon: '✴︎', title: 'Explainability',   body: 'Every prediction surfaces the top contributing features so loan officers understand the reasoning, not just the number.' },
    { icon: '✴︎', title: 'Fast Decisions',   body: 'Sub-second inference time means applicants get answers quickly, improving the customer experience end to end.' },
  ]

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className="lp-nav">
        <Link to="/" className="lp-nav-logo">
          <div className="lp-nav-dot" />
          CMPT 310 - Group 10
        </Link>
        <ul className="lp-nav-links">
          <li><a href="#mission">Mission</a></li>
          <li><a href="#how">How it works</a></li>
          <li>
            <button
              className="lp-btn-primary lp-nav-cta"
              style={{ padding: '9px 22px', fontSize: '14px' }}
              onClick={() => navigate('/predict')}
            >
              Predict Now
            </button>
          </li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-hero-inner">
          <div>
            <p className="lp-eyebrow">Powered by Machine Learning</p>
            <h1 className="lp-hero-title">
              Default Risk<br />
              <span className="lp-accent">Predictor</span>
            </h1>
            <p className="lp-hero-body">
              Assess loan default risk in seconds. Our model analyzes credit
              history, income ratios, and employment data to surface a clear
              risk score — so lenders can make faster, fairer decisions.
            </p>
            <div className="lp-actions">
              <button className="lp-btn-primary" onClick={() => navigate('/predict')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Predict Now
              </button>
              <a href="#how" className="lp-btn-ghost">Learn how it works</a>
            </div>
            <div className="lp-stats">
              <div>
                <div className="lp-stat-num">##.#%</div>
                <div className="lp-stat-label">Model Accuracy</div>
              </div>
              <div>
                <div className="lp-stat-num">##.#K+</div>
                <div className="lp-stat-label">Training Records</div>
              </div>
              <div>
                <div className="lp-stat-num">&lt; 1s</div>
                <div className="lp-stat-label">Prediction Time</div>
              </div>
            </div>
          </div>

          <RiskGauge score={32} />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div id="how" className="glp-how-b">
        <div className="lp-section">
          <p className="lp-section-eyebrow">How it works</p>
          <h2 className="lp-section-title">Three steps to a risk score</h2>
          <div className="lp-steps">
            {[
              { icon: '📋', title: 'Enter Applicant Data',  body: 'Fill in the loan application form with credit history, income, employment status, loan amount, and other key financial signals.' },
              { icon: '⚙️', title: 'Model Runs Analysis',   body: 'Our trained gradient-boosted classifier processes the inputs against patterns learned from 300 000+ real Home Credit applications.' },
              { icon: '📊', title: 'Get a Risk Score',      body: 'Receive an instant APPROVE or DENY decision with a clear breakdown of the factors that drove the outcome.' },
            ].map((s) => (
              <div className="lp-step-card" key={s.title}>
                <div className="lp-step-icon">{s.icon}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MISSION */}
      <div id="mission" className="lp-mission-band">
        <div className="lp-mission-inner">
          <div>
            <h2 className="lp-mission-title">Our Mission</h2>
            <p className="lp-mission-body">
              To minimize the cost of bad lending decisions — for lenders and
              for borrowers. Traditional credit scoring leaves many creditworthy
              people underserved and many risky loans approved. We built a
              model that looks at the full picture.
            </p>
          </div>
          <div className="lp-pillars">
            {pillars.map((p) => (
              <div className="lp-pillar" key={p.title}>
                <div className="lp-pillar-icon">{p.icon}</div>
                <div>
                  <div className="lp-pillar-title">{p.title}</div>
                  <div className="lp-pillar-body">{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER CTA */}
      <section className="lp-footer-cta">
        <div className="lp-footer-blob" />
        <h2 className="lp-footer-cta-title">Ready to assess risk?</h2>
        <p className="lp-footer-cta-sub">
          Open the predictor and run your first application in under a minute.
        </p>
        <button className="lp-btn-primary" onClick={() => navigate('/predict')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Predict Now
        </button>
      </section>

      <footer className="lp-footer">
        <div className="lp-footer-logo">PREDICT</div>
        <div>Home Credit Default Risk · Built with React + FastAPI</div>
      </footer>
    </>
  )
}
