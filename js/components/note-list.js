const listTemplate = document.createElement("template");
listTemplate.innerHTML = `
<style>
  :host { display:block; min-width:0; color:var(--color-text,#222); }
  * { box-sizing:border-box; }
  .heading { display:flex; align-items:center; justify-content:space-between; gap:1rem; margin:.1rem 0 1rem; }
  .heading-copy { display:flex; align-items:center; gap:.7rem; }
  .icon { font-size:1.7rem; }
  h2 { margin:0; color:#173d70; font:600 1.65rem/1.1 var(--font-display,sans-serif); }
  .subtitle { margin:.25rem 0 0; color:#526783; font-size:.82rem; }
  .count { margin:0; color:#526783; font-size:.8rem; font-weight:800; white-space:nowrap; }
  .toolbar { display:grid; grid-template-columns:minmax(0,1fr); gap:.7rem; margin-bottom:1rem; }
  .search { display:flex; align-items:center; gap:.5rem; padding:.65rem .8rem; border:1px solid #a9c3e5; border-radius:999px; background:#fffdf7; }
  .search svg { width:18px; height:18px; flex:none; stroke:#173d70; fill:none; stroke-width:2; }
  input { width:100%; min-width:0; border:0; outline:0; background:transparent; color:#173d70; font:600 .85rem var(--font-body,sans-serif); }
  .filters { display:flex; flex-wrap:wrap; gap:.45rem; }
  .filter { border:1px solid #c2d4eb; border-radius:999px; padding:.42rem .8rem; background:#fffdf7; color:#29486e; font-size:.78rem; font-weight:800; }
  .filter[aria-pressed="true"] { background:#9db9e3; border-color:#6f9edb; color:#173d70; }
  .add { border:1px solid #6f9edb; border-radius:999px; padding:.65rem 1rem; background:#9db9e3; color:#173d70; font-weight:900; white-space:nowrap; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr)); gap:1rem; }
  .empty { display:none; min-height:260px; place-items:center; align-content:center; gap:.65rem; padding:2rem; text-align:center; border:1px dashed #b5cbe7; border-radius:16px; background:#fffdf780; }
  .empty.visible { display:grid; }
  .empty-art { display:grid; place-items:center; width:76px; height:86px; border:2px solid #173d70; border-radius:12px; background:#f9c5d8; color:#173d70; font:600 2rem var(--font-display,sans-serif); transform:rotate(-5deg); box-shadow:4px 5px 0 #9db9e3; }
  .empty h3 { margin:0; color:#e88fb0; font:600 1.45rem var(--font-display,sans-serif); }
  .empty p { max-width:300px; margin:0; color:#526783; font-size:.88rem; line-height:1.5; }
  .empty button { margin-top:.3rem; border:1px solid #6f9edb; border-radius:999px; padding:.65rem 1rem; background:#9db9e3; color:#173d70; font-weight:900; }
  @media(min-width:640px) { .toolbar { grid-template-columns:minmax(0,1fr) auto; align-items:center; } }
  @media(max-width:639px) { .heading { align-items:flex-start; } h2 { font-size:1.45rem; } .grid { grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr)); gap:.8rem; } }
</style>
<section id="notes" aria-labelledby="notes-title">
  <div class="heading">
    <div class="heading-copy"><span class="icon" aria-hidden="true">▤</span><div><h2 id="notes-title">My Notes</h2><p class="subtitle">Your thoughts, organized beautifully.</p></div></div>
    <div><p class="count" aria-live="polite">0 catatan</p></div>
  </div>
  <div class="toolbar">
    <label class="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input type="search" placeholder="Search notes..." aria-label="Cari catatan"></label>
    <div class="filters" aria-label="Filter kategori">
      <button class="filter" type="button" data-category="All" aria-pressed="true">All</button>
      <button class="filter" type="button" data-category="Study" aria-pressed="false">Study</button>
      <button class="filter" type="button" data-category="Work" aria-pressed="false">Work</button>
      <button class="filter" type="button" data-category="Personal" aria-pressed="false">Personal</button>
      <button class="filter" type="button" data-category="Other" aria-pressed="false">Other</button>
    </div>
  </div>
  <div class="grid" role="list" aria-label="Daftar catatan"></div>
  <div class="empty visible" role="status">
    <div class="empty-art" aria-hidden="true">☺</div><h3>No notes yet!</h3><p>Click the Add Note button to create your first note and start capturing your ideas.</p><button type="button">＋ Add Note</button>
  </div>
</section>`;
class NoteList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).append(listTemplate.content.cloneNode(true));
    this.notes = []; this.query = ""; this.category = "All";
  }
  connectedCallback() {
    const root = this.shadowRoot;
    root.querySelector(".search input").addEventListener("input", event => {
      this.query = event.target.value.toLocaleLowerCase("id-ID"); this.render();
      this.dispatchEvent(new CustomEvent("notes-search", { bubbles:true, composed:true, detail:{ query:event.target.value } }));
    });
    root.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => this.setCategory(button.dataset.category)));
    root.querySelector(".empty button").addEventListener("click", () => {
      document.querySelector("note-form")?.shadowRoot?.querySelector("#title")?.focus();
      document.querySelector("note-form")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"center" });
    });
  }
  setNotes(notes) { this.notes = [...notes]; this.render(); }
  setQuery(query) { this.query = String(query || "").toLocaleLowerCase("id-ID"); this.shadowRoot.querySelector(".search input").value = query; this.render(); }
  setCategory(category) {
    this.category = category;
    this.shadowRoot.querySelectorAll(".filter").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.category === category)));
    this.render();
  }
  render() {
    const root = this.shadowRoot, grid = root.querySelector(".grid");
    const filtered = this.notes.filter(note => {
      const matchesQuery = `${note.title} ${note.body}`.toLocaleLowerCase("id-ID").includes(this.query);
      const matchesCategory = this.category === "All" || note.category === this.category;
      return matchesQuery && matchesCategory;
    });
    grid.replaceChildren();
    filtered.forEach(note => {
      const item = document.createElement("note-item");
      item.setAttribute("note-id", note.id); item.setAttribute("title", note.title);
      item.setAttribute("body", note.body); item.setAttribute("color", note.color);
      item.setAttribute("category", note.category); item.setAttribute("created-at", note.createdAt);
      item.setAttribute("role", "listitem");
      grid.append(item);
    });
    root.querySelector(".count").textContent = `${filtered.length} ${filtered.length === 1 ? "catatan" : "catatan"}`;
    const empty = root.querySelector(".empty");
    empty.classList.toggle("visible", filtered.length === 0);
    empty.querySelector("h3").textContent = this.notes.length === 0 ? "No notes yet!" : "No notes found";
    empty.querySelector("p").textContent = this.notes.length === 0
      ? "Click the Add Note button to create your first note and start capturing your ideas."
      : "Belum ada catatan yang cocok. Coba kata kunci atau kategori lain.";
    grid.hidden = filtered.length === 0;
  }
}
customElements.define("note-list", NoteList);
