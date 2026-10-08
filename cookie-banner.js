/*!
 * ETA Games — banner cookie / archiviazione locale
 * Uso: aggiungi <script src="cookie-banner.js" defer></script> in ogni pagina.
 * Riaprire le preferenze: <a href="#" data-cookie-settings>Preferenze cookie</a>
 * Codice che richiede consenso (es. analytics futuri):
 *   if (window.etaConsent.get() === "all") { ...carica script... }
 *   window.etaConsent.onChange(v => { ... });
 */
(function () {
  "use strict";
  var KEY = "eta_cookie_consent";
  var PRIVACY_URL = "privacy.html";

  var T = {
    it: {
      langLabel: "Lingua",
      title: "Cookie e privacy",
      text: "Usiamo solo cookie e archiviazione locale tecnici (login, tema, lingua), necessari al funzionamento del sito. Con “Accetta tutto” ci permetti anche di usare, se in futuro li attiveremo, strumenti di statistica anonima. Puoi cambiare idea quando vuoi.",
      more: "Leggi l’informativa",
      accept: "Accetta tutto",
      reject: "Solo necessari",
      settings: "Preferenze cookie"
    },
    en: {
      langLabel: "Language",
      title: "Cookies and privacy",
      text: "We only use technical cookies and local storage (login, theme, language) needed for the site to work. “Accept all” also allows anonymous statistics tools, should we enable them in the future. You can change your mind at any time.",
      more: "Read the privacy policy",
      accept: "Accept all",
      reject: "Necessary only",
      settings: "Cookie settings"
    }
  };

  var NAMES = { it: "Italiano", en: "English" };

  function setLang(l) {
    try { localStorage.setItem("eta_lang", l); } catch (e) {}
    document.documentElement.lang = l;
    // Aggancio al sistema di traduzione del sito (i18n.js), se espone una di queste funzioni
    var fns = [window.setLang, window.setLanguage, window.changeLanguage,
               window.i18n && window.i18n.setLang, window.i18n && window.i18n.setLanguage];
    for (var i = 0; i < fns.length; i++) {
      if (typeof fns[i] === "function") { try { fns[i](l); } catch (e) {} break; }
    }
    try { document.dispatchEvent(new CustomEvent("eta:languagechange", { detail: l })); } catch (e) {}
  }

  function lang() {
    var l = "";
    try {
      l = localStorage.getItem("eta_lang") || localStorage.getItem("lang") ||
          localStorage.getItem("language") || localStorage.getItem("siteLang") || "";
    } catch (e) {}
    l = (l || document.documentElement.lang || "it").toLowerCase().slice(0, 2);
    return T[l] ? l : "it";
  }

  var listeners = [];
  function get() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function set(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    listeners.forEach(function (f) { try { f(v); } catch (e) {} });
  }
  window.etaConsent = {
    get: get,
    onChange: function (f) { listeners.push(f); }
  };

  var css =
    "#eta-cc{position:fixed;left:16px;right:16px;bottom:16px;max-width:560px;margin:0 auto;z-index:99999;" +
    "background:var(--card,#1e2327);color:var(--text,#e8eaed);border:1px solid rgba(255,255,255,.15);" +
    "border-radius:12px;padding:18px 20px;box-shadow:0 8px 32px rgba(0,0,0,.5);font:14px/1.5 system-ui,sans-serif}" +
    "#eta-cc h2{margin:0 0 6px;font-size:16px}" +
    "#eta-cc p{margin:0 0 12px}" +
    "#eta-cc a{color:var(--accent,#7aa2ff)}" +
    "#eta-cc .eta-cc-btns{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}" +
    "#eta-cc button{flex:1 1 140px;padding:10px 14px;border-radius:8px;font:inherit;font-weight:600;cursor:pointer;" +
    "border:1px solid var(--accent,#7aa2ff);background:var(--accent,#7aa2ff);color:#fff}" +
    "#eta-cc button.eta-cc-alt{background:transparent;color:inherit}" +
    "#eta-cc .eta-cc-lang{display:flex;align-items:center;gap:8px;margin:0 0 10px;font-size:13px}" +
    "#eta-cc select{padding:6px 8px;border-radius:6px;background:transparent;color:inherit;border:1px solid rgba(255,255,255,.3);font:inherit}" +
    "#eta-cc select option{color:#000}" +
    "#eta-cc button:focus-visible{outline:2px solid #fff;outline-offset:2px}";

  function close() {
    var el = document.getElementById("eta-cc");
    if (el) el.remove();
  }

  function show() {
    close();
    var t = T[lang()];
    var box = document.createElement("div");
    box.id = "eta-cc";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-label", t.title);
    var cur = lang();
    var opts = Object.keys(NAMES).map(function (k) {
      return '<option value="' + k + '"' + (k === cur ? " selected" : "") + ">" + NAMES[k] + "</option>";
    }).join("");
    box.innerHTML =
      '<div class="eta-cc-lang"><label for="eta-cc-lang">🌐 ' + t.langLabel + '</label>' +
      '<select id="eta-cc-lang">' + opts + "</select></div>" +
      "<h2>" + t.title + "</h2>" +
      "<p>" + t.text + ' <a href="' + PRIVACY_URL + '">' + t.more + "</a></p>" +
      '<div class="eta-cc-btns">' +
      '<button type="button" data-v="necessary" class="eta-cc-alt">' + t.reject + "</button>" +
      '<button type="button" data-v="all">' + t.accept + "</button>" +
      "</div>";
    box.addEventListener("change", function (e) {
      if (e.target && e.target.id === "eta-cc-lang") { setLang(e.target.value); show(); }
    });
    box.addEventListener("click", function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute("data-v");
      if (v) { set(v); close(); }
    });
    document.body.appendChild(box);
  }

  function init() {
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);

    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("[data-cookie-settings]");
      if (a) { e.preventDefault(); show(); }
    });
    window.etaCookieSettings = show;

    if (!get()) show();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
