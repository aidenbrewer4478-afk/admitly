export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Patrick+Hand&display=swap');

  :root{
    --ink:#2E2A24;
    --bg:#FAF6EF;
    --panel:#F1EAD9;
    --paper:#FFFFFF;
    --paper-dim:#6F6A5D;
    --coral:#E8735A;
    --coral-dim:#C15A44;
    --sage:#7A9B76;
    --highlight:#F5D98C;
    --muted:#948C7C;
    --line:rgba(46,42,36,0.12);
  }

  *{box-sizing:border-box; margin:0; padding:0;}

  body{
    background:var(--bg);
    color:var(--ink);
    font-family:'Inter',sans-serif;
    line-height:1.55;
  }

  .wrap{max-width:1120px; margin:0 auto; padding:0 28px;}

  /* ---------- NAV ---------- */
  nav{
    display:flex; align-items:center; justify-content:space-between;
    padding:26px 0;
    border-bottom:1px solid var(--line);
  }
  .logo{
    font-family:'Fraunces', serif;
    font-weight:700;
    font-size:26px;
    color:var(--ink);
  }
  .logo span{color:var(--coral);}
  .nav-links{display:flex; gap:10px;}
  .nav-link-btn{
    font-size:13.5px; font-weight:600; color:var(--ink);
    text-decoration:none; padding:9px 16px; border-radius:20px;
    border:1px solid rgba(46,42,36,0.14);
    transition:background-color 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
  }
  .nav-link-btn:hover{background:var(--panel); border-color:rgba(46,42,36,0.24); transform:translateY(-1px);}
  .nav-link-btn:active{transform:translateY(0);}
  .nav-cta{
    background:var(--coral);
    color:#fff;
    font-weight:600;
    font-size:14px;
    padding:10px 22px;
    border-radius:2px;
    text-decoration:none;
    box-shadow:0 3px 10px rgba(232,115,90,0.28);
    transition:transform 0.15s ease, box-shadow 0.15s ease;
  }
  .nav-cta:hover{transform:translateY(-1px); box-shadow:0 5px 14px rgba(232,115,90,0.36);}
  .nav-cta:active{transform:translateY(0);}

  /* ---------- HERO ---------- */
  .hero{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:60px;
    align-items:center;
    padding:90px 0 100px;
  }
  .hero > div:first-child{animation:heroFadeIn 0.6s ease both;}
  .hero .page{animation:heroFadeIn 0.6s ease 0.15s both;}
  .eyebrow{
    font-family:'Inter',sans-serif;
    font-size:13px;
    font-weight:600;
    color:var(--coral-dim);
    letter-spacing:1.5px;
    text-transform:uppercase;
    margin-bottom:20px;
  }
  h1{
    font-family:'Fraunces', serif;
    font-weight:600;
    font-size:56px;
    line-height:1.08;
    color:var(--ink);
    margin-bottom:24px;
  }
  h1 em{
    font-style:italic;
    color:var(--coral);
  }
  .sub{
    font-size:17px;
    color:var(--paper-dim);
    max-width:440px;
    margin-bottom:32px;
  }
  @media (prefers-reduced-motion: reduce){
    *{animation-duration:0.001ms !important; transition-duration:0.001ms !important;}
  }
  @keyframes heroFadeIn{
    from{opacity:0; transform:translateY(10px);}
    to{opacity:1; transform:translateY(0);}
  }
  .btn-primary{
    background:var(--coral);
    color:#fff;
    font-weight:600;
    font-size:15px;
    padding:15px 28px;
    border-radius:2px;
    text-decoration:none;
    display:inline-block;
    margin-right:14px;
    box-shadow:0 3px 10px rgba(232,115,90,0.28);
    transition:transform 0.15s ease, box-shadow 0.15s ease;
  }
  .btn-primary:hover{transform:translateY(-2px); box-shadow:0 6px 18px rgba(232,115,90,0.36);}
  .btn-primary:active{transform:translateY(0); box-shadow:0 2px 6px rgba(232,115,90,0.28);}
  .btn-ghost{
    font-size:14px;
    color:var(--muted);
    text-decoration:none;
    border-bottom:1px solid var(--muted);
    transition:color 0.15s ease, border-color 0.15s ease;
  }
  .btn-ghost:hover{color:var(--ink); border-color:var(--ink);}

  /* ---------- ESSAY MOCKUP (signature element) ---------- */
  .page{
    background:var(--paper);
    color:var(--ink);
    border-radius:6px;
    padding:34px 36px;
    box-shadow:0 20px 50px rgba(46,42,36,0.12);
    font-family:'Fraunces', serif;
    font-size:16.5px;
    line-height:1.85;
    position:relative;
    border:1px solid var(--line);
  }
  .page .struck{
    text-decoration:line-through;
    text-decoration-color:var(--coral-dim);
    color:#a39b89;
  }
  .annotation{
    font-family:'Patrick Hand', cursive;
    color:var(--coral-dim);
    font-size:19px;
    font-weight:400;
    display:inline-block;
    letter-spacing:0.2px;
    opacity:0;
    animation:markIn 0.5s ease-out 1s forwards;
  }
  .insert{
    font-family:'Patrick Hand', cursive;
    color:var(--sage);
    font-size:19px;
    font-weight:400;
    letter-spacing:0.2px;
    opacity:0;
    animation:markIn 0.5s ease-out 1.4s forwards;
  }
  @keyframes markIn{
    0%{opacity:0; transform:translateY(6px);}
    100%{opacity:1; transform:translateY(0);}
  }
  .hl{
    background:var(--highlight);
    padding:1px 3px;
    border-radius:2px;
  }
  .page-tag{
    position:absolute; top:-14px; left:24px;
    background:var(--coral);
    color:#fff;
    font-family:'Inter',sans-serif;
    font-size:11px;
    font-weight:700;
    letter-spacing:1px;
    padding:4px 10px;
    border-radius:2px;
  }
  .page-score{
    position:absolute; top:-22px; right:20px;
    width:64px; height:64px;
  }
  .page-score svg{position:absolute; inset:0; width:100%; height:100%;}
  .page-score-num{
    position:absolute; inset:0; display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    font-family:'Fraunces', serif; font-weight:700; color:var(--ink);
  }
  .page-score-num span{font-size:22px; line-height:1;}
  .page-score-num em{font-style:normal; font-size:8px; color:var(--muted); margin-top:1px;}

  /* ---------- STATS ---------- */
  .stats{
    border-top:1px solid var(--line);
    border-bottom:1px solid var(--line);
    padding:44px 0;
    background:var(--panel);
  }
  .stats-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:24px;
  }
  .stat-num{
    font-family:'Fraunces', serif;
    font-weight:700;
    font-size:44px;
    color:var(--coral);
  }
  .stat-label{
    font-size:14px;
    color:var(--paper-dim);
    margin-top:6px;
    max-width:240px;
  }

  /* ---------- HOW IT WORKS ---------- */
  .section{padding:100px 0;}
  .section-head{max-width:560px; margin-bottom:56px;}
  .section-tag{
    font-size:12px;
    font-weight:600;
    color:var(--coral-dim);
    letter-spacing:1.5px;
    text-transform:uppercase;
    margin-bottom:14px;
  }
  h2{
    font-family:'Fraunces', serif;
    font-weight:600;
    font-size:38px;
    color:var(--ink);
  }
  .steps{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:1px;
    background:var(--line);
    border:1px solid var(--line);
  }
  .step{
    background:var(--bg);
    padding:34px 28px;
  }
  .step-badge{position:relative; width:38px; height:38px; margin-bottom:16px;}
  .step-badge svg{position:absolute; inset:0; width:100%; height:100%;}
  .step-badge span{
    position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
    font-family:'Fraunces', serif; font-weight:700; font-size:16px; color:var(--ink);
  }
  .step h3{font-size:19px; font-weight:600; margin-bottom:10px; color:var(--ink);}
  .step p{font-size:14.5px; color:var(--paper-dim);}

  /* ---------- PRICING ---------- */
  .pricing-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:24px;
  }
  .pricing-card{
    background:var(--panel);
    border:1px solid var(--line);
    border-radius:8px;
    padding:36px;
  }
  .pricing-card.featured{
    background:var(--paper);
    border:2px solid var(--coral);
    position:relative;
  }
  .featured-tag{
    position:absolute; top:-13px; left:32px;
    background:var(--coral); color:#fff;
    font-size:11px; font-weight:700; letter-spacing:0.5px;
    padding:4px 12px; border-radius:20px;
  }
  .price-left h3{
    font-family:'Fraunces', serif;
    font-weight:700;
    font-size:22px;
    margin-bottom:6px;
  }
  .price-tag{
    font-family:'Fraunces', serif;
    font-weight:700;
    font-size:40px;
    color:var(--coral);
    line-height:1;
    margin-bottom:18px;
  }
  .price-tag span{font-size:14px; color:var(--muted); font-family:'Inter',sans-serif; font-weight:500;}
  .price-left ul{list-style:none; margin-bottom:22px;}
  .price-left li{
    font-size:14px;
    color:var(--paper-dim);
    padding:5px 0;
    padding-left:20px;
    position:relative;
  }
  .price-left li::before{
    content:"—";
    color:var(--coral);
    position:absolute; left:0;
  }
  .price-note{font-size:12px; color:var(--muted); margin-top:10px;}
  .btn-block{width:100%; text-align:center;}

  footer{
    border-top:1px solid var(--line);
    padding:40px 0;
    display:flex; justify-content:space-between; align-items:center;
    font-size:13px; color:var(--muted);
  }

  @media(max-width:860px){
    .hero{grid-template-columns:1fr; padding:50px 0 60px;}
    h1{font-size:40px;}
    .stats-grid{grid-template-columns:1fr;}
    .steps{grid-template-columns:1fr;}
    .pricing-card{grid-template-columns:1fr; text-align:center;}
    .nav-links{display:none;}
  }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `

<div class="wrap">
  <nav>
    <div class="logo">Admit<span>ly</span></div>
    <div class="nav-links">
      <a href="#how" class="nav-link-btn">How it works</a>
      <a href="#pricing" class="nav-link-btn">Pricing</a>
    </div>
    <a href="#pricing" class="nav-cta">Try it free</a>
  </nav>

  <div class="hero">
    <div>
      <div class="eyebrow">Built for the Common App essay grind</div>
      <h1>Turn your draft into the essay that <em>gets you in.</em></h1>
      <p class="sub">Paste your essay. Admitly reads it like an admissions officer would — flags the clichés, the vague lines, the openings that sound like everyone else's — and shows you exactly what to write instead.</p>
      <div>
        <a href="#pricing" class="btn-primary">Get your first round free</a>
        <a href="#how" class="btn-ghost">See how it works</a>
      </div>
    </div>

    <div class="page">
      <div class="page-tag">ROUND 2</div>
      <div class="page-score">
        <svg viewBox="0 0 80 80">
          <path d="M40,6 C58,4 74,20 75,40 C76,60 60,75 40,74 C20,73 5,58 6,39 C7,20 22,7 40,6"
                fill="none" stroke="#E8735A" stroke-width="3.5" stroke-linecap="round"/>
        </svg>
        <div class="page-score-num"><span>7</span><em>OUT OF 10</em></div>
      </div>
      <p>
        Ever since I was young, I have always <span class="struck">learned so much from my experiences</span>
        <span class="annotation">↳ too vague — what did you actually learn?</span>
        working on my grandfather's boat. The smell of
        <span class="hl">diesel and low tide</span> still means more to me than any classroom ever could.
        <br><br>
        <span class="insert">^ this is your real opening — start here instead</span>
      </p>
    </div>
  </div>
</div>

<div class="stats">
  <div class="wrap stats-grid">
    <div>
      <div class="stat-num">3.5M+</div>
      <div class="stat-label">students apply to college in the US every year</div>
    </div>
    <div>
      <div class="stat-num">1</div>
      <div class="stat-label">essay most admissions readers actually remember, out of hundreds they read</div>
    </div>
    <div>
      <div class="stat-num">∞</div>
      <div class="stat-label">feedback rounds included — revise until it's actually good</div>
    </div>
  </div>
</div>

<div class="wrap section" id="how">
  <div class="section-head">
    <div class="section-tag">How it works</div>
    <h2>Paste it. See what's actually wrong. Fix it.</h2>
  </div>
  <div class="steps">
    <div class="step">
      <div class="step-badge">
        <svg viewBox="0 0 40 40"><path d="M20,3 C29,2 37,10 37,20 C38,30 30,37 20,37 C10,38 3,29 3,20 C3,10 11,3 20,3" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/></svg>
        <span>1</span>
      </div>
      <h3>Paste your draft</h3>
      <p>Common App essay, a supplemental, or a scholarship essay — any of it. No account setup beyond a Google sign-in.</p>
    </div>
    <div class="step">
      <div class="step-badge">
        <svg viewBox="0 0 40 40"><path d="M20,3 C29,2 37,10 37,20 C38,30 30,37 20,37 C10,38 3,29 3,20 C3,10 11,3 20,3" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/></svg>
        <span>2</span>
      </div>
      <h3>Get reader-level feedback</h3>
      <p>Not "great job!" — specific notes on clichés, vague claims, weak openings, and where the real story is hiding in your draft.</p>
    </div>
    <div class="step">
      <div class="step-badge">
        <svg viewBox="0 0 40 40"><path d="M20,3 C29,2 37,10 37,20 C38,30 30,37 20,37 C10,38 3,29 3,20 C3,10 11,3 20,3" fill="none" stroke="#E8735A" stroke-width="2.5" stroke-linecap="round"/></svg>
        <span>3</span>
      </div>
      <h3>Revise and track every round</h3>
      <p>Every version is saved, so you can watch the essay actually improve instead of guessing if your edits helped.</p>
    </div>
  </div>
</div>

<div class="wrap section" id="pricing">
  <div class="section-head">
    <div class="section-tag">Pricing</div>
    <h2>One plan. Unlimited rounds.</h2>
  </div>
  <div class="pricing-grid">
    <div class="pricing-card">
      <div class="price-left">
        <h3>Free</h3>
        <div class="price-tag">$0</div>
        <ul>
          <li>2 essays reviewed per month</li>
          <li>1 feedback round per essay</li>
          <li>Common App, supplementals, or scholarship essays</li>
          <li>No card required</li>
        </ul>
      </div>
      <a href="#" class="btn-ghost btn-block" style="display:block; padding:13px 0; border:1px solid var(--line); border-radius:2px;">Get started free</a>
    </div>
    <div class="pricing-card featured">
      <div class="featured-tag">MOST POPULAR</div>
      <div class="price-left">
        <h3>Unlimited</h3>
        <div class="price-tag">$12<span>/mo</span></div>
        <ul>
          <li>Unlimited essays and feedback rounds</li>
          <li>Version history for every draft</li>
          <li>Line-level notes, not just a summary</li>
          <li>Cancel anytime</li>
        </ul>
      </div>
      <a href="#" class="btn-primary btn-block">Upgrade to Unlimited</a>
    </div>
  </div>
</div>

<div class="wrap">
  <footer>
    <div>Admit<span style="color:var(--coral);">ly</span> — for the essay that has to sound like you, not everyone else.</div>
    <div><a href="/about" style="color:var(--muted); margin-right:16px;">About</a><a href="/privacy" style="color:var(--muted); margin-right:16px;">Privacy</a><a href="/terms" style="color:var(--muted); margin-right:16px;">Terms</a>hello@admitly.io</div>
  </footer>
</div>

` }} />
    </>
  );
}
