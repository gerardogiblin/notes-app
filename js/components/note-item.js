const itemTemplate = document.createElement("template");
itemTemplate.innerHTML = `
<style>
  :host { display:block; min-width:0; }
  * { box-sizing:border-box; }
  article { position:relative; display:grid; grid-template-rows:auto 1fr auto; min-height:195px; padding:1rem 1rem .85rem; overflow:hidden; border:1px solid #d7d7d7; border-radius:12px; background:var(--note-paper,#e1eeff); box-shadow:3px 4px 0 rgba(23,61,112,.08); transform:rotate(var(--tilt,0deg)); transition:transform .18s ease,box-shadow .18s ease; }
  article:before { content:""; position:absolute; inset:0; pointer-events:none; background-image:linear-gradient(rgba(255,255,255,.17) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.17) 1px,transparent 1px); background-size:18px 18px; }
  article:hover, article:focus-within { transform:translateY(-4px) rotate(0); box-shadow:5px 8px 0 rgba(23,61,112,.13); }
  .tape { position:absolute; top:-2px; right:12px; width:48px; height:13px; transform:rotate(-8deg); background:repeating-linear-gradient(135deg,#ffffff8a 0 5px,#ffffff30 5px 10px); border:1px dashed #ffffffa0; }
  .top { position:relative; display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-bottom:.65rem; }
  .category { display:flex; align-items:center; gap:.4rem; color:#29486e; font-size:.72rem; font-weight:900; letter-spacing:.02em; }
  .dot { width:9px; height:9px; border-radius:50%; background:#4b91df; border:1px solid #fff; }
  .menu-wrap { position:relative; }
  button { display:grid; place-items:center; width:28px; height:28px; border:0; border-radius:50%; color:#173d70; background:transparent; font-weight:900; }
  button:hover { background:#ffffff85; }
  .menu { display:none; position:absolute; z-index:2; right:0; top:28px; min-width:110px; padding:.25rem; background:#fffdf7; border:1px solid #b7cbe6; border-radius:8px; box-shadow:0 5px 16px #173d7020; }
  .menu.open { display:block; }
  .menu button { display:block; width:100%; height:auto; padding:.5rem; text-align:left; border-radius:5px; font-size:.8rem; }
  h3 { position:relative; margin:0 0 .45rem; color:#172f50; font-size:1rem; line-height:1.3; overflow-wrap:anywhere; }
  .body { position:relative; margin:0; color:#253e5d; font-size:.85rem; line-height:1.5; overflow-wrap:anywhere; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:4; line-clamp:4; overflow:hidden; white-space:pre-wrap; }
  .bottom { position:relative; display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-top:.8rem; color:#526783; font-size:.7rem; font-weight:700; }
  .pin { color:#286ab1; font-size:1.1rem; }
  .delete { color:#a32c50; }
  @media(prefers-reduced-motion:reduce) { article { transition:none; } }
</style>
<article>
  <span class="tape" aria-hidden="true"></span>
  <div class="top"><span class="category"><span class="dot"></span><span class="category-label"></span></span><div class="menu-wrap"><button class="more" type="button" aria-label="Opsi catatan" aria-expanded="false">⋮</button><div class="menu"><button class="delete" type="button">Hapus catatan</button></div></div></div>
  <div><h3></h3><p class="body"></p></div>
  <div class="bottom"><time></time><span class="pin" aria-hidden="true">✧</span></div>
</article>`;
const colors = { blue:"#E1EEFF", pink:"#FCE4ED", yellow:"#FFF1B8", mint:"#DDF5E8", lavender:"#EDE5FF", sky:"#DDF4FF" };
class NoteItem extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }).append(itemTemplate.content.cloneNode(true)); }
  connectedCallback() {
    const root = this.shadowRoot;
    const note = {
      id: this.getAttribute("note-id"),
      title: this.getAttribute("title") || "Untitled",
      color: this.getAttribute("color") || "yellow",
      createdAt: this.getAttribute("created-at") || new Date().toISOString(),
      body: this.getAttribute("body") || "",
      category: this.getAttribute("category") || "Other"
    };
    root.querySelector("article").style.setProperty("--note-paper", colors[note.color] || colors.yellow);
    root.querySelector("article").style.setProperty("--tilt", `${((note.id?.length || 1) % 3 - 1) * .6}deg`);
    root.querySelector("h3").textContent = note.title;
    root.querySelector(".body").textContent = note.body;
    root.querySelector(".category-label").textContent = note.category;
    root.querySelector(".dot").style.background = ({Study:"#4b91df",Work:"#e77da3",Personal:"#e6ad24",Other:"#3cae8b"})[note.category] || "#4b91df";
    const date = new Date(note.createdAt);
    root.querySelector("time").dateTime = date.toISOString();
    root.querySelector("time").textContent = new Intl.DateTimeFormat("id-ID", { day:"2-digit", month:"short", year:"numeric" }).format(date);
    const more = root.querySelector(".more"), menu = root.querySelector(".menu");
    more.addEventListener("click", () => { const open = menu.classList.toggle("open"); more.setAttribute("aria-expanded", String(open)); });
    root.querySelector(".delete").addEventListener("click", () => {
      menu.classList.remove("open"); more.setAttribute("aria-expanded", "false");
      this.dispatchEvent(new CustomEvent("note-delete-request", { bubbles:true, composed:true, detail:{ id:note.id, title:note.title } }));
    });
    root.addEventListener("keydown", event => { if (event.key === "Escape") { menu.classList.remove("open"); more.setAttribute("aria-expanded","false"); more.focus(); } });
  }
}
customElements.define("note-item", NoteItem);
