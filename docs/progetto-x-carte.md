# Progetto X - Sistema Carte

## Visione

Il sistema carte deve essere un extra collezionabile e godibile, non un muro pay-to-win. Deve dare ai giocatori la sensazione dello sbustamento stile giochi di carte, con rarita, sorpresa, collezione e piccoli vantaggi, ma senza impedire a chi non spende di arrivare al top.

## Pacchetti

- I pacchetti possono essere comprati con gold.
- I pacchetti possono essere vinti facendo battaglie, dungeon difficili o dungeon epici.
- Gli eventi mensili possono dare possibilita speciali di ottenere carte rare alte.
- In futuro possono esistere monete speciali acquistabili con euro, usabili per comprare pacchetti o accelerare leggermente il progresso.
- Lo sbustamento deve essere visibile, lento quanto basta, piacevole e con momento speciale per leggendarie e mitiche.

Scala mazzi prototipo:

- Mazzo della Recluta: comuni e non comuni, comprabile con oro o Sigilli.
- Mazzo dell'Avanguardia: non comune garantita, piccola possibilita di raro, comprabile con oro o Sigilli.
- Mazzo del Giuramento: rara garantita, piccola possibilita di epico/leggendario, comprabile con oro o Sigilli.
- Mazzo dell'Epopea: epica garantita, solo ricompensa da dungeon difficili e storie lunghe.
- Mazzo della Leggenda: leggendaria garantita, solo ricompensa da dungeon epici, eventi e boss lunghi.
- Mazzo del Mito: mitica garantita, solo ricompensa da eventi mensili, campagne leggendarie e imprese uniche.

Regola economica:

- I primi tre mazzi devono essere acquistabili anche farmando missioni, cosi chi non spende puo comunque avanzare.
- I tre mazzi alti devono essere ottenibili giocando contenuti importanti, non solo pagando.
- Questo mantiene la possibilita di arrivare al top senza spendere soldi reali.

## Negozio e Pacchetti

- Il negozio normale resta dedicato agli equip comuni, non comuni e rari.
- I pacchetti servono soprattutto per trovare epiche, leggendarie e mitiche.
- Le probabilita devono essere studiate come nei giochi di carte collezionabili, con drop rate chiari e bilanciati.
- Le carte alte devono poter uscire anche senza pagare, ma con tempi molto piu lunghi.

## Pay-To-Progress

- Va bene un leggero vantaggio a chi compra, ma deve restare controllato.
- Il progresso di chi paga deve essere circa 2/3% piu veloce, non una scorciatoia brutale.
- Un giocatore free-to-play deve poter arrivare al top senza spendere una lira.
- Chi non spende puo metterci anche molto di piu, ma non deve sentirsi escluso dal contenuto migliore.

## Valuta Premium

Nome scelto per il prototipo: Sigilli di Zodar.

Regole:

- I Sigilli di Zodar sono la valuta premium finta del prototipo.
- Nel prototipo si acquistano tramite shop test, senza denaro reale.
- In futuro lo stesso sistema dovra collegarsi a Steam Wallet su Steam e Google Play Billing su Play Store.
- Il frontend non deve mai accreditare valuta reale da solo: in produzione accredita solo il backend dopo conferma della piattaforma.
- I prezzi reali non devono essere scolpiti nel codice di gioco: Steam e Google dovranno gestire prezzo, valuta locale e prodotti.
- I Sigilli possono comprare pacchetti e cosmetici, ma non devono creare pay-to-win pesante.

## Ricompense

Le carte possono contenere:

- Armi.
- Armature.
- Pozioni.
- Accessori.
- Titoli speciali.
- Colori o effetti estetici in game.
- Elementi scenici da collezione.

## Esclusive Estetiche

Titoli speciali, colori, effetti scenici e oggetti da vanto devono essere solo nei pacchetti.

Esempi:

- "Adepto di Zodar".
- Titoli rari da mostrare.
- Colori speciali del nome o dell'aura.
- Retro carta, cornici, effetti scenici.

Queste cose non devono dare vantaggi reali in combattimento: servono per vantarsi, collezionare e distinguersi.

## Carte

Ogni carta deve mostrare chiaramente:

- Nome.
- Rarita.
- Immagine.
- Descrizione narrativa.
- Cosa fa in gioco.
- Se e equipaggiabile, usabile o solo scenica.

Le carte oggetto devono spiegare bonus e uso, per esempio danno arma, attacco, difesa, magia, cura, slot di equipaggiamento.

Le carte sceniche devono spiegare che sono estetiche e non aumentano le statistiche.

## Carte Alleato

Idea: alcuni pacchetti possono contenere NPC collezionabili da usare in battaglia.

Regole prototipo:

- Gli alleati sono divisi nei 6 gradi di rarita.
- Il prototipo genera un catalogo iniziale di 200 alleati.
- Distribuzione alleati: 80 comuni, 50 non comuni, 35 rari, 20 epici, 12 leggendari, 3 mitici.
- Comuni: soldati, mercenari, apprendisti, bestie semplici; utili ma sacrificabili.
- Non comuni: specialisti, guardie esperte, chierici minori; buoni supporti.
- Rari: veterani, maghi, assassini, cavalieri; forti davvero.
- Epici: campioni, mostri intelligenti, eroi decaduti; cambiano una battaglia.
- Leggendari: grandi eroi, draghi minori, entita antiche; quasi boss alleati.
- Mitici: personaggi unici del mondo di Zodar; devastanti e rarissimi.
- Le carte alleato possono uscire dai pacchetti.
- Dalla tab Carte si possono evocare solo durante un combattimento.
- Nel prototipo la carta viene consumata quando l'alleato entra in battaglia.

Regole finali desiderate:

- Se l'alleato sopravvive allo scontro puo tornare nella collezione.
- Se l'alleato muore, la carta sparisce definitivamente.
- Gli alleati piu rari devono avere identita, arte e magari piccole abilita speciali.
- I giocatori devono voler cercare personaggi specifici, come succede nei giochi veri.

## Direzione Grafica

La carta deve prendere spunto dalla chiarezza dei grandi giochi di carte, senza copiarne cornici, simboli o composizione protetta.

Struttura desiderata:

- Barra superiore con nome della carta.
- Simbolo o medaglione di rarita.
- Illustrazione grande e centrale.
- Riga tipo, per esempio "Oggetto - Arma" o "Scenica - Titolo".
- Box regole con cosa fa in gioco.
- Testo narrativo breve in stile flavour.
- Targhetta in basso per dato importante, per esempio dado arma, bonus, cura o natura scenica.

Stile Echoes of Zodar:

- Cornici da reliquia fantasy oscura.
- Colori guidati dalla rarita.
- Bordo spesso e immediatamente riconoscibile in base alla rarita.
- Doppia cornice e glow piu forte sulle rarita alte.
- Testi sempre leggibili: nomi lunghi e regole non devono essere tagliati nello sbustamento.
- Immagini oggetto mostrate intere in una finestra quadrata centrata, senza tagli brutali.
- Aspetto collezionabile, leggibile e non identico a Magic, Pokemon o altri TCG.
- Versione compatta per la griglia collezione e versione grande per sbustamento/dettaglio.

## Tab In Game

Sono previste due tab:

- Pacchetti: contiene i pacchetti trovati, acquistati e non ancora aperti.
- Carte: contiene la collezione delle carte ottenute.

Durante lo sviluppo le due tab restano bloccate con password, cosi quando il sistema e pronto si puo sbloccare tutto e sorprendere i tester.

## Stato Attuale

Gia implementato:

- Tab Pacchetti e Carte protette.
- Pacchetti test.
- Acquisto pacchetti con gold dalla tab Pacchetti.
- Shop test dei Sigilli di Zodar con pacchetti valuta finti.
- Acquisto pacchetti con Sigilli di Zodar.
- Scala da 6 mazzi: comune/non comune, non comune, raro, epico, leggendario, mitico.
- Mazzi epici/leggendari/mitici marcati come solo ricompensa.
- Ledger locale delle transazioni premium test.
- Carte alleato generate nei 6 gradi di rarita.
- Evocazione prototipo degli alleati in battaglia dalla collezione carte.
- Tab Master "Pacchetti" per regalare pacchetti ai player selezionati.
- Tab Master "Pacchetti" per regalare Sigilli di Zodar test ai player selezionati.
- Sbustamento con reveal.
- Grafica base dei pacchetti con busta fantasy, sigillo e animazione di apertura.
- Primo asset generato per il Pacchetto di Zodar.
- Asset generati per le 6 buste/retro carta: Recluta, Avanguardia, Giuramento, Epopea, Leggenda, Mito.
- Animazione di apertura con strappo della busta, lampo e carte che escono prima del reveal.
- Rarita e pity.
- Frammenti per doppioni cosmetici.
- Carte ottenute salvate in collezione.
- Equip/uso da carta quando l'oggetto esiste in inventario.
- Immagini degli item forgiati +1, +2, +3 ricondotte all'immagine base.
- Box "Effetto" e "Cosa fa" sulle carte.
- Layout carta ispirato ai TCG: nome, illustrazione, tipo, effetto, flavour e stat in basso.

Da fare:

- Grafica estetica completa delle carte.
- Asset dedicati per ogni busta e ogni famiglia di carte.
- Identita visiva diversa per rarita.
- Animazioni avanzate di sbustamento, con effetti speciali dedicati a epiche, leggendarie e mitiche.
- Shop/pacchetti collegati a gold, dungeon, eventi e valuta speciale.
- Collegamento reale a Steam Wallet e Google Play Billing.
- Backend definitivo per ordini, verifica acquisti, accrediti e rimborsi.
- Persistenza finale delle carte alleato: ritorno se sopravvivono, distruzione se muoiono.
- Arte e identita unica per NPC alleati rari, leggendari e mitici.
- Drop pacchetti da dungeon, eventi e ricompense mensili.
- Bilanciamento finale delle probabilita.
