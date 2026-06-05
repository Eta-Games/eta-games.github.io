/**
 * ETA Games — Theme Loader
 * Carica il tema utente da Firebase Firestore e lo applica al body.
 * Include un fallback a night-theme se Firebase non risponde entro 800ms.
 *
 * Requisiti: firebase-app-compat + firebase-auth-compat + firebase-firestore-compat
 * già caricati prima di questo script.
 */
(function () {
  const DEFAULT_THEME = 'night-theme';

  /* Mappa i valori legacy (senza -theme) al formato attuale */
  function normalizeTheme(raw) {
    if (!raw) return DEFAULT_THEME;
    return raw.endsWith('-theme') ? raw : raw + '-theme';
  }

  function applyTheme(theme) {
    document.body.className = normalizeTheme(theme);
  }

  /* Esporta applyTheme globalmente (usato anche inline da alcune pagine) */
  window.applyTheme = applyTheme;

  /* Fallback: se Firebase non risponde entro 800 ms usa il tema di default */
  var fallback = setTimeout(function () {
    if (!document.body.className) {
      document.body.className = DEFAULT_THEME;
    }
  }, 800);

  /* Aspetta che Firebase sia pronto */
  function init() {
    try {
      var app = firebase.apps.length
        ? firebase.app()
        : firebase.initializeApp(window._firebaseConfig || {});
      var auth = firebase.auth();
      var db = firebase.firestore();

      auth.onAuthStateChanged(async function (user) {
        clearTimeout(fallback);
        if (user) {
          try {
            var doc = await db.collection('users').doc(user.uid).get();
            if (doc.exists && doc.data().theme) {
              applyTheme(doc.data().theme);
              return;
            }
          } catch (e) {
            console.warn('[theme-loader] Firestore error:', e);
          }
        }
        /* Nessun utente o nessun tema salvato → default */
        if (!document.body.className) {
          document.body.className = DEFAULT_THEME;
        }
      });
    } catch (e) {
      clearTimeout(fallback);
      console.warn('[theme-loader] Firebase init error:', e);
      if (!document.body.className) {
        document.body.className = DEFAULT_THEME;
      }
    }
  }

  /* Esegui dopo che il DOM è disponibile */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
