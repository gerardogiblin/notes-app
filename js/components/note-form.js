const formTemplate = document.createElement("template");
formTemplate.innerHTML = `
<style>
  :host { display:block; }
  * { box-sizing:border-box; }
  .card { position:relative; padding:1.35rem; border:1px solid #e1d5b7; border-radius:15px; background-color:var(--color-paper,#fffdf7); background-image:linear-gradient(rgba(157,185,227,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(157,185,227,.16) 1px,transparent 1px); background-size:20px 20px; box-shadow:var(--shadow-paper,6px 6px 0 #f6b8c8); }
  .tape { position:absolute; top:-7px; right:25px; width:76px; height:20px; transform:rotate(12deg); background:repeating-linear-gradient(135deg,#f7a8c5 0 7px,#fbc6d8 7px 14px); border:1px dashed #e88fb0; }
  h2 { display:flex; align-items:center; gap:.6rem; margin:.15rem 0 1.2rem; color:#173d70; font:600 1.45rem var(--font-display,sans-serif); }
  .paper-icon { font-size:1.6rem; }
  .field { margin-bottom:1rem; }
  label, legend { display:block; margin-bottom:.4rem; color:#173d70; font-size:.9rem; font-weight:800; }
  input[type=text], textarea { width:100%; border:1px solid #b7cbe6; border-radius:9px; padding:.75rem .8rem; color:#222; background:rgba(255,253,247,.92); font:600 .92rem var(--font-body,sans-serif); }
  textarea { resize:vertical; min-height:116px; line-height:1.5; }
  input::placeholder, textarea::placeholder { color:#8397b3; font-weight:600; }
  .meta { display:flex; justify-content:space-between; gap:.5rem; margin-top:.25rem; color:#6d7e97; font-size:.75rem; }
  .error { min-height:1rem; margin:.2rem 0 0; color:#a32c50; font-size:.78rem; font-weight:700; }
  fieldset { margin:0 0 1.15rem; padding:0; border:0; }
  .swatches { display:flex; flex-wrap:wrap; gap:.65rem; }
  .swatch { position:relative; display:grid; place-items:center; width:32px; height:32px; border:2px solid transparent; border-radius:50%; cursor:pointer; }
  .swatch input { position:absolute; opacity:0; inset:0; cursor:pointer; }
  .swatch span { width:100%; height:100%; border:1px solid #00000010; border-radius:50%; }
  .swatch:has(input:checked) { border-color:#173d70; box-shadow:0 0 0 2px #fffdf7 inset; }
  .swatch:has(input:focus-visible) { outline:3px solid #345f9d; outline-offset:3px; }
  .actions { display:grid; grid-template-columns:1fr 1.15fr; gap:.6rem; }
  button { min-height:42px; border:1px solid #7fa5dc; border-radius:999px; background:#fffdf7; color:#173d70; font-weight:800; }
  button.primary { background:var(--color-button,#9db9e3); }
  button:disabled { cursor:not-allowed; opacity:.5; }
  .status { min-height:1.2rem; margin:.65rem 0 0; color:#276b4b; font-size:.8rem; font-weight:800; }
  @media(max-width:639px) { .card { padding:1.1rem; } h2 { font-size:1.3rem; } }
</style>
<section class="card" id="note-form" aria-labelledby="form-title">
  <span class="tape" aria-hidden="true"></span>
  <h2 id="form-title"><span class="paper-icon" aria-hidden="true">▤</span> Add New Note</h2>
  <form novalidate>
    <div class="field">
      <label for="title">Title *</label>
      <input id="title" name="title" type="text" maxlength="60" placeholder="e.g. Study plan" required aria-describedby="title-error title-count">
      <div class="meta"><span class="error" id="title-error" aria-live="polite"></span><span id="title-count">0/60</span></div>
    </div>
    <div class="field">
      <label for="body">Content *</label>
      <textarea id="body" name="body" maxlength="500" placeholder="Write your note here..." required aria-describedby="body-error body-count"></textarea>
      <div class="meta"><span class="error" id="body-error" aria-live="polite"></span><span id="body-count">0/500</span></div>
    </div>
    <fieldset>
      <legend>Paper color</legend>
      <div class="swatches">
        <label class="swatch" title="Blue"><input type="radio" name="color" value="blue" checked aria-label="Blue"><span style="background:#9db9e3"></span></label>
        <label class="swatch" title="Pink"><input type="radio" name="color" value="pink" aria-label="Pink"><span style="background:#f6b8c8"></span></label>
        <label class="swatch" title="Yellow"><input type="radio" name="color" value="yellow" aria-label="Yellow"><span style="background:#fbe89a"></span></label>
        <label class="swatch" title="Mint"><input type="radio" name="color" value="mint" aria-label="Mint"><span style="background:#a9dfc7"></span></label>
        <label class="swatch" title="Lavender"><input type="radio" name="color" value="lavender" aria-label="Lavender"><span style="background:#c7adf5"></span></label>
        <label class="swatch" title="Sky"><input type="radio" name="color" value="sky" aria-label="Sky"><span style="background:#a6d9f3"></span></label>
      </div>
    </fieldset>
    <div class="field">
      <label for="category">Category</label>
      <select id="category" name="category">
        <option>Study</option><option>Work</option><option>Personal</option><option selected>Other</option>
      </select>
    </div>
    <style>
      select { width:100%; border:1px solid #b7cbe6; border-radius:9px; padding:.7rem .8rem; color:#173d70; background:#fffdf7; font:700 .9rem var(--font-body,sans-serif); }
    </style>
    <div class="actions"><button type="reset">Clear</button><button class="primary" type="submit" disabled>Save Note</button></div>
    <p class="status" role="status" aria-live="polite"></p>
  </form>
</section>`;
class NoteForm extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }).append(formTemplate.content.cloneNode(true)); }
  connectedCallback() {
    const root = this.shadowRoot, form = root.querySelector("form");
    const title = root.querySelector("#title"), body = root.querySelector("#body");
    const submit = root.querySelector('[type="submit"]'), status = root.querySelector(".status");
    const validate = (field, errorEl, label) => {
      const value = field.value.trim();
      const message = !value ? `${label} wajib diisi.` : value.length < 2 && label === "Judul" ? "Judul minimal 2 karakter." : "";
      errorEl.textContent = message;
      field.setAttribute("aria-invalid", String(Boolean(message)));
      return !message;
    };
    const update = () => {
      root.querySelector("#title-count").textContent = `${title.value.length}/60`;
      root.querySelector("#body-count").textContent = `${body.value.length}/500`;
      const validTitle = validate(title, root.querySelector("#title-error"), "Judul");
      const validBody = validate(body, root.querySelector("#body-error"), "Isi catatan");
      submit.disabled = !(validTitle && validBody);
    };
    title.addEventListener("input", update); body.addEventListener("input", update);
    form.addEventListener("reset", () => {
      queueMicrotask(() => { root.querySelector("#title-error").textContent = ""; root.querySelector("#body-error").textContent = ""; title.removeAttribute("aria-invalid"); body.removeAttribute("aria-invalid"); update(); status.textContent = ""; });
    });
    form.addEventListener("submit", event => {
      event.preventDefault(); update();
      if (submit.disabled) return;
      const data = { title: title.value.trim(), body: body.value.trim(), color: root.querySelector('[name="color"]:checked').value, category: root.querySelector("#category").value };
      this.dispatchEvent(new CustomEvent("note-added", { bubbles: true, composed: true, detail: data }));
      form.reset(); title.focus(); status.textContent = "Catatan berhasil ditambahkan!";
    });
    update();
  }
}
customElements.define("note-form", NoteForm);
