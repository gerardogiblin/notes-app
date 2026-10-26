const heroTemplate = document.createElement("template");
heroTemplate.innerHTML = `
<style>
  :host { display:block; }
  * { box-sizing:border-box; }
  .paper { position:relative; display:grid; grid-template-columns:minmax(0,1.15fr) minmax(240px,.85fr); align-items:center; gap:1rem; overflow:hidden; padding:clamp(1.5rem,4vw,3.2rem); border:1px solid #e2d5b1; border-radius:18px; background-color:var(--color-paper,#fffdf7); background-image:linear-gradient(rgba(157,185,227,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(157,185,227,.22) 1px,transparent 1px); background-size:22px 22px; box-shadow:var(--shadow-paper,6px 6px 0 #f6b8c8); }
  .paper:before { content:""; position:absolute; top:0; left:0; right:0; height:17px; background:radial-gradient(circle at 12px 8px,var(--color-bg,#fbefa3) 5px,transparent 5.5px); background-size:28px 17px; opacity:.95; }
  .tape { position:absolute; top:20px; left:25px; width:100px; height:25px; transform:rotate(-13deg); background:repeating-linear-gradient(135deg,#f7a8c5 0 8px,#fbc6d8 8px 16px); opacity:.95; border:1px dashed #e88fb0; }
  h1 { margin:.35rem 0 .8rem; max-width:640px; color:var(--color-accent,#e88fb0); font:600 clamp(2rem,4vw,3.5rem)/1.05 var(--font-display,sans-serif); letter-spacing:-.02em; text-shadow:1px 2px 0 #f6b8c8; }
  p { max-width:590px; margin:0; color:#263d61; font-size:1rem; line-height:1.7; }
  .buttons { display:flex; flex-wrap:wrap; gap:.7rem; margin:1.4rem 0 1rem; }
  .btn { display:inline-flex; align-items:center; justify-content:center; gap:.5rem; padding:.75rem 1.15rem; border:1.5px solid #6f9edb; border-radius:999px; color:#173d70; background:#fffdf7; text-decoration:none; font-weight:800; font-size:.9rem; transition:transform .18s ease,box-shadow .18s ease; }
  .btn.primary { background:var(--color-button,#9db9e3); color:#102f58; }
  .btn:hover { transform:translateY(-2px); box-shadow:0 4px 0 #f6b8c8; }
  .delivery { display:flex; align-items:center; gap:.5rem; color:#345477; font-size:.83rem; font-weight:700; }
  .delivery svg { width:22px; height:22px; stroke:currentColor; fill:none; stroke-width:1.7; }
  .art { position:relative; min-height:245px; display:grid; place-items:center; color:#173d70; }
  .notebook { position:relative; display:grid; place-items:center; width:min(250px,80%); aspect-ratio: .8; border:2px solid #173d70; border-radius:18px 12px 12px 18px; background:#f9c5d8; box-shadow:9px 10px 0 #9db9e3; transform:rotate(-7deg); }
  .notebook:before { content:""; position:absolute; left:12px; top:10px; bottom:10px; width:12px; border-right:2px solid #173d70; background:radial-gradient(circle,#fffdf7 4px,transparent 4.5px) center top/12px 24px repeat-y; }
  .notebook span { max-width:150px; text-align:center; font:600 2rem/1.1 var(--font-display,sans-serif); }
  .book { position:absolute; bottom:8px; right:7%; width:130px; height:34px; border:2px solid #173d70; border-radius:4px; background:#9db9e3; transform:rotate(5deg); box-shadow:0 8px 0 #e88fb0; }
  .pencil { position:absolute; right:4%; bottom:55px; width:12px; height:120px; border:2px solid #173d70; border-radius:7px; background:#f4d56d; transform:rotate(20deg); }
  .pencil:after { content:""; position:absolute; bottom:-10px; left:1px; border-left:4px solid transparent; border-right:4px solid transparent; border-top:10px solid #173d70; }
  .spark { position:absolute; color:#ed9d35; font-size:2rem; }
  .spark.one { top:18%; right:9%; }.spark.two { bottom:18%; left:5%; color:#e88fb0; }
  .plane { position:absolute; top:7%; left:7%; font-size:2.1rem; transform:rotate(-15deg); }
  @media(max-width:639px) { .paper { grid-template-columns:1fr; padding:2.1rem 1.15rem 1.2rem; } .tape { left:18px; width:75px; } h1 { font-size:2.1rem; } p { font-size:.92rem; } .art { min-height:205px; } .notebook { width:150px; } .notebook span { font-size:1.45rem; } .book { width:100px; right:14%; } .pencil { right:12%; height:95px; } .btn { flex:1 1 auto; } }
  @media(prefers-reduced-motion:reduce) { .btn { transition:none; } }
</style>
<section class="paper" aria-labelledby="hero-title">
  <span class="tape" aria-hidden="true"></span>
  <div class="copy">
    <h1 id="hero-title">Notes is your inspiring stationery destination...</h1>
    <p>Modern stationery, creative supplies, planners, and custom printing services designed to support your study sessions, creative projects, and everyday ideas all in one space.</p>
    <div class="buttons">
      <a class="btn" href="#note-form"><span aria-hidden="true">▤</span> Upload &amp; Print</a>
    </div>
  </div>
  <div class="art" aria-label="Ilustrasi buku catatan dan pensil" role="img">
    <span class="plane" aria-hidden="true">➤</span><span class="spark one" aria-hidden="true">✳</span><span class="spark two" aria-hidden="true">〰</span>
    <div class="notebook"><span>Good<br>Ideas</span></div><div class="book"></div><div class="pencil"></div>
  </div>
</section>`;
class HeroSection extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }).append(heroTemplate.content.cloneNode(true)); }
}
customElements.define("hero-section", HeroSection);
