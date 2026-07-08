/* =========================================================================
   5. IMAGES
   Organism photos are LOCAL files (images/organisms/<slug>.jpg) so they work
   even from file://. Concept/diagram images in the drawer are still fetched
   live from Wikipedia and degrade gracefully if offline.
   ========================================================================= */
const W = t => 'https://en.wikipedia.org/wiki/'+encodeURIComponent(t);

/* slug -> Wikipedia article: image-fallback target + provenance (see CREDITS.md) */
const ORG = {
  "cyanobacteria":"Cyanobacteria","green-algae":"Chlamydomonas","red-algae":"Red algae",
  "diatoms":"Diatom","brown-algae":"Macrocystis pyrifera","dinoflagellates":"Dinoflagellate",
  "coccolithophores":"Emiliania huxleyi","euglenids":"Euglena","mosses":"Sphagnum","ferns":"Fern",
  "gymnosperms":"Pinus sylvestris","c3":"Fagus sylvatica","c4":"Zea mays","cam":"Ananas comosus",
  "purple-sulfur":"Purple sulfur bacteria","purple-nonsulfur":"Rhodospirillum rubrum",
  "green-sulfur":"Green sulfur bacteria","iron-oxidisers":"Iron-oxidizing bacteria",
  "sulfur-oxidisers":"Beggiatoa","nitrifiers":"Nitrosomonas","hydrogen-methane":"Cupriavidus necator",
  "heliobacteria":"Heliobacteria"
};

const imgCache = {};
async function wikiThumb(title, size){
  const key = title+'|'+(size||320);
  if(imgCache[key]!==undefined) return imgCache[key];
  try{
    const r = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(title), {headers:{'accept':'application/json'}});
    if(!r.ok) throw 0;
    const j = await r.json();
    let src = (j.thumbnail && j.thumbnail.source) || (j.originalimage && j.originalimage.source) || null;
    if(src && size){ src = src.replace(/\/\d+px-/, '/'+size+'px-'); }
    imgCache[key] = src; return src;
  }catch(e){ imgCache[key]=null; return null; }
}

/* local-first organism thumbnail: try the committed file, then live Wikipedia,
   else leave the emoji fallback already in the tile */
function fillOrganism(el, slug){
  if(!slug) return;
  const show = (src, alt)=>{ const im=new Image(); im.onload=()=>{el.innerHTML='';el.appendChild(im)}; im.src=src; im.alt=alt||slug; };
  const probe = new Image();
  probe.onload = ()=>{ el.innerHTML=''; el.appendChild(probe); };
  probe.onerror = ()=>{ const t=ORG[slug]; if(t) wikiThumb(t,240).then(s=>{ if(s) show(s,t); }); };
  probe.alt = slug;
  probe.src = 'images/organisms/'+slug+'.jpg';
}

/* concept/diagram image (drawer): live Wikipedia fetch, hide block on failure */
function fillImg(el, title, size){
  const dropConcept=()=>{ const c=el.closest('.concept'); if(c) c.remove(); };
  wikiThumb(title,size).then(src=>{
    if(src){ const im=new Image(); im.onload=()=>{el.innerHTML='';el.appendChild(im)}; im.onerror=dropConcept; im.src=src; im.alt=title; }
    else dropConcept();
  });
}

/* =========================================================================
   6. RENDER — THE TREE
   ========================================================================= */
/* Every split (grouping node) is handed the next colour, so no two nested
   levels share a hue. Assigned in depth-first order; palette cycles if needed. */
const BRANCH_PALETTE = ['#1F7A43','#1f8a8a','#5aa032','#2FA5A0','#4B8B3B','#C98A1B','#7C5CBF','#B5651D','#C24A3E','#3E7CB1'];
let _branchIdx = 0;
const nextBranch = () => BRANCH_PALETTE[_branchIdx++ % BRANCH_PALETTE.length];

/* fallback icon shown until (or instead of) the live Wikipedia photo —
   an emoji that hints at the organism, never a bare capital letter */
const LEAFICON = { c3:'🌳', c4:'🌽', cam:'🌵', cyanobacteria:'🦠', anox:'🟣', chemo:'⚗️' };
function leafIcon(n){
  const nm = (n.name||'').replace(/&[^;]+;/g,' ').toLowerCase();
  if(/moss|bryo|fern/.test(nm))      return '🌿'; // 🌿
  if(/gymnosperm/.test(nm))          return '🌲'; // 🌲
  if(/diatom/.test(nm))              return '💠'; // 💠
  if(/coccolith/.test(nm))           return '⚪';       // ⚪
  if(/red alga/.test(nm))            return '🔴'; // 🔴
  if(/green alga/.test(nm))          return '🟢'; // 🟢
  if(/brown alga/.test(nm))          return '🟤'; // 🟤
  if(/helio/.test(nm))               return '☀️'; // ☀️
  if(/iron/.test(nm))                return '🟠'; // 🟠
  if(/sulfur ox/.test(nm))           return '🟡'; // 🟡
  if(/nitrif/.test(nm))              return '🦠'; // 🦠
  if(/hydrogen|methan/.test(nm))     return '⚗️'; // ⚗️
  if(/dino|euglen/.test(nm))         return '🦠'; // 🦠
  return LEAFICON[n.groupId] || '🌱';             // 🌱
}

function nodeHTML(n, parentColor, depth){
  depth = depth||0;
  if(n.leaf){
    const g = GROUPS[n.groupId] || {};
    const mixo = n.mixo ? '<span class="mixo">&#42; mixotroph</span>' : '';
    let cta;
    if(g.kind==='chemo') cta = '<span class="cta">No sunlight &mdash; how it lives &rarr;</span>';
    else if(g.kind==='anox') cta = '<span class="cta">A different way to use light &rarr;</span>';
    else cta = '<span class="cta">Energy flow <span class="max">'+g.max+'</span> <span class="arrow">&rarr;</span></span>';
    const sp = (n.species||[]).map(s=>'<span class="sp">'+s.n+(s.mixo?' <b class="sp-star" title="mixotrophic">&#42;</b>':'')+' <i>'+s.s+'</i></span>').join('');
    return '<button class="leaf'+(g.kind==='chemo'?' dark-cta':'')+'" data-group="'+n.groupId+'" style="--branch:'+(parentColor||'var(--chloro)')+'">'
      + '<div class="lead"><div class="thumb" data-img="'+n.img+'"><span class="ic">'+leafIcon(n)+'</span></div>'
      + '<div><div class="name">'+n.name+' '+mixo+'</div><div class="rank">'+(n.rank||'')+'</div></div></div>'
      + (sp?'<div class="species">'+sp+'</div>':'')
      + cta + '</button>';
  }
  // grouping node — own colour for its disc/caret + the connectors to its kids
  const my = nextBranch();
  const kids = n.children||[];
  const hasKids = kids.length>0;
  const open = depth===0;              // root is open; every sub-group starts collapsed
  const meta = [];
  if(n.rank) meta.push('<span class="rank">'+n.rank+'</span>');
  if(n.note) meta.push(n.note);
  const caret = hasKids ? '<span class="caret" aria-hidden="true">&#9662;</span>' : '<span class="disc"></span>';
  const head = '<div class="grp" style="--branch:'+my+'"'+(hasKids?' role="button" tabindex="0" aria-expanded="'+open+'" aria-label="Toggle '+n.name.replace(/&[^;]+;/g,'')+'"':'')+'>'
    + caret + (hasKids?'<span class="disc"></span>':'')
    + '<div class="txt"><h3>'+n.name+'</h3>'+(meta.length?'<div class="meta">'+meta.join(' &middot; ')+'</div>':'')+'</div></div>';
  const kidHTML = kids.map(c=>'<div class="twig" style="--branch:'+my+'">'+nodeHTML(c, my, depth+1)+'</div>').join('');
  return head + (hasKids?'<div class="children"'+(open?'':' hidden')+' style="--branch:'+my+'">'+kidHTML+'</div>':'');
}
function renderTree(){
  _branchIdx = 0;
  document.getElementById('tree').innerHTML = '<div class="node">'+nodeHTML(TREE, null, 0)+'</div>';
  document.querySelectorAll('#tree .thumb[data-img]').forEach(el=>fillOrganism(el, el.dataset.img));
  document.querySelectorAll('#tree .leaf').forEach(b=>{
    b.addEventListener('click',()=>{ location.hash = '#/flow/'+b.dataset.group; });
  });
  document.querySelectorAll('#tree .grp[role="button"]').forEach(g=>{
    const kids = g.nextElementSibling;
    if(!kids || !kids.classList.contains('children')) return;
    const toggle = ()=>{ const open = g.getAttribute('aria-expanded')!=='false';
      g.setAttribute('aria-expanded', String(!open)); kids.hidden = open; };
    g.addEventListener('click',toggle);
    g.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); } });
  });
}

/* =========================================================================
   7. RENDER — THE ENERGY FLOW
   ========================================================================= */
function catChip(cat){ return '<span class="cat" style="--c:'+CAT[cat].c+'">'+CAT[cat].name+'</span>'; }

function renderFlow(id){
  const g = GROUPS[id]; if(!g){ location.hash='#/map'; return; }
  document.getElementById('flowKicker').innerHTML = g.kicker||'';
  document.getElementById('flowName').innerHTML = g.name;
  const maxBox = document.getElementById('flowMaxBox');
  const intro = document.getElementById('flowIntro');
  const casc = document.getElementById('cascade');
  const shared = document.getElementById('sharedBox');
  intro.innerHTML = g.intro||'';
  renderSpecies(g);

  if(g.kind==='chemo'){ maxBox.style.visibility='hidden'; renderChemo(g,casc,shared); return; }
  if(g.kind==='anox'){ maxBox.style.visibility='hidden'; renderAnox(g,casc,shared); return; }

  maxBox.style.visibility='visible';
  document.getElementById('flowMax').textContent = g.max;

  let html = '<div class="entered"><span class="chip">100% incident sunlight enters</span></div>';
  g.stages.forEach((s,i)=>{
    html += '<div class="stage">'
      + '<div class="beamcol"><div class="beam" style="width:'+s.remain+'%"></div><span class="pct">'+s.remain+'%</span></div>'
      + '<div class="loss"><button class="loss-card" data-i="'+i+'" style="--c:'+CAT[s.cat].c+'">'
        + '<span class="drop">&minus;'+s.lost+'%</span>'
        + '<span class="txt"><span class="h">'+s.label+' '+catChip(s.cat)+'</span>'
        + '<span class="s">'+s.short+'</span><span class="more">tap for the mechanism &amp; sources &rarr;</span></span>'
      + '</button></div></div>';
  });
  const last = g.stages[g.stages.length-1];
  html += '<div class="final"><div class="num">'+last.remain+'%</div>'
    + '<div class="t"><h3>&hellip; survives as new biomass</h3>'
    + '<p>Out of every hundred units of sunlight that landed, about '+last.remain+' end up stored in growth \u2014 the theoretical best for this group. Real field or ocean values are lower still.</p></div></div>';

  if(g.win){
    html += '<div class="final" style="background:rgba(63,174,77,.10);border-color:rgba(63,174,77,.28);margin-top:10px">'
      + '<div class="num" style="color:#7fdc8f;font-size:1.3rem">\u2713</div>'
      + '<div class="t"><h3 style="font-size:1rem">'+g.win.label+'</h3><p>'+g.win.text+'</p></div></div>';
  }
  casc.innerHTML = html;

  casc.querySelectorAll('.loss-card').forEach(b=>{
    b.addEventListener('click',()=>openDrawer(g.stages[+b.dataset.i]));
  });

  shared.innerHTML = sharedBlock(g.sharedNote);
}

/* extended per-group species roster, each linked to Wikipedia */
function renderSpecies(g){
  const box = document.getElementById('speciesBox');
  const list = g.species||[];
  if(!list.length){ box.innerHTML=''; return; }
  const hasMixo = list.some(s=>s.mixo);
  const items = list.map(s=>{
    const mx = s.mixo ? ' <span class="sp-mixo" title="facultatively mixotrophic">&#42;</span>' : '';
    return '<a class="sp-card" href="'+W(s.wiki)+'" target="_blank" rel="noopener">'
      + '<span class="sp-txt"><span class="sp-n">'+s.n+mx+'</span>'
      + '<span class="sp-s"><i>'+s.s+'</i></span></span>'
      + '<span class="sp-w">wikipedia &#8599;</span></a>';
  }).join('');
  box.innerHTML = '<div class="species-panel"><h3>Representative species</h3>'
    + '<p class="sp-lead">A fuller roster than the map shows &mdash; tap any card for its Wikipedia page.'
    + (hasMixo?' <span class="sp-mixo">&#42;</span> marks a facultatively mixotrophic species (can also feed on organic carbon).':'')
    + '</p><div class="sp-grid">'+items+'</div></div>';
}

function sharedBlock(note){
  return '<div class="shared"><h3>Shared with every group on the tree</h3>'
    + '<p>Strip away what makes each group special and the same physics-and-machinery bottlenecks remain \u2014 they set the floor no oxygenic phototroph can beat:</p>'
    + '<div class="tags">'
    + ['~half the spectrum unusable (PAR)','thermalisation \u2014 excess photon energy lost as heat','the two-photosystem Z-scheme \u2014 8+ photons per CO\u2082','Rubisco\u2019s intrinsic slowness','light saturation &amp; NPQ','respiration (gross \u2192 net)']
        .map(t=>'<span class="tag">'+t+'</span>').join('')
    + '</div>'
    + (note?'<p style="margin-top:16px">'+note+'</p>':'')
    + '</div>';
}

function renderAnox(g,casc,shared){
  let html = '<div class="entered"><span class="chip" style="background:linear-gradient(90deg,#b48be0,#7c5cbf);color:#160a24">light \u2192 a single photosystem</span></div>';
  g.qualitative.forEach(q=>{
    html += '<div class="stage" style="grid-template-columns:1fr"><div class="loss"><button class="loss-card anoxcard" style="--c:'+CAT[q.cat].c+'">'
      + '<span class="txt"><span class="h">'+q.label+' '+catChip(q.cat)+'</span><span class="s">'+q.text+'</span>'
      + '<span class="more">tap for links &rarr;</span></span></button></div></div>';
  });
  casc.innerHTML = html;
  const cards = casc.querySelectorAll('.anoxcard');
  cards.forEach((b,i)=>b.addEventListener('click',()=>openDrawerRaw({
    cat:g.qualitative[i].cat, label:g.qualitative[i].label, detail:g.qualitative[i].text, links:g.qualitative[i].links
  })));
  shared.innerHTML = '<div class="shared"><h3>Why it stays niche</h3><p>'+g.sharedNote+'</p>'
    + '<div class="tags"><span class="tag">no water-splitting \u2192 no O\u2082</span><span class="tag">single photosystem</span><span class="tag">donor supply is the real limit</span><span class="tag">far-red / IR bacteriochlorophyll</span></div></div>';
}

function renderChemo(g,casc,shared){
  let html = '<div class="chemo-panel"><h3>No spectrum, no Rubisco bottleneck &mdash; a different limit entirely</h3>'
    + '<p style="color:var(--lum-soft)">'+g.intro+'</p>'
    + '<div class="donors">'
    + g.donors.map(d=>'<a class="donor" href="'+W(d.wiki)+'" target="_blank" rel="noopener" style="text-decoration:none">'
        + '<h4>'+d.h+'</h4><p>'+d.who+'</p><div class="rx">'+d.rx+'</div></a>').join('')
    + '</div></div>';
  casc.innerHTML = html;
  shared.innerHTML = '<div class="shared" style="border:none"><p style="color:var(--lum-soft)">'+g.sharedNote+'</p>'
    + '<div class="tags"><span class="tag">tiny free-energy per reaction</span><span class="tag">electron-donor supply limits growth</span><span class="tag">still uses the Calvin cycle to fix CO\u2082</span></div></div>';
}

/* =========================================================================
   8. DRAWER
   ========================================================================= */
const drawer = document.getElementById('drawer');
const scrim = document.getElementById('scrim');
function openDrawer(s){
  openDrawerRaw({cat:s.cat,label:s.label,lost:s.lost,remain:s.remain,detail:s.detail,concept:s.concept,links:s.links});
}
function openDrawerRaw(o){
  const c = CAT[o.cat].c;
  let nums = '';
  if(o.lost!==undefined){ nums = '<div class="dnums"><div><b>&minus;'+o.lost+'%</b><span>lost here</span></div><div><b>'+o.remain+'%</b><span>still on the beam</span></div></div>'; }
  const links = (o.links||[]).map(l=>'<a href="'+W(l[1])+'" target="_blank" rel="noopener"><span>'+l[0]+'</span><span class="w">wikipedia &#8599;</span></a>').join('');
  drawer.innerHTML = '<button class="dclose" aria-label="Close">&times;</button>'
    + '<div class="dhead" style="--c:'+c+'"><span class="cat">'+CAT[o.cat].name+'</span>'
    + '<h3>'+o.label+'</h3>'+nums+'</div>'
    + '<div class="dbody" style="--c:'+c+'">'
    + (o.concept?'<div class="concept"><div data-img="'+o.concept.title+'" style="min-height:60px"></div><div class="cap">'+o.concept.cap+'</div></div>':'')
    + '<p>'+o.detail+'</p>'
    + (links?'<div class="links">'+links+'</div>':'')
    + '</div>';
  const box = drawer.querySelector('.concept > div[data-img]');
  if(box) fillImg(box, box.dataset.img, 480);
  drawer.querySelector('.dclose').addEventListener('click',closeDrawer);
  drawer.classList.add('open'); scrim.classList.add('open'); drawer.setAttribute('aria-hidden','false');
}
function closeDrawer(){ drawer.classList.remove('open'); scrim.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }
scrim.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeDrawer(); });

/* =========================================================================
   9. ROUTER
   ========================================================================= */
function show(view){
  document.getElementById('view-map').classList.toggle('active',view==='map');
  document.getElementById('view-flow').classList.toggle('active',view==='flow');
  document.body.classList.toggle('flow-mode',view==='flow');
}
function route(){
  const h = location.hash.replace(/^#\/?/, '');
  closeDrawer();
  if(h.startsWith('flow/')){
    const id = h.slice(5);
    if(GROUPS[id]){ renderFlow(id); show('flow'); window.scrollTo(0,0); return; }
  }
  show('map'); window.scrollTo(0,0);
}
document.getElementById('backBtn').addEventListener('click',()=>{ location.hash='#/map'; });
window.addEventListener('hashchange',route);

renderTree();
route();
