const navbarTemplate = document.createElement("template");
navbarTemplate.innerHTML = `
<style>
  :host { display:block; position:relative; z-index:5; background:var(--color-nav,#bdd3ee); box-shadow:0 2px 0 rgba(23,61,112,.08); }
  * { box-sizing:border-box; }
  .nav-wrap { display:grid; grid-template-columns:minmax(0,1fr) minmax(220px,300px); gap:1.25rem; align-items:center; width:min(1280px,calc(100% - 2rem)); margin:auto; min-height:48px; }
  nav { display:flex; align-items:stretch; gap:clamp(.5rem,1.6vw,1.4rem); min-width:0; }
  a, button { font:700 .88rem var(--font-body,sans-serif); color:#173d70; text-decoration:none; border:0; background:transparent; }
  .nav-link { display:flex; align-items:center; gap:.3rem; padding:.85rem 0; border-bottom:3px solid transparent; white-space:nowrap; }
  .nav-link.active { border-color:var(--color-accent,#e88fb0); }
  .nav-link:hover { color:#a43d68; }
  .dropdown { position:relative; display:flex; }
  .menu { display:none; position:absolute; top:100%; left:-.75rem; min-width:190px; padding:.45rem; border:1px solid #c8d9ee; border-radius:12px; background:#fffdf7; box-shadow:0 8px 24px #173d7020; }
  .dropdown.open .menu { display:grid; }
  .menu button { text-align:left; padding:.65rem .7rem; border-radius:8px; font-weight:700; }
  .menu button:hover, .menu button:focus-visible { background:#eaf2ff; }
  .search { display:flex; align-items:center; gap:.5rem; padding:.55rem .75rem; border:1px solid #94b6e5; border-radius:999px; background:#fffdf7; color:#173d70; }
  .search svg { width:17px; height:17px; flex:none; stroke:currentColor; fill:none; stroke-width:2; }
  input { width:100%; min-width:0; border:0; outline:0; background:transparent; color:#173d70; font:600 .8rem var(--font-body,sans-serif); }
  input::placeholder { color:#6b83a5; }
  .hamburger { display:none; align-items:center; gap:.5rem; padding:.55rem .7rem; border-radius:8px; }
  .hamburger svg { width:21px; height:21px; stroke:currentColor; fill:none; stroke-width:2; }
  @media(max-width:1023px) {
    .nav-wrap { grid-template-columns:auto minmax(150px,1fr); gap:.5rem; width:calc(100% - 1rem); }
    .hamburger { display:flex; }
    nav { display:none; position:absolute; top:100%; left:0; right:0; padding:.65rem 1rem 1rem; background:#bdd3ee; box-shadow:0 8px 16px #173d7018; }
    nav.open { display:grid; grid-template-columns:1fr; gap:0; }
    .nav-link { padding:.75rem .5rem; }
    .dropdown { display:grid; }
    .menu { position:static; margin:.2rem 0 .5rem .5rem; box-shadow:none; }
  }
  @media(max-width:639px) { .nav-wrap { grid-template-columns:auto minmax(0,1fr); min-height:52px; } .hamburger { font-size:0; } .search { padding:.5rem .65rem; } }
</style>
<div class="nav-wrap">
  <button class="hamburger" type="button" aria-expanded="false" aria-controls="primary-nav"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg><span>Menu</span></button>
  <nav id="primary-nav" aria-label="Navigasi utama">
    <a class="nav-link active" href="#top">Home</a>
    <div class="dropdown">
      <button class="nav-link dropdown-toggle" type="button" aria-expanded="false">Notes Category⌄</button>
      <div class="menu" role="menu">
        <button type="button" role="menuitem" data-filter="Study">Study &amp; learning</button>
        <button type="button" role="menuitem" data-filter="Work">Work notes</button>
        <button type="button" role="menuitem" data-filter="Personal">Personal journal</button>
        <button type="button" role="menuitem" data-filter="Other">Other ideas</button>
      </div>
    </div>
    <a class="nav-link" href="#note-form">Upload &amp; Print</a>
    <a class="nav-link" href="#about">About us</a>
  </nav>
  <label class="search">
    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
    <input id="global-search" type="search" placeholder="Search..." aria-label="Cari catatan berdasarkan judul atau isi">
  </label>
</div>`;
class AppNavbar extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }).append(navbarTemplate.content.cloneNode(true)); }
  connectedCallback() {
    const root = this.shadowRoot;
    const hamburger = root.querySelector(".hamburger");
    const nav = root.querySelector("nav");
    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(open));
    });
    root.querySelectorAll(".dropdown-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const wrapper = button.closest(".dropdown");
        const open = wrapper.classList.toggle("open");
        button.setAttribute("aria-expanded", String(open));
      });
      button.addEventListener("keydown", event => {
        if (event.key === "Escape") {
          button.closest(".dropdown").classList.remove("open");
          button.setAttribute("aria-expanded", "false");
          button.focus();
        }
      });
    });
    root.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("category-select", { bubbles: true, composed: true, detail: { category: button.dataset.filter } }));
      root.querySelectorAll(".dropdown").forEach(el => el.classList.remove("open"));
    }));
    root.querySelector("#global-search").addEventListener("input", event => {
      this.dispatchEvent(new CustomEvent("notes-search", { bubbles: true, composed: true, detail: { query: event.target.value } }));
    });
    document.addEventListener("click", event => {
      if (!event.composedPath().includes(this)) {
        root.querySelectorAll(".dropdown").forEach(el => {
          el.classList.remove("open");
          el.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
        });
      }
    });
  }
}
customElements.define("app-navbar", AppNavbar);
