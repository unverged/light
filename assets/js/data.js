/* =========================================================================
   DATA — content only. No DOM here. Rendered by app.js.
   Edit blocks: CAT (loss colours) · STEP (shared light physics) ·
                GROUPS (one energy-flow page each) · TREE (the map).
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. LOSS-CATEGORY COLOURS  (colour encodes the KIND of loss)
   ------------------------------------------------------------------------- */
const CAT = {
  nonpar:   {c:'var(--loss-nonpar)',  name:'off-spectrum light'},
  absorb:   {c:'var(--loss-absorb)',  name:'not absorbed'},
  thermal:  {c:'var(--loss-thermal)', name:'thermalisation (heat)'},
  quantum:  {c:'var(--loss-quantum)', name:'quantum requirement'},
  carbon:   {c:'var(--loss-carbon)',  name:'carbon fixation'},
  photoresp:{c:'var(--loss-photoresp)',name:'photorespiration'},
  resp:     {c:'var(--loss-resp)',    name:'respiration'},
  sat:      {c:'var(--loss-sat)',     name:'light saturation'},
  ccm:      {c:'var(--loss-ccm)',     name:'CO₂ pump cost'},
  water:    {c:'var(--loss-absorb)',  name:'water attenuation'},
  calcify:  {c:'var(--loss-photoresp)',name:'calcification cost'},
  silica:   {c:'var(--loss-quantum)', name:'shell (silica) cost'},
  desicc:   {c:'var(--loss-sat)',     name:'desiccation downtime'},
  winter:   {c:'var(--loss-sat)',     name:'seasonal shutdown'},
  needle:   {c:'var(--loss-absorb)',  name:'needle self-shading'},
};

/* -------------------------------------------------------------------------
   2. SHARED CASCADE STEPS  (identical light physics reused by oxygenic groups)
   ------------------------------------------------------------------------- */
const STEP = {
  nonpar:(remain,lost)=>({
    id:'nonpar', cat:'nonpar', lost, remain,
    label:'Half the Sun is the wrong colour',
    short:'Only 400–700 nm light (PAR) can drive photochemistry; infrared and UV pass straight through.',
    detail:'Chlorophyll-based reaction centres only respond to visible light between roughly 400 and 700 nm — the band called <b>photosynthetically active radiation (PAR)</b>. That is about half of the energy in sunlight; the infrared beyond 700 nm and the ultraviolet below 400 nm simply cannot be captured. This ceiling is set by physics, not biology, so it hits every phototroph before any chemistry begins. Groups with extra pigments (phycobilins in cyanobacteria and red algae, fucoxanthin in diatoms, chlorophyll d/f in some cyanobacteria) shave the penalty down by reaching into green, orange, or far-red light.',
    concept:{title:'Photosynthetically active radiation', cap:'The PAR window (≈400–700 nm) against the solar spectrum.'},
    links:[['Photosynthetically active radiation','Photosynthetically active radiation'],['Chlorophyll','Chlorophyll']]
  }),
  absorb:(remain,lost)=>({
    id:'absorb', cat:'absorb', lost, remain,
    label:'Some light bounces off or slips through',
    short:'Part of the in-band light is reflected, transmitted, or absorbed by non-photosynthetic structures.',
    detail:'Of the usable light that does arrive, not all reaches a reaction centre. A fraction is reflected off the surface, some passes clean through, and some is soaked up by pigments and structures that are not wired into photosynthesis. A healthy leaf or cell absorbs roughly 80–90% of PAR, so this stage is a modest but unavoidable tax on the light that made it past the spectral filter.',
    concept:{title:'Leaf', cap:'Optics: reflectance, transmittance and absorptance of incoming light.'},
    links:[['Absorptance','Absorptance'],['Leaf','Leaf']]
  }),
  thermal:(remain,lost)=>({
    id:'thermal', cat:'thermal', lost, remain,
    label:'Blue photons get downgraded to red',
    short:'Every absorbed photon relaxes to the same low-energy excited state; the surplus is dumped as heat.',
    detail:'A blue photon carries far more energy than a red one, but once absorbed, every photon relaxes to the <b>same</b> low-energy excited state before it can do chemistry — as if all of them were merely 700 nm photons. The excess energy of the shorter wavelengths is released as heat within femtoseconds. This <b>thermalisation</b> loss is a fundamental quantum cost shared by every organism that runs on chlorophyll, and it is one of the reasons photosynthesis can never approach the efficiency of a tuned solar cell.',
    concept:{title:'Photosystem', cap:'Antenna pigments funnel excitation to the reaction centre at a fixed energy.'},
    links:[['Photosystem','Photosystem'],['Thermalisation','Thermalisation']]
  }),
  resp:(remain,lost,extra)=>({
    id:'resp', cat:'resp', lost, remain,
    label:'The cell burns sugar to stay alive',
    short: extra || 'Maintenance and growth respiration consume a share of what was just fixed.',
    detail:'Gross photosynthesis is not net growth. The organism burns a substantial fraction of its fresh sugar in <b>respiration</b> to power maintenance, transport and the construction of new tissue. What survives all of these deductions is the true biomass yield.',
    concept:{title:'Cellular respiration', cap:'Respiration reclaims energy from sugar to run the living cell.'},
    links:[['Cellular respiration','Cellular respiration']]
  }),
};

/* convenience builders for the two aquatic stages reused a lot */
const carbonPyrenoid = (lost,remain)=>({
  id:'carbon',cat:'ccm',lost,remain,label:'Sugar, behind a pyrenoid',
  short:'The Calvin cycle fed by a pyrenoid CO₂ pump and bicarbonate transporters.',
  detail:'Most eukaryotic algae cluster Rubisco inside a <b>pyrenoid</b> and actively pump bicarbonate from the water, converting it to CO₂ right at the enzyme with carbonic anhydrase. Like the bacterial carboxysome, this concentrating mechanism keeps Rubisco fixing carbon instead of oxygen — suppressing photorespiration at an ATP cost.',
  concept:{title:'Pyrenoid', cap:'The pyrenoid: the algal CO₂-concentrating body around Rubisco.'},
  links:[['Pyrenoid','Pyrenoid'],['Carbon concentrating mechanism','Carbon concentrating mechanism']]});
const waterStage = (lost,remain)=>({
  id:'water',cat:'water',lost,remain,label:'The sea filters the light',
  short:'Water absorbs red light within metres and scatters the rest; only blue-green reaches any depth.',
  detail:'Before light even meets a blade, the water column has already filtered it. Red and infrared wavelengths are absorbed within the first few metres, and scattering dims everything with depth, so submerged algae work with a weaker, blue-green-shifted beam. Red and brown algae counter this with accessory pigments (<b>phycoerythrin</b>, <b>fucoxanthin</b>) tuned to exactly the light that survives to depth.',
  concept:{title:'Photic zone', cap:'How sunlight thins and reddens with depth in the sea.'},
  links:[['Photic zone','Photic zone'],['Phycoerythrin','Phycoerythrin']]});

/* the two stages every unpumped C₃ land plant shares (bryophytes → conifers → angiosperms) */
const calvinC3 = (lost,remain)=>({
  id:'carbon',cat:'carbon',lost,remain,label:'Building sugar is expensive',
  short:'It takes 8+ photons to fix one CO₂; the Calvin cycle stores only a fraction of the light energy in sugar.',
  detail:'The light reactions bank energy in ATP and NADPH, and the <b>Calvin–Benson cycle</b> spends it fixing CO₂ into carbohydrate. The bookkeeping is unforgiving: at least 8 photons (measured closer to 9–10) are needed per CO₂, driven through <b>two photosystems in series</b> (the Z-scheme). Most of the captured energy runs that machinery rather than ending up in the sugar itself.',
  concept:{title:'Calvin cycle', cap:'The Calvin–Benson cycle: where CO₂ becomes carbohydrate, at a steep energy cost.'},
  links:[['Calvin cycle','Calvin cycle'],['Light-dependent reactions','Light-dependent reactions'],['RuBisCO','RuBisCO']]});
const photorespC3 = (lost,remain,extra)=>({
  id:'photoresp',cat:'photoresp',lost,remain,label:'Rubisco grabs the wrong molecule',
  short:'Rubisco fixes O₂ instead of CO₂ ~25% of the time; salvaging the mistake can burn 20–50% of the energy.',
  detail:'Rubisco cannot cleanly tell CO₂ from O₂. At warm temperatures and today’s CO₂ levels it grabs oxygen roughly a quarter of the time, producing a toxic by-product the cell must recycle through <b>photorespiration</b> — releasing CO₂ and ammonia and consuming energy for no gain. In C₃ plants this wastes 20–50% of photosynthetic energy, and it is <b>the single biggest thing separating C₃ from C₄ and the aquatic microbes</b>, all of which concentrate CO₂ around Rubisco to shut it down.' + (extra?' '+extra:''),
  concept:{title:'Photorespiration', cap:'Photorespiration: the costly salvage of Rubisco’s oxygenation mistakes.'},
  links:[['Photorespiration','Photorespiration'],['RuBisCO','RuBisCO']]});

/* -------------------------------------------------------------------------
   3. GROUPS  (each = one energy-flow page)
   remain / lost are % of the ORIGINAL incident sunlight.
   Endpoints follow Zhu, Long & Ort; intermediate splits are illustrative.
   `species` is the extended list shown on the page (map lists are shorter).
   ------------------------------------------------------------------------- */
const GROUPS = {

  /* ---------- Land plants: the three non-flowering grades, each its own page ---------- */

  mosses:{
    kind:'oxy', name:'Mosses &amp; bryophytes', kicker:'Oxygenic · C₃ · no roots, no plumbing', max:'≈2.5%',
    intro:'The first plants to leave the water, and still built like it: no roots, no wood, and — in most species — <b>no vascular tissue</b> to move water upward. A moss cushion is <b>poikilohydric</b>, meaning it lets itself dry out to match the air and simply stops. It runs the ordinary C₃ chemistry of a beech tree, but through leaves one cell thick, and only while it happens to be wet.',
    stages:[
      STEP.nonpar(53,47),
      {id:'absorb',cat:'absorb',lost:20,remain:33,label:'A leaf one cell thick',
       short:'Bryophyte leaves are usually a single cell layer, so much of the in-band light passes straight through.',
       detail:'A moss “leaf” is typically <b>one cell thick</b>, with no cuticle, no palisade layer and no internal air spaces to bounce photons back through the chlorophyll. Light that a beech leaf would catch on a second or third pass simply exits the far side. The whole cushion, rather than the individual leaf, is the light-capturing unit — which is why mosses grow as dense mats and why an isolated shoot absorbs so poorly.',
       concept:{title:'Bryophyte', cap:'Bryophyte leaves: a single cell layer, no cuticle, no internal optics.'},
       links:[['Bryophyte','Bryophyte'],['Moss','Moss']]},
      STEP.thermal(25,8),
      calvinC3(14,11),
      photorespC3(4.5,6.5),
      {id:'desicc',cat:'desicc',lost:3.0,remain:3.5,label:'Most of the year, the shop is shut',
       short:'With no way to pull water up, a moss dries to air-dryness and photosynthesis stops until it rains.',
       detail:'This is the stage that has no counterpart in a vascular plant. Lacking roots and xylem, a moss cannot hold its water against a dry afternoon; it equilibrates with the air, its cells shrink, and photosynthesis halts within minutes. Sunlight keeps falling on a metabolically dead cushion. Averaged over a year, a temperate moss may be <b>hydrated and photosynthesising only a fraction of the daylight hours</b> — so its annual energy conversion is far below what a single well-watered hour would suggest. The trade is real, though: rewetting restores full photosynthesis in minutes, and desiccated moss survives conditions that would kill any tree.',
       concept:{title:'Poikilohydry', cap:'Poikilohydry: hydration — and metabolism — tracks the surrounding air.'},
       links:[['Poikilohydry','Poikilohydry'],['Desiccation tolerance','Desiccation tolerance'],['Sphagnum','Sphagnum']]},
      STEP.resp(2.5,1.0,'Maintenance respiration — modest in absolute terms, but a large slice of a very small carbon budget.')
    ],
    win:{label:'it can die and come back', text:'A desiccated moss can sit air-dry for months, then resume full photosynthesis within minutes of a rain shower — a resurrection no vascular plant can perform.'},
    sharedNote:'Mosses lose on efficiency and win on tenacity. <i>Sphagnum</i> peat bogs, built by exactly this slow, intermittent chemistry, hold roughly <b>a third of all soil carbon on Earth</b> — more than every tropical forest combined. Rate is not the same as stock.',
    species:[
      {n:'Peat moss',s:'Sphagnum',wiki:'Sphagnum'},
      {n:'Model moss',s:'Physcomitrium patens',wiki:'Physcomitrium patens'},
      {n:'Common haircap',s:'Polytrichum commune',wiki:'Polytrichum commune'},
      {n:'Silvergreen bryum',s:'Bryum argenteum',wiki:'Bryum argenteum'},
      {n:'Common liverwort',s:'Marchantia polymorpha',wiki:'Marchantia polymorpha'},
      {n:'Hornwort',s:'Anthoceros agrestis',wiki:'Anthoceros'},
    ],
  },

  ferns:{
    kind:'oxy', name:'Ferns', kicker:'Oxygenic · C₃ · vascular, built for the understorey', max:'≈3.6%',
    intro:'The first plants with real plumbing — xylem, phloem, true roots — but still reproducing by <b>spores</b>, not seeds. Ferns dominated the Carboniferous canopy; today most of them live in the shade beneath flowering plants. Their photosynthetic machinery is tuned for that dim, flecked understorey light, which is precisely why it wastes so much of a bright one.',
    stages:[
      STEP.nonpar(53,47), STEP.absorb(37,16), STEP.thermal(28,9),
      calvinC3(16,12),
      photorespC3(5.4,6.6,'Ferns are ordinary C₃ plants here — no pump, no escape.'),
      {id:'sat',cat:'sat',lost:1.8,remain:4.8,label:'Tuned for shade, dazzled by sun',
       short:'Fern photosynthesis saturates at a fraction of full sunlight; the surplus is quenched as heat.',
       detail:'An understorey fern reaches its maximum rate at perhaps <b>a fifth to a third of full sunlight</b> — a low <b>light saturation point</b> — because it is built to exploit dim, patchy light rather than a noon beam. In bright sun the excess is bled off as heat through <b>non-photochemical quenching</b>, and many species actively swing their chloroplasts edge-on to the light to avoid damage. Ferns also have far fewer, larger stomata than angiosperms and open them sluggishly, so a passing sunfleck is often over before CO₂ supply catches up. Low saturation is the price of a low <b>light compensation point</b> — the ability to turn a profit in gloom that would starve a grass.',
       concept:{title:'Chloroplast', cap:'Chloroplast avoidance movement: turning edge-on to escape excess light.'},
       links:[['Photosynthetic efficiency','Photosynthetic efficiency'],['Non-photochemical quenching','Non-photochemical quenching'],['Fern','Fern']]},
      STEP.resp(3.6,1.2,'Maintenance and growth respiration, including the fronds’ non-photosynthetic stipe and rhizome.')
    ],
    win:{label:'profitable in the gloom', text:'A low light compensation point lets ferns show a net carbon gain in shade where a C₄ grass would respire away more than it fixed — which is how they hold the forest floor.'},
    sharedNote:'Ferns keep a trick the seed plants lost: their stomata respond weakly to the drought hormone ABA, and open on light alone. It suits a damp understorey and rules out a dry one.',
    species:[
      {n:'Bracken',s:'Pteridium aquilinum',wiki:'Pteridium aquilinum'},
      {n:'Hart’s-tongue',s:'Asplenium scolopendrium',wiki:'Asplenium scolopendrium'},
      {n:'Ostrich fern',s:'Matteuccia struthiopteris',wiki:'Matteuccia struthiopteris'},
      {n:'Tree fern',s:'Dicksonia antarctica',wiki:'Dicksonia antarctica'},
      {n:'Model fern',s:'Ceratopteris richardii',wiki:'Ceratopteris richardii'},
      {n:'Water fern',s:'Azolla filiculoides',wiki:'Azolla'},
      {n:'Resurrection fern',s:'Pleopeltis polypodioides',wiki:'Pleopeltis polypodioides'},
    ],
  },

  gymnosperms:{
    kind:'oxy', name:'Gymnosperms', kicker:'Oxygenic · C₃ · evergreen, needle-leaved', max:'≈3.9%',
    intro:'Conifers, cycads, <i>Ginkgo</i> — seed plants whose ovules sit <b>naked</b> on a cone scale rather than sealed in a fruit. They lost the canopy to flowering plants everywhere it was warm and wet, and kept everything that was cold, dry, poor or steep. Boreal conifer forest is still the largest terrestrial biome on Earth. Its photosynthesis is the same C₃ chemistry as a wheat field, run at a deliberately slower and more durable setting.',
    stages:[
      STEP.nonpar(53,47),
      {id:'needle',cat:'needle',lost:18,remain:35,label:'Needles in the shade of other needles',
       short:'Clustered needles and thick waxy cuticles mean each one sees a beam already skimmed by its neighbours.',
       detail:'A conifer shoot bundles its needles densely around the twig, so at the scale of a single needle much of the light has already been intercepted by the needles above and around it — <b>self-shading within the shoot</b>. Thick cuticles and a heavy surface wax reflect more than a broad leaf’s surface does. The canopy as a whole intercepts light superbly (which is why a spruce forest floor is dark); the individual needle does not.',
       concept:{title:'Pinophyta', cap:'Needle-leaved shoots: excellent canopy interception, mediocre per-needle absorptance.'},
       links:[['Pinophyta','Pinophyta'],['Leaf area index','Leaf area index']]},
      STEP.thermal(27,8),
      {id:'carbon',cat:'carbon',lost:15,remain:12,label:'Sugar, through a thick needle',
       short:'The ordinary C₃ Calvin cycle, throttled by how slowly CO₂ diffuses into a dense, waxy needle.',
       detail:'The Calvin–Benson cycle costs a conifer exactly what it costs a beech: 8+ photons per CO₂ through the two-photosystem Z-scheme. On top of that, a needle’s thick walls and tightly packed mesophyll give it a <b>low mesophyll conductance</b> — CO₂ moves reluctantly from the stomatal pore to Rubisco — so the enzyme sits at a lower internal CO₂ concentration than a thin broadleaf’s does. Conifers accept a slower carbon intake in exchange for a needle that survives frost, drought and several years of weather.',
       concept:{title:'Calvin cycle', cap:'The Calvin–Benson cycle, fed through a needle’s reluctant diffusion path.'},
       links:[['Calvin cycle','Calvin cycle'],['RuBisCO','RuBisCO'],['Stoma','Stoma']]},
      photorespC3(4.6,7.4,'A low internal CO₂ concentration makes it slightly worse, not better.'),
      {id:'winter',cat:'winter',lost:1.9,remain:5.5,label:'Green all winter, working for none of it',
       short:'Below freezing the needles stay on, but photosynthesis shuts down while the sunlight keeps arriving.',
       detail:'Keeping needles through the winter is what makes a conifer a conifer — but for months the machinery is deliberately switched off. Cold triggers <b>sustained non-photochemical quenching</b>: the needle dismantles its capacity to use light and converts nearly every absorbed photon to heat, because a frozen Calvin cycle cannot consume the electrons and a lit, idle photosystem destroys itself. Sunlight falls on green needles that fix nothing, and the recovery each spring takes weeks. Averaged over the year, this is a real deduction from the light budget — the price of being ready the moment it thaws.',
       concept:{title:'Non-photochemical quenching', cap:'Sustained winter NPQ: absorbed light dumped as heat for months.'},
       links:[['Non-photochemical quenching','Non-photochemical quenching'],['Evergreen','Evergreen'],['Pinophyta','Pinophyta']]},
      STEP.resp(3.9,1.6,'Maintenance respiration — and a conifer must feed decades of accumulated sapwood, not one season’s growth.')
    ],
    win:{label:'no leaf-out lag', text:'An evergreen begins fixing carbon the first warm day of spring and is still working the last warm day of autumn, while a deciduous neighbour spends weeks building leaves it will discard. In a short growing season that head start beats any per-photon efficiency.'},
    sharedNote:'Conifers embody the same bargain as every gymnosperm: a slower, tougher, cheaper leaf that lasts three to ten years rather than one. It loses the race for light wherever the season is long — and wins everywhere the season is short.',
    species:[
      {n:'Scots pine',s:'Pinus sylvestris',wiki:'Pinus sylvestris'},
      {n:'Norway spruce',s:'Picea abies',wiki:'Picea abies'},
      {n:'Coast redwood',s:'Sequoia sempervirens',wiki:'Sequoia sempervirens'},
      {n:'Ginkgo',s:'Ginkgo biloba',wiki:'Ginkgo biloba'},
      {n:'Bristlecone pine',s:'Pinus longaeva',wiki:'Pinus longaeva'},
      {n:'Sago cycad',s:'Cycas revoluta',wiki:'Cycas revoluta'},
      {n:'Common yew',s:'Taxus baccata',wiki:'Taxus baccata'},
    ],
  },

  c3:{
    kind:'oxy', name:'C₃ land plants', kicker:'Oxygenic photoautotroph · no CO₂ pump', max:'4.6%',
    intro:'The default pathway of most trees, shrubs and temperate crops — beech, wheat, rice. Rubisco fixes CO₂ directly from the air, with <b>no mechanism to concentrate it</b>, which leaves the door open to photorespiration. This is the baseline every other group is measured against.',
    stages:[
      STEP.nonpar(53,47), STEP.absorb(37,16), STEP.thermal(28,9),
      calvinC3(16,12),
      photorespC3(5.4,6.6),
      STEP.resp(4.6,2.0)
    ],
    sharedNote:'C₃ plants also face a limit the aquatic groups escape entirely: opening stomata to admit CO₂ means losing water, so in heat or drought they must choose between carbon and dehydration.',
    species:[
      {n:'European beech',s:'Fagus sylvatica',wiki:'Fagus sylvatica'},
      {n:'Wheat',s:'Triticum aestivum',wiki:'Wheat'},
      {n:'Rice',s:'Oryza sativa',wiki:'Rice'},
      {n:'Soybean',s:'Glycine max',wiki:'Soybean'},
      {n:'English oak',s:'Quercus robur',wiki:'Quercus robur'},
      {n:'Potato',s:'Solanum tuberosum',wiki:'Potato'},
      {n:'Sunflower',s:'Helianthus annuus',wiki:'Helianthus annuus'},
    ],
  },

  c4:{
    kind:'oxy', name:'C₄ plants', kicker:'Oxygenic · biochemical CO₂ pump', max:'6.0%',
    intro:'Maize, sugarcane, sorghum — tropical grasses that evolved a <b>CO₂-concentrating pump</b>. They fix carbon first in mesophyll cells, then release it, concentrated, around Rubisco in sealed bundle-sheath cells. That pump costs extra ATP but almost completely shuts down photorespiration, which is why C₄ tops out higher than C₃.',
    stages:[
      STEP.nonpar(53,47), STEP.absorb(37,16), STEP.thermal(28,9),
      {id:'carbon',cat:'ccm',lost:17,remain:11,label:'Sugar, plus the cost of the pump',
       short:'The Calvin cycle plus the C₄ CO₂ pump; extra ATP is spent shuttling carbon into the bundle sheath.',
       detail:'C₄ plants run the same Calvin cycle but prepend a <b>CO₂-concentrating mechanism</b>: PEP carboxylase captures carbon in the mesophyll, ships it as a four-carbon acid into the bundle sheath, and releases it there at high concentration. This costs extra ATP per CO₂, so the pure biochemistry is slightly <i>more</i> expensive than C₃ — the payoff comes next.',
       concept:{title:'C4 carbon fixation', cap:'The C₄ shuttle: PEP carboxylase feeds concentrated CO₂ to Rubisco.'},
       links:[['C4 carbon fixation','C4 carbon fixation'],['PEP carboxylase','Phosphoenolpyruvate carboxylase']]},
      STEP.resp(6.0,5.0,'Maintenance and growth respiration — but with photorespiration essentially eliminated.')
    ],
    win:{label:'photorespiration ≈ 0', text:'The bundle-sheath CO₂ pump lets C₄ skip the 20–50% photorespiration penalty that holds C₃ back.'},
    sharedNote:'Like all land plants, C₄ species still pay the stomatal water cost — though their CO₂ pump lets them keep stomata more closed, making them notably more water-efficient.',
    species:[
      {n:'Maize',s:'Zea mays',wiki:'Maize'},
      {n:'Sugarcane',s:'Saccharum officinarum',wiki:'Sugarcane'},
      {n:'Sorghum',s:'Sorghum bicolor',wiki:'Sorghum'},
      {n:'Pearl millet',s:'Cenchrus americanus',wiki:'Pearl millet'},
      {n:'Switchgrass',s:'Panicum virgatum',wiki:'Panicum virgatum'},
      {n:'Crabgrass',s:'Digitaria sanguinalis',wiki:'Digitaria sanguinalis'},
    ],
  },

  cam:{
    kind:'oxy', name:'CAM plants', kicker:'Oxygenic · CO₂ pump in time, not space', max:'≈4%',
    intro:'Pineapple, agave, most cacti and many orchids. CAM plants run the same CO₂-concentrating trick as C₄ but <b>separate it in time</b>: stomata open at night to store CO₂ as malate, then close by day so photosynthesis runs on the stored supply without losing water. Superb for deserts — but the size of the nightly malate store caps how much carbon a day can fix.',
    stages:[
      STEP.nonpar(53,47), STEP.absorb(37,16), STEP.thermal(28,9),
      {id:'carbon',cat:'ccm',lost:17,remain:11,label:'Sugar, plus the nocturnal pump',
       short:'CO₂ is banked at night as malate, then fed to the Calvin cycle by day — at an ATP cost.',
       detail:'CAM (Crassulacean Acid Metabolism) fixes CO₂ into malic acid overnight while stomata are open and evaporation is low, stores it in the vacuole, then breaks it down during the day to feed Rubisco behind <b>closed stomata</b>. Like C₄ it suppresses photorespiration and saves enormous amounts of water — but running the pump costs extra ATP.',
       concept:{title:'Crassulacean acid metabolism', cap:'CAM banks CO₂ as malate at night and releases it by day.'},
       links:[['Crassulacean acid metabolism','Crassulacean acid metabolism']]},
      {id:'sat',cat:'sat',lost:4.5,remain:6.5,label:'The night tank runs dry',
       short:'A day can only fix as much CO₂ as was stored overnight — a hard ceiling on throughput.',
       detail:'CAM’s water thrift comes at a price: daytime carbon fixation is limited to whatever CO₂ the plant banked as malate the night before. Vacuole capacity caps the nightly store, so even in blazing sun a CAM plant cannot fix carbon as fast as a C₄ plant. This throughput ceiling — not photorespiration — is why CAM plants grow slowly.',
       concept:{title:'Crassulacean acid metabolism', cap:'The malate store sets a nightly quota on the next day’s carbon.'},
       links:[['Crassulacean acid metabolism','Crassulacean acid metabolism']]},
      STEP.resp(4.3,2.2,'Ordinary maintenance respiration on a smaller carbon budget.')
    ],
    sharedNote:'CAM is the ultimate water-saver among land plants — but the same closed-by-day stomata that conserve water are what starve it of CO₂ and cap its growth.',
    species:[
      {n:'Pineapple',s:'Ananas comosus',wiki:'Pineapple'},
      {n:'Agave',s:'Agave americana',wiki:'Agave americana'},
      {n:'Prickly pear',s:'Opuntia ficus-indica',wiki:'Opuntia ficus-indica'},
      {n:'Jade plant',s:'Crassula ovata',wiki:'Crassula ovata'},
      {n:'Queen of the night',s:'Epiphyllum oxypetalum',wiki:'Epiphyllum oxypetalum'},
      {n:'Spanish moss',s:'Tillandsia usneoides',wiki:'Tillandsia usneoides'},
    ],
  },

  cyanobacteria:{
    kind:'oxy', name:'Cyanobacteria', kicker:'Oxygenic · prokaryote · the original inventors', max:'6–8%',
    intro:'The bacteria that <b>invented oxygenic photosynthesis</b> — and whose descendants, domesticated, became the chloroplast. <i>Spirulina</i>, <i>Prochlorococcus</i>, <i>Anabaena</i>. They pack a CO₂-concentrating <b>carboxysome</b> around Rubisco and carry extra pigments (phycobilins) that reach light land plants miss, so they dodge two of the biggest plant penalties at once.',
    stages:[
      STEP.nonpar(56,44), STEP.absorb(39,17), STEP.thermal(29,10),
      {id:'carbon',cat:'ccm',lost:18,remain:11,label:'Sugar, behind a carboxysome',
       short:'The Calvin cycle fed by a carboxysome CO₂ pump — extra cost, but Rubisco stays saturated with CO₂.',
       detail:'Cyanobacteria wrap Rubisco inside a protein shell called a <b>carboxysome</b> and pump bicarbonate into the cell, flooding the enzyme with CO₂. Running that pump costs energy, but it keeps Rubisco working on carbon instead of oxygen — a microbial version of the C₄ trick, and the reason cyanobacteria can be grown at high efficiency in bioreactors.',
       concept:{title:'Carboxysome', cap:'The carboxysome: a bacterial CO₂-concentrating micro-compartment around Rubisco.'},
       links:[['Carboxysome','Carboxysome'],['Cyanobacteria','Cyanobacteria']]},
      STEP.resp(6.5,4.5,'Maintenance respiration — with photorespiration essentially eliminated by the carboxysome.')
    ],
    win:{label:'photorespiration ≈ 0', text:'The carboxysome plus phycobilin pigments let cyanobacteria beat both the spectral penalty and the photorespiration penalty that limit C₃ plants.'},
    sharedNote:'In water, CO₂ diffuses ~10,000× slower than in air — which is exactly why aquatic phototrophs evolved such aggressive CO₂-concentrating machinery in the first place.',
    species:[
      {n:'Spirulina',s:'Arthrospira platensis',wiki:'Arthrospira'},
      {n:'Prochlorococcus',s:'Prochlorococcus marinus',wiki:'Prochlorococcus'},
      {n:'Anabaena',s:'Anabaena',wiki:'Anabaena'},
      {n:'Nostoc',s:'Nostoc commune',wiki:'Nostoc'},
      {n:'Synechocystis',s:'Synechocystis sp. PCC 6803',wiki:'Synechocystis'},
      {n:'Trichodesmium',s:'Trichodesmium erythraeum',wiki:'Trichodesmium'},
    ],
  },

  /* ---------- Eukaryotic algae: now one distinctive page each ---------- */

  greenalgae:{
    kind:'oxy', name:'Green algae', kicker:'Oxygenic · eukaryote · Chlorophyta', max:'5–7%',
    intro:'The green drifters and mats of fresh and salt water — the lineage that gave rise to all land plants. Same chlorophyll <i>a</i>/<i>b</i> as a leaf, but suspended as single cells or simple filaments. Model organisms like <i>Chlamydomonas</i> and fast-growing <i>Chlorella</i> make them the workhorses of algal biotech.',
    stages:[
      STEP.nonpar(55,45), STEP.absorb(38,17), STEP.thermal(28,10),
      carbonPyrenoid(17,11),
      {id:'sat',cat:'sat',lost:3.5,remain:7.5,label:'Too much light, and shading below',
       short:'Photosynthesis saturates well below noon sun; surface cells shade those beneath (the package effect).',
       detail:'A single cell saturates at a fraction of full sunlight, so much of the midday beam is wasted, and excess light is bled off as heat through <b>non-photochemical quenching</b> to avoid damage. In a dense suspension the cells near the surface steal light from those below — the <b>package effect</b> — so a whole culture never performs as well as one thin cell in ideal light.',
       concept:{title:'Non-photochemical quenching', cap:'Excess absorbed light is safely dissipated as heat via NPQ.'},
       links:[['Non-photochemical quenching','Non-photochemical quenching'],['Chlamydomonas reinhardtii','Chlamydomonas reinhardtii']]},
      STEP.resp(5.0,2.5,'Maintenance respiration on the surviving carbon budget.')
    ],
    win:{label:'photorespiration ≈ 0', text:'The pyrenoid and bicarbonate pumps suppress photorespiration — the aquatic microbes’ equivalent of the C₄ advantage.'},
    sharedNote:'Green algae are the direct ancestors of land plants (via the charophytes) — the same chlorophyll-a/b machinery, just never having left the water.',
    species:[
      {n:'Model green alga',s:'Chlamydomonas reinhardtii',wiki:'Chlamydomonas reinhardtii'},
      {n:'Chlorella',s:'Chlorella vulgaris',wiki:'Chlorella',mixo:true},
      {n:'Sea lettuce',s:'Ulva lactuca',wiki:'Ulva'},
      {n:'Volvox',s:'Volvox carteri',wiki:'Volvox'},
      {n:'Salt alga',s:'Dunaliella salina',wiki:'Dunaliella salina'},
      {n:'Blood-rain alga',s:'Haematococcus pluvialis',wiki:'Haematococcus pluvialis'},
      {n:'Scenedesmus',s:'Scenedesmus obliquus',wiki:'Scenedesmus'},
    ],
  },

  redalgae:{
    kind:'oxy', name:'Red algae', kicker:'Oxygenic · eukaryote · Rhodophyta · submerged', max:'3–6%',
    intro:'The red seaweeds behind nori, agar and carrageenan. Their pigment <b>phycoerythrin</b> is tuned to the blue-green light that survives to depth, so red algae can live <b>deeper than any other seaweed</b> — down to ~250 m in the clearest water. That reach comes at the price of an already water-thinned light budget.',
    stages:[
      STEP.nonpar(53,47),
      waterStage(15,38),
      STEP.absorb(27,11), STEP.thermal(20,7),
      {id:'carbon',cat:'ccm',lost:12,remain:8,label:'Sugar, with a CO₂ pump',
       short:'The Calvin cycle fed by algal CO₂-concentrating mechanisms drawing on seawater bicarbonate.',
       detail:'Red algae tap the vast bicarbonate pool of seawater and concentrate it around Rubisco, suppressing photorespiration much as other algae do. The energy that survives the long trip through water and the biochemistry is what builds the frond. <b>Phycoerythrin</b> is the signature move — it harvests exactly the wavelengths that penetrate deepest.',
       concept:{title:'Phycoerythrin', cap:'Phycoerythrin harvests the blue-green light that reaches depth.'},
       links:[['Phycoerythrin','Phycoerythrin'],['Red algae','Red algae']]},
      STEP.resp(4.5,3.5,'Maintenance respiration — proportionally larger because the light budget started smaller.')
    ],
    sharedNote:'Depth is the master variable: the same red alga is far more efficient in a sunlit rockpool than 30 m down — but phycoerythrin is what lets it live down there at all.',
    species:[
      {n:'Nori',s:'Pyropia yezoensis',wiki:'Pyropia'},
      {n:'Irish moss',s:'Chondrus crispus',wiki:'Chondrus crispus'},
      {n:'Agar weed',s:'Gracilaria',wiki:'Gracilaria'},
      {n:'Dulse',s:'Palmaria palmata',wiki:'Palmaria palmata'},
      {n:'Coralline alga',s:'Corallina officinalis',wiki:'Corallina officinalis'},
      {n:'Hot-spring red alga',s:'Cyanidioschyzon merolae',wiki:'Cyanidioschyzon merolae'},
    ],
  },

  diatoms:{
    kind:'oxy', name:'Diatoms', kicker:'Oxygenic · eukaryote · Bacillariophyta', max:'5–8%',
    intro:'Single cells that live in jewel-box shells of glass. Diatoms carry out roughly <b>a fifth of all photosynthesis on Earth</b> and drive the ocean’s biological carbon pump when their silica shells sink. Their pigment <b>fucoxanthin</b> harvests blue-green light, widening the usable spectrum beyond what a green cell can reach.',
    stages:[
      STEP.nonpar(58,42), STEP.absorb(41,17), STEP.thermal(31,10),
      {id:'silica',cat:'silica',lost:2,remain:29,label:'Building the glass house',
       short:'Precipitating the silica frustule each division is an extra energetic and nutrient cost.',
       detail:'Every diatom builds a two-part shell of amorphous silica — the <b>frustule</b> — and must rebuild it at each cell division. Silica uptake and deposition cost energy and tie growth to dissolved-silicon supply; when silicon runs out, diatom blooms crash. The dense shell also makes cells sink, ferrying carbon to the deep sea (the <b>biological pump</b>).',
       concept:{title:'Frustule', cap:'The silica frustule: a diatom’s two-valve glass shell.'},
       links:[['Frustule','Frustule'],['Diatom','Diatom'],['Biological pump','Biological pump']]},
      carbonPyrenoid(18,11),
      {id:'sat',cat:'sat',lost:2.5,remain:8.5,label:'Fucoxanthin harvests wide, but light still saturates',
       short:'A broad accessory-pigment antenna helps, yet photosynthesis still saturates below full sun.',
       detail:'Fucoxanthin lets diatoms harvest the blue-green light that dominates seawater, so their spectral penalty is smaller than a green cell’s. But the reaction centres still saturate below full sunlight, and excess light is quenched as heat to prevent damage — the same NPQ ceiling every microalga hits.',
       concept:{title:'Fucoxanthin', cap:'Fucoxanthin: the brown-gold pigment that widens the diatom antenna.'},
       links:[['Fucoxanthin','Fucoxanthin'],['Non-photochemical quenching','Non-photochemical quenching']]},
      STEP.resp(6.0,2.5,'Maintenance respiration on the surviving carbon budget.')
    ],
    win:{label:'wide antenna + pyrenoid', text:'Fucoxanthin widens the usable spectrum and the pyrenoid suppresses photorespiration — two advantages stacked, which is why diatoms are so productive.'},
    sharedNote:'Diatoms are limited in vast ocean regions not by light but by <b>iron and silicon</b> — add either, and blooms follow.',
    species:[
      {n:'Bloom diatom',s:'Thalassiosira pseudonana',wiki:'Thalassiosira'},
      {n:'Model pennate',s:'Phaeodactylum tricornutum',wiki:'Phaeodactylum tricornutum'},
      {n:'Chain diatom',s:'Skeletonema costatum',wiki:'Skeletonema'},
      {n:'Spring-bloom diatom',s:'Chaetoceros',wiki:'Chaetoceros'},
      {n:'Toxic diatom',s:'Pseudo-nitzschia',wiki:'Pseudo-nitzschia'},
      {n:'Freshwater diatom',s:'Fragilaria',wiki:'Fragilaria'},
    ],
  },

  brownalgae:{
    kind:'oxy', name:'Brown algae', kicker:'Oxygenic · eukaryote · Phaeophyceae · anchored', max:'3–6%',
    intro:'The big anchored seaweeds — giant kelp, wracks and <i>Sargassum</i>. Giant kelp can grow half a metre a day and build underwater forests. Like diatoms they use <b>fucoxanthin</b>, but they live below the surface, so the water column steals and reddens their light before it reaches a blade.',
    stages:[
      STEP.nonpar(53,47),
      waterStage(14,39),
      STEP.absorb(28,11), STEP.thermal(21,7),
      {id:'carbon',cat:'ccm',lost:11,remain:10,label:'Sugar, with a CO₂ pump',
       short:'The Calvin cycle fed by CO₂-concentrating mechanisms drawing on seawater bicarbonate.',
       detail:'Kelps tap seawater’s bicarbonate and concentrate it around Rubisco, suppressing photorespiration. Fucoxanthin harvests the blue-green light that reaches them. What survives the long trip through water and the biochemistry is what builds the frond — and kelp build a lot of it, very fast.',
       concept:{title:'Kelp', cap:'Kelp: carbon fixation fed from seawater’s bicarbonate reserve.'},
       links:[['Kelp','Kelp'],['Fucoxanthin','Fucoxanthin']]},
      STEP.resp(5.2,4.8,'Maintenance respiration — higher, relatively, because the light budget started smaller.')
    ],
    sharedNote:'Kelp are astonishingly productive per area because they are huge and grow fast — but their per-photon efficiency is capped by living underwater.',
    species:[
      {n:'Giant kelp',s:'Macrocystis pyrifera',wiki:'Macrocystis pyrifera'},
      {n:'Bladderwrack',s:'Fucus vesiculosus',wiki:'Fucus vesiculosus'},
      {n:'Sargassum',s:'Sargassum',wiki:'Sargassum'},
      {n:'Sugar kelp',s:'Saccharina latissima',wiki:'Saccharina latissima'},
      {n:'Bull kelp',s:'Nereocystis luetkeana',wiki:'Nereocystis'},
      {n:'Knotted wrack',s:'Ascophyllum nodosum',wiki:'Ascophyllum nodosum'},
    ],
  },

  dinoflagellates:{
    kind:'oxy', name:'Dinoflagellates', kicker:'Oxygenic* · eukaryote · often mixotrophic', max:'~4–7%',
    intro:'Whirling, armoured cells with two flagella — the algae behind <b>red tides</b>, ocean <b>bioluminescence</b>, and the <i>Symbiodinium</i> that power coral reefs. Many are <b>facultatively mixotrophic</b>: they photosynthesise <i>and</i> eat, so their energy budget is a blend the pure numbers below only partly capture.',
    stages:[
      STEP.nonpar(54,46), STEP.absorb(37,17), STEP.thermal(27,10),
      {id:'carbon',cat:'ccm',lost:16,remain:11,label:'Sugar, with peridinin & a CO₂ pump',
       short:'The Calvin cycle fed by a CO₂-concentrating mechanism; peridinin widens the antenna.',
       detail:'Dinoflagellates use the carotenoid <b>peridinin</b> to harvest blue-green light and concentrate CO₂ around Rubisco. Their Rubisco is an unusual <b>Form II</b> enzyme, even more oxygen-prone than the plant version, which makes the CO₂ pump essential rather than optional.',
       concept:{title:'Peridinin', cap:'Peridinin: the signature light-harvesting carotenoid of dinoflagellates.'},
       links:[['Peridinin','Peridinin'],['Dinoflagellate','Dinoflagellate']]},
      {id:'sat',cat:'sat',lost:4,remain:7,label:'Saturation — but eating fills the gap',
       short:'Light saturates as in any microalga, yet many species top up by ingesting prey (mixotrophy).',
       detail:'Photosynthesis saturates below full sun, but many dinoflagellates are <b>mixotrophic</b> — they engulf bacteria and other plankton to supplement fixed carbon, or (as <i>Symbiodinium</i>) live inside coral and trade sugars for shelter. This flexibility lets them thrive where pure phototrophs would starve, at the cost of a tidy efficiency figure.',
       concept:{title:'Mixotroph', cap:'Mixotrophy: photosynthesis and predation in the same cell.'},
       links:[['Mixotroph','Mixotroph'],['Symbiodinium','Symbiodinium']]},
      STEP.resp(5.0,2.0,'Maintenance respiration — offset in mixotrophs by ingested carbon.')
    ],
    win:{label:'mixotrophy = a second income', text:'Being able to eat as well as photosynthesise makes dinoflagellates resilient in nutrient-poor, variable water — flexibility a pure autotroph lacks.'},
    sharedNote:'The reef-building partnership between corals and their <i>Symbiodinium</i> is one of the most important mutualisms on Earth — and its breakdown is coral bleaching.',
    species:[
      {n:'Coral symbiont',s:'Symbiodinium',wiki:'Symbiodinium',mixo:true},
      {n:'Red-tide alga',s:'Karenia brevis',wiki:'Karenia brevis',mixo:true},
      {n:'Sea sparkle',s:'Noctiluca scintillans',wiki:'Noctiluca scintillans',mixo:true},
      {n:'Shellfish-toxin alga',s:'Alexandrium',wiki:'Alexandrium (dinoflagellate)',mixo:true},
      {n:'Bioluminescent alga',s:'Lingulodinium polyedra',wiki:'Lingulodinium polyedra',mixo:true},
    ],
  },

  coccolithophores:{
    kind:'oxy', name:'Coccolithophores', kicker:'Oxygenic* · eukaryote · Haptophyta · calcifying', max:'~4–7%',
    intro:'Microscopic cells wrapped in plates of chalk (<b>coccoliths</b>). Their blooms turn whole seas milky-turquoise — visible from orbit — and their sunken plates built the White Cliffs of Dover. Building all that calcite is a curious energy sink that no other phytoplankton pays.',
    stages:[
      STEP.nonpar(55,45), STEP.absorb(38,17), STEP.thermal(28,10),
      carbonPyrenoid(16,12),
      {id:'calcify',cat:'calcify',lost:3,remain:9,label:'Building plates of chalk',
       short:'Precipitating CaCO₃ coccoliths costs energy — and paradoxically releases CO₂.',
       detail:'Coccolithophores build ornate <b>calcite plates</b> inside the cell and export them to the surface. <b>Calcification</b> costs ATP, and its chemistry releases CO₂ even as photosynthesis consumes it — so the two processes partly work against each other. The plates may deter grazers, ballast the cell, or manage light; the exact payoff is still debated. When these cells sink, they carry carbon <i>and</i> carbonate to the deep sea.',
       concept:{title:'Coccolithophore', cap:'Coccoliths: interlocking calcite plates around the cell.'},
       links:[['Coccolithophore','Coccolithophore'],['Coccolith','Coccolith'],['Emiliania huxleyi','Emiliania huxleyi']]},
      {id:'sat',cat:'sat',lost:2.5,remain:6.5,label:'Light saturation & shading',
       short:'Photosynthesis saturates below full sun; blooms self-shade as in any dense culture.',
       detail:'Like every microalga, coccolithophores saturate below full sunlight and bleed excess energy as heat, and dense blooms self-shade. Some species are also mildly mixotrophic. Their bright calcite actually scatters light, which is what makes their blooms so visible from space.',
       concept:{title:'Non-photochemical quenching', cap:'Excess light dissipated as heat.'},
       links:[['Non-photochemical quenching','Non-photochemical quenching']]},
      STEP.resp(4.8,1.7,'Maintenance respiration on the surviving budget.')
    ],
    sharedNote:'Coccolithophores sit at the crossroads of the carbon and carbonate cycles — they fix CO₂ like any alga, yet also build (and, when they dissolve, release) mineral carbonate.',
    species:[
      {n:'Chalk plankton',s:'Emiliania huxleyi',wiki:'Emiliania huxleyi',mixo:true},
      {n:'Gephyrocapsa',s:'Gephyrocapsa oceanica',wiki:'Gephyrocapsa'},
      {n:'Coccolithus',s:'Coccolithus pelagicus',wiki:'Coccolithus pelagicus'},
      {n:'Calcidiscus',s:'Calcidiscus leptoporus',wiki:'Calcidiscus leptoporus'},
    ],
  },

  euglenids:{
    kind:'oxy', name:'Euglenids', kicker:'Oxygenic* · eukaryote · Euglenophyta · mixotrophic', max:'variable',
    intro:'Pond-water shape-shifters with a red <b>eyespot</b> and no cell wall. Their green plastid was borrowed <b>second-hand</b> — an ancestor swallowed a whole green alga — and many euglenids can lose it entirely and live as predators or absorbers. They are textbook <b>mixotrophs</b>, straddling the line between plant and animal.',
    stages:[
      STEP.nonpar(54,46), STEP.absorb(37,17), STEP.thermal(27,10),
      {id:'carbon',cat:'ccm',lost:16,remain:11,label:'Sugar, in a second-hand chloroplast',
       short:'A green plastid acquired by secondary endosymbiosis runs the Calvin cycle.',
       detail:'Euglenid chloroplasts have <b>three membranes</b>, a fingerprint of <b>secondary endosymbiosis</b>: the plastid came from an engulfed green alga, not directly from a cyanobacterium. It runs the same chlorophyll-a/b photosynthesis, storing carbon as the unusual polysaccharide <b>paramylon</b> rather than starch.',
       concept:{title:'Euglena', cap:'The euglenid cell: eyespot, flagellum and a second-hand green plastid.'},
       links:[['Euglena','Euglena'],['Symbiogenesis','Symbiogenesis']]},
      {id:'sat',cat:'sat',lost:3,remain:8,label:'Or skip the light entirely',
       short:'When light is poor, euglenids switch to eating or absorbing organic carbon.',
       detail:'Euglenids are the most opportunistic of these algae. In the light they photosynthesise; in the dark, or in rich water, they take up dissolved organics or engulf particles. Some permanently lose their chloroplast and live as heterotrophs. This makes any single efficiency figure almost meaningless — the point is the <b>flexibility</b>.',
       concept:{title:'Mixotroph', cap:'Mixotrophy: photosynthesis and heterotrophy in one cell.'},
       links:[['Mixotroph','Mixotroph'],['Phototaxis','Phototaxis']]},
      STEP.resp(6.0,2.0,'Maintenance respiration — readily topped up by ingested carbon.')
    ],
    win:{label:'plant when it suits, animal when it doesn’t', text:'A borrowed chloroplast plus the ability to eat lets euglenids exploit habitats too dark or too rich for a committed autotroph.'},
    sharedNote:'Euglenids are a favourite classroom demonstration of mixotrophy — and a reminder that “plant” and “animal” are lifestyles a single cell can switch between.',
    species:[
      {n:'Model euglenid',s:'Euglena gracilis',wiki:'Euglena'},
      {n:'Green euglenid',s:'Euglena viridis',wiki:'Euglena viridis'},
      {n:'Lens-shaped euglenid',s:'Phacus',wiki:'Phacus'},
      {n:'Shelled euglenid',s:'Trachelomonas',wiki:'Trachelomonas'},
      {n:'Marine euglenid',s:'Eutreptiella',wiki:'Eutreptiella'},
    ],
  },

  anox:{
    kind:'anox', name:'Anoxygenic phototrophs', kicker:'Photoautotroph · no water-splitting · no O₂', max:'niche',
    intro:'An older, stranger way to live on light. Purple and green bacteria run photosynthesis with a <b>single photosystem</b> and <b>never split water</b> — so they release no oxygen. Instead they strip electrons from hydrogen sulfide, hydrogen gas or iron. Their bacteriochlorophylls see deep-red and infrared light that plants can’t, letting them thrive in sulfurous muds and the dim water beneath algal blooms.',
    qualitative:[
      {cat:'nonpar',label:'A different slice of the spectrum',
       text:'Bacteriochlorophylls absorb in the far-red and near-infrared (up to ~1000 nm), so these bacteria harvest light that oxygenic phototrophs above them have already skimmed the visible out of — an advantage in layered, low-light habitats.',
       links:[['Bacteriochlorophyll','Bacteriochlorophyll'],['Anoxygenic photosynthesis','Phototroph']]},
      {cat:'quantum',label:'One photosystem, not two',
       text:'With a single reaction centre rather than the Z-scheme’s two-in-series, the per-electron photon cost is lower. But a single photosystem cannot generate a strong enough oxidant to pull electrons from water.',
       links:[['Photosynthetic reaction centre','Photosynthetic reaction centre']]},
      {cat:'carbon',label:'Weak electron donors cap everything',
       text:'Because they can’t use water, they depend on scarcer donors — H₂S, H₂, Fe²⁺, or organics. The supply of those donors, not the light, is usually the true limiting factor, confining these bacteria to anoxic, sulfidic niches and low overall productivity.',
       links:[['Green sulfur bacteria','Green sulfur bacteria'],['Purple bacteria','Purple bacteria']]},
    ],
    sharedNote:'Many are <b>facultatively mixotrophic</b> (the * groups on the map): when light or donors run short they switch to consuming organic carbon — a flexibility that pure autotrophs lack.',
    species:[
      {n:'Purple sulfur bacterium',s:'Chromatium okenii',wiki:'Chromatium'},
      {n:'Purple non-sulfur bacterium',s:'Rhodospirillum rubrum',wiki:'Rhodospirillum rubrum',mixo:true},
      {n:'Green sulfur bacterium',s:'Chlorobium',wiki:'Chlorobium'},
      {n:'Heliobacterium',s:'Heliobacterium modesticaldum',wiki:'Heliobacterium',mixo:true},
      {n:'Purple non-sulfur bacterium',s:'Rhodobacter sphaeroides',wiki:'Rhodobacter',mixo:true},
    ],
  },

  chemo:{
    kind:'chemo', name:'Chemolithoautotrophs', kicker:'Autotroph · no light at all',
    intro:'Autotrophs that never touch sunlight. They fix CO₂ into biomass using energy pulled from <b>oxidising inorganic chemicals</b> — iron, sulfur, ammonia, hydrogen. They power deep-sea vents, drive the nitrogen cycle in every soil, and rust the world. Their limit isn’t the spectrum or Rubisco — it’s that each chemical reaction releases only a <b>small packet of free energy</b>, so growth is slow and demands enormous throughput of raw material.',
    donors:[
      {h:'Iron oxidisers',rx:'Fe²⁺ → Fe³⁺',who:'Acidithiobacillus, Gallionella, Mariprofundus',wiki:'Iron-oxidizing bacteria'},
      {h:'Sulfur oxidisers',rx:'H₂S / S⁰ → SO₄²⁻',who:'Beggiatoa, Thiobacillus; vent tubeworm symbionts',wiki:'Sulfur-oxidizing bacteria'},
      {h:'Nitrifiers',rx:'NH₃ → NO₂⁻ → NO₃⁻',who:'Nitrosomonas, Nitrospira, Nitrobacter',wiki:'Nitrifying bacteria'},
      {h:'Hydrogen oxidisers',rx:'H₂ + O₂ → H₂O',who:'Cupriavidus necator (Knallgas bacteria)',wiki:'Knallgas bacteria'},
      {h:'Methanogens (Archaea)',rx:'H₂ + CO₂ → CH₄',who:'Methanocaldococcus jannaschii',wiki:'Methanogen'},
      {h:'Anammox',rx:'NH₄⁺ + NO₂⁻ → N₂',who:'Kuenenia, Brocadia',wiki:'Anammox'},
    ],
    sharedNote:'These organisms sit on your family tree as the answer to “what if an autotroph had no Sun?” — proof that building a body from CO₂ doesn’t strictly require light, only a source of usable energy.',
    species:[
      {n:'Acid-mine iron bacterium',s:'Acidithiobacillus ferrooxidans',wiki:'Acidithiobacillus ferrooxidans'},
      {n:'Vent iron bacterium',s:'Mariprofundus ferrooxydans',wiki:'Mariprofundus ferrooxydans'},
      {n:'Sulfur bacterium',s:'Beggiatoa',wiki:'Beggiatoa'},
      {n:'Ammonia oxidiser',s:'Nitrosomonas europaea',wiki:'Nitrosomonas'},
      {n:'Nitrite oxidiser',s:'Nitrospira',wiki:'Nitrospira'},
      {n:'Knallgas bacterium',s:'Cupriavidus necator',wiki:'Cupriavidus necator'},
      {n:'Vent methanogen',s:'Methanocaldococcus jannaschii',wiki:'Methanocaldococcus jannaschii'},
    ],
  },
};

/* -------------------------------------------------------------------------
   4. THE TAXONOMY TREE  (the map)
   `img` on a leaf is the local slug under images/organisms/<slug>.jpg
   Per-species `mixo:true` prints the * marker.
   ------------------------------------------------------------------------- */
const TREE = {
  name:'Autotrophs', note:'organisms that build biomass from inorganic carbon (CO₂)',
  children:[
    { name:'Phototrophs', note:'energy from light', children:[
      { name:'Oxygenic photoautotrophs', note:'split water → release O₂', children:[
        { leaf:true, groupId:'cyanobacteria', name:'Cyanobacteria', rank:'Domain Bacteria', mixo:true, img:'cyanobacteria',
          species:[{n:'Spirulina',s:'Arthrospira platensis',wiki:'Arthrospira'},{n:'Prochlorococcus',s:'Prochlorococcus marinus',wiki:'Prochlorococcus'},{n:'Anabaena',s:'Anabaena',wiki:'Anabaena'},{n:'Nostoc',s:'Nostoc',wiki:'Nostoc'}] },

        { name:'Eukaryotic algae', note:'plastids from endosymbiosis — a grade, not a single clade', children:[
          { leaf:true, groupId:'greenalgae', name:'Green algae', rank:'Chlorophyta', img:'green-algae',
            species:[{n:'Chlamydomonas',s:'C. reinhardtii',wiki:'Chlamydomonas reinhardtii'},{n:'Chlorella',s:'Chlorella vulgaris',wiki:'Chlorella',mixo:true},{n:'Sea lettuce',s:'Ulva lactuca',wiki:'Ulva'}] },
          { leaf:true, groupId:'redalgae', name:'Red algae', rank:'Rhodophyta', img:'red-algae',
            species:[{n:'Nori',s:'Pyropia yezoensis',wiki:'Pyropia'},{n:'Irish moss',s:'Chondrus crispus',wiki:'Chondrus crispus'},{n:'Gracilaria',s:'Gracilaria',wiki:'Gracilaria'}] },
          { leaf:true, groupId:'diatoms', name:'Diatoms', rank:'Bacillariophyta', img:'diatoms',
            species:[{n:'Thalassiosira',s:'Thalassiosira',wiki:'Thalassiosira'},{n:'Phaeodactylum',s:'P. tricornutum',wiki:'Phaeodactylum tricornutum'}] },
          { leaf:true, groupId:'brownalgae', name:'Brown algae', rank:'Phaeophyceae', img:'brown-algae',
            species:[{n:'Giant kelp',s:'Macrocystis pyrifera',wiki:'Macrocystis pyrifera'},{n:'Bladderwrack',s:'Fucus vesiculosus',wiki:'Fucus vesiculosus'},{n:'Sargassum',s:'Sargassum',wiki:'Sargassum'}] },
          { leaf:true, groupId:'dinoflagellates', name:'Dinoflagellates', rank:'Dinoflagellata', mixo:true, img:'dinoflagellates',
            species:[{n:'Coral symbiont',s:'Symbiodinium',wiki:'Symbiodinium',mixo:true},{n:'Red-tide alga',s:'Karenia brevis',wiki:'Karenia brevis',mixo:true}] },
          { leaf:true, groupId:'coccolithophores', name:'Coccolithophores', rank:'Haptophyta', mixo:true, img:'coccolithophores',
            species:[{n:'Chalk plankton',s:'Emiliania huxleyi',wiki:'Emiliania huxleyi',mixo:true}] },
          { leaf:true, groupId:'euglenids', name:'Euglenids', rank:'Euglenophyta', mixo:true, img:'euglenids',
            species:[{n:'Euglena',s:'Euglena gracilis',wiki:'Euglena',mixo:true}] },
        ]},

        { name:'Land plants', rank:'Embryophyta', note:'evolved from charophyte green algae', children:[
          { leaf:true, groupId:'mosses', name:'Mosses &amp; bryophytes', rank:'Bryophyta', img:'mosses',
            species:[{n:'Peat moss',s:'Sphagnum',wiki:'Sphagnum'},{n:'Model moss',s:'Physcomitrium patens',wiki:'Physcomitrium patens'}] },
          { leaf:true, groupId:'ferns', name:'Ferns', rank:'Polypodiopsida', img:'ferns',
            species:[{n:'Bracken',s:'Pteridium aquilinum',wiki:'Pteridium aquilinum'},{n:'Hart’s-tongue',s:'Asplenium scolopendrium',wiki:'Asplenium scolopendrium'}] },
          { leaf:true, groupId:'gymnosperms', name:'Gymnosperms', rank:'conifers &amp; allies', img:'gymnosperms',
            species:[{n:'Scots pine',s:'Pinus sylvestris',wiki:'Pinus sylvestris'},{n:'Ginkgo',s:'Ginkgo biloba',wiki:'Ginkgo biloba'}] },
          { name:'Flowering plants', rank:'Angiosperms', note:'split by carbon-fixation pathway', children:[
            { leaf:true, groupId:'c3', name:'C₃ plants', rank:'~85% of plant species', img:'c3',
              species:[{n:'European beech',s:'Fagus sylvatica',wiki:'Fagus sylvatica'},{n:'Wheat',s:'Triticum aestivum',wiki:'Wheat'},{n:'Rice',s:'Oryza sativa',wiki:'Rice'}] },
            { leaf:true, groupId:'c4', name:'C₄ plants', rank:'hot-climate grasses', img:'c4',
              species:[{n:'Maize',s:'Zea mays',wiki:'Maize'},{n:'Sugarcane',s:'Saccharum officinarum',wiki:'Sugarcane'},{n:'Sorghum',s:'Sorghum bicolor',wiki:'Sorghum'}] },
            { leaf:true, groupId:'cam', name:'CAM plants', rank:'succulents &amp; epiphytes', img:'cam',
              species:[{n:'Pineapple',s:'Ananas comosus',wiki:'Pineapple'},{n:'Agave',s:'Agave',wiki:'Agave'},{n:'Prickly pear',s:'Opuntia',wiki:'Opuntia'}] },
          ]},
        ]},
      ]},

      { name:'Anoxygenic photoautotrophs', note:'don’t split water — no O₂ released', mixo:true, children:[
        { leaf:true, groupId:'anox', name:'Purple sulfur bacteria', rank:'Chromatiales', img:'purple-sulfur',
          species:[{n:'Chromatium',s:'Chromatium',wiki:'Chromatium'}] },
        { leaf:true, groupId:'anox', name:'Purple non-sulfur bacteria', rank:'Rhodospirillales', mixo:true, img:'purple-nonsulfur',
          species:[{n:'Rhodospirillum',s:'Rhodospirillum rubrum',wiki:'Rhodospirillum rubrum',mixo:true},{n:'Rhodobacter',s:'Rhodobacter',wiki:'Rhodobacter'}] },
        { leaf:true, groupId:'anox', name:'Green sulfur bacteria', rank:'Chlorobiales', img:'green-sulfur',
          species:[{n:'Chlorobium',s:'Chlorobium',wiki:'Chlorobium'}] },
        { leaf:true, groupId:'anox', name:'Heliobacteria', rank:'Heliobacteriaceae', mixo:true, img:'heliobacteria',
          species:[{n:'Heliobacterium',s:'Heliobacterium',wiki:'Heliobacterium',mixo:true}] },
      ]},
    ]},

    { name:'Chemolithoautotrophs', note:'energy from oxidising inorganic chemicals — no light', children:[
      { leaf:true, groupId:'chemo', name:'Iron oxidisers', rank:'e.g. Acidithiobacillus', img:'iron-oxidisers',
        species:[{n:'Acid-mine iron bacterium',s:'Acidithiobacillus ferrooxidans',wiki:'Acidithiobacillus ferrooxidans'},{n:'Vent iron bacterium',s:'Mariprofundus',wiki:'Mariprofundus ferrooxydans'}] },
      { leaf:true, groupId:'chemo', name:'Sulfur oxidisers', rank:'e.g. Beggiatoa', img:'sulfur-oxidisers',
        species:[{n:'Sulfur bacterium',s:'Beggiatoa',wiki:'Beggiatoa'},{n:'Vent symbiont host',s:'Riftia pachyptila',wiki:'Riftia pachyptila'}] },
      { leaf:true, groupId:'chemo', name:'Nitrifiers', rank:'nitrogen-cycle bacteria', img:'nitrifiers',
        species:[{n:'Ammonia oxidiser',s:'Nitrosomonas',wiki:'Nitrosomonas'},{n:'Nitrite oxidiser',s:'Nitrospira',wiki:'Nitrospira'}] },
      { leaf:true, groupId:'chemo', name:'Hydrogen &amp; methane', rank:'Knallgas &amp; methanogens', img:'hydrogen-methane',
        species:[{n:'Knallgas bacterium',s:'Cupriavidus necator',wiki:'Cupriavidus necator'},{n:'Vent methanogen',s:'Methanocaldococcus jannaschii',wiki:'Methanocaldococcus jannaschii'}] },
    ]},
  ]
};
