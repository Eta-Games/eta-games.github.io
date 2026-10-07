/* ETA Games — voti e commenti (stessa collezione Firestore "reviews" del launcher).
   Uso: <div id="reviews" data-game="dantes_revenge"></div><script src="eta-reviews.js"></script>
   Richiede firebase-app/auth/firestore (compat) già caricati. */
(function () {
  var host = document.getElementById('reviews');
  if (!host) return;
  var gid = host.getAttribute('data-game');
  var TX = {
    it: { t: 'Recensioni e voti', login: 'Accedi per lasciare un voto o un commento.', vote: 'Il tuo voto', ph: 'Scrivi un commento (facoltativo)…', send: 'Pubblica', none: 'Ancora nessuna recensione.', avg: 'Media', votes: 'voti', ok: 'Recensione salvata!', err: 'Errore: ' },
    en: { t: 'Reviews & ratings', login: 'Log in to leave a rating or comment.', vote: 'Your rating', ph: 'Write a comment (optional)…', send: 'Post', none: 'No reviews yet.', avg: 'Average', votes: 'votes', ok: 'Review saved!', err: 'Error: ' },
    de: { t: 'Bewertungen', login: 'Melde dich an, um zu bewerten oder zu kommentieren.', vote: 'Deine Bewertung', ph: 'Kommentar schreiben (optional)…', send: 'Senden', none: 'Noch keine Bewertungen.', avg: 'Durchschnitt', votes: 'Stimmen', ok: 'Bewertung gespeichert!', err: 'Fehler: ' }
  };
  var lang = 'it';
  try { lang = localStorage.getItem('eta_lang') || 'it'; } catch (e) {}
  var db, auth, user = null;
  function tx() { return TX[lang] || TX.it; }
  function esc(s) { return String(s || '').replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  function render(items, mine) {
    var t = tx(), sum = 0;
    items.forEach(function (r) { sum += r.rating; });
    var html = '<h2>' + t.t + '</h2><p>' + (items.length ? t.avg + ': <b>' + (sum / items.length).toFixed(1) + ' / 5</b> (' + items.length + ' ' + t.votes + ')' : t.none) + '</p>';
    if (user) {
      html += '<div style="margin:12px 0"><label>' + t.vote + ': <select id="etaRate" class="themed-input">';
      for (var i = 5; i >= 1; i--) html += '<option value="' + i + '"' + (mine && mine.rating === i ? ' selected' : '') + '>' + stars(i) + '</option>';
      html += '</select></label><br><textarea id="etaText" class="themed-input" maxlength="1000" rows="3" style="width:100%;margin:8px 0" placeholder="' + esc(t.ph) + '">' + esc(mine ? mine.text : '') + '</textarea>' +
        '<button class="btn" id="etaSend">' + t.send + '</button> <span id="etaMsg"></span></div>';
    } else html += '<p><a href="login.html">' + t.login + '</a></p>';
    items.forEach(function (r) {
      html += '<div style="border-top:1px solid var(--muted);padding:10px 0"><b>' + esc(r.name) + '</b> <span style="color:#f5b301">' + stars(r.rating) + '</span> <small>' +
        new Date(r.ms).toLocaleDateString(lang) + '</small><br>' + esc(r.text).replace(/\n/g, '<br>') + '</div>';
    });
    host.innerHTML = html;
    var b = document.getElementById('etaSend');
    if (b) b.onclick = send;
  }

  function load() {
    db.collection('reviews').where('gameId', '==', gid).limit(100).get().then(function (snap) {
      var items = [], mine = null;
      snap.forEach(function (d) {
        var r = d.data(); r.rating = Math.min(5, Math.max(1, r.rating | 0));
        items.push(r); if (user && r.uid === user.uid) mine = r;
      });
      items.sort(function (a, b) { return (b.ms || 0) - (a.ms || 0); });
      render(items, mine);
    }).catch(function (e) { host.textContent = tx().err + e.message; });
  }

  function send() {
    var btn = document.getElementById('etaSend'), msg = document.getElementById('etaMsg');
    btn.disabled = true;
    db.collection('users').doc(user.uid).get().then(function (u) {
      var name = (u.exists && u.data().displayName) || user.displayName || (user.email || '').split('@')[0];
      return db.collection('reviews').doc(gid + '_' + user.uid).set({
        gameId: gid, uid: user.uid, name: name,
        rating: parseInt(document.getElementById('etaRate').value, 10),
        text: document.getElementById('etaText').value.trim().slice(0, 1000), ms: Date.now()
      });
    }).then(function () { load(); }).catch(function (e) { btn.disabled = false; msg.textContent = tx().err + e.message; });
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(window._firebaseConfig || {});
    db = firebase.firestore(); auth = firebase.auth();
    auth.onAuthStateChanged(function (u) {
      user = u;
      if (!u) return load();
      db.collection('users').doc(u.uid).get().then(function (d) {
        var l = d.exists && d.data().lang;
        if (l && TX[l]) { lang = l; try { localStorage.setItem('eta_lang', l); } catch (e) {} }
      }).catch(function () {}).then(load);
    });
  } catch (e) { host.textContent = e.message; }
})();
