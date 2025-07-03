# ////////////
# // README //
# ////////////

Le repository su github possono essere "maneggiate" con un programma
chiamato 'git', un programma inizialmente creato da Linus Torvalds, che è
anche il padre di Linux.

Qui spiego molto semplicemente come usare git, in modo MOLTO basilare.

## Dove scarico git?
Eccotelo qui: https://git-scm.com/downloads

Se sei su linux te lo trovi anche nel gestore di pacchetti (come apt o pacman
o dnf o ancora zypper, ma anche nix).


## Scaricare la repository (clone)
Installato git, puoi clonare la repository con questo comando:

$ git clone https://github.com/Eta-Games/eta-games.github.io.git

Ignora  il '$', sta solo a indicare un comando da eseguire in un terminale
(o riga di comando se preferisci)


## Fare modifiche alla repository (commit e push)
Potresti notare due file, chiamati commit.sh e commit.bat --
Essi sono script stupidamente semplici per velocizzare commit e push con git.

Si possono usare solo con VScode (Visual Studio Code), ma in teoria
potrebbero funzionare anche con una chiave API, tuttavia preferirei
NON usarne una per motivi di sicurezza.

**NOTA BENE**:
Purtroppo, il modo più sicuro di lavorare è di farlo uno per volta, a causa
di git stesso: Se lo facessimo, avremmo due timeline di git diverse.
Sarebbe possibile fonderle, ma è possibile anche rompere qualcosa nel farlo.
Nota che per "lavorare" intendo modificare il codice nella repository,
quindi possiamo modificarla solo uno per volta.

### "git non mi fa fare la commit!"
Se è così, allora la copia della repository che hai nel computer non è
aggiornata -- dovrai aggiornarla eseguendo un pull. La spiegazione è proprio
qua sotto.


## Aggiornare la repository locale (pull)
Per aggiornare la repository in locale, devi eseguire questo semplice
comando:

$ git pull

(il '$' sta a indicare la riga di comando, ignoralo)
Tuttavia, alla prima esecuzione di tale comando ti chiederà di come farlo.
sei libero di scegliere quello che vuoi ma io ti consiglio:

$ git config pull.rebase true

Nota che con questo modo di pull, TUTTE LE MODIFICHE FATTE PRIMA DI ESEGUIRE

$ git pull

SARANNO SCARTATE E RIMOSSE.


Ora sai tutto.
*// Kappa*