# 🌭 GRILOVAČKA U ÓÓČEK – Kompletní dialogy a herní podklady

---

## 1. Příběhový rámec
 „Parta kamarádů z Kladna se chystá na (jistě legendární) grilovačku čuníka u Óóček. Je tu ale jeden problém – Jan Š. (jméno bylo záměrně zamaskováno) má talent usnout na jakékoliv akci dřív, než se vůbec začne grilovat. Letos to bude jinak! A právě ty jako jediný ho můžeš zachránit! Máš jasný úkol: navštívit všechny kamarády, kteří se na grilovačku chystají, zjistit co by Janovi Š. mohlo pomoci a získat předměty, které ho udrží vzhůru, a večer mu je správně dávkovat. Čím déle vydrží nespat, tím větší legenda z tebe bude!“

 ## 2. Herní flow
1. Přihlášení → výběr charakteru (Anička/Jarda/Petra)
2. Mapa s 10 lokacemi – volný pohyb (můžeš navštívit v libovolném pořadí)
3. Každá lokace:
    - Dialog (3 možnosti odpovědí, 1 správná)
    - Minihra (úspěch = předmět; neúspěch = můžeš zkusit znovu později)
    - Získání předmětu

4. Po získání všech 10 předmětů → odemčení finální lokace „Grillovačka u Šulců“
5. Finále:
    - Grilovačka začíná v 18:00. Je vidět postupující čas
    - Jan Š. začíná usínat (je zobrazen indikátor ospalosti 0-100) Pokud dosáhne 100 Jan Š. usnul a hra končí
    - Hráč mu podává předměty ve zvoleném pořadí, které si vybírá sám hráč
    - Každý předmět mu ubere z indikátoru ospalosti X minut
    - Pořadí ovlivňuje celkový čas (synergie!)
    - Běží čas – čím později Jana Š. usne, tím lepší. V čase v jakém usne = skóre hráče

## 3. Design hry
- Celkový tón hry
        - Vtipné situace, přehnané animace (chrápání, padající postavy, pobíhající pes Garp) v pixel artu působí extrémně vtipně
        - Navozuje to atmosféru starých klasik, ale zároveň umožňuje roztomilou nadsázku
        - Ideální je 16bitový styl (barevnější, detailnější postavičky) – Super Mario World / české hry jako třeba Polda v tomhle stylu

- Mapa
        - Použít reálnou mapu Kladna, ale převést ji do „pixel art turistické mapy“ – ulice jako klikaté cesty, domy jako ikonické budovy (Šulcovi, Vackovi…)
        - Přidat humorné orientační body („Hospoda Jednadváca“ s animovaným komínem, „Kostel“ s blikajícím křížem)
        - Hráč chodí po mapě shora (2D top-down) a vstupuje do označených lokací

- Lokace
        - Každá lokace bude krátká 2D plošinovka (side-scroll), kde dojdete k postavám, stylizovaná podle reálií (Dům Šulců – obývák s gaučem a psem, Dům Krečů – dětský pokoj s hračkami, Posilovna 21 – běžící pásy a činky…)
        - Nepřátelé? Místo nepřátel třeba „překážky“ (rozházené hračky, rozlitý nápoj, pes Garp pobíhající) – humorné, ne smrtící
        - Je to hlavně zábavný způsob, jak dostat hráče k rozhovoru

- SHRNUTÍ HERNÍHO TOKU
        1. Overworld (mapa Kladna) – pixel art 2D top-down; postupně odemykaných 10 lokací, finální lokace „Grilovačka“ se odemkne po získání alespoň 6 předmětů.
        2. Lokace = plošinovka → dojít k postavě → dialog (3 možnosti) → po správné odpovědi minihra (obtížnost 1–5, max. 2 pokusy, jinak lokace se lokace zavře a už do ní nepůje vstoupit).
        3. Úspěch v minihře = předmět → uloží se do inventáře (itineráře).
        4. Grilovačka (finále):
            - Pohled na Jana Š. (pixelová hlava, postava na gauči/venku), hodiny od 18:00 do max. 8:00.
            - Indikátor Ospalost 0–100, který neustále stoupá (různou rychlostí, možná i podle „fáze večera“).
            - Když dosáhne 80, hra se pozastaví a hráč vybírá ze získaných předmětů.
            - Po použití: animace, hláška Jana Š., ospalost klesne (o hodnotu předmětu + případné bonusy/penalizace za pořadí), čas opět běží.
            - Cíl: udržet ospalost pod 100 (resp. nedojít do stavu spánku) co nejdéle – vyhrává ten, kdo ho udrží vzhůru až do rána (08:00) nebo aspoň co nejdéle.

---

## 👩‍🦰🧓 HRÁČ - VÝBĚR POSTAVY
Při spuštění hry si vybereme hráče:
Uživatel zvolí:
- Jméno (sám si vypíše)
- vybere si z připraveného avatara (náhodně vygenerujeme 3 ženské a 3 mužské postavy)


---

## 🧑‍🤝‍🧑 POSTAVY A JEJICH OSOBNOSTI

| Č. | Lokace | Postavy | Poznámky |
|----|--------|---------|----------|
| 1 | Dům Šulců | Jan Š. (krátké šedé vlasy), Markéta (světle hnědé mikádo), Anička (blond culík), Emma (blond culík), Garp (pes) | Hlavní hrdina, který nesmí usnout. Momentálně odpočívá očima na gauči. |
| 2 | Dům Vacků | Váca (krátké černé vlasy), Alena (blond mikádo), Emča (dlouhé blond vlasy), Honza | Váca kutí na zahradě u bazénu. Alena pracuje na notebooku na lehátku v bazénu |
| 3 | Dům Krečů | Lubo (hubený, plešatý), Krista, Ema (hnědé vlasy), Thea (delší hnědé vlasy, velké kulaté brýle), Elda (krátké světlé vlasy) | Redakční chaos, TikTok, stojky. |
| 4 | Dům Větráků | Větrák (plešatý), Katka (delší světlé vlasy), Adéla (dlouhý blond culík), Adam (krátké blond vlasy, modré oči) | Moderní dům, obří TV TCL, florbalová výzbroj. |
| 5 | Dům Óóček | Janek (rozcuchané hnědé vlasy), Petra (hnědý culík), Kubík (rozcuchané světlé vlasy), Nina (dlouhé blond vlasy, brýle) | Místo konání grilovačky, gril master Janek. |
| 6 | Dům Franců | Jarda (krátké černé vlasy), Vlastička (černé vlasy do culíku) | Vinotéka, golfové trofeje. |
| 7 | Dům doktora Fíši | Dr. Fíša (hubený, krátké černé vlasy, kulaté brýle) | Ordinace plná „zázračných“ preparátů. |
| 8 | Kozlovna | Výčepní (tlustý s pivním břichem) | Hospoda s tankovou Plzní. |
| 9 | Posilovna 21 | Sexy fitness trenérka (vysoká, tmavovlasá, spoře oblečená) | Kardio zóna, zrcadla, činky. |
| 10 | Kostel | Kněz (oblečen jako Mikuláš), Jan Hus (obraz) | Svatostánek s mluvící mozaikou s Janem Husem. |

Jan Š - hlavní hrdina, rád jezdí na kole (černé Binachi, kterému říká láskyplnně "Cikánečka") a cvičí. Pracuje v developmentu (je to "developerská mrdka"), miluje klasické vozy Volvo s diesel motorem a zvukem traktoru
Markéta - manželka Jana Š., pracuje v neziskové organizaci, ale jezdí v Audi kabrio.
Anička - starší dcera Jana Š. a Markéty, chodí do Skauta a dělá atletiku. Studuje na Gymnáziu
Emma - mladší dcera Jana Š. a Markéty, chodí na základní školu
Garp - pes Jana Š., vycvičený lovecký pes, poslouchá na slovo.
Váca - rád jezdí na kole a sportuje. Často má chuť na chlazenou Plzíňku, má doma na zahradě vyhřívaný bazén. Bolí ho záda, proto už se nemůže věnovat běhání a je to velký kutil.
Alena - manželka Vácy. Pracuje zásadně na Home officu, má ráda umění a cestování.
Emča - dcera Vácy a Aleny, spolužačka Aničky a Adély na Gymnáziu. Aktivně sportuje - atletiku a děsně rychle běhá
Honza - syn Vácy a Aleny. Hodně paří na počítači, dívá se na Youtube jak hrají jiní. Hraje fotbal
Lubo - pracuje jako šéfredaktor v CzechCrunchi, má přehled o dění ve světě, hodně cestuje
Krista - manželka Luba, učitelka
Ema - starší dcera Luba a Kristy, studuje, sportuje
Thea - mladší dcera Luba a Kristy, studuje a je influencerka na sociálních sítích. je upoutaná na invalidní vozík
Elda - mladší syn Luba a Kristy, velký sportovec (fotbal, gymnastika)
Větrák - pracuje pro čínského výrobce televizí TCL, rád jezdí na kole a hraje fotbal. Pije nealko pivo, dělá si srandičky
Katka - manželka Větráka, právnička, do práce v Praze jezdí vlakem
Adéla - dcera Větráka a Katky, spolužačka Aničky a Emy na Gymnáziu. Hraje tenis a poslouchá hudbu, ráda jezdí na koncerty po celé Evropě
Adam - syn Větráka a Katky, hraje florbal a chodí do první třídy. Je to rošťák a moc neposlouchá
Janek - hlavní grill master, u něj bude probíhat grilování, je to bývalý zahradník, má rád pivo
Petra - manželka Janka, ráda vaří a má ráda pivo
Kubík - syn Janka a Petry, hraje fotbal a jezdí na kole
Nina - dcera Janka a Petry, chodí do druhé třídy a je to rozumbrada
Jarda - hraje golf, manžel Vlastičky. Nebojí se všechny okolo sebe aktivovat a jít na pivo.
Vlastička - manželka Jardy
dr. Fíša - doktor urolog, hraje fotbal a když hraje, tak nezná bratra
Výčepní - vrchní v hospodě. Umí dobře čepovat pivo a dává k dobru fun-facty o pivu
Trenérka - pohledná fitness trenérka, která cvičí v Posilovně 21. Specializuje se na kardio a vyrýsování hýždí. Jan Š k ní chodí pravidelně trénovat
Kněz - narcistický kněz trpící silnou xenofobií a rád dělá vtípky na černochy
Jan Hus - oživlá mozaika v Kostele, promlouvá k Janu Š., aby si při grilování dával pozor a neusnul příliš blízko ohně.. Je vtipnej a dělá si se sebe legraci


---

## 📦 PŘEHLED PŘEDMĚTŮ, JEJICH HODNOT A KOMB

| # | Předmět | Získáno v | Snížení ospalosti | Kombo (+bonus) | Anti-kombo (-penal) |
|---|---------|-----------|-------------------|----------------|---------------------|
| 1 | Katalog Volva V70 | Dům Krečů | 30 | +5 s Helmou | — |
| 2 | Smeták | Dům Šulců | 15 | +10 po Párátkách | zrušení s Kýblem |
| 3 | Pixla Nandralonu | Posilovna 21 | 20 | +15 s Panákem zelené | — |
| 4 | Párátka do očí | Dům dr. Fíši | 40 | +10 s Bundou | zrušení s Helmou |
| 5 | Plzníňka | Dům Óóček | 20 | — | –10 s Panákem, zrušení Svěcené |
| 6 | Kolíčky na bradavky | Dům Franců | 35 | +10 s Kýblem | — |
| 7 | Helma proti usnutí | Dům Větráků | 35 | +5 s Katalogem | zrušení Párátek |
| 8 | Svěcená voda | Kostel | 20 (40 jako první) | ×2 jako první předmět | zrušení po Plzni/Panáku |
| 9 | Kýbl ledové vody | Dům Vacků | 20 | +10 s Kolíčky | zrušení Bundy |
| 10 | Panák zelené s Redbullem | Kozlovna | 30 | +15 s Nandralonem | –10 s Plzní, zrušení Svěcené |

---

## 💬 DIALOGY V LOKACÍCH

### 1. DŮM ŠULCŮ (Bunda Elan naruby, 15)
**Prostředí:** Obývák s velkým gaučem. Jan Š. na něm leží, Garp mu olizuje obličej. Markéta stojí opodál opřená o koště, Anička drží budík, Emma maluje transparent „NESPINKY TATÍNKU, NE!“.

**Markéta:** „No nazdar! To jdeš zachránit situaci? Tenhle můj milovaný manžel už zase klimbá a grilovačka ještě nezačala! Co s ním budeme dělat?“

**Možnosti:**
A) „Nechte ho spát, grilovačka počká, ne?“
B) „Markét, vyprávěj mi, co na něj platí – co to máš v ruce?“
C) „Garp vypadá, že by se s ním proběhl!“

**Správná: B**  
Markétě se rozzáří oči: *„Anička jednou zjistila, že když dáš Honzovi do ruky koště nebo smeták, stane se z něj mix Jimiho Hendrixe a Mike Jaggera a okamžitě vyskočí!“*

Anička podává bundu: *„Hlavně mu to dej, až bude fakt zle. A pozor, kdybys ho předtím polil vodou, tak smeták ztratí kouzlo – bude mu to jedno, protože už bude mokrej.“* (náznak anti-komba s Kýblem)

**Po získání:** Hráč má **Smeták-kytaru**.
**Ikona 🧹 smetáku**

---

### 2. DŮM VACKŮ (Kýbl ledové vody, 20)
**Prostředí:** Zahrada s bazénem. Váca stojí u grilu, v ruce hasák, na hlavě čelovku. Alena pracuje na notebooku na lehátku v bazénu. Na sobě má tričko "I ❤️ HO". Emča s Honzou hrají ping-pong, Honza při tom telefonuje přes FaceTime.

**Váca:** „Čau, je mi jasný proč jsi tady! Honza zase klimbá, že jo? Já ti řeknu, jednou jsem na něj vytáhnul kýbl ledový vody a to ho hned probralo! Chceš to zkusit?“

**Možnosti:**
A) „Váco, nemáš radši studený pivko?“
B) „Ledovou vodu? Jo, to by mohlo zabrat! Díky za tip.“
C) „Kdepak voda, na Honzu platí jen četba výročních zpráv EMB zpětně od roku 2015.“ 

**Správná: B**  
Váca jásá: *„Přesně! Naber vodu z bazénu, hoď do ní kostky ledu a máš to! A mimochodem – když to zkombinuješ s něčím, co ho štípne, to bude teprve jízda!“* (náznak komba s Kolíčky)

Alena od notebooku procedí: *„Ale nepoužívej to, když bude vybrnkávat kytarový sólo na smeták... To pak nemá efekt.“* (náznak anti-komba se Smetákem)

**Po získání:** Hráč má **Kýbl ledové vody**.
**Ikona 🫗 vody**

---

### 3. DŮM KREČŮ (Katalog Volva V70, 30)
**Prostředí:** Obývák zaplněný časopisy, počítači a hračkami. Thea sedí za stolem a natáčí TikTok na mobil, Elda dělá stojku u zdi. Lubo listuje novinami a kouří dýmku.

**Lubo:** „Šulcíno? Ten usne vždycky, když se začne mluvit o něčem, co ho nebaví. Ale počkej – znám jeho slabost. Tady mám něco, co ho udrží vzhůru celou noc!“

**Možnosti:**
A) „Dáš mu kafe?“
B) „Něco o autech? Třeba nový katalog Volva? Jinou značku, využívající motory z traktorů neuznává“
C) „Sledování CNN a vývoje cen nemovitstí na Blízkém východě? – Když se baví "Velcí kluci", to ho vždycky rozhodí.“

**Správná: B**  
Lubo s úsměvem podává lesklý katalog: *„Přesně! Jakmile začne číst technický specifikace novýho Volva V70 Diesel, neusne. A co ti povím – kdybys mu pak dal ještě něco na hlavu, bude v tom číst jako v transu!“* (náznak komba s Helmou)

Thea dodává: *„Ale pozor, stará Volva ho dojímají a občas mu zvlhnou oči. Kdyby nemohl mrkat, totálně ho to rozhodí, přestane číst a začne řvát.“* (náznak anti-komba Párátka vs. Helma – ale to není přímé, spíše varování)

**Po získání:** Hráč má **Katalog nového Volva V70 diesel (edice Traktor)**.
**Ikona 🚗 auta**

---

### 4. DŮM VĚTRÁKŮ (Helma proti usnutí, 35)
**Prostředí:** Moderní obývák. Na obří TV TCL (přes celou zeď) běží fotbal. Adam běhá s florbalkou. Větrák pije nealko pivo a chechtá se. Katka stojí za žehlícím prknem a žehlí. Adélka sedí na zemi, na uších má velká sluchátka poslouchá písničky.

**Větrák:** „Hele, Šulcík usne vždycky, když skloní hlavu. Já už to ale vykoumal a sestrojil jsem mu speciální helmu - s hrotem! Když mu klesne hlava, napíchne se a to ho probere!“

**Možnosti:**
A) „To je krutý, ale účinný. Beru!“
B) „Nechci mu ublížit, radši mu zazpívám cikánské balady.“
C) „Nemáš radši polštářek s vůní levandulového pole?“

**Správná: A**  
Větrák září: *„Přesně, bez bolesti to nejde! A co teprve, když mu k tomu dáš číst něco o autech – bude sedět rovně jak svíčka!“* (náznak komba s Katalogem)

Katka od právnických lejster zvedne oči: *„Ale jestli si předtím aplikoval oční protispánkovou terapii, tak helma nepomůže – bude mít oči volné a může je zavřít i s helmou!“* (náznak anti-komba Helma ruší Párátka)

**Po získání:** Hráč má **Aerodynamickou helmu proti usnutí**.
**Ikona 🪖 helmy**

---

### 5. DŮM ÓÓČEK (Plzníňka, 20)
**Prostředí:** Zahrada s grilem a dřevěnou boudou plnou nářadí a nepořádku. Janek rozdělává oheň, Petra nese pivo, Kubík kope do míče, Nina drží tabulku „GRILOVAČKA ZAČÍNÁ!“.

**Janek:** „Nazdar! Honza už zase spí? To chce Plzníňku! Tady máš čerstvě natočenou – to ho probere!“

**Možnosti:**
A) „Alkohol? Pro Honzu nikdy!! To ho spíš uspí, ne?“
B) „Díky, jedno pivo nikoho nezabije!“
C) „Nemáš radši tip na jogínské pozice? Třeba pozici Kobry, aby si Honza otevřel čakry?“

**Správná: B**  
Janek se chechtá: *„Jedno pivko ho probere. Ale bacha – když pak do něj kopneš panáka zelený, bude z toho akorát unavenej alkáč.“* (náznak anti-komba Plzníňka → Panák zelené)

Petra dodává: *„A hlavně mu nedávej nic svatýho po hospodě – to by se svatost smyla.“* (náznak anti-komba Plzně ruší Svěcenou vodu)

**Po získání:** Hráč má **Půllitr vychlazené tankové Plzníňky**.
**Ikona 🍺 piva**

---

### 6. DŮM FRANCŮ (Kolíčky na bradavky, 35)
**Prostředí:** Obývák s vinotékou a golfovými trofejemi. Jarda právě otvírá láhev, Vlastička krájí sýr.

**Jarda:** „Víš, co je na golfu nejdůležitější? Soustředění. A na Honzu platí tohle – přinesl jsem to pro jistotu.“ (tajemně ukazuje dřevěné kolíčky se srdíčkem)

**Možnosti:**
A) „To je... kolíček na prádlo?“
B) „Na co to je? Na bradavky?!“
C) „Jardo, ty jsi úchyl. Ale beru to!“

**Správná: B i C** 
Jarda se rozesměje: *„Věděl jsem, že to pochopíš! Když to dáš dohromady s ledovou vodou, bude to jako na mistrovství světa v křiku!“* (náznak komba s Kýblem)

Vlastička tiše poznamená: *„Jen mu to neaplikuj v okamžiku, kdy bude vybrnkávat kytarové sólíčko... to by si ty kolíčky tak neužil.“* (náznak anti-komba – Bundy a Ledové? Spíš nic, ale hravá poznámka; ve skutečnosti anti-kombo není, ale narážka na to, že bunda kryje bradavky)

**Po získání:** Hráč má **Kolíčky na bradavky**.
**Ikona 🧷 sponky**

---

### 7. DŮM DOKTORA FÍŠI (Párátka do očí, 40)
**Prostředí:** Ordinace s modely urologických orgánů, obrázků, rentgeny a všude spousta lahví alkoholu. Doktor Fíša v horolezeckém postroji míchá něco v baňce.

**Dr. Fíša:** „Kolego, spánek je přežitek! Tady mám svůj patent – profesionální držáky očí. Zaveď je Honzovi, až bude usínat a úspěch zaručen, garantuju! A ano - jsou to párátka“

**Možnosti:**
A) „To zní jako mučení, ne?“
B) „Dobře, ale jen jestli to fakt funguje.“
C) „Nechci mu vypíchnout oko, nemáš raději třeba prášky proti spaní!“

**Správná: B**  
Fíša je nadšený: *„Správná volba! A poslouchej – když mu potom ještě dáš do ruky hudební nástroj, bude mít oči dokořán, bude brnkat a myslet si, že je superstar, takže neusne dvojnásob!“* (náznak komba s Bundou)

*„Ale hlavně, ať si nebere nic na hlavu, mohlo by mu to tlačit na spánky a párátka by vypadla!“* (náznak anti-komba Helma ruší Párátka)

**Po získání:** Hráč má **Párátka do očí (patent dr. Fíši)**.
**Ikona 🥢 hůlek**

---

### 8. KOZLOVNA (Panák zelené s Redbullem, 30)
**Prostředí:** Hospoda s výčepem. Výčepní leští půllitry.

**Výčepní:** „Fun fact: víte, že směs Red Bullu a zelené peprmintky dokáže nakopnout i mrtvého koně? Chceš to zkusit na Honzu?“

**Možnosti:**
A) „Namíchej mi to! Ale ať je to silný!“
B) „Dej mi radši klasický pivo, to je jistota.“
C) „Ne, díky, já nechci, aby mu explodovalo srdce.“

**Správná: A**  
Výčepní s ďábelským úsměvem mixuje: *„Tady to máš! A víš co? Kdybys do něj ještě kopnul nějaký ty bombónky, co se prodávaj v posilovně, bude z něj učiněnej zelenej Hulk!“* (náznak komba s Pixlou Nandralonu)

*„Ale dej si bacha – kdybys to zkombinoval s pivem, bude z toho jenom unavenej opilec.“* (náznak anti-komba s Plzní)

**Po získání:** Hráč má **Panák zelené s Redbullem**.
**Ikona 🍸 drinku**

---

### 9. POSILOVNA 21 (Pixla Nandralonu, 20)
**Prostředí:** Kardio zóna, zrcadla, činky. Sexy trenérka předcvičuje dřepy.

**Trenérka:** „Čau! Neříkej mi, že Honzovi zase klesl tep pod 40? To chce něco na prokrvení! Mám tady exkluzivní pixličku Nandralónku – je to sice pro koně, ale funguje to i na lidi. Dřepy + tohle = neusne!“

**Možnosti:**
A) „To je doping, ne? To Jan nemůže.“
B) „Radši ho vezmu na kardio a dáme 500 angličáků, to ho taky prokrví.“
C) „Super, aspoň mu narostou svaly a bude vzhůru!“

**Správná: C**  
Trenérka mrkne: *„Přesně! A jestli to zapiješ tím zeleným bejčím ionťákem, bude z něj nezastavitelný stroj!“* (náznak komba s Panákem)

*„Ale jestli si předtím dal pivo, tak to nebude tak efektivní – alkohol ředí účinek.“* (dodatečná informace, není přímé anti-kombo, ale varování)

**Po získání:** Hráč má **Extra velkou pixlu Nandralonu**.
**Ikona 💊 pilulky**

---

### 10. KOSTEL (Svěcená voda, 20/40)
**Prostředí:** Lavice, oltář, svaté obrázky. Kněz stojí u kazatelny, v pozadí obraz Jana Husa na hranici.

**Kněz:** „Synu, spánek je hřích! Zde je svěcená voda proti démonům ospalosti. Chceš ji?“

**Možnosti:**
A) „Amen, vezmu si ji. Požehnej buď Ježíš Kristus“
B) „Nevěřím na zázraky, radši mu dám kafe.“
C) „Nechci, aby ze mě vymítal ďábla.“

**Správná: A**  
Kněz pokropí flakónek: *„Požehnejž tobě i téhle vodě. A pamatuj – pokud ji použiješ jako první věc večera, její síla se zdvojnásobí!“* (náznak komba jako první předmět)

Jan Hus z obrazu promluví: *„Ale po pivu a zelený, příteli, ta svatost odchází jako pára nad hrncem. Žehu zdar!“* (náznak anti-komba s Plzní/Panákem)

**Po získání:** Hráč má **Svěcenou vodu** (20, ale ×2 jako první).
**Ikona 🥛 sklenice**

---

## 🏁 GRILOVAČKA (finální lokace) – kostra
**Čas:** 18:00 – 08:00  - hodiny běží zrychleně, každou 1 vteřinu se čas posune o 10 minut.
**Indikátor ospalosti:** roste souběžně rychle s hodinami, při 80 se zastaví, hráč vybírá předmět. (proveď výpočet tak, aby se na hodnotu 80 dostal cca každou celou hodinu času)
**Cíl:** Vydržet co nejdéle, ideálně do 08:00.

**Hlášky pro jednotlivé intervaly:**
- 18:00: *„Tak jo, grilovačka začíná! Cejtim čuníka!“*
- Při 80 poprvé: *„Hele, mně se začínaj klížit oči... máš něco, co by mě udrželo při životě?“*
- Po použití předmětu: (viz individuální Komentáře Jana Š.)
- Po vyčerpání předmětů: *„Už nic nemáš? Tak já jdu spát...“* — hra končí.
- Pokud přežije do rána: *„Ty vole, to byla noc! Já to dal! A kdo je tady legenda?!“*

---

## 🕹️ MINIHRY - vždy po rozhovoru s postavou se musí hra dokončit, aby se získal předmět
1. Dům Šulců
Pexeso: najdi Garpa (mix domácích zvířat, zejména různí psi), Počet párů: 25, Obtížnost: 2

2. Dům Vacků
Přesmyčky: Vácovo vtipný slovník (slovní přesmyčky 6-10 písmen), Počet přesmyček: 8, Obtížnost: 2

3. Dům Krečů
Sudoku: Krečdoku (klasické číselné sudoku, doplňují se jen 4 čísla), Obtížnost: 2

4. Dům Větráků
Zručnost: Let vlaštovky (Vlaštovka s vrtulkou nahoře a dole prolétává zleva doprava mezi 2 hranicemi - lesem dole a mraky nahoře. Hráč pomocí šipek nahoru/dolů vlaštovku ovládá aby dolétla až k cíli. Musí vlaštovku udržet v letu alespoň 20 sekund) Obtížnost: 2

5. Dům Óóček
Paměťová sekvence: Jankova světýlka (zopakovat světelnou sekvenci, která se postupně prodlužuje. 4 světla v řadě, celkem 6 sekvencí, od nejlehčí (3 světla) po nejtěžší (8 světel)), Obtížnost: 3

6. Dům Franců
Hangman: Šibenice pana France (uhádnout celkem 5 slov, maximálně 6 chyb), Obtížnost: 4
Slova (náhodně a v náhodném pořadí, vždy bude lehká nápověda co se hádá): GRILOVÁNÍ, VINOTÉKA, GOLFOVÉ HŘIŠTĚ, PRVOHORY, PTAKOPYSK, LENOCHOD, KRUMPÁČ, ZMRTVÝCHVSTÁNÍ, VLKODLAK, ŘÍZEČEK, BAČKORY, PRATETA

7. Dům doktora Fíši
Vědomostní kvíz: Ordinace pana doktora Fišera (3 možnosti, pouze jedna správná. Vtipné medicínské otázky, fun-facty a situace) Celkem bude 5 otázek, tolerance je 1 chyba., Obtížnost: 2

8. Jednadváca (hospoda)
Postřehová hra: Natoč pivo (hráč pomocí šipek levá, pravá, nahoru, dolu pohybuje půllitrem a chytá do něj kapky piva - inspirace ruskou hrou Nu pagadi. Rychlost kapek z píp se neustále zrychluje), hráč musí celkem nachytal plný půllitr (celkem chytit 20 kapek), Obtížnost 3

9. Posilovna 21
Reakční hra: Dej si angličáky (Postava stojí a proti ní létají činky na úrovni hlavy a nohou, pomocí šipky nohoru postava vyskočí, pomocí šipky dolů udělá dřep - těmito pohyby se vyhýbá létajícím činkám. 2D arkádový pohled ve stylu Google Dinosaura), Aby úkol splnil musí úspěšně udělat 30 angličáků (tzn. vyhnout se 30 letícím činkám - rychlost se postupně zvyšuje) Obtížnost 2

10. Kostel
Hledačka: Najdi 5 rozdílů (porovnávání dvou obrázků, kde na jednom bude 5 rozdílů, které budou chytře zamaskované, Na nalezení všech 5 rozdílů je časový limit 90 sekund) Obtížnost 4
Dodám fotky, kde se pomocí AI vygeneruje 5 rozdílů.








## 📊 SHRNUTÍ KOMB PRO VÝVOJÁŘE

| Kombo | Podmínka | Bonus |
|-------|----------|-------|
| Párátka + Smeták | Párátka → Smeták | +10 |
| Kolíčky + Kýbl | Kolíčky → Kýbl | +10 |
| Katalog + Helma | Katalog → Helma | +5 |
| Nandralon + Panák | Nandralon → Panák | +15 |
| Svěcená jako první | První předmět = Svěcená | ×2 |
| Plzníňka + Panák | V libovolném pořadí | –10 |
| Plzníňka + Svěcená | Plzeň → Svěcená | Zrušení Svěcené |
| Panák + Svěcená | Panák → Svěcená | Zrušení Svěcené |
| Kýbl + Smeták | Kýbl → Smeták | Zrušení Bundy |
| Helma + Párátka | Helma → Párátka | Zrušení Párátek |

---

*Grilovačce zdar! 🍺🌭*