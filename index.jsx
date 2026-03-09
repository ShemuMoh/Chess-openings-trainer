import { useState, useCallback, useEffect } from "react";

// ==================== iOS STYLE CONSTANTS ====================
const IOS={
  bg:"#f2f2f7",bg2:"#ffffff",card:"#ffffff",sep:"#e5e5ea",text:"#1c1c1e",text2:"#8e8e93",text3:"#aeaeb2",
  accent:"#007aff",green:"#34c759",orange:"#ff9500",red:"#ff3b30",purple:"#af52de",teal:"#5ac8fa",
  radius:12,radiusSm:8,shadow:"0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.06)",
  font:"-apple-system,BlinkMacSystemFont,'SF Pro Display','SF Pro Text','Helvetica Neue',sans-serif",
};

// ==================== DATA ====================
const CATS=[
  {id:"open",name:"Open Games",desc:"1.e4 e5",icon:"⚔️"},
  {id:"semiopen",name:"Semi-Open",desc:"1.e4 (not e5)",icon:"🗡️"},
  {id:"closed",name:"Closed Games",desc:"1.d4 d5",icon:"🏰"},
  {id:"indian",name:"Indian Systems",desc:"1.d4 Nf6",icon:"🐘"},
  {id:"flank",name:"Flank Openings",desc:"1.c4, 1.Nf3, etc",icon:"🌀"},
];
const OPS=[
  {id:"ruy-lopez",cat:"open",name:"Ruy Lopez",eco:"C60",moves:"1.e4 e5 2.Nf3 Nc6 3.Bb5",side:"white",desc:"The king of openings. White pressures Black's center via the Nc6 pin.",strategy:"Long-term pressure on e5. Bishop retreats or exchanges on c6. Control d5, mount kingside attack.",
   vars:[{name:"Morphy Defence",moves:"3...a6 4.Ba4",desc:"Most common — Black chases the bishop."},{name:"Berlin Defence",moves:"3...Nf6",desc:"The 'Berlin Wall' — used by Kramnik to dethrone Kasparov."},{name:"Marshall Attack",moves:"3...a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 O-O 8.c3 d5",desc:"Famous gambit — pawn sacrifice for ferocious kingside attack."},{name:"Exchange",moves:"3...a6 4.Bxc6 dxc6",desc:"Doubles Black's pawns. Fischer loved this."}]},
  {id:"italian",cat:"open",name:"Italian Game",eco:"C50",moves:"1.e4 e5 2.Nf3 Nc6 3.Bc4",side:"white",desc:"One of the oldest openings. Bishop targets f7.",strategy:"Rapid development, aim for d4. Sharp or quiet depending on variation.",
   vars:[{name:"Giuoco Piano",moves:"3...Bc5",desc:"'Quiet game' — but sharp after 4.c3."},{name:"Evans Gambit",moves:"3...Bc5 4.b4",desc:"Bold pawn sacrifice. Fischer's 'perfect opening.'"},{name:"Fried Liver",moves:"3...Nf6 4.Ng5 d5 5.exd5 Nxd5 6.Nxf7",desc:"Spectacular Nxf7 sacrifice!"}]},
  {id:"scotch",cat:"open",name:"Scotch Game",eco:"C45",moves:"1.e4 e5 2.Nf3 Nc6 3.d4",side:"white",desc:"Immediate central challenge. Kasparov's revival.",strategy:"After 3...exd4 4.Nxd4, central knight + open lines.",vars:[{name:"Scotch Gambit",moves:"3...exd4 4.Bc4",desc:"Gambit d-pawn for rapid development."}]},
  {id:"kings-gambit",cat:"open",name:"King's Gambit",eco:"C30",moves:"1.e4 e5 2.f4",side:"white",desc:"Most romantic opening. Pawn sacrifice for attack.",strategy:"After 2...exf4 3.Nf3, open f-file and e5 control.",vars:[{name:"Accepted",moves:"2...exf4 3.Nf3",desc:"Main line."},{name:"Falkbeer Counter",moves:"2...d5",desc:"Black countergambits!"}]},
  {id:"petrov",cat:"open",name:"Petrov Defence",eco:"C42",moves:"1.e4 e5 2.Nf3 Nf6",side:"black",desc:"Ultra-solid mirror response.",strategy:"Counterattack e4 instead of defending e5.",vars:[]},
  {id:"vienna",cat:"open",name:"Vienna Game",eco:"C25",moves:"1.e4 e5 2.Nc3",side:"white",desc:"Prepares f4 flexibly.",strategy:"Delayed King's Gambit with more options.",vars:[]},
  {id:"four-knights",cat:"open",name:"Four Knights",eco:"C47",moves:"1.e4 e5 2.Nf3 Nc6 3.Nc3 Nf6",side:"white",desc:"Symmetric development with sharp lines.",strategy:"Flexible — Spanish, Scotch or Italian style.",vars:[]},
  {id:"sicilian",cat:"semiopen",name:"Sicilian Defence",eco:"B20",moves:"1.e4 c5",side:"black",desc:"Most popular response to 1.e4.",strategy:"Exchange c-pawn for d-pawn — imbalanced play with winning chances for both.",
   vars:[{name:"Najdorf",moves:"2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6",desc:"Fischer's weapon. Most analyzed variation."},{name:"Dragon",moves:"2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6",desc:"Fianchetto the dragon. Yugoslav Attack chaos."},{name:"Sveshnikov",moves:"2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 e5",desc:"Bold ...e5, accepting d5 hole for activity."},{name:"Alapin",moves:"2.c3",desc:"Prepares d4 with pawn support. Avoids theory."},{name:"Smith-Morra",moves:"2.d4 cxd4 3.c3",desc:"Pawn sacrifice for development."}]},
  {id:"french",cat:"semiopen",name:"French Defence",eco:"C00",moves:"1.e4 e6",side:"black",desc:"Solid and strategic. Pawn chain but locked bishop.",strategy:"After 2.d4 d5, tension e4 vs d5. Challenge: develop c8 bishop.",
   vars:[{name:"Advance",moves:"2.d4 d5 3.e5",desc:"White grabs space."},{name:"Winawer",moves:"2.d4 d5 3.Nc3 Bb4",desc:"Sharp! Pin the knight."},{name:"Tarrasch",moves:"2.d4 d5 3.Nd2",desc:"Avoids Bb4 pin."},{name:"Exchange",moves:"2.d4 d5 3.exd5 exd5",desc:"Symmetrical. Small White edge."}]},
  {id:"caro-kann",cat:"semiopen",name:"Caro-Kann",eco:"B10",moves:"1.e4 c6",side:"black",desc:"Rock-solid. Bishop stays free.",strategy:"After 2.d4 d5, solid position. Slightly passive but no weaknesses.",
   vars:[{name:"Classical",moves:"2.d4 d5 3.Nc3 dxe4 4.Nxe4 Bf5",desc:"Bishop out before ...e6."},{name:"Advance",moves:"2.d4 d5 3.e5",desc:"White grabs space."},{name:"Panov-Botvinnik",moves:"2.d4 d5 3.exd5 cxd5 4.c4",desc:"IQP play. Dynamic."}]},
  {id:"pirc",cat:"semiopen",name:"Pirc Defence",eco:"B07",moves:"1.e4 d6 2.d4 Nf6 3.Nc3 g6",side:"black",desc:"Hypermodern — let White build, then attack.",strategy:"Fianchetto, wait for overextension.",vars:[{name:"Austrian Attack",moves:"4.f4",desc:"Massive center. Dangerous."}]},
  {id:"alekhine",cat:"semiopen",name:"Alekhine's Defence",eco:"B02",moves:"1.e4 Nf6",side:"black",desc:"Provocative! Lure pawns forward.",strategy:"After 2.e5 Nd5 3.d4 d6, undermine the overextended center.",vars:[]},
  {id:"scandinavian",cat:"semiopen",name:"Scandinavian",eco:"B01",moves:"1.e4 d5",side:"black",desc:"Immediately challenges e4.",strategy:"Simple and direct. Avoids heavy theory.",vars:[{name:"Qxd5 Main",moves:"2.exd5 Qxd5 3.Nc3 Qa5",desc:"Queen retreats to a5."}]},
  {id:"qgd",cat:"closed",name:"Queen's Gambit Declined",eco:"D30",moves:"1.d4 d5 2.c4 e6",side:"black",desc:"Classical response. Hold d5, lock c8 bishop.",strategy:"Maintain d5. Break with ...c5 or ...e5. Battle of patience.",
   vars:[{name:"Orthodox",moves:"3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 Nbd7",desc:"Traditional setup."},{name:"Tartakower",moves:"3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O 6.Nf3 h6 7.Bh4 b6",desc:"Solve bishop with ...Bb7."}]},
  {id:"qga",cat:"closed",name:"Queen's Gambit Accepted",eco:"D20",moves:"1.d4 d5 2.c4 dxc4",side:"black",desc:"Capture c4 for free development.",strategy:"Develop while White recaptures.",vars:[]},
  {id:"slav",cat:"closed",name:"Slav Defence",eco:"D10",moves:"1.d4 d5 2.c4 c6",side:"black",desc:"Supports d5, keeps bishop free.",strategy:"Play ...Bf5 before ...e6, or ...dxc4/...b5.",
   vars:[{name:"Semi-Slav",moves:"3.Nf3 Nf6 4.Nc3 e6",desc:"Hybrid. Sharp Meran systems."},{name:"Meran",moves:"3.Nf3 Nf6 4.Nc3 e6 5.e3 Nbd7 6.Bd3 dxc4 7.Bxc4 b5",desc:"Sharpest line."}]},
  {id:"london",cat:"closed",name:"London System",eco:"D02",moves:"1.d4 d5 2.Nf3 Nf6 3.Bf4",side:"white",desc:"Universal system. Same setup vs everything.",strategy:"Bf4, e3, Bd3, Nbd2, c3 — solid pyramid.",vars:[]},
  {id:"catalan",cat:"closed",name:"Catalan",eco:"E01",moves:"1.d4 Nf6 2.c4 e6 3.g3",side:"white",desc:"Fianchetto g2. Kramnik's favorite.",strategy:"g2 bishop crushes queenside.",vars:[{name:"Open",moves:"3...d5 4.Bg2 dxc4",desc:"Black captures c4."},{name:"Closed",moves:"3...d5 4.Bg2 Be7",desc:"Holds center. Positional."}]},
  {id:"kid",cat:"indian",name:"King's Indian Defence",eco:"E60",moves:"1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6",side:"black",desc:"Most aggressive defence. Kingside storm.",strategy:"After d5, center locks. Black attacks kingside, White expands queenside.",
   vars:[{name:"Classical",moves:"5.Nf3 O-O 6.Be2 e5",desc:"Main line. Center closes after d5."},{name:"Sämisch",moves:"5.f3",desc:"Reinforce e4. Aims for Be3, Qd2."},{name:"Four Pawns",moves:"5.f4",desc:"All center pawns forward!"}]},
  {id:"nimzo",cat:"indian",name:"Nimzo-Indian",eco:"E20",moves:"1.d4 Nf6 2.c4 e6 3.Nc3 Bb4",side:"black",desc:"Most respected defence. Bb4 pin.",strategy:"Pin Nc3, trade bishop for structural damage.",
   vars:[{name:"Classical (4.Qc2)",moves:"4.Qc2",desc:"Avoids doubled pawns."},{name:"Rubinstein (4.e3)",moves:"4.e3",desc:"Solid."},{name:"Sämisch (4.a3)",moves:"4.a3 Bxc3+ 5.bxc3",desc:"Provokes trade. Bishop pair compensates."}]},
  {id:"queens-indian",cat:"indian",name:"Queen's Indian",eco:"E12",moves:"1.d4 Nf6 2.c4 e6 3.Nf3 b6",side:"black",desc:"Fianchetto b7. Solid and positional.",strategy:"Bb7 fights for e4. Avoids sharp Nimzo lines.",vars:[]},
  {id:"grunfeld",cat:"indian",name:"Grünfeld Defence",eco:"D70",moves:"1.d4 Nf6 2.c4 g6 3.Nc3 d5",side:"black",desc:"Dynamic — strike center with ...d5.",strategy:"White gets powerful center; Black's g7 bishop attacks it relentlessly.",
   vars:[{name:"Exchange",moves:"4.cxd5 Nxd5 5.e4 Nxc3 6.bxc3 Bg7 7.Bc4",desc:"Main line. Center vs bishop."}]},
  {id:"benoni",cat:"indian",name:"Benoni Defence",eco:"A60",moves:"1.d4 Nf6 2.c4 c5 3.d5 e6",side:"black",desc:"Asymmetric and dynamic.",strategy:"Queenside majority and c-file vs central space.",vars:[]},
  {id:"dutch",cat:"indian",name:"Dutch Defence",eco:"A80",moves:"1.d4 f5",side:"black",desc:"Aggressive. Fight for e4.",strategy:"Classical, Stonewall, or Leningrad systems.",vars:[{name:"Stonewall",moves:"2.c4 Nf6 3.g3 e6 4.Bg2 d5",desc:"Wall on d5-e6-f5."},{name:"Leningrad",moves:"2.c4 Nf6 3.g3 g6",desc:"Dutch + KID."}]},
  {id:"english",cat:"flank",name:"English Opening",eco:"A10",moves:"1.c4",side:"white",desc:"Flexible flank opening.",strategy:"Can transpose or stay unique. Fianchetto g2.",vars:[{name:"Symmetrical",moves:"1...c5",desc:"Mirror. Strategic."},{name:"Reversed Sicilian",moves:"1...e5",desc:"Sicilian with extra tempo."}]},
  {id:"reti",cat:"flank",name:"Réti Opening",eco:"A04",moves:"1.Nf3 d5 2.c4",side:"white",desc:"Hypermodern. Attack d5 from flank.",strategy:"Fianchetto, undermine center.",vars:[]},
  {id:"bird",cat:"flank",name:"Bird's Opening",eco:"A02",moves:"1.f4",side:"white",desc:"Fight for e5.",strategy:"Control e5, kingside attack.",vars:[]},
  {id:"kia",cat:"flank",name:"King's Indian Attack",eco:"A07",moves:"1.Nf3 d5 2.g3 c5 3.Bg2 Nc6 4.O-O",side:"white",desc:"Fischer's universal system.",strategy:"Nf3, g3, Bg2, O-O, d3, e4.",vars:[]},
];

// ==================== MOVE-BY-MOVE TEACHING ====================
// Each opening has commentary for every book move (by index).
// Even indices = White moves, Odd = Black moves (from move string order)
// ==================== MOVE-BY-MOVE TEACHING ====================
const TEACH={
  "ruy-lopez":[
    "1.e4 — White seizes the center and opens diagonals for the bishop and queen. In the Ruy Lopez, this pawn becomes part of a central duel that defines the entire middlegame.",
    "1...e5 — Black mirrors the center grab. Both pawns control key squares (d4/d5). This symmetrical tension is the hallmark of Open Games.",
    "2.Nf3 — The knight attacks e5 immediately. In the Ruy Lopez, this knight defends e4, attacks e5, and might later reroute to g3 or d4. Development with a threat — the ideal move.",
    "2...Nc6 — The most classical defense of e5. This knight will become a target — White's Bb5 will pressure it, and the entire opening revolves around this pin.",
    "3.Bb5 — The Ruy Lopez! The bishop doesn't capture yet — the *threat* is more powerful. By pinning Nc6, White creates indirect pressure on e5. First played by Ruy López de Segura in 1561 — still the king of all openings."
  ],
  "ruy-lopez/Morphy Defence":[
    "1.e4 — The gateway to the Ruy Lopez. This pawn anchors White's central strategy throughout the Morphy Defence.",
    "1...e5 — The e4-e5 tension is the engine that drives the Ruy Lopez — every piece placement revolves around these pawns.",
    "2.Nf3 — The most important minor piece in the Ruy Lopez — it attacks e5, supports d4, and controls key squares.",
    "2...Nc6 — In the Morphy Defence, this knight is the focal point. White's bishop targets it, and Black's setup manages this pressure.",
    "3.Bb5 — The Ruy Lopez pin! Analyzed for 500 years, still the most popular opening at every level.",
    "3...a6 — The Morphy Defence! Named after Paul Morphy, this asks the bishop: 'Stay and risk capture, or retreat?' It prepares ...b5 and is the single most played move in all of chess theory. Virtually every top Ruy Lopez game features 3...a6.",
    "4.Ba4 — The bishop retreats to a4 but stays on the diagonal, maintaining the pin on Nc6. The cat-and-mouse game between bishop and knight defines the entire Ruy Lopez."
  ],
  "ruy-lopez/Berlin Defence":[
    "1.e4 — In the Berlin, this pawn gets traded early — a unique feature of this defense.",
    "1...e5 — Black sets up the center, but the counterattack comes immediately.",
    "2.Nf3 — Attacking e5. White expects Nc6...",
    "2...Nc6 — Standard defense, but Black has a surprise prepared.",
    "3.Bb5 — The Ruy Lopez.",
    "3...Nf6 — The Berlin Defence! Black ignores the pin and counterattacks e4. Kramnik used this to dethrone Kasparov in 2000. The resulting 'Berlin Wall' endgame (after 4.O-O Nxe4 5.d4 Nd6 6.Bxc6 dxc6 7.dxe5 Nf5 8.Qxd8+ Kxd8) is ugly for Black but incredibly hard to crack. Kasparov couldn't break through in four games."
  ],
  "ruy-lopez/Marshall Attack":[
    "1.e4 — The first step toward one of chess's most spectacular gambits.",
    "1...e5 — The symmetry will be shattered spectacularly 8 moves later.",
    "2.Nf3 — Standard procedure — but Black is planning a long-term ambush.",
    "2...Nc6 — Every Marshall setup move looks calm, hiding the coming storm.",
    "3.Bb5 — The Ruy Lopez.", "3...a6 — Morphy Defence — gaining tempo.",
    "4.Ba4 — The bishop retreats, maintaining pressure.",
    "4...Nf6 — Developing toward e4. Building toward the big moment.",
    "5.O-O — White castles. The last peaceful move before Black springs the trap.",
    "5...Be7 — Calmly preparing to castle. The gambit works best with full development first.",
    "6.Re1 — Reinforcing e4 and controlling the e-file. Sensible — but Black is counting moves.",
    "6...b5 — Pushing the bishop back, gaining queenside space, and opening b7 for the bishop.",
    "7.Bb3 — The bishop settles on its strongest diagonal, targeting f7. White's position looks ideal.",
    "7...O-O — The stage is set. All pieces developed, king safe. Time for fireworks.",
    "8.c3 — Preparing d4 for the ideal center. Logical — but it walks into Marshall's ambush.",
    "8...d5! — BOOM! The Marshall Attack! Frank Marshall kept this gambit SECRET for years before unleashing it in 1918 against Capablanca. Black sacrifices the d-pawn for a ferocious kingside attack — rook to e8, bishop to d6 or b7, and White's king faces enormous pressure. Over 100 years later, Aronian, Caruana, and Anand still play it. One of the most beautiful gambits in chess history."
  ],
  "ruy-lopez/Exchange":[
    "1.e4 — In the Exchange, White's plan is to simplify toward an endgame.",
    "1...e5 — Symmetrical for now.", "2.Nf3 — Developing with pressure.", "2...Nc6 — Classical defense.",
    "3.Bb5 — The Ruy Lopez pin.",
    "3...a6 — Morphy Defence.",
    "4.Bxc6 — The Exchange! White captures immediately, doubling Black's pawns. Fischer played this devastatingly. White gets a 4-vs-3 kingside majority; Black's queenside majority is crippled by doubled c-pawns. The strategy: trade pieces, reach an endgame, grind the structural advantage.",
    "4...dxc6 — Black recaptures toward the center. The doubled pawns look ugly, but the d-file is open and the bishop pair shines in the middlegame. Structure vs. dynamics — the eternal battle."
  ],
  "italian":[
    "1.e4 — In the Italian, this pawn opens the diagonal for the bishop to target f7 — the weakest point in Black's starting position.",
    "1...e5 — Classical response. Both sides have a stake in the center.",
    "2.Nf3 — The knight develops toward e5 and supports the upcoming d4 advance.",
    "2...Nc6 — Black defends e5. White's pieces will converge on the center and f7 simultaneously.",
    "3.Bc4 — The Italian Game! One of the oldest openings (dating to the 1400s). The bishop targets f7 — defended only by the king. White plans rapid development and a d4 push. Rich, tactical middlegames await."
  ],
  "italian/Giuoco Piano":[
    "1.e4 — The Italian foundation. White opens lines for the light-squared bishop.",
    "1...e5 — Black must be careful about White's f7 pressure.",
    "2.Nf3 — Developing with a threat. The knight supports the coming d4 push.",
    "2...Nc6 — Solid defense on its best square.",
    "3.Bc4 — The Italian bishop targets f7.",
    "3...Bc5 — The Giuoco Piano ('Quiet Game' in Italian) — but deceptive! Both bishops stare at each other's f-pawns. After 4.c3 preparing d4, the game explodes into sharp tactics. White wants a massive center; Black must challenge with ...d5 or be squeezed."
  ],
  "italian/Evans Gambit":[
    "1.e4 — White is about to sacrifice material for a devastating development lead.",
    "1...e5 — Black answers normally.", "2.Nf3 — Standard Italian.", "2...Nc6 — Defending.",
    "3.Bc4 — The Italian bishop eyes f7.", "3...Bc5 — Giuoco Piano mirror.",
    "4.b4!? — The Evans Gambit! Invented by Welsh sea Captain William Evans (~1827). A full pawn sacrifice to deflect Black's bishop and build a massive center with c3+d4. After 4...Bxb4 5.c3, White gets open diagonals and crushing initiative. Fischer called it 'perfect for a swashbuckler.' The Evans teaches: time and initiative can outweigh material."
  ],
  "italian/Fried Liver":[
    "1.e4 — The first step toward the most dramatic knight sacrifice in opening theory.",
    "1...e5 — Black mirrors.", "2.Nf3 — Developing.", "2...Nc6 — Defending.",
    "3.Bc4 — In the Fried Liver, this bishop isn't just positional — it's preparation for assault.",
    "3...Nf6 — The Two Knights Defense! Counterattacking e4 — aggressive but dangerous.",
    "4.Ng5 — Both knight and bishop target f7! Two pieces on the weakest square creates immediate tactical danger.",
    "4...d5 — The only good answer! Black sacrifices a pawn to open lines.",
    "5.exd5 — White grabs the pawn. Sharp and tactical.",
    "5...Nxd5 — Black recaptures... walking into the spectacular sacrifice.",
    "6.Nxf7!! — The FRIED LIVER! White sacrifices the knight, ripping open Black's king. After Kxf7, Qf3+ drags the king into the center. The name (Fegatello in Italian) means Black's king gets 'cooked.' The most famous attacking combination for beginners — terrifying to face unprepared!"
  ],
  "scotch":[
    "1.e4 — In the Scotch, the plan is immediate central confrontation.",
    "1...e5 — The symmetry won't last long.",
    "2.Nf3 — White is about to strike immediately instead of slow maneuvering.",
    "2...Nc6 — Black expects 3.Bb5 or 3.Bc4...",
    "3.d4 — The Scotch Game! White rips open the center on move three. After 3...exd4 4.Nxd4, the knight controls c6, e6, f5, and b5. Kasparov revived it in the 1990s against Karpov. Direct, aggressive, and theoretically sound."
  ],
  "scotch/Scotch Gambit":[
    "1.e4 — Maximum aggression from the start.", "1...e5 — Classical.", "2.Nf3 — Tempo.", "2...Nc6 — Defending.",
    "3.d4 — The Scotch pawn strike!",
    "3...exd4 — Black captures. Now White chooses...",
    "4.Bc4 — The Scotch Gambit! White ignores the d4 pawn and develops the bishop, targeting f7. Why recapture when you can develop with threats? The pawn sacrifice brings rapid deployment and f7 pressure. Development + initiative > a pawn."
  ],
  "kings-gambit":[
    "1.e4 — The starting move of the most romantic opening in chess history.",
    "1...e5 — What comes next changed chess forever.",
    "2.f4 — The King's Gambit! White offers the f-pawn to tear open the f-file. The opening of the Romantic era — Morphy, Anderssen, Spassky all played it devastatingly. The king is slightly exposed, but the f-file becomes a highway to Black's king. Are you brave enough?"
  ],
  "kings-gambit/Accepted":[
    "1.e4 — Preparing the sacrifice.", "1...e5 — Setting up the gambit.",
    "2.f4 — The King's Gambit!",
    "2...exf4 — Accepted! Black takes. The e5 square is vacant for White's pieces.",
    "3.Nf3 — Develops with tempo, preventing 3...Qh4+. Now: Bc4 targeting f7, d4 for the center, O-O blasting the f-file open. The classic plan: castle, push d4, use the f-file as an attacking highway."
  ],
  "kings-gambit/Falkbeer Counter":[
    "1.e4 — Center.", "1...e5 — Classical.",
    "2.f4 — The King's Gambit — but Black has a counter-surprise!",
    "2...d5! — The Falkbeer Countergambit! Black strikes back with maximum aggression. After 3.exd5 e4, Black's pawn charges forward like a battering ram. Named after Ernst Falkbeer (1850s). 'You want to gambit? I'll out-gambit you!'"
  ],
  "petrov":[
    "1.e4 — White claims the center.", "1...e5 — Black isn't defending this conventionally.",
    "2.Nf3 — White attacks e5.",
    "2...Nf6 — Petrov's Defence! Instead of defending e5, Black counterattacks e4. Both pawns appear to hang. Critical trap: after 3.Nxe5, Black must NOT play 3...Nxe4?? (4.Qe2! wins). Correct: 3...d6 4.Nf3 Nxe4. Ultra-solid, slightly drawish — Caruana and Karjakin use it for safe Black games."
  ],
  "vienna":[
    "1.e4 — White has a sneaky plan.", "1...e5 — Expecting 2.Nf3.",
    "2.Nc3 — The Vienna Game! Queenside knight first, keeping f4 free for a delayed King's Gambit. Flexible: Vienna Gambit (3.f4), positional (3.Bc4), or Four Knights transposition. A surprise specialist's dream."
  ],
  "four-knights":[
    "1.e4 — Standard.", "1...e5 — Mirror.", "2.Nf3 — Developing.", "2...Nc6 — Defending.",
    "3.Nc3 — Symmetric development.",
    "3...Nf6 — The Four Knights! All four knights deployed. Looks peaceful but hides sharp lines: Halloween Gambit (4.Nxe5!?), Belgrade Gambit (4.d4), Spanish Four Knights (4.Bb5). Caruana uses it as a solid weapon avoiding heavy theory."
  ],
  "sicilian":[
    "1.e4 — White claims the center. This move starts the most important theoretical battles in chess.",
    "1...c5 — The Sicilian Defence! The most popular, most analyzed, most combative answer to 1.e4. Black refuses to mirror — the c-pawn fights for d4 from the side. The brilliant idea: when White plays d4 and Black takes cxd4, Black exchanges a flank pawn for a center pawn, creating asymmetry with a queenside majority and half-open c-file. The Sicilian produces decisive results more than any other opening — Fischer, Kasparov, and Carlsen all relied on it."
  ],
  "sicilian/Najdorf":[
    "1.e4 — The start of a journey into the deepest opening theory in chess.",
    "1...c5 — The Sicilian! Black aims for asymmetry and fighting chances.",
    "2.Nf3 — Developing naturally, preparing the d4 advance.",
    "2...d6 — Supporting ...Nf6 and establishing the Sicilian pawn backbone. Foundation for Najdorf, Dragon, and Scheveningen.",
    "3.d4 — White strikes the center! The critical moment.",
    "3...cxd4 — The fundamental Sicilian exchange: flank pawn for center pawn. Black gets the c-file and queenside majority; White gets central space and attacking chances.",
    "4.Nxd4 — The knight recaptures powerfully, controlling b5, c6, e6, and f5.",
    "4...Nf6 — Developing while attacking e4! Tempo is everything in the Sicilian.",
    "5.Nc3 — Defends e4 and completes knight development.",
    "5...a6 — The Najdorf! This modest pawn move is the most important in all of chess theory. It prevents Bb5+, prepares ...e5 or ...b5, maintains maximum flexibility. Fischer played almost nothing else. Kasparov called it his 'life's work.' The Najdorf is the sharpest, deepest, most theoretically demanding opening in chess — a true test of preparation, calculation, and nerve."
  ],
  "sicilian/Dragon":[
    "1.e4 — The start of one of chess's wildest adventures.",
    "1...c5 — The Sicilian — Black wants imbalance and a fight.",
    "2.Nf3 — Standard development.", "2...d6 — The Sicilian structure takes shape.",
    "3.d4 — Opening the center.", "3...cxd4 — The Sicilian trademark exchange.",
    "4.Nxd4 — Knight takes the center.", "4...Nf6 — Attacking e4 with tempo.",
    "5.Nc3 — Defending e4.",
    "5...g6 — The Dragon! Black fianchettoes to g7, where the bishop becomes a 'dragon' breathing fire along the h8-a1 diagonal. In the Yugoslav Attack (6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.Bc4), both sides castle opposite and launch all-out pawn storms. Mutual sacrifices, king hunts, razor-sharp tactics. Not for the faint of heart — one inaccuracy is fatal."
  ],
  "sicilian/Sveshnikov":[
    "1.e4 — The Sveshnikov will challenge this pawn's dominance uniquely.",
    "1...c5 — Sicilian!", "2.Nf3 — Developing.", "2...Nc6 — Knight first (crucial for reaching the Sveshnikov).",
    "3.d4 — Center opens.", "3...cxd4 — Exchange.", "4.Nxd4 — Recapture.",
    "4...Nf6 — Pressuring e4.", "5.Nc3 — Defending.",
    "5...e5! — The Sveshnikov! Bold push kicking the knight from d4, seizing space. Yes, it leaves a gaping hole on d5 — but Black's activity compensates. Sveshnikov proved everyone wrong; Kramnik adopted it at the highest level. A revolutionary concept: dynamic compensation outweighs static weakness."
  ],
  "sicilian/Alapin":[
    "1.e4 — White isn't going for the massive Open Sicilian theory.",
    "1...c5 — Black expects 2.Nf3 and the theoretical battleground...",
    "2.c3 — The Alapin! White prepares d4 with pawn support, completely avoiding Najdorf/Dragon theory. The practical choice: a good position without needing a PhD in openings. Black responds with 2...d5 or 2...Nf6. Played by Tal, Adams, and Rozentalis at top level."
  ],
  "sicilian/Smith-Morra":[
    "1.e4 — White is about to spring a surprise gambit.", "1...c5 — Sicilian.",
    "2.d4 — Challenging immediately!", "2...cxd4 — Black captures.",
    "3.c3 — The Smith-Morra Gambit! A full pawn for explosive development and open lines. After 3...dxc3 4.Nxc3, White has the c-file and d-file ripped open, active pieces, and dangerous initiative. Esserman's 'Mayhem in the Morra' celebrates its attacking potential. Even GMs often decline it because the attacking chances are so dangerous."
  ],
  "french":[
    "1.e4 — Against the French, this pawn becomes the target of a fundamental tension.",
    "1...e6 — The French Defence! Black prepares ...d5 for next move, building a fortress. The trade-off defining the entire opening: the c8 bishop gets locked behind e6-d5. Solving that bishop is Black's central challenge. Trusted by Botvinnik, Petrosian, Kortchnoi, and MVL (Vachier-Lagrave)."
  ],
  "french/Advance":[
    "1.e4 — The center pawn that will march forward in the Advance.",
    "1...e6 — The French! Preparing ...d5.",
    "2.d4 — White builds the ideal center: e4+d4.", "2...d5 — Black strikes! The fundamental French tension.",
    "3.e5 — The Advance! White pushes forward, grabbing space. Black is cramped but has clear plans: ...c5 attacks the chain's base (d4), the knight maneuvers to f5 via e7, and the bishop goes to b7 or a6. Nimzowitsch's pawn chain theory was built on these positions."
  ],
  "french/Winawer":[
    "1.e4 — In the Winawer, this pawn advances to create a space advantage.",
    "1...e6 — French! Setting up ...d5.",
    "2.d4 — The ideal center.", "2...d5 — The French challenge.",
    "3.Nc3 — Defending e4. This allows Black's sharpest option...",
    "3...Bb4 — The Winawer! Named after Szymon Winawer — the most aggressive French line. Black pins the knight, pressuring the center. After 4.e5 c5 5.a3 Bxc3+ 6.bxc3, White has the bishop pair and space but shattered pawns. Razor-sharp and heavily theoretical. Botvinnik pioneered it; today it's the weapon for maximum fighting chances."
  ],
  "french/Tarrasch":[
    "1.e4 — Center.", "1...e6 — French!",
    "2.d4 — Full center.", "2...d5 — The French challenge.",
    "3.Nd2 — The Tarrasch! Knight on d2 instead of c3 avoids the Winawer pin entirely. From d2, it supports e4 and can reroute to f3 or b3. Korchnoi's favorite — leading to quieter but deeply complex positional battles."
  ],
  "french/Exchange":[
    "1.e4 — Center.", "1...e6 — French!",
    "2.d4 — Full center.", "2...d5 — Challenge.",
    "3.exd5 — The Exchange. White resolves the tension by trading. After 3...exd5, the position is symmetrical — some call it 'the coward's French.' But White retains the initiative of the first move, and even symmetry offers winning chances for the skilled player."
  ],
  "caro-kann":[
    "1.e4 — White claims the center. The Caro-Kann response is subtle but deeply logical.",
    "1...c6 — The Caro-Kann! Like the French (...e6), it prepares ...d5 — but with a crucial difference: the c8 bishop stays FREE. After ...d5, the bishop develops to f5 or g4 BEFORE ...e6. Rock-solid with no bad bishop. Used by Karpov, Anand, Kramnik, and every player who values solidity."
  ],
  "caro-kann/Classical":[
    "1.e4 — White builds the platform Black is about to challenge.",
    "1...c6 — The Caro-Kann! Preparing ...d5 while keeping the bishop free.",
    "2.d4 — White establishes the ideal center.", "2...d5 — The fundamental tension: e4 vs d5.",
    "3.Nc3 — White defends e4. Leads to the sharpest lines.",
    "3...dxe4 — Black captures! Opening the position to develop the bishop immediately.",
    "4.Nxe4 — Powerfully centralized knight on e4.",
    "4...Bf5 — The Classical Caro-Kann! THIS is why Black played ...c6 instead of ...e6. The bishop comes out BEFORE ...e6. It attacks the e4 knight and controls key light squares. Chess logic at its finest — the entire opening exists to make this one bishop move possible."
  ],
  "caro-kann/Advance":[
    "1.e4 — Center.", "1...c6 — Caro-Kann!",
    "2.d4 — The ideal center.", "2...d5 — Challenging White.",
    "3.e5 — The Advance! White grabs space like the French Advance — but the Caro-Kann player is better off. Black can immediately strike with ...c5 (c-pawn only moved once), and the bishop still gets out via f5. More comfortable for Black than the French Advance — which is why some French players switch to the Caro-Kann."
  ],
  "caro-kann/Panov-Botvinnik":[
    "1.e4 — Center.", "1...c6 — Caro-Kann!",
    "2.d4 — Full center.", "2...d5 — Challenge.",
    "3.exd5 — White exchanges.", "3...cxd5 — Black recaptures with the c-pawn. Symmetrical center.",
    "4.c4 — The Panov-Botvinnik Attack! White creates an IQP (Isolated Queen's Pawn) position. The isolated d-pawn gives dynamic piece play but is a long-term weakness. Botvinnik proved dynamic activity can outweigh structural weakness for dozens of moves. Transforms the quiet Caro-Kann into a sharp tactical battle."
  ],
  "pirc":[
    "1.e4 — In the Pirc, Black deliberately lets White build an enormous center.",
    "1...d6 — Modest but purposeful. Supports ...Nf6 and prepares the fianchetto.",
    "2.d4 — White happily takes the invitation: full pawn center.",
    "2...Nf6 — Nibbling at e4, creating minor annoyance.",
    "3.Nc3 — White defends and builds. The center looks imposing.",
    "3...g6 — The Pirc Defence! Black fianchettoes to g7, aiming at White's center like a sniper. The hypermodern philosophy: let the opponent overextend, then strike with ...c5 or ...e5 at the right moment. If White consolidates, Black is worse. If White overextends, the center collapses. Requires patience, nerve, and timing."
  ],
  "pirc/Austrian Attack":[
    "1.e4 — Center.", "1...d6 — Pirc — letting White build.",
    "2.d4 — Full center.", "2...Nf6 — Nibbling at e4.",
    "3.Nc3 — Defending.", "3...g6 — The Pirc fianchetto. Black invites White to go all-in...",
    "4.f4 — The Austrian Attack! Maximum pawn center: e4+d4+f4. Three pawns abreast — powerful but committal. The e1-h4 diagonal is weakened, and pawns can become targets. Black strikes with ...c5 or ...e5 to blast the center. Both sides going for the knockout."
  ],
  "alekhine":[
    "1.e4 — White takes the center. Black's response is one of the most provocative in chess.",
    "1...Nf6 — Alekhine's Defence! The knight taunts the e-pawn forward. After 2.e5 Nd5 3.d4 d6, White has a big center that's been lured forward — every advance creates weaknesses behind it. Alekhine: 'Lure the enemy pawns forward, then destroy them.' Provocative, counterintuitive, and enormous fun."
  ],
  "scandinavian":[
    "1.e4 — White claims the center. Black's reply is the most direct possible.",
    "1...d5 — The Scandinavian! No preparation, no subtlety — Black strikes e4 immediately. After 2.exd5 Qxd5, the queen comes out early (violating classical principles) but the resulting position is surprisingly solid. Low theory, practical, effective. Used by Tiviakov at GM level."
  ],
  "scandinavian/Qxd5 Main":[
    "1.e4 — The Scandinavian challenges this immediately.",
    "1...d5 — Direct confrontation on move one!",
    "2.exd5 — White captures.",
    "2...Qxd5 — The queen takes! Early queen development seems wrong — but it works here. The queen retreats to a safe, active square.",
    "3.Nc3 — Developing while attacking the queen.",
    "3...Qa5 — The main line! Safe and active. From a5, the queen pins Nc3 to the king (a5-e1 diagonal), prevents certain setups, and keeps options for ...c6, ...Nf6, ...Bf5. The Scandinavian's insight: rules can be broken when the concrete position justifies it."
  ],
  "qgd":[
    "1.d4 — Entering the world of closed games. The QGD is the most classical of all 1.d4 openings.",
    "1...d5 — Symmetrical center. Both sides have a firm grip on their halves.",
    "2.c4 — The Queen's Gambit! Despite the name, not a real gambit — if Black takes 2...dxc4, White recovers easily. The c4 pawn attacks d5, trying to dominate the center.",
    "2...e6 — The QGD! Black holds d5 with the e-pawn. The price: the c8 bishop is locked behind e6 (like the French). But the position is rock-solid — trusted by every world champion from Lasker to Carlsen."
  ],
  "qgd/Orthodox":[
    "1.d4 — The Orthodox QGD is chess at its most classical and refined.",
    "1...d5 — Solid and principled.",
    "2.c4 — The Queen's Gambit — challenging d5.",
    "2...e6 — Declined! Rock-solid center, accepting the locked bishop trade-off.",
    "3.Nc3 — Adding pressure to d5. Every piece focuses on this point.",
    "3...Nf6 — Defends d5 while developing and preventing e4.",
    "4.Bg5 — The Classical pin! If the knight moves, cxd5 exd5 and d5 is less protected. The pin threatens to win a pawn in some lines.",
    "4...Be7 — Breaking the pin by interposing. Natural and popular — no weaknesses created.",
    "5.e3 — Solid center. Supports d4 and opens Bd3's diagonal.",
    "5...O-O — King to safety, rooks connected.",
    "6.Nf3 — Completing kingside development. Harmonious piece placement.",
    "6...Nbd7 — The Orthodox Defence! Classical setup complete: knights on f6/d7, pawns on d5/e6, king castled. Black prepares ...c5 or ...e5 breaks. The bread and butter of championship chess for over a century — Capablanca, Alekhine, Botvinnik, Petrosian all fought critical games here."
  ],
  "qgd/Tartakower":[
    "1.d4 — Closed game territory.", "1...d5 — Symmetrical.",
    "2.c4 — Queen's Gambit.", "2...e6 — Declined!",
    "3.Nc3 — Pressuring d5.", "3...Nf6 — Defending.",
    "4.Bg5 — The classical pin.", "4...Be7 — Breaking it.",
    "5.e3 — Solid center.", "5...O-O — King safety.",
    "6.Nf3 — Completing development.",
    "6...h6 — Asking the bishop: stay and be captured, or retreat? Forces a permanent decision.",
    "7.Bh4 — The bishop retreats but maintains the pin through h4-d8.",
    "7...b6 — The Tartakower! Black solves the eternal QGD bishop problem by fianchettoing to b7. From b7, the bishop attacks e4 and d5 — active instead of imprisoned. Tartakower's revolutionary idea showed the 'bad bishop' can be liberated with creativity."
  ],
  "qga":[
    "1.d4 — Closed game.", "1...d5 — Mirror.",
    "2.c4 — The Queen's Gambit!",
    "2...dxc4 — Accepted! Black takes — not to hold it permanently, but to develop freely while White recovers the pawn. After ...Nf6, ...e6, ...c5, Black gets harmonious development and flexible structure. Kramnik and Anand have used it at the highest level."
  ],
  "slav":[
    "1.d4 — Closed game.", "1...d5 — Symmetrical.",
    "2.c4 — Queen's Gambit!",
    "2...c6 — The Slav! Supporting d5 with c6 instead of e6. Critical difference from QGD: the c8 bishop is completely FREE to develop to f5 or g4. Combines QGD solidity with Caro-Kann bishop freedom. One of the most reliable defenses — Euwe, Smyslov, and Kramnik swear by it."
  ],
  "slav/Semi-Slav":[
    "1.d4 — Closed game.", "1...d5 — Mirror.", "2.c4 — Gambit.",
    "2...c6 — The Slav!",
    "3.Nf3 — Developing.", "3...Nf6 — Mirror development.",
    "4.Nc3 — Increasing d5 pressure.",
    "4...e6 — The Semi-Slav! BOTH ...c6 AND ...e6 double-barricade d5. The bishop is locked in, but the position is fortress-solid yet leads to razor-sharp lines. The Meran, Anti-Meran, and Botvinnik System are legendary for depth. World championships decided here. Rare: fortress solidity + explosive tactical potential."
  ],
  "slav/Meran":[
    "1.d4 — Closed game.", "1...d5 — Mirror.", "2.c4 — Gambit.", "2...c6 — Slav!",
    "3.Nf3 — Develop.", "3...Nf6 — Mirror.",
    "4.Nc3 — Pressuring d5.", "4...e6 — Semi-Slav!",
    "5.e3 — Solid platform. Looks calm...",
    "5...Nbd7 — Preparing the dramatic ...dxc4 and ...b5 expansion.",
    "6.Bd3 — Active square, eyeing the kingside and h7.",
    "6...dxc4 — Black captures! The critical moment — preparing queenside expansion.",
    "7.Bxc4 — Recapturing, maintaining the active diagonal.",
    "7...b5 — The Meran! Aggressive queenside lunge. One of the sharpest positions in all of chess — entire books cover just the next 5-6 moves. Sacrifices, counter-sacrifices, razor-sharp complications. Named after Merano (1924 tournament). A true test of preparation at the highest level."
  ],
  "london":[
    "1.d4 — The London is about consistency — same setup against everything.",
    "1...d5 — In the London, it almost doesn't matter what Black plays.",
    "2.Nf3 — Knight first (before Bf4) prevents ...Qb6 hitting b2.",
    "2...Nf6 — Normal development.",
    "3.Bf4 — The London System! The bishop reaches f4 BEFORE e3 locks it in. The defining move. From here: e3, Bd3, Nbd2, c3 — a rock-solid pyramid. The ultimate 'system' opening: same moves regardless of Black's setup. Easy to learn, hard to refute. Hansen, Kamsky, even Carlsen in rapid games use it."
  ],
  "catalan":[
    "1.d4 — The Catalan is one of the most sophisticated openings in modern chess.",
    "1...Nf6 — Indian complex. The knight prevents e4.",
    "2.c4 — Taking more space.",
    "2...e6 — Preparing ...d5.",
    "3.g3 — The Catalan! White fianchettoes to g2 instead of Nc3 or Nf3. From g2, the bishop becomes a monster — pressuring the entire a8-h1 diagonal (b7, c6, d5). Kramnik's signature weapon, used to slowly suffocate opponents. The choice of the positional elite: Kramnik, Giri, Ding Liren."
  ],
  "catalan/Open":[
    "1.d4 — Long-term positional pressure ahead.", "1...Nf6 — Indian setup.",
    "2.c4 — Queenside space.", "2...e6 — Preparing ...d5.",
    "3.g3 — The Catalan fianchetto!",
    "3...d5 — Striking the center.",
    "4.Bg2 — The fianchetto complete! A laser beam cutting across the board — b7, c6, d5, all pressured.",
    "4...dxc4 — The Open Catalan! Capturing makes White's bishop MORE powerful — the diagonal is open. White recovers the pawn eventually; the real weapon is persistent diagonal pressure lasting 20-30 moves. Chess at its most refined."
  ],
  "catalan/Closed":[
    "1.d4 — Closed game.", "1...Nf6 — Indian.", "2.c4 — Space.", "2...e6 — Preparing ...d5.",
    "3.g3 — Catalan fianchetto.",
    "3...d5 — Challenging the center.",
    "4.Bg2 — The bishop takes its throne on g2.",
    "4...Be7 — The Closed Catalan! Black refuses to capture, holding the center. Deep positional battle: White exploits the bishop's power; Black aims for ...c5 or ...c6. A battle of patience and understanding — perfect for players who enjoy long strategic chess."
  ],
  "kid":[
    "1.d4 — Against the KID, this pawn becomes part of an enormous center Black deliberately allows — then tries to destroy.",
    "1...Nf6 — The Indian move! Develops the knight, stays flexible, prevents e4.",
    "2.c4 — White grabs more space. Two pawns abreast — empire building.",
    "2...g6 — The unmistakable sign of the King's Indian! Fianchetto incoming. The setup of warriors — Bronstein, Fischer, Kasparov, Radjabov.",
    "3.Nc3 — Continuing to build. The knight supports e4 and pressures d5.",
    "3...Bg7 — The 'dragon bishop' on g7! Staring down the h8-a1 diagonal at d4 and the queenside. In the middlegame, this bishop becomes one of the most powerful pieces on the board.",
    "4.e4 — The dream center: c4+d4+e4. Three central pawns — looks completely dominant. But this is exactly what Black WANTS.",
    "4...d6 — The King's Indian Defence! Black LETS White have the full center, planning to blow it up. After ...e5 and d5, the center locks and the game becomes a thrilling race — Black storms the kingside (f5-f4-g5-g4), White pushes the queenside (c5-b4-a4). The most dynamic, aggressive defense in chess. Play for a win or go down in flames."
  ],
  "kid/Classical":[
    "1.d4 — The Classical KID leads to the most fundamental pawn structure battle in chess.",
    "1...Nf6 — Maximum flexibility.", "2.c4 — Space grab.",
    "2...g6 — KID incoming!", "3.Nc3 — Building.", "3...Bg7 — Dragon bishop deployed.",
    "4.e4 — The massive center.", "4...d6 — KID! Black's modest pawn allows the full center — with a plan to smash it.",
    "5.Nf3 — The Classical. Most natural development — leads to the most theoretically important KID positions.",
    "5...O-O — Castle first, then attack. Every KID player knows this.",
    "6.Be2 — Solid development protecting the king.",
    "6...e5 — THE critical King's Indian move! Striking at d4. After 7.d5, the center LOCKS and the race begins. Black: f5, f4, g5, g4, Rf7-f8 — full kingside storm. White: c5, cxd6, b4, a4 — queenside expansion. The most exciting locked-center structure in chess. Welcome to the King's Indian."
  ],
  "kid/Sämisch":[
    "1.d4 — Center.", "1...Nf6 — Indian.", "2.c4 — Space.", "2...g6 — KID.",
    "3.Nc3 — Build.", "3...Bg7 — Dragon bishop.", "4.e4 — Full center.", "4...d6 — KID!",
    "5.f3 — The Sämisch! White reinforces e4 with f3, planning Be3, Qd2, castling QUEENSIDE, then launching a KINGSIDE attack with g4, h4. Both sides attack the same flank! Extremely violent and tactical. Petrosian, Spassky, Kramnik have all used it to punish KID players."
  ],
  "kid/Four Pawns":[
    "1.d4 — Center.", "1...Nf6 — Indian.", "2.c4 — Space.", "2...g6 — KID.",
    "3.Nc3 — Build.", "3...Bg7 — Dragon bishop.", "4.e4 — Full center.", "4...d6 — KID!",
    "5.f4 — The Four Pawns Attack! ALL four center pawns forward: c4, d4, e4, f4. Maximum ambition. But there's a fine line between dominance and overextension. Black strikes with ...e5 or ...c5 to blast it open. If the center collapses, White's on every light square with dark-square holes everywhere. High-risk, high-reward — thrilling from both sides."
  ],
  "nimzo":[
    "1.d4 — The Nimzo-Indian is Black's most respected response to this move.",
    "1...Nf6 — Indian knight prevents e4.",
    "2.c4 — Queenside space.",
    "2...e6 — Preparing two options: Nimzo (...Bb4) or QGD (...d5). White's next move decides.",
    "3.Nc3 — Natural — but creates a target.",
    "3...Bb4 — The Nimzo-Indian! Pinning Nc3 to the king. Widely considered THE most respected defence to 1.d4, invented by Aron Nimzowitsch. White can't play e4 easily, and if Black trades ...Bxc3, White gets doubled c-pawns. Black sacrifices the bishop pair for structural damage. Used by Capablanca, Botvinnik, Fischer, Kasparov, Kramnik, and Carlsen."
  ],
  "nimzo/Classical (4.Qc2)":[
    "1.d4 — Center.", "1...Nf6 — Indian.", "2.c4 — Space.", "2...e6 — Preparing the pin.",
    "3.Nc3 — The target.", "3...Bb4 — The Nimzo pin!",
    "4.Qc2 — The Classical (Capablanca Variation)! Queen to c2 prevents doubled pawns — if ...Bxc3, bxc3 with queen already defending. Also controls e4, preparing a future e4 advance. The most positional Nimzo approach. Capablanca systematized it."
  ],
  "nimzo/Rubinstein (4.e3)":[
    "1.d4 — Center.", "1...Nf6 — Indian.", "2.c4 — Space.", "2...e6 — Preparing.",
    "3.Nc3 — Target.", "3...Bb4 — Nimzo pin!",
    "4.e3 — The Rubinstein! Simple and solid — accepting doubled pawns might happen. Develop naturally: Bd3, Nf3, O-O, with the bishop pair as long-term compensation. Rubinstein understood that quiet, harmonious development is more dangerous than any sharp weapon. Rich strategic middlegames where understanding > memorization."
  ],
  "nimzo/Sämisch (4.a3)":[
    "1.d4 — Center.", "1...Nf6 — Indian.", "2.c4 — Space.", "2...e6 — Preparing.",
    "3.Nc3 — Target.", "3...Bb4 — Nimzo pin!",
    "4.a3 — The Sämisch! 'Take or retreat — decide now!' No middle ground.",
    "4...Bxc3+ — Black takes! Inflicting the doubled pawns — why Black played ...Bb4.",
    "5.bxc3 — Ugly doubled c-pawns but: bishop pair, extra central space, half-open b-file. White's dynamic bishops vs. Black's superior structure. One of chess's great strategic duels."
  ],
  "queens-indian":[
    "1.d4 — Closed game.", "1...Nf6 — Indian setup.",
    "2.c4 — White takes space.",
    "2...e6 — Nimzo or QGD depending on White's third move.",
    "3.Nf3 — White avoids Nc3! Preventing the Nimzo-Indian pin. Black must find another plan.",
    "3...b6 — The Queen's Indian! Fianchettoing to b7 to fight for e4. The natural partner to the Nimzo — together they form a complete defensive system against 1.d4. Solid, flexible, positional. Karpov, Kramnik, and Grischuk's choice for a safe but fighting Black game."
  ],
  "grunfeld":[
    "1.d4 — The Grünfeld lets White build a massive center — then blows it up.",
    "1...Nf6 — Indian knight.", "2.c4 — More space.",
    "2...g6 — Fianchetto coming. Looks like KID — but completely different plan.",
    "3.Nc3 — White builds.",
    "3...d5 — The Grünfeld! UNLIKE the KID (...d6), Black STRIKES immediately. 'Take it! Build your center! I'll DESTROY it.' After 4.cxd5 Nxd5 5.e4, White has imposing d4+e4 pawns — but the g7 bishop becomes a battering ram at d4, and Black undermines from every direction: ...c5, ...Nc6, ...Bg4. Kasparov's primary weapon. Requires nerves of steel — rewards are spectacular."
  ],
  "grunfeld/Exchange":[
    "1.d4 — Center.", "1...Nf6 — Indian.", "2.c4 — Space.", "2...g6 — Fianchetto.",
    "3.Nc3 — Building.", "3...d5 — The Grünfeld strike!",
    "4.cxd5 — White accepts the challenge.", "4...Nxd5 — Black recaptures.",
    "5.e4 — The massive d4+e4 center. Critical moment — looks awesome but Black has resources.",
    "5...Nxc3 — Trading the knight for White's defender! Opens the b-file.",
    "6.bxc3 — Maintaining the center but with doubled c-pawns.",
    "6...Bg7 — The dragon bishop arrives! Staring straight at d4. Combined with ...c5, ...Nc6, ...Qa5 — relentless attack on the center. The purest Grünfeld: imposing center vs. piece pressure.",
    "7.Bc4 — Exchange Variation main line! Bishop aims at f7, adding kingside threats. The battle: powerful center + active bishop vs. g7 bishop + open lines + dynamic piece play. Thousands of GM games fought here."
  ],
  "benoni":[
    "1.d4 — The Benoni creates one of chess's most imbalanced structures.",
    "1...Nf6 — Indian knight.", "2.c4 — White expands.",
    "2...c5 — Challenging d4 from the flank! Creating asymmetry immediately.",
    "3.d5 — White advances instead of exchanging. Claiming central space.",
    "3...e6 — The Modern Benoni! After ...exd5, wildly asymmetric structure: White has central space + kingside majority; Black has queenside majority + half-open e-file. White pushes e4-e5; Black pushes ...b5. Tal loved it for dynamism; Gashimov played it devastatingly. One of the most unbalanced openings."
  ],
  "dutch":[
    "1.d4 — White opens with the Queen's pawn.",
    "1...f5 — The Dutch Defence! Aggressively fighting for e4. The mirror of the Sicilian: ...c5 fights for d4, ...f5 fights for e4. Creates immediate imbalance. Risks: weakened kingside (e8-h5 diagonal opens). Rewards: fighting game with clear attacking plans. Alekhine, Botvinnik, and Nakamura all use it for sharp chess."
  ],
  "dutch/Stonewall":[
    "1.d4 — Center.", "1...f5 — Dutch! Fighting for e4.",
    "2.c4 — White takes space.", "2...Nf6 — Developing while maintaining f5 control.",
    "3.g3 — White fianchettoes.", "3...e6 — Preparing the wall.",
    "4.Bg2 — White's bishop surveys the diagonal.",
    "4...d5 — The Stonewall! Pawns on d5-e6-f5 create an impregnable wall. The e4 square is Black's prize outpost — a knight there is almost untouchable. Downsides: e5 is weak, dark-squared bishop trapped. But the Stonewall is nearly unbreakable. Botvinnik was its greatest champion."
  ],
  "dutch/Leningrad":[
    "1.d4 — Center.", "1...f5 — Dutch!",
    "2.c4 — White expands.", "2...Nf6 — Controlling e4.",
    "3.g3 — White fianchettoes.",
    "3...g6 — The Leningrad Dutch! A brilliant hybrid of Dutch + King's Indian. Fianchetto AND f5 pawn — best of both worlds. The g7 bishop is a powerhouse; the f5 pawn grips the light squares. Black can play ...e5 reaching KID structure with f5 already advanced. The most dynamic Dutch — Nakamura crushes GMs with it."
  ],
  "english":[
    "1.c4 — The English Opening! Queenside space without committing to any central structure. Ultimate flexibility — can transpose into Sicilian reversed, Queen's Gambit, or stay unique. Botvinnik's favorite. Kramnik, Caruana, Carlsen all use it regularly."
  ],
  "english/Symmetrical":[
    "1.c4 — The English!",
    "1...c5 — The Symmetrical English! Both sides mirror, fighting for d4/d5 from the flanks. Pure strategic chess — pawn breaks, piece maneuvering, positional understanding over memorization. Karpov was a master of this."
  ],
  "english/Reversed Sicilian":[
    "1.c4 — The English!",
    "1...e5 — The Reversed Sicilian! Literally a Sicilian with colors reversed and an extra tempo for White. Since the Sicilian is great for Black, having it with an extra move is even better for White. Nc3, g3, Bg2, d3 — compact and pleasant."
  ],
  "reti":[
    "1.Nf3 — The Réti! Develops without committing any center pawn. Maximum flexibility.",
    "1...d5 — Black takes the center. Natural and strong.",
    "2.c4 — The Réti Opening! Striking d5 from the flank without ever playing d4. Hypermodern philosophy: control the center with pieces, not pawns. White fianchettoes to g2, pressuring d5 from distance. Richard Réti proved the center can be controlled without occupying it. Flexible, positional, extremely hard to prepare against."
  ],
  "bird":[
    "1.f4 — Bird's Opening! White fights for e5 with the f-pawn — the Dutch Defence reversed. Risks mirror the Dutch: weakened king diagonal. Watch for From's Gambit (1...e5!?). Rare at the top but fun for club players who enjoy surprises."
  ],
  "kia":[
    "1.Nf3 — Flexible. White has a universal system in mind.",
    "1...d5 — Black takes the center. Natural and principled.",
    "2.g3 — Fianchetto!", "2...c5 — Black expands on the queenside.",
    "3.Bg2 — The bishop surveys the center from the long diagonal.",
    "3...Nc6 — Natural development.",
    "4.O-O — The King's Indian Attack! Fischer's universal system as White: Nf3, g3, Bg2, O-O, d3, e4. Works against virtually any Black setup. Compact, flexible, then strike with e4. Fischer destroyed Myagmarsuren at the 1967 Sousse Interzonal with this. Not about theory — about understanding plans and patterns."
  ]
};

// Helper: get the teach comment for a specific opening + optional variation + move index
function getTeachCmt(openingId, varName, moveIdx, bookLen){
  const vKey = varName ? openingId+"/"+varName : null;
  const arr = (vKey && TEACH[vKey]) || TEACH[openingId] || [];
  if(moveIdx < arr.length) return arr[moveIdx];
  // Fallback for moves beyond what we have commentary for
  return null;
}

// Generate contextual engine-phase commentary based on what just happened
function genEngineCmt(board, move, opening, isCapture, notation, moveNum, playerIsWhite){
  const piece = board[move.from[0]][move.from[1]];
  const pt = piece?.toLowerCase();
  const side = isW(piece) ? "White" : "Black";
  const opSide = playerIsWhite ? "White" : "Black";
  const themes = (opening?.strategy || "").split(".");
  const theme = themes[moveNum % themes.length]?.trim() || "";
  
  const pieceNames = {k:"king",q:"queen",r:"rook",b:"bishop",n:"knight",p:"pawn"};
  const pn = pieceNames[pt] || "piece";
  
  // Different comment pools based on situation
  if(move.castle){
    const castleComments = [
      `${notation} — ${side} castles! Tucking the king to safety and connecting the rooks. In the ${opening?.name||'opening'}, king safety is crucial before the middlegame battle begins.`,
      `${notation} — Good timing to castle. The king is safe now, and the rook enters the game. ${theme ? "Remember: " + theme : ""}`,
    ];
    return castleComments[moveNum % castleComments.length];
  }
  
  if(isCapture){
    const capComments = [
      `${notation} — A capture! Material exchanges change the character of the position. In ${opening?.name||'this opening'}, watch how the pawn structure shifts after trades.`,
      `${notation} — ${side} takes. Every exchange in the ${opening?.name||'middlegame'} should serve your strategic goals. ${theme ? theme + "." : "Ask yourself: does this trade help my plan?"}`,
      `${notation} — Trade! Think about what's left on the board. Who benefits from fewer pieces here?`,
    ];
    return capComments[moveNum % capComments.length];
  }
  
  if(pt === "p"){
    const pawnComments = [
      `${notation} — A pawn advance. Pawns can't go backwards, so every push is a permanent decision. In the ${opening?.name||'opening'}, pawn structure defines the plans.`,
      `${notation} — Pawn push. This changes the landscape — look at which squares are now controlled and which are weakened. ${theme ? theme + "." : ""}`,
      `${notation} — Interesting pawn move. Consider: does this open lines or close them? Both can be useful depending on your position.`,
    ];
    return pawnComments[moveNum % pawnComments.length];
  }
  
  if(pt === "n"){
    const knightComments = [
      `${notation} — The knight repositions. Knights love outposts — squares protected by pawns where they can't be chased away. Look for those in the ${opening?.name||'position'}.`,
      `${notation} — Knight maneuver. Remember, knights thrive in closed positions and need strong squares. ${theme ? theme + "." : ""}`,
    ];
    return knightComments[moveNum % knightComments.length];
  }
  
  if(pt === "b"){
    const bishopComments = [
      `${notation} — The bishop seeks a better diagonal. Bishops love open positions with long diagonals. In the ${opening?.name||'position'}, which diagonal is most important?`,
      `${notation} — Bishop development. Bishops are long-range pieces — they get stronger as the position opens up. ${theme ? theme + "." : ""}`,
    ];
    return bishopComments[moveNum % bishopComments.length];
  }
  
  if(pt === "r"){
    const rookComments = [
      `${notation} — The rook activates. Rooks belong on open files and the 7th rank. Look for those opportunities in the ${opening?.name||'position'}.`,
      `${notation} — Rook move. Rooks are the last pieces to enter the game but often decide it. ${theme ? theme + "." : ""}`,
    ];
    return rookComments[moveNum % rookComments.length];
  }
  
  if(pt === "q"){
    const queenComments = [
      `${notation} — The queen enters the battle. She's powerful but vulnerable — don't let her get trapped or chased around losing tempo.`,
      `${notation} — Queen maneuver. In the ${opening?.name||'middlegame'}, the queen often supports attacks from a distance before committing to the action.`,
    ];
    return queenComments[moveNum % queenComments.length];
  }
  
  return `${notation} — Your turn. ${theme ? "Keep in mind: " + theme : "Think about your plan before moving."}`;
}

// Generate tutorial-mode commentary: tells user exactly what to do
function getTutorialCmt(bm, opening, variation, isPlayerMove, bookLen, idx, nextBm){
  const PN={k:"king",q:"queen",r:"rook",b:"bishop",n:"knight",p:"pawn"};
  const from=toA(bm.from[0],bm.from[1]), to=toA(bm.to[0],bm.to[1]);
  const piece=bm.notation?.replace(/[x+#!?=]/g,"")[0];
  const pName=piece&&piece===piece.toUpperCase()&&piece!=="O"?PN[piece.toLowerCase()]||"piece":"pawn";
  const opName=opening?.name||"opening";const vrName=variation?.name;
  const fullName=vrName?`${opName}: ${vrName}`:opName;
  
  if(bm.notation==="O-O"||bm.notation==="O-O-O"){
    const side=bm.notation==="O-O"?"kingside":"queenside";
    if(isPlayerMove)return `📌 Step ${idx+1}: Time to castle ${side}! Click your king on ${from}, then click ${to}. This moves your king to safety and brings your rook into the game. Castling early is really important in the ${fullName} — it protects your king before the middlegame battle starts.`;
    return `Your opponent just castled ${side} — their king moved from ${from} to ${to}. This is the standard move here in the ${fullName}. Their king is now safe and their rook is active.${idx<bookLen-1?" Get ready — your next move is coming up!":""}`;
  }
  
  if(isPlayerMove){
    const capText=bm.notation.includes("x")?" This is a capture — you'll take the piece sitting on "+to+".":"";
    const why=pName==="pawn"?"This pawn move controls important central squares and shapes the pawn structure for the rest of the game."
      :pName==="knight"?"Knights are best in the center where they control the most squares. This is the ideal square for your knight in this opening."
      :pName==="bishop"?"This puts your bishop on a powerful diagonal where it has maximum range and influence."
      :pName==="rook"?"Your rook now controls an important file. Rooks need open lines to be effective."
      :pName==="queen"?"The queen is your most powerful piece — this square gives it maximum influence without being exposed."
      :"This follows the main plan of the opening.";
    return `📌 Step ${idx+1}: Move your ${pName} from ${from} to ${to}. Click on your ${pName} sitting on the ${from} square, then click on the ${to} square.${capText} ${why} This is the correct book move in the ${fullName}.`;
  } else {
    // Opponent move — also preview what the user should do next
    let nextHint="";
    if(nextBm){
      const nFrom=toA(nextBm.from[0],nextBm.from[1]),nTo=toA(nextBm.to[0],nextBm.to[1]);
      const nPiece=nextBm.notation?.replace(/[x+#!?=]/g,"")[0];
      const nName=nPiece&&nPiece===nPiece.toUpperCase()&&nPiece!=="O"?PN[nPiece.toLowerCase()]||"piece":"pawn";
      nextHint=` Your next move will be to move your ${nName} from ${nFrom} to ${nTo} — get ready!`;
    } else if(idx>=bookLen-1){
      nextHint=" That's the last book move — the opening is complete! From here you'll play on your own using what you've learned.";
    }
    return `Your opponent just played ${bm.notation} — they moved their ${pName} from ${from} to ${to}. This is the standard response in the ${fullName} and exactly what we expected.${nextHint}`;
  }
}

// Tutorial comment for engine phase (post-book)
function getTutorialEngineCmt(board, move, notation, opening, playerIsWhite){
  const PN={k:"king",q:"queen",r:"rook",b:"bishop",n:"knight",p:"pawn"};
  const piece=board[move.from[0]][move.from[1]];
  const pt=piece?.toLowerCase();const pn=PN[pt]||"piece";
  const from=toA(move.from[0],move.from[1]),to=toA(move.to[0],move.to[1]);
  const isCap=!!board[move.to[0]][move.to[1]];
  const opName=opening?.name||"opening";
  const strat=opening?.strategy?.split(".")[0]?.trim()||"develop your remaining pieces";
  if(move.castle)return`Your opponent just castled — their king is now safe. We're past the book moves now, so you're playing on your own! Remember the ${opName} strategy: ${strat}. Look at the board and think about which of your pieces isn't doing much — try to make it active. Use the Hint button if you need help!`;
  return`Your opponent just moved their ${pn} from ${from} to ${to}${isCap?" (a capture!)":""}. It's your turn now! We're in the middlegame — the opening book is finished. Think about the ${opName} plan: ${strat}. Look for pieces that aren't active yet, or squares you can control. If you're not sure what to do, tap the Hint button and I'll suggest a move with the exact squares!`;
}


const INIT_B=[["r","n","b","q","k","b","n","r"],["p","p","p","p","p","p","p","p"],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],["P","P","P","P","P","P","P","P"],["R","N","B","Q","K","B","N","R"]];
const FI=["a","b","c","d","e","f","g","h"],RK=["8","7","6","5","4","3","2","1"];
function toA(r,c){return FI[c]+RK[r]}function dc(b){return b.map(r=>[...r])}function isW(p){return p&&p===p.toUpperCase()}function isB(p){return p&&p===p.toLowerCase()}
function gKP(b,w){const k=w?"K":"k";for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(b[r][c]===k)return[r,c];return null;}
function isSA(b,row,col,byW){const pD=byW?1:-1,pw=byW?"P":"p";if(row+pD>=0&&row+pD<8){if(col-1>=0&&b[row+pD][col-1]===pw)return true;if(col+1<8&&b[row+pD][col+1]===pw)return true;}for(const[dr,d]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){const nr=row+dr,nc=col+d;if(nr>=0&&nr<8&&nc>=0&&nc<8&&b[nr][nc]===(byW?"N":"n"))return true;}const kg=byW?"K":"k";for(let dr=-1;dr<=1;dr++)for(let d=-1;d<=1;d++){if(!dr&&!d)continue;const nr=row+dr,nc=col+d;if(nr>=0&&nr<8&&nc>=0&&nc<8&&b[nr][nc]===kg)return true;}const bs=byW?"B":"b",qu=byW?"Q":"q";for(const[dr,d]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let nr=row+dr,nc=col+d;while(nr>=0&&nr<8&&nc>=0&&nc<8){if(b[nr][nc]){if(b[nr][nc]===bs||b[nr][nc]===qu)return true;break;}nr+=dr;nc+=d;}}const rk=byW?"R":"r";for(const[dr,d]of[[-1,0],[1,0],[0,-1],[0,1]]){let nr=row+dr,nc=col+d;while(nr>=0&&nr<8&&nc>=0&&nc<8){if(b[nr][nc]){if(b[nr][nc]===rk||b[nr][nc]===qu)return true;break;}nr+=dr;nc+=d;}}return false;}
function inChk(b,wK){const kp=gKP(b,wK);if(!kp)return false;return isSA(b,kp[0],kp[1],!wK);}
function genP(b,wTM,ep,cas){const mv=[],isM=wTM?isW:isB,isE=wTM?isB:isW;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!isM(p))continue;const t=p.toLowerCase();if(t==="p"){const dir=wTM?-1:1,sr=wTM?6:1,pr=wTM?0:7;if(r+dir>=0&&r+dir<8&&!b[r+dir][c]){if(r+dir===pr){for(const x of wTM?["Q","R","B","N"]:["q","r","b","n"])mv.push({from:[r,c],to:[r+dir,c],promo:x});}else{mv.push({from:[r,c],to:[r+dir,c]});if(r===sr&&!b[r+2*dir][c])mv.push({from:[r,c],to:[r+2*dir,c]});}}for(const d of[-1,1]){const nc=c+d;if(nc<0||nc>=8)continue;const nr=r+dir;if(nr<0||nr>=8)continue;const isEp=ep&&toA(nr,nc)===ep;if(isE(b[nr][nc])||isEp){if(nr===pr){for(const x of wTM?["Q","R","B","N"]:["q","r","b","n"])mv.push({from:[r,c],to:[nr,nc],promo:x,ep:isEp});}else mv.push({from:[r,c],to:[nr,nc],ep:isEp});}}}if(t==="n")for(const[dr,d]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){const nr=r+dr,nc=c+d;if(nr>=0&&nr<8&&nc>=0&&nc<8&&!isM(b[nr][nc]))mv.push({from:[r,c],to:[nr,nc]});}if(t==="b"||t==="q")for(const[dr,d]of[[-1,-1],[-1,1],[1,-1],[1,1]]){let nr=r+dr,nc=c+d;while(nr>=0&&nr<8&&nc>=0&&nc<8){if(isM(b[nr][nc]))break;mv.push({from:[r,c],to:[nr,nc]});if(isE(b[nr][nc]))break;nr+=dr;nc+=d;}}if(t==="r"||t==="q")for(const[dr,d]of[[-1,0],[1,0],[0,-1],[0,1]]){let nr=r+dr,nc=c+d;while(nr>=0&&nr<8&&nc>=0&&nc<8){if(isM(b[nr][nc]))break;mv.push({from:[r,c],to:[nr,nc]});if(isE(b[nr][nc]))break;nr+=dr;nc+=d;}}if(t==="k"){for(let dr=-1;dr<=1;dr++)for(let d=-1;d<=1;d++){if(!dr&&!d)continue;const nr=r+dr,nc=c+d;if(nr>=0&&nr<8&&nc>=0&&nc<8&&!isM(b[nr][nc]))mv.push({from:[r,c],to:[nr,nc]});}if(wTM){if(cas.K&&!b[7][5]&&!b[7][6]&&b[7][7]==="R"&&!isSA(b,7,4,false)&&!isSA(b,7,5,false)&&!isSA(b,7,6,false))mv.push({from:[7,4],to:[7,6],castle:"K"});if(cas.Q&&!b[7][3]&&!b[7][2]&&!b[7][1]&&b[7][0]==="R"&&!isSA(b,7,4,false)&&!isSA(b,7,3,false)&&!isSA(b,7,2,false))mv.push({from:[7,4],to:[7,2],castle:"Q"});}else{if(cas.k&&!b[0][5]&&!b[0][6]&&b[0][7]==="r"&&!isSA(b,0,4,true)&&!isSA(b,0,5,true)&&!isSA(b,0,6,true))mv.push({from:[0,4],to:[0,6],castle:"k"});if(cas.q&&!b[0][3]&&!b[0][2]&&!b[0][1]&&b[0][0]==="r"&&!isSA(b,0,4,true)&&!isSA(b,0,3,true)&&!isSA(b,0,2,true))mv.push({from:[0,4],to:[0,2],castle:"q"});}}}return mv;}
function genL(b,wTM,ep,cas){return genP(b,wTM,ep,cas).filter(m=>{const nb=dc(b);nb[m.to[0]][m.to[1]]=nb[m.from[0]][m.from[1]];nb[m.from[0]][m.from[1]]=null;if(m.ep)nb[wTM?m.to[0]+1:m.to[0]-1][m.to[1]]=null;if(m.promo)nb[m.to[0]][m.to[1]]=m.promo;if(m.castle){if(m.castle==="K"){nb[7][5]=nb[7][7];nb[7][7]=null;}if(m.castle==="Q"){nb[7][3]=nb[7][0];nb[7][0]=null;}if(m.castle==="k"){nb[0][5]=nb[0][7];nb[0][7]=null;}if(m.castle==="q"){nb[0][3]=nb[0][0];nb[0][0]=null;}}return!inChk(nb,wTM);});}
function aM(b,m){const nb=dc(b);nb[m.to[0]][m.to[1]]=nb[m.from[0]][m.from[1]];nb[m.from[0]][m.from[1]]=null;if(m.ep)nb[isW(nb[m.to[0]][m.to[1]])?m.to[0]+1:m.to[0]-1][m.to[1]]=null;if(m.promo)nb[m.to[0]][m.to[1]]=m.promo;if(m.castle){if(m.castle==="K"){nb[7][5]=nb[7][7];nb[7][7]=null;}if(m.castle==="Q"){nb[7][3]=nb[7][0];nb[7][0]=null;}if(m.castle==="k"){nb[0][5]=nb[0][7];nb[0][7]=null;}if(m.castle==="q"){nb[0][3]=nb[0][0];nb[0][0]=null;}}return nb;}
function tN(b,m){const p=b[m.from[0]][m.from[1]],t=p.toLowerCase(),to=toA(m.to[0],m.to[1]),cap=b[m.to[0]][m.to[1]]||m.ep;if(m.castle==="K"||m.castle==="k")return"O-O";if(m.castle==="Q"||m.castle==="q")return"O-O-O";if(t==="p"){let n=cap?FI[m.from[1]]+"x"+to:to;if(m.promo)n+="="+m.promo.toUpperCase();return n;}return t.toUpperCase()+(cap?"x":"")+to;}
function uC(cas,m){const c={...cas};if(m.from[0]===7&&m.from[1]===4){c.K=false;c.Q=false;}if(m.from[0]===7&&m.from[1]===7)c.K=false;if(m.from[0]===7&&m.from[1]===0)c.Q=false;if(m.from[0]===0&&m.from[1]===4){c.k=false;c.q=false;}if(m.from[0]===0&&m.from[1]===7)c.k=false;if(m.from[0]===0&&m.from[1]===0)c.q=false;return c;}
function gEp(b,m){if(b[m.from[0]][m.from[1]]?.toLowerCase()==="p"&&Math.abs(m.to[0]-m.from[0])===2)return toA((m.from[0]+m.to[0])/2,m.from[1]);return null;}
function ev(b){const v={p:100,n:320,b:330,r:500,q:900,k:20000};const pT=[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]];let s=0;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;const t=p.toLowerCase(),vl=v[t]||0,sg=isW(p)?1:-1;s+=sg*vl;if(t==="p")s+=sg*(isW(p)?pT[r][c]:pT[7-r][c]);}return s;}
function eS(b,d,a,bt,mx,ep,cas){if(d===0)return{score:ev(b)};const moves=genL(b,mx,ep,cas);if(!moves.length)return inChk(b,mx)?{score:mx?-99999:99999}:{score:0};moves.sort((x,y)=>(b[y.to[0]][y.to[1]]?1:0)-(b[x.to[0]][x.to[1]]?1:0));let best=null;if(mx){let m=-Infinity;for(const mv of moves){const r=eS(aM(b,mv),d-1,a,bt,false,gEp(b,mv),uC(cas,mv));if(r.score>m){m=r.score;best=mv;}a=Math.max(a,m);if(bt<=a)break;}return{score:m,move:best};}else{let m=Infinity;for(const mv of moves){const r=eS(aM(b,mv),d-1,a,bt,true,gEp(b,mv),uC(cas,mv));if(r.score<m){m=r.score;best=mv;}bt=Math.min(bt,m);if(bt<=a)break;}return{score:m,move:best};}}

// Parse opening moves string
function parseOM(moveStr){if(!moveStr)return[];const tokens=moveStr.replace(/\d+\.\s*/g,"").replace(/\.\.\./g,"").trim().split(/\s+/).filter(Boolean);let board=dc(INIT_B);let wTM=true;const result=[];for(const tok of tokens){const nb=aAF(board,tok,wTM);if(nb){result.push({notation:tok,board:dc(nb.board),white:wTM,from:nb.from,to:nb.to});board=nb.board;}wTM=!wTM;}return result;}
function aAF(board,move,white){const b=dc(board);if(move==="O-O"||move==="0-0"){const r=white?7:0;b[r][6]=b[r][4];b[r][4]=null;b[r][5]=b[r][7];b[r][7]=null;return{board:b,from:[r,4],to:[r,6]};}if(move==="O-O-O"||move==="0-0-0"){const r=white?7:0;b[r][2]=b[r][4];b[r][4]=null;b[r][3]=b[r][0];b[r][0]=null;return{board:b,from:[r,4],to:[r,2]};}let m=move.replace(/[+#!?]/g,"");let promo=null;if(m.includes("=")){promo=m.split("=")[1][0];m=m.split("=")[0];}m=m.replace("x","");const sq=s=>[8-parseInt(s[1]),FI.indexOf(s[0])];if(m[0]===m[0].toLowerCase()&&m.length<=3){const dest=sq(m.slice(-2));const dir=white?1:-1;if(m.length===2){if(b[dest[0]+dir]?.[dest[1]]?.toLowerCase()==="p"&&(white?isW(b[dest[0]+dir][dest[1]]):!isW(b[dest[0]+dir][dest[1]]))){const fr=[dest[0]+dir,dest[1]];b[dest[0]][dest[1]]=promo?(white?promo.toUpperCase():promo.toLowerCase()):b[fr[0]][fr[1]];b[fr[0]][fr[1]]=null;return{board:b,from:fr,to:dest};}if(b[dest[0]+2*dir]?.[dest[1]]?.toLowerCase()==="p"&&!b[dest[0]+dir][dest[1]]&&(white?isW(b[dest[0]+2*dir][dest[1]]):!isW(b[dest[0]+2*dir][dest[1]]))){const fr=[dest[0]+2*dir,dest[1]];b[dest[0]][dest[1]]=b[fr[0]][fr[1]];b[fr[0]][fr[1]]=null;return{board:b,from:fr,to:dest};}}else{const fromCol=FI.indexOf(m[0]);const destSq=sq(m.slice(-2));for(let r=0;r<8;r++)if(b[r][fromCol]?.toLowerCase()==="p"&&(white?isW(b[r][fromCol]):!isW(b[r][fromCol]))&&Math.abs(r-destSq[0])===1){b[destSq[0]][destSq[1]]=promo?(white?promo.toUpperCase():promo.toLowerCase()):b[r][fromCol];b[r][fromCol]=null;if(!board[destSq[0]][destSq[1]])b[r][destSq[1]]=null;return{board:b,from:[r,fromCol],to:destSq};}}return null;}const pc=m[0];const piece=white?pc:pc.toLowerCase();const dest=sq(m.slice(-2));let dF=null,dR=null;if(m.length===4){const d=m[1];if(FI.includes(d))dF=FI.indexOf(d);else if("12345678".includes(d))dR=8-parseInt(d);}if(m.length===5){dF=FI.indexOf(m[1]);dR=8-parseInt(m[2]);}for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(b[r][c]===piece){if(dF!==null&&c!==dF)continue;if(dR!==null&&r!==dR)continue;if(cR(b,r,c,dest[0],dest[1],piece)){b[dest[0]][dest[1]]=b[r][c];b[r][c]=null;return{board:b,from:[r,c],to:dest};}}}return null;}
function cR(b,fr,fc,tr,tc,piece){const t=piece.toLowerCase();if(t==="n")return(Math.abs(fr-tr)===2&&Math.abs(fc-tc)===1)||(Math.abs(fr-tr)===1&&Math.abs(fc-tc)===2);if(t==="k")return Math.abs(fr-tr)<=1&&Math.abs(fc-tc)<=1;if(t==="r"||t==="q"){if(fr===tr){const d=tc>fc?1:-1;for(let c=fc+d;c!==tc;c+=d)if(b[fr][c])return false;return true;}if(fc===tc){const d=tr>fr?1:-1;for(let r=fr+d;r!==tr;r+=d)if(b[r][fc])return false;return true;}if(t==="r")return false;}if(t==="b"||t==="q"){if(Math.abs(fr-tr)===Math.abs(fc-tc)){const dr=tr>fr?1:-1,dcc=tc>fc?1:-1;let r=fr+dr,c=fc+dcc;while(r!==tr){if(b[r][c])return false;r+=dr;c+=dcc;}return true;}if(t==="b")return false;}return false;}

// ==================== SVG PIECES (unchanged) ====================
const SP={K:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#fff" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" strokeLinecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0"/></g></svg>,Q:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#fff" stroke="#555" strokeWidth="1.5" strokeLinejoin="round"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15L14 11v14L7 14l2 12z" strokeLinecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/></g></svg>,R:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#fff" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt"/><path d="M34 14l-3 3H14l-3-3"/><path d="M15 17v12.5h15V17" strokeLinecap="butt" strokeLinejoin="miter"/><path d="M11 14h23" fill="none" strokeLinejoin="miter"/></g></svg>,B:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#fff" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/><path d="M17.5 26h10M15 30h15" fill="none" strokeLinejoin="miter"/></g></svg>,N:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#fff" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><circle cx="9" cy="25.5" r=".5" fill="#555" stroke="#555"/><path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#555" stroke="#555"/></g></svg>,P:s=><svg viewBox="0 0 45 45" width={s} height={s}><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39h23c0-7.42-4.41-11.91-7.41-12.97C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/></svg>,k:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#333" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" strokeLinecap="butt"/><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z"/><path d="M11.5 30c5.5-3 15.5-3 21 0M11.5 33.5c5.5-3 15.5-3 21 0M11.5 37c5.5-3 15.5-3 21 0" stroke="#777" fill="none"/></g></svg>,q:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#333" stroke="#111" strokeWidth="1.5" strokeLinejoin="round"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/><path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" strokeLinecap="butt"/><path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" strokeLinecap="butt"/><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" stroke="#777"/></g></svg>,r:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#333" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 39h27v-3H9v3z" strokeLinecap="butt"/><path d="M12.5 32l1.5-2.5h17l1.5 2.5"/><path d="M12 36v-4h21v4H12z" strokeLinecap="butt"/><path d="M14 29.5v-13h17v13H14z" strokeLinecap="butt" strokeLinejoin="miter"/><path d="M14 16.5L11 14h23l-3 2.5H14z" strokeLinecap="butt"/><path d="M11 14V9h4v2h5V9h5v2h5V9h4v5H11z" strokeLinecap="butt"/><path d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23" fill="none" stroke="#777"/></g></svg>,b:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#333" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/><path d="M17.5 26h10M15 30h15" fill="none" stroke="#777" strokeLinejoin="miter"/></g></svg>,n:s=><svg viewBox="0 0 45 45" width={s} height={s}><g fill="#333" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><circle cx="9" cy="25.5" r=".5" fill="#eee" stroke="#eee"/><path d="M14.933 15.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5z" fill="#eee" stroke="#eee" strokeWidth="1"/></g></svg>,p:s=><svg viewBox="0 0 45 45" width={s} height={s}><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39h23c0-7.42-4.41-11.91-7.41-12.97C28.06 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#333" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>};

// ==================== iOS BUTTON COMPONENT ====================
function Btn({children,onClick,style,disabled,small,accent}){
  return <button onClick={onClick} disabled={disabled} style={{background:accent||IOS.accent,color:"#fff",border:"none",borderRadius:small?8:IOS.radius,padding:small?"6px 14px":"11px 20px",fontSize:small?13:15,fontWeight:"600",fontFamily:IOS.font,cursor:disabled?"default":"pointer",opacity:disabled?.45:1,transition:"all .15s",letterSpacing:"-0.2px",boxShadow:"none",...style}}>{children}</button>;
}
function BtnGhost({children,onClick,style,disabled}){
  return <button onClick={onClick} disabled={disabled} style={{background:"transparent",color:IOS.accent,border:"none",borderRadius:8,padding:"6px 12px",fontSize:15,fontWeight:"600",fontFamily:IOS.font,cursor:disabled?"default":"pointer",opacity:disabled?.4:1,...style}}>{children}</button>;
}
// ==================== STATIC BOARD (thumbnails) ====================
function StaticBoard({board,size=26}){
  const sz=size;
  return(<div style={{display:"grid",gridTemplateColumns:`repeat(8,${sz}px)`,gridTemplateRows:`repeat(8,${sz}px)`,borderRadius:2,overflow:"hidden",border:"1px solid #c8c0b0"}}>
    {Array.from({length:64},(_,i)=>{const r=Math.floor(i/8),c=i%8;const p=board[r][c];const lt=(r+c)%2===0;
      return(<div key={i} style={{width:sz,height:sz,background:lt?"#f0ead6":"#b5a78a",display:"flex",alignItems:"center",justifyContent:"center"}}>
        {p&&SP[p]?<div style={{lineHeight:0}}>{SP[p](sz*0.78)}</div>:null}
      </div>);
    })}
  </div>);
}

// ==================== MAIN APP ====================
export default function App(){
  const[screen,setScreen]=useState("landing");
  const[diff,setDiff]=useState(null);
  const[selCat,setSelCat]=useState(null);
  const[searchQ,setSearchQ]=useState("");
  const[opening,setOpening]=useState(null);
  const[variation,setVariation]=useState(null);
  const[board,setBoard]=useState(dc(INIT_B));
  const[wTM,setWTM]=useState(true);
  const[ep,setEp]=useState(null);
  const[cas,setCas]=useState({K:true,Q:true,k:true,q:true});
  const[sel,setSel]=useState(null);
  const[legal,setLegal]=useState([]);
  const[hlSq,setHL]=useState([]);
  const[lastMv,setLM]=useState(null);
  const[thinking,setTh]=useState(false);
  const[gameOver,setGO]=useState(null);
  const[comments,setComments]=useState([]);
  const[cmtIdx,setCmtIdx]=useState(0);
  const[bookMoves,setBookMoves]=useState([]);
  const[bookIdx,setBookIdx]=useState(0);
  const[moveLog,setMoveLog]=useState([]);
  const[hintStage,setHintStage]=useState(0);
  const[hintMove,setHintMove]=useState(null);
  const[tutMode,setTutMode]=useState(false);
  const[history,setHistory]=useState([]);  // [{board,lastMv,ply}]
  const[viewPly,setViewPly]=useState(null); // null = live, number = viewing history

  const playerIsWhite=opening?.side==="white";
  const playerTurn=playerIsWhite?wTM:!wTM;
  const flip=!playerIsWhite;

  const startGame=useCallback((op,vr)=>{
    let moveStr=op.moves;if(vr){const vm=vr.moves;moveStr=/^\d/.test(vm)?vm.includes("1.")?vm:op.moves+" "+vm:op.moves+" "+vm;}
    const parsed=parseOM(moveStr);setOpening(op);setVariation(vr||null);setBoard(dc(INIT_B));setWTM(true);setEp(null);setCas({K:true,Q:true,k:true,q:true});setSel(null);setLegal([]);setHL([]);setLM(null);setTh(false);setGO(null);setBookMoves(parsed);setBookIdx(0);setMoveLog([]);setHintStage(0);setHintMove(null);
    setHistory([{board:dc(INIT_B),lastMv:null,ply:0}]);setViewPly(null);
    const intro=vr
      ?`Welcome to the ${op.name}: ${vr.name}! You're playing as ${op.side==="white"?"White ♔":"Black ♚"}. ${vr.desc} The overall strategy of the ${op.name}: ${op.strategy} Let's learn this line move by move!`
      :`Welcome to the ${op.name}! You're playing as ${op.side==="white"?"White ♔":"Black ♚"}. ${op.desc} Strategic plan: ${op.strategy} Follow the book moves to learn the opening — I'll explain every step.`;
    const firstMv=parsed.length>0?parsed[0]:null;
    const fmFrom=firstMv?toA(firstMv.from[0],firstMv.from[1]):"";
    const fmTo=firstMv?toA(firstMv.to[0],firstMv.to[1]):"";
    const tutIntro=vr
      ?`Welcome! We're going to learn the ${op.name}: ${vr.name} step by step. You're playing as ${op.side==="white"?"White ♔":"Black ♚"}. I'll tell you exactly which piece to move and where — just follow my instructions on each step.${op.side==="white"&&firstMv?` To start, you'll move your piece from ${fmFrom} to ${fmTo}. Let's go!`:` Your opponent will make the first move. Watch what they do, and I'll tell you exactly how to respond. Let's go!`}`
      :`Welcome! We're going to learn the ${op.name} step by step. You're playing as ${op.side==="white"?"White ♔":"Black ♚"}. Don't worry if you're new to this — I'll guide you through every single move, telling you exactly which piece to pick up and where to put it.${op.side==="white"&&firstMv?` To start, you'll move your piece from ${fmFrom} to ${fmTo}. Let's begin!`:` Your opponent moves first. Watch their move, then I'll tell you exactly what to do next. Let's begin!`}`;
    setComments([{type:"coach",text:intro,tut:tutIntro}]);setCmtIdx(0);setScreen("game");
  },[]);

  useEffect(()=>{if(screen==="game"&&opening&&!playerTurn&&bookIdx<bookMoves.length&&!thinking&&!gameOver&&moveLog.length===0)setTimeout(()=>playBookMove(),400);},[screen,opening]);

  const playBookMove=useCallback(()=>{
    if(bookIdx>=bookMoves.length)return;const bm=bookMoves[bookIdx];const lm=genL(board,wTM,ep,cas);
    const match=lm.find(m=>m.from[0]===bm.from[0]&&m.from[1]===bm.from[1]&&m.to[0]===bm.to[0]&&m.to[1]===bm.to[1]);
    if(!match)return;const bc=getBookCmt(bookIdx);execMove(match,bm.notation+" — "+bc.def,bm.notation+" — "+bc.tut);setBookIdx(bi=>bi+1);
  },[bookIdx,bookMoves,board,wTM,ep,cas]);

  const getBookCmt=(idx)=>{
    if(!opening)return{def:"",tut:""};const bm=bookMoves[idx];if(!bm)return{def:"",tut:""};
    const isPlayerMv=playerIsWhite?bm.white:!bm.white;
    // Next book move (for tutorial preview)
    const nextBm=idx+1<bookMoves.length?bookMoves[idx+1]:null;
    // Tutorial version — pass nextBm so opponent moves can preview user's next move
    const tut=getTutorialCmt(bm,opening,variation,isPlayerMv,bookMoves.length,idx,nextBm);
    // Default version
    let def=getTeachCmt(opening.id, variation?.name, idx, bookMoves.length);
    if(!def){
      if(idx===bookMoves.length-1){def=variation?`You've reached the tabiya of the ${variation.name}. ${variation.desc} From here, the real battle begins!`:`This is the tabiya of the ${opening.name}. ${opening.desc} Now the opening is complete — the middlegame fight starts!`;}
      else{const side=bm.white?"White":"Black";const strats=opening.strategy.split(".");const strat=strats[idx%strats.length]?.trim();def=`${side} plays a key theoretical move. ${strat?strat+".":"The position follows established theory."}`;}
    }
    return{def,tut};
  };

  const execMove=useCallback((move,commentText,tutText)=>{
    const not=tN(board,move);const nb=aM(board,move);const nEp=gEp(board,move);const nC=uC(cas,move);
    setBoard(nb);setLM(move);setEp(nEp);setCas(nC);setSel(null);setLegal([]);setHL([]);setWTM(w=>!w);setHintStage(0);setHintMove(null);setViewPly(null);
    const ply=moveLog.length+1;
    setHistory(h=>[...h,{board:dc(nb),lastMv:move,ply}]);
    setMoveLog(p=>[...p,{notation:not,white:wTM,ply}]);
    if(commentText)setComments(p=>{const n=[...p,{type:wTM===playerIsWhite?"tip":"coach",text:commentText,tut:tutText||commentText,ply}];setCmtIdx(n.length-1);return n;});
  },[board,cas,wTM,playerIsWhite,moveLog.length]);

  const isViewing=viewPly!==null;
  const viewSnap=isViewing?history.find(h=>h.ply===viewPly)||history[0]:null;
  const displayBoard=isViewing&&viewSnap?viewSnap.board:board;
  const displayLastMv=isViewing&&viewSnap?viewSnap.lastMv:lastMv;
  const goLive=()=>setViewPly(null);

  const onClick=useCallback((bR,bC)=>{
    if(isViewing||!playerTurn||gameOver||thinking)return;
    if(sel){
      const mv=legal.find(m=>m.to[0]===bR&&m.to[1]===bC);
      if(mv){
        let fm=mv;if(mv.promo)fm=legal.find(m=>m.to[0]===bR&&m.to[1]===bC&&m.promo===(playerIsWhite?"Q":"q"))||mv;
        const isBook=bookIdx<bookMoves.length;let cmt="",tutCmt="";
        if(isBook){const bm=bookMoves[bookIdx];const bc=getBookCmt(bookIdx);if(fm.from[0]===bm.from[0]&&fm.from[1]===bm.from[1]&&fm.to[0]===bm.to[0]&&fm.to[1]===bm.to[1]){cmt="Excellent! "+bc.def;tutCmt="✅ Perfect! That's exactly right. "+bc.tut;setBookIdx(bi=>bi+1);}else{const bmFrom=toA(bm.from[0],bm.from[1]),bmTo=toA(bm.to[0],bm.to[1]);cmt=`Interesting choice! The book move here is ${bm.notation}. That's okay — exploring sidelines is how you deepen your understanding. Let's see where your move leads!`;tutCmt=`❌ Not quite — the correct move was to move the piece from ${bmFrom} to ${bmTo} (${bm.notation}). That's okay though! We'll continue from this position. Don't worry — learning takes practice, and trying different moves helps you understand why the book move is best.`;setBookIdx(999);}}
        if(!cmt){const pn=tN(board,fm);const fromSq=toA(fm.from[0],fm.from[1]),toSq=toA(fm.to[0],fm.to[1]);const isCap=!!board[fm.to[0]][fm.to[1]];const strat=opening?.strategy?.split(".")[0]?.trim()||"look for active moves";cmt=isCap?`${pn} — good capture! Every trade changes the balance. Think about whether fewer pieces help your position here.`:`You played ${pn}. Now watch how your opponent responds and think about your next plan.`;tutCmt=isCap?`You moved your piece from ${fromSq} to ${toSq}, capturing! Nice. We're past the book moves now, so you're playing freestyle. Remember the ${opening?.name||"opening"} strategy: ${strat}. Tap Hint if you need help with your next move!`:`You moved your piece from ${fromSq} to ${toSq}. We're past the book moves now, so you're on your own — but that's great! Remember what you learned in the ${opening?.name||"opening"}: ${strat}. If you're unsure, tap the Hint button and I'll tell you exactly where to move.`;}
        execMove(fm,cmt,tutCmt);
        setTimeout(()=>{setTh(true);setTimeout(()=>{
          const newB=aM(board,fm);const newEp=gEp(board,fm);const newCas=uC(cas,fm);const newWTM=!wTM;
          const nbi=isBook&&(cmt.startsWith("Excellent")||cmt.startsWith("✅"))?bookIdx+1:999;
          if(nbi<bookMoves.length){const bm2=bookMoves[nbi];const oL=genL(newB,newWTM,newEp,newCas);const om=oL.find(m=>m.from[0]===bm2.from[0]&&m.from[1]===bm2.from[1]&&m.to[0]===bm2.to[0]&&m.to[1]===bm2.to[1]);
            if(om){const n2=tN(newB,om);const nb2=aM(newB,om);setBoard(nb2);setLM(om);setEp(gEp(newB,om));setCas(uC(newCas,om));setWTM(w=>!w);const opPly=moveLog.length+2;setMoveLog(p=>[...p,{notation:n2,white:newWTM,ply:opPly}]);setHistory(h=>[...h,{board:dc(nb2),lastMv:om,ply:opPly}]);setBookIdx(nbi+1);const bc2=getBookCmt(nbi);setComments(p=>{const n=[...p,{type:"coach",text:n2+" — "+bc2.def,tut:n2+" — "+bc2.tut,ply:opPly}];setCmtIdx(n.length-1);return n;});setTh(false);return;}}
          const depth=diff==="firsttime"?1:diff==="beginner"?2:3;
          const res=eS(newB,depth,-Infinity,Infinity,newWTM,newEp,newCas);
          if(res.move){const n2=tN(newB,res.move);const nb2=aM(newB,res.move);setBoard(nb2);setLM(res.move);setEp(gEp(newB,res.move));setCas(uC(newCas,res.move));setWTM(w=>!w);const engPly=moveLog.length+2;setMoveLog(p=>[...p,{notation:n2,white:newWTM,ply:engPly}]);setHistory(h=>[...h,{board:dc(nb2),lastMv:res.move,ply:engPly}]);
            const isCap=!!newB[res.move.to[0]][res.move.to[1]];const mNum=moveLog.length;
            const defCmt=genEngineCmt(newB,res.move,opening,isCap,n2,mNum,playerIsWhite);
            const tutCmt2=getTutorialEngineCmt(newB,res.move,n2,opening,playerIsWhite);
            setComments(p=>{const n=[...p,{type:"coach",text:defCmt,tut:tutCmt2,ply:engPly}];setCmtIdx(n.length-1);return n;});}
          setTh(false);
        },400);},200);
      } else {
        if((playerIsWhite?isW:isB)(board[bR][bC])){const all=genL(board,wTM,ep,cas);const pm=all.filter(m=>m.from[0]===bR&&m.from[1]===bC);setSel([bR,bC]);setLegal(pm);setHL(pm.map(m=>m.to));}
        else{setSel(null);setLegal([]);setHL([]);}
      }
    } else {
      if((playerIsWhite?isW:isB)(board[bR][bC])){const all=genL(board,wTM,ep,cas);const pm=all.filter(m=>m.from[0]===bR&&m.from[1]===bC);setSel([bR,bC]);setLegal(pm);setHL(pm.map(m=>m.to));}
    }
  },[sel,legal,board,wTM,ep,cas,playerTurn,gameOver,thinking,bookIdx,bookMoves,playerIsWhite,diff,isViewing]);

  const onHint=useCallback(()=>{
    if(!playerTurn||thinking||gameOver)return;
    if(hintStage===0){let hm=null,htDef="",htTut="";
      if(bookIdx<bookMoves.length){const bm=bookMoves[bookIdx];hm=bm;
        const from=toA(bm.from[0],bm.from[1]),to=toA(bm.to[0],bm.to[1]);
        htTut=`📌 Move the piece on ${from} to ${to} (${bm.notation}). Click ${from} first, then click ${to}.`;
        const teach=getTeachCmt(opening?.id,variation?.name,bookIdx,bookMoves.length);
        htDef=teach?`💡 The book move is ${bm.notation}. ${teach}`:`💡 Play ${bm.notation} — this is the main theoretical continuation in the ${opening?.name||"opening"}.`;
      } else {const r=eS(board,2,-Infinity,Infinity,playerIsWhite,ep,cas);if(r.move){hm=r.move;
        const pn=tN(board,r.move);const pt=board[r.move.from[0]][r.move.from[1]]?.toLowerCase();
        const names={k:"king",q:"queen",r:"rook",b:"bishop",n:"knight",p:"pawn"};
        const from=toA(r.move.from[0],r.move.from[1]),to=toA(r.move.to[0],r.move.to[1]);
        htTut=`📌 Try moving your ${names[pt]||"piece"} from ${from} to ${to} (${pn}).`;
        htDef=`💡 Consider ${pn}. Moving your ${names[pt]||"piece"} here looks strongest. In the ${opening?.name||"middlegame"}, ${opening?.strategy?.split(".")[0]?.trim()||"keep developing and looking for targets"}.`;}}
      if(hm){setHintMove(hm);setHintStage(1);setComments(p=>{const n=[...p,{type:"hint",text:htDef,tut:htTut}];setCmtIdx(n.length-1);return n;});}
    } else if(hintStage===1)setHintStage(2);
  },[playerTurn,thinking,gameOver,hintStage,bookIdx,bookMoves,board,wTM,ep,cas,playerIsWhite,opening,variation]);

  const DIFFS=[
    {id:"firsttime",name:"First Time",desc:"Never played openings",rating:"0–400",color:IOS.purple},
    {id:"beginner",name:"Beginner",desc:"Know how pieces move",rating:"400–800",color:IOS.green},
    {id:"amateur",name:"Amateur",desc:"Know the basics",rating:"800–1200",color:IOS.accent},
    {id:"intermediate",name:"Intermediate",desc:"Comfortable with theory",rating:"1200–1600",color:IOS.orange},
    {id:"expert",name:"Expert",desc:"Deep theoretical knowledge",rating:"1600–2000",color:"#ff6723"},
    {id:"grandmaster",name:"Grandmaster",desc:"Master-level preparation",rating:"2000+",color:IOS.red},
  ];
  const SZ=52;const curCmt=comments[cmtIdx];

  // ===== GLOBAL STYLES =====
  const pageStyle={minHeight:"100vh",background:IOS.bg,fontFamily:IOS.font,color:IOS.text,padding:0,margin:0};

  // ===== LANDING =====
  if(screen==="landing")return(
    <div style={{...pageStyle,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 20px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:56,marginBottom:8}}>♔</div>
        <h1 style={{fontSize:28,fontWeight:"700",color:IOS.text,margin:"0 0 4px",letterSpacing:"-0.5px"}}>Chess Openings</h1>
        <p style={{color:IOS.text2,fontSize:15,margin:"0 0 4px"}}>Master Every Opening</p>
        <p style={{color:IOS.text3,fontSize:13,margin:0}}>{OPS.length} openings · {OPS.reduce((a,o)=>a+(o.vars?.length||0),0)}+ variations</p>
      </div>
      <div style={{maxWidth:400,width:"100%"}}>
        <p style={{color:IOS.text2,fontSize:13,fontWeight:"600",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.5px",paddingLeft:16}}>Choose your level</p>
        <div style={{background:IOS.card,borderRadius:IOS.radius,overflow:"hidden",boxShadow:IOS.shadow}}>
          {DIFFS.map((d,i)=>(
            <div key={d.id} onClick={()=>{setDiff(d.id);setScreen("browser");}} style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",borderBottom:i<DIFFS.length-1?`0.5px solid ${IOS.sep}`:"none",transition:"background .1s"}}
              onMouseEnter={e=>e.currentTarget.style.background="#f9f9f9"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:10,height:10,borderRadius:5,background:d.color,flexShrink:0}}/>
                <div><div style={{fontSize:17,fontWeight:"400",color:IOS.text}}>{d.name}</div><div style={{fontSize:13,color:IOS.text2}}>{d.desc}</div></div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:13,color:IOS.text3}}>{d.rating}</span><span style={{color:IOS.text3,fontSize:16}}>›</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ===== BROWSER =====
  if(screen==="browser"){
    const filtered=searchQ?OPS.filter(o=>o.name.toLowerCase().includes(searchQ.toLowerCase())||o.eco.toLowerCase().includes(searchQ.toLowerCase())||(o.vars||[]).some(v=>v.name.toLowerCase().includes(searchQ.toLowerCase()))):selCat?OPS.filter(o=>o.cat===selCat):OPS;
    return(
      <div style={pageStyle}>
        {/* Nav bar */}
        <div style={{background:"rgba(242,242,247,0.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`0.5px solid ${IOS.sep}`,padding:"12px 16px",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,maxWidth:600,margin:"0 auto"}}>
            <BtnGhost onClick={()=>setScreen("landing")}>‹ Back</BtnGhost>
            <div style={{flex:1}}><div style={{fontSize:17,fontWeight:"600",letterSpacing:"-0.3px"}}>Openings</div></div>
          </div>
        </div>
        <div style={{maxWidth:600,margin:"0 auto",padding:"12px 16px 32px"}}>
          {/* Search */}
          <input value={searchQ} onChange={e=>{setSearchQ(e.target.value);setSelCat(null);}} placeholder="Search openings, ECO codes..."
            style={{width:"100%",padding:"10px 14px",background:IOS.card,border:"none",borderRadius:10,color:IOS.text,fontSize:15,fontFamily:IOS.font,marginBottom:12,boxSizing:"border-box",outline:"none",boxShadow:IOS.shadow}}/>
          {/* Category pills */}
          {!searchQ&&<div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
            <Btn small onClick={()=>setSelCat(null)} accent={!selCat?IOS.accent:"#e9e9eb"} style={{color:!selCat?"#fff":IOS.text2}}>All</Btn>
            {CATS.map(c=><Btn key={c.id} small onClick={()=>setSelCat(c.id)} accent={selCat===c.id?IOS.accent:"#e9e9eb"} style={{color:selCat===c.id?"#fff":IOS.text2,whiteSpace:"nowrap"}}>{c.icon} {c.name}</Btn>)}
          </div>}
          {/* Opening cards */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.map(o=>{
              // Compute final position for thumbnail
              const parsed=parseOM(o.moves);
              const thumbBoard=parsed.length?parsed[parsed.length-1].board:dc(INIT_B);
              return(
              <div key={o.id} style={{background:IOS.card,borderRadius:IOS.radius,padding:14,boxShadow:IOS.shadow}}>
                <div style={{display:"flex",gap:12}}>
                  {/* Board thumbnail */}
                  <div style={{flexShrink:0}}><StaticBoard board={thumbBoard} size={26}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontSize:17,fontWeight:"600",color:IOS.text}}>{o.name}</span>
                      <span style={{fontSize:12,color:IOS.text3,background:IOS.bg,padding:"2px 8px",borderRadius:6}}>{o.eco}</span>
                      <span style={{fontSize:12,color:o.side==="white"?IOS.text:IOS.text2,background:o.side==="white"?"#f0f0f0":"#e8e8e8",padding:"2px 8px",borderRadius:6}}>{o.side==="white"?"♔ White":"♚ Black"}</span>
                    </div>
                    <p style={{fontSize:14,color:IOS.text2,margin:"0 0 10px",lineHeight:"1.4"}}>{o.desc}</p>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      <Btn small onClick={()=>startGame(o,null)}>Play</Btn>
                      {(o.vars||[]).map((v,vi)=><Btn key={vi} small onClick={()=>startGame(o,v)} accent="#e9e9eb" style={{color:IOS.accent}}>{v.name}</Btn>)}
                    </div>
                  </div>
                </div>
              </div>);
            })}
            {!filtered.length&&<div style={{textAlign:"center",color:IOS.text3,padding:40}}>No openings found</div>}
          </div>
        </div>
      </div>
    );
  }

  // ===== GAME =====
  if(screen==="game"&&opening){
    const isLt=(r,c)=>(r+c)%2===0;
    const cmtColors={coach:[IOS.bg,"#d4a843"],tip:["#f0fff4",IOS.green],hint:["#eff6ff",IOS.accent]};
    const[cBg,cAccent]=cmtColors[curCmt?.type]||cmtColors.coach;
    return(
      <div style={{...pageStyle,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <style>{`@keyframes hintPulse{0%,100%{opacity:.7;transform:scale(.96)}50%{opacity:1;transform:scale(1.01)}}`}</style>
        {/* Nav */}
        <div style={{width:"100%",background:"rgba(242,242,247,0.85)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`0.5px solid ${IOS.sep}`,padding:"10px 16px",position:"sticky",top:0,zIndex:10}}>
          <div style={{display:"flex",alignItems:"center",gap:6,maxWidth:500,margin:"0 auto"}}>
            <BtnGhost onClick={()=>setScreen("browser")}>‹ Back</BtnGhost>
            <div style={{flex:1,textAlign:"center"}}><div style={{fontSize:16,fontWeight:"600",letterSpacing:"-0.3px"}}>{opening.name}</div>
              <div style={{fontSize:12,color:IOS.text3}}>{variation?.name||"Main Line"} · {opening.side==="white"?"♔":"♚"}</div></div>
            <div style={{width:50}}/>
          </div>
        </div>

        <div style={{maxWidth:SZ*8+32,width:"100%",padding:"8px 16px 24px"}}>
          {/* Commentary */}
          {comments.length>0&&curCmt&&(
            <div style={{background:IOS.card,borderRadius:IOS.radius,padding:"10px 8px",boxShadow:IOS.shadow,marginBottom:8,display:"flex",alignItems:"center",gap:4,minHeight:56}}>
              <BtnGhost onClick={()=>{const ni=Math.max(0,cmtIdx-1);setCmtIdx(ni);const c=comments[ni];if(c?.ply!=null)setViewPly(c.ply);else setViewPly(0);}} disabled={cmtIdx<=0} style={{fontSize:20,padding:"2px 6px"}}>‹</BtnGhost>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                  <span style={{fontSize:11,fontWeight:"600",color:tutMode?"#34c759":cAccent,textTransform:"uppercase",letterSpacing:"0.5px"}}>{tutMode?"📌 Tutorial":curCmt.type==="coach"?"Coach":curCmt.type==="hint"?"💡 Hint":"Your Move"}</span>
                  <span style={{fontSize:11,color:IOS.text3}}>{cmtIdx+1}/{comments.length}</span>
                </div>
                <div style={{fontSize:14,lineHeight:"1.45",color:IOS.text,borderLeft:`3px solid ${tutMode?IOS.green:cAccent}`,paddingLeft:10,borderRadius:2}}>{tutMode?(curCmt.tut||curCmt.text):curCmt.text}</div>
              </div>
              <BtnGhost onClick={()=>{const ni=Math.min(comments.length-1,cmtIdx+1);setCmtIdx(ni);if(ni>=comments.length-1){setViewPly(null);}else{const c=comments[ni];if(c?.ply!=null)setViewPly(c.ply);}}} disabled={cmtIdx>=comments.length-1&&!isViewing} style={{fontSize:20,padding:"2px 6px"}}>{cmtIdx>=comments.length-1&&isViewing?"⏩":"›"}</BtnGhost>
            </div>
          )}

          {/* Viewing history banner */}
          {isViewing&&(
            <div onClick={goLive} style={{background:IOS.orange+"15",border:`1px solid ${IOS.orange}40`,borderRadius:IOS.radiusSm,padding:"8px 14px",marginBottom:6,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
              <span style={{fontSize:13,color:IOS.orange,fontWeight:"600"}}>⏪ Reviewing move {viewPly}</span>
              <span style={{fontSize:12,color:IOS.orange,fontWeight:"700",background:IOS.orange+"20",padding:"4px 12px",borderRadius:16}}>▶ Resume</span>
            </div>
          )}

          {/* Board — UNCHANGED STYLE */}
          <div style={{display:"flex",justifyContent:"center"}}>
            <div style={{display:"grid",gridTemplateColumns:`repeat(8,${SZ}px)`,gridTemplateRows:`repeat(8,${SZ}px)`,borderRadius:4,overflow:"hidden",boxShadow:isViewing?"0 4px 20px rgba(255,149,0,0.18)":"0 4px 20px rgba(0,0,0,0.12)",border:isViewing?"2px solid #ff9500":"2px solid #57534e",transition:"border .2s, box-shadow .2s"}}>
              {Array.from({length:64},(_,i)=>{
                const dR=Math.floor(i/8),dC=i%8;const bR=flip?7-dR:dR,bC=flip?7-dC:dC;
                const piece=displayBoard[bR][bC];const lt=isLt(bR,bC);
                const isSel=!isViewing&&sel&&sel[0]===bR&&sel[1]===bC;
                const isHL=!isViewing&&hlSq.some(s=>s[0]===bR&&s[1]===bC);
                const isLM=displayLastMv&&((displayLastMv.from[0]===bR&&displayLastMv.from[1]===bC)||(displayLastMv.to[0]===bR&&displayLastMv.to[1]===bC));
                const isHF=!isViewing&&hintStage===2&&hintMove?.from?.[0]===bR&&hintMove?.from?.[1]===bC;
                const isHT=!isViewing&&hintStage===2&&hintMove?.to?.[0]===bR&&hintMove?.to?.[1]===bC;
                let bg=lt?"#f0ead6":"#b5a78a";
                if(isLM)bg=lt?"#f2e88e":"#c4b44e";if(isHF)bg=lt?"#90caf9":"#5b9bd5";if(isHT)bg=lt?"#64b5f6":"#4a90c4";if(isSel)bg="#8bc34a";
                return(<div key={i} onClick={()=>isViewing?goLive():onClick(bR,bC)} style={{width:SZ,height:SZ,background:bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:isViewing?"pointer":playerTurn&&!thinking?"pointer":"default",position:"relative",userSelect:"none",transition:"background .12s"}}>
                  {isHL&&!piece&&<div style={{width:"28%",height:"28%",borderRadius:"50%",background:"rgba(0,0,0,0.2)"}}/>}
                  {isHL&&piece&&<div style={{position:"absolute",inset:2,border:"3.5px solid rgba(0,0,0,0.25)",borderRadius:"50%"}}/>}
                  {isHT&&<div style={{position:"absolute",inset:3,borderRadius:"50%",border:"3px solid #1565c0",background:"rgba(21,101,192,0.15)",animation:"hintPulse 1.2s ease-in-out infinite"}}/>}
                  {isHF&&<div style={{position:"absolute",inset:3,borderRadius:"50%",border:"2px dashed #1976d2",background:"rgba(25,118,210,0.08)"}}/>}
                  {piece&&SP[piece]?<div style={{lineHeight:0,position:"relative",zIndex:1}}>{SP[piece](SZ*0.78)}</div>:null}
                </div>);
              })}
            </div>
          </div>

          {/* Controls */}
          <div style={{display:"flex",gap:8,marginTop:10,alignItems:"center"}}>
            <div style={{flex:1,padding:"10px 14px",background:IOS.card,borderRadius:IOS.radiusSm,fontSize:14,color:thinking?IOS.orange:playerTurn?IOS.text:IOS.text3,boxShadow:IOS.shadow,textAlign:"center"}}>
              {thinking?"Thinking...":playerTurn?"Your move":"Waiting..."}
            </div>
            {/* Tutorial toggle */}
            <button onClick={()=>setTutMode(t=>!t)} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",background:tutMode?IOS.green+"18":IOS.card,border:`1.5px solid ${tutMode?IOS.green:IOS.sep}`,borderRadius:20,cursor:"pointer",fontFamily:IOS.font,fontSize:12,fontWeight:"600",color:tutMode?IOS.green:IOS.text3,transition:"all .2s",boxShadow:IOS.shadow}}>
              <div style={{width:34,height:20,borderRadius:10,background:tutMode?IOS.green:"#c7c7cc",transition:"background .25s",position:"relative",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:8,background:"#fff",position:"absolute",top:2,left:tutMode?16:2,transition:"left .25s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
              </div>
              {tutMode?"Tutorial":"Guide"}
            </button>
            <Btn small onClick={onHint} disabled={!playerTurn||thinking||hintStage>=2} accent={hintStage===1?IOS.accent:hintStage>=2?"#c7c7cc":IOS.teal}>
              {hintStage===0?"💡 Hint":hintStage===1?"📍 Show":"✓ Shown"}
            </Btn>
          </div>

          {/* Move log */}
          <div style={{marginTop:8,background:IOS.card,borderRadius:IOS.radiusSm,padding:"8px 14px",boxShadow:IOS.shadow,fontSize:13,maxHeight:54,overflowY:"auto",display:"flex",flexWrap:"wrap",gap:"2px 8px",alignItems:"center"}}>
            <span style={{color:IOS.text3,fontSize:11,fontWeight:"600",marginRight:4}}>MOVES</span>
            {moveLog.map((e,i)=>{
              const isActive=isViewing&&viewPly===e.ply;
              return <span key={i} onClick={()=>{setViewPly(e.ply);const ci=comments.findIndex(c=>c.ply===e.ply);if(ci>=0)setCmtIdx(ci);}} style={{color:isActive?IOS.orange:IOS.text,fontFamily:"'SF Mono',Menlo,monospace",cursor:"pointer",background:isActive?IOS.orange+"18":"transparent",padding:"1px 4px",borderRadius:4,fontWeight:isActive?"700":"400",transition:"all .15s"}}>{e.white?`${Math.floor(i/2)+1}. `:""}{e.notation} </span>;
            })}
            {!moveLog.length&&<span style={{color:IOS.text3}}>—</span>}
          </div>

          {/* Variation switcher */}
          {opening.vars?.length>0&&(
            <div style={{marginTop:12}}>
              <p style={{fontSize:12,color:IOS.text3,fontWeight:"600",margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Other Variations</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {opening.vars.filter(v=>v!==variation).map((v,vi)=><Btn key={vi} small onClick={()=>startGame(opening,v)} accent="#e9e9eb" style={{color:IOS.accent}}>{v.name}</Btn>)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}
