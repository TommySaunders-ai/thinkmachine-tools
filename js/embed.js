/* ═══════════════════════════════════════════════════════════════════════════
   EMBED — Form Handling, Iframe Management, Example Links
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var EMBED_BASE = 'https://app.thinkmachine.com/new';

  /* ── Handlers by input type ──────────────────────────────────────────── */

  function handleTextSubmit(inputEl) {
    var text = (inputEl.value || '').trim();
    if (!text) return;
    var params = new URLSearchParams();
    params.set('text', text);
    params.set('mindmap', 'true');
    loadEmbed(params.toString());
    scrollToEmbed();
  }

  function handleUrlSubmit(inputEl) {
    var url = (inputEl.value || '').trim();
    if (!url) return;
    if (url.indexOf('http') !== 0) url = 'https://' + url;
    var params = new URLSearchParams();
    params.set('url', url);
    params.set('mindmap', 'true');
    loadEmbed(params.toString());
    scrollToEmbed();
  }

  function handleFileSubmit(fileInput) {
    var file = fileInput ? fileInput.files[0] : null;
    if (!file) return;
    // Files cannot be sent cross-origin via iframe — open in new tab
    window.open(EMBED_BASE + '?mindmap=true', '_blank');
  }

  /* ── Iframe Management ───────────────────────────────────────────────── */

  function loadEmbed(queryString) {
    var placeholder = document.querySelector('.tool-embed__placeholder');
    var iframe = document.querySelector('.tool-embed__iframe');

    if (placeholder) placeholder.style.display = 'none';
    if (iframe) {
      iframe.src = EMBED_BASE + '?' + queryString;
      iframe.style.display = 'block';
    }
  }

  function scrollToEmbed() {
    var section = document.querySelector('.tool-embed');
    if (section) {
      var top = section.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  /* ── Example Links ───────────────────────────────────────────────────── */

  var exampleLinks = document.querySelectorAll('.tool-examples__link');
  for (var i = 0; i < exampleLinks.length; i++) {
    exampleLinks[i].addEventListener('click', function (e) {
      e.preventDefault();
      var text = this.getAttribute('data-text');
      var url  = this.getAttribute('data-url');

      var textField = document.querySelector('.tool-input__field');
      if (!textField) {
        var ta = document.querySelector('.tool-input__textarea');
        if (ta) textField = ta;
      }

      if (text && textField) {
        textField.value = text;
        handleTextSubmit(textField);
      } else if (url && textField) {
        textField.value = url;
        handleUrlSubmit(textField);
      }
    });
  }

  /* ── Form Initialization ─────────────────────────────────────────────── */

  var form = document.querySelector('.tool-input');
  if (!form) return;

  var btn       = form.querySelector('.tool-input__btn');
  var textField = form.querySelector('.tool-input__field') || form.querySelector('.tool-input__textarea');
  var fileField = form.querySelector('input[type="file"]');
  var toolType  = form.getAttribute('data-tool-type'); // "text", "url", or "file"

  if (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (toolType === 'url' && textField)       handleUrlSubmit(textField);
      else if (toolType === 'file' && fileField)  handleFileSubmit(fileField);
      else if (toolType === 'file' && textField)  handleTextSubmit(textField); // markdown paste fallback
      else if (textField)                         handleTextSubmit(textField);
    });
  }

  // Enter key for text fields
  if (textField && textField.tagName !== 'TEXTAREA') {
    textField.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (btn) btn.click();
      }
    });
  }

  // Drag-and-drop zone for file tools
  var uploadZone = form.querySelector('.tool-input__upload');
  if (uploadZone && fileField) {
    uploadZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      this.classList.add('is-dragover');
    });
    uploadZone.addEventListener('dragleave', function () {
      this.classList.remove('is-dragover');
    });
    uploadZone.addEventListener('drop', function (e) {
      e.preventDefault();
      this.classList.remove('is-dragover');
      if (e.dataTransfer.files.length) {
        fileField.files = e.dataTransfer.files;
        var nameEl = this.querySelector('.tool-input__upload-filename');
        if (nameEl) nameEl.textContent = e.dataTransfer.files[0].name;
      }
    });
  }

})();
