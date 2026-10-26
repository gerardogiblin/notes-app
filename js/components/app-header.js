const headerTemplate = document.createElement("template");
headerTemplate.innerHTML = `
<style>
  :host { display:block; background:var(--color-paper, #fffdf7); border-bottom:1px solid rgba(23,61,112,.13); }
  * { box-sizing:border-box; }
  .bar { display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:1rem; width:min(1280px, calc(100% - 2rem)); min-height:76px; margin:auto; }
  .social, .actions { display:flex; align-items:center; gap:.55rem; }
  .actions { justify-content:flex-end; }
  .icon-btn { width:38px; height:38px; display:grid; place-items:center; border:0; border-radius:50%; background:transparent; color:var(--color-blue-deep,#173d70); }
  .icon-btn:hover { background:#fce4ed; }
  svg { width:20px; height:20px; stroke:currentColor; fill:none; stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  .logo { font:700 clamp(2rem, 4vw, 2.8rem)/1 var(--font-display, sans-serif); letter-spacing:.02em; color:var(--color-accent,#e88fb0); text-shadow:1px 2px 0 #f6b8c8; text-decoration:none; }
  .logo-wrap { display:flex; align-items:center; gap:.3rem; }
  .spark { color:var(--color-accent,#e88fb0); font-size:1.4rem; }
  @media(max-width:639px) { .bar { min-height:62px; width:calc(100% - 1rem); gap:.3rem; } .social { display:none; } .bar { grid-template-columns:auto 1fr auto; } .logo { font-size:2rem; } .actions { gap:0; } .icon-btn { width:32px; height:32px; } .actions .user { display:none; } }
</style>
<header class="bar">
  <div class="social" aria-label="Social media">
  </div>
  <a class="logo-wrap" href="#top" aria-label="Notes home"><span class="spark" aria-hidden="true">〰</span><span class="logo">Notes</span><span class="spark" aria-hidden="true">✳</span></a>
  <div class="actions">
    <button class="icon-btn user" type="button" aria-label="Account (demo)" title="Account"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg></button>
  </div>
</header>`;
class AppHeader extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }).append(headerTemplate.content.cloneNode(true)); }
}
customElements.define("app-header", AppHeader);
