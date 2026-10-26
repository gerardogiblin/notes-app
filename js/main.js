import { NotesStore } from "./data/notes-store.js";
import "./components/app-header.js";
import "./components/app-navbar.js";
import "./components/hero-section.js";
import "./components/note-form.js";
import "./components/note-item.js";
import "./components/note-list.js";

const store = new NotesStore();
const noteList = document.querySelector("note-list");
const navbar = document.querySelector("app-navbar");

function renderNotes() {
  noteList.setNotes(store.getAll());
}
renderNotes();

document.addEventListener("note-added", event => {
  store.add(event.detail);
  renderNotes();
  noteList.setCategory("All");
  noteList.setQuery("");
  const globalSearch = navbar.shadowRoot.querySelector("#global-search");
  globalSearch.value = "";
});

document.addEventListener("note-delete-request", event => {
  const { id, title } = event.detail;
  showDeleteDialog(title, confirmed => {
    if (confirmed) {
      store.remove(id);
      renderNotes();
    }
  });
});

document.addEventListener("notes-search", event => {
  noteList.setQuery(event.detail.query);
});

document.addEventListener("category-select", event => {
  noteList.setCategory(event.detail.category);
  noteList.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block:"start" });
});

function showDeleteDialog(title, callback) {
  const dialog = document.createElement("dialog");
  dialog.setAttribute("aria-labelledby", "delete-title");
  const style = document.createElement("style");
  style.textContent = `
    dialog { width:min(420px,calc(100% - 2rem)); border:1px solid #b7cbe6; border-radius:16px; padding:1.4rem; color:#222; background:#fffdf7; box-shadow:0 20px 60px #173d7030; font-family:Nunito, sans-serif; }
    dialog::backdrop { background:#173d7060; backdrop-filter:blur(2px); }
    h2 { margin:0 0 .5rem; color:#173d70; font:600 1.45rem Fredoka,sans-serif; }
    p { line-height:1.55; }
    .actions { display:flex; justify-content:flex-end; gap:.6rem; margin-top:1.2rem; }
    button { border:1px solid #9db9e3; border-radius:999px; padding:.65rem 1rem; background:#fffdf7; color:#173d70; font:800 .9rem Nunito,sans-serif; cursor:pointer; }
    .danger { background:#f6b8c8; border-color:#e88fb0; }
    button:focus-visible { outline:3px solid #345f9d; outline-offset:3px; }
  `;
  dialog.innerHTML = `<h2 id="delete-title">Hapus catatan?</h2><p>Catatan <strong></strong> akan dihapus dari daftar. Tindakan ini tidak bisa dibatalkan.</p><div class="actions"><button type="button" data-action="cancel">Batal</button><button type="button" class="danger" data-action="delete">Ya, hapus</button></div>`;
  dialog.querySelector("strong").textContent = `“${title}”`;
  dialog.prepend(style);
  document.body.append(dialog);
  const close = confirmed => { dialog.close(); dialog.remove(); callback(confirmed); };
  dialog.querySelector('[data-action="cancel"]').addEventListener("click", () => close(false));
  dialog.querySelector('[data-action="delete"]').addEventListener("click", () => close(true));
  dialog.addEventListener("cancel", event => { event.preventDefault(); close(false); });
  dialog.addEventListener("close", () => dialog.remove(), { once:true });
  dialog.showModal();
  dialog.querySelector('[data-action="cancel"]').focus();
}


// Fragment links inside Shadow DOM do not resolve to elements in the document tree,
// so route the design's internal navigation to the relevant components explicitly.
document.addEventListener("click", event => {
  const path = event.composedPath();
  const link = path.find(node => node instanceof HTMLAnchorElement && node.getAttribute("href")?.startsWith("#"));
  if (!link) return;
  const target = link.getAttribute("href");
  if (target === "#notes") {
    event.preventDefault();
    noteList.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  } else if (target === "#note-form") {
    event.preventDefault();
    const form = document.querySelector("note-form");
    form?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    form?.shadowRoot?.querySelector("#title")?.focus({ preventScroll: true });
  } else if (target === "#top") {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
