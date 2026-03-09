/* =============================================
   ONCE — Book Review Main Page · main.js
   ============================================= */

// Particle System
(function () {
  var canvas = document.getElementById('particles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d'), particles = [], W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function rnd(a,b) { return a + Math.random()*(b-a); }
  function P() { this.reset(); }
  P.prototype.reset = function() {
    this.x=rnd(0,W); this.y=rnd(0,H); this.size=rnd(.4,1.4);
    this.sy=rnd(-.12,-.4); this.sx=rnd(-.08,.08); this.life=0; this.max=rnd(120,260);
    this.color='hsl('+rnd(30,50)+','+rnd(40,70)+'%,'+rnd(55,80)+'%)';
  };
  P.prototype.update = function() {
    this.x+=this.sx; this.y+=this.sy; this.life++;
    if (this.life>this.max||this.y<-10) this.reset();
  };
  P.prototype.draw = function() {
    ctx.globalAlpha=Math.sin((this.life/this.max)*Math.PI)*.45;
    ctx.fillStyle=this.color;
    ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fill();
  };
  function init() {
    resize(); particles=[];
    for(var i=0;i<55;i++){var p=new P();p.life=Math.floor(Math.random()*p.max);particles.push(p);}
    window.addEventListener('resize',resize);
    (function loop(){ ctx.clearRect(0,0,W,H); ctx.globalAlpha=1; particles.forEach(function(p){p.update();p.draw();}); requestAnimationFrame(loop); })();
  }
  window.addEventListener('DOMContentLoaded',init);
})();


document.addEventListener('DOMContentLoaded', function() {

  // ── Hamburger ──
  var hb = document.getElementById('hamburger'), nl = document.getElementById('navLinks');
  if (hb && nl) {
    hb.addEventListener('click', function() { hb.classList.toggle('open'); nl.classList.toggle('open'); });
    nl.querySelectorAll('.nav-link').forEach(function(l){ l.addEventListener('click',function(){ hb.classList.remove('open'); nl.classList.remove('open'); }); });
  }

  // ── Progress & Active Nav ──
  var pb = document.getElementById('progressBar');
  var sections = document.querySelectorAll('.section');
  var navAs = document.querySelectorAll('.nav-link');
  function onScroll() {
    var dh = document.documentElement.scrollHeight - window.innerHeight;
    if (pb) pb.style.width = (dh>0?(window.scrollY/dh)*100:0)+'%';
    var cur='';
    sections.forEach(function(s){ if(window.scrollY>=s.offsetTop-80) cur=s.id; });
    navAs.forEach(function(a){ a.classList.toggle('active',a.getAttribute('href')==='#'+cur); });
    var st=document.getElementById('scrollTop');
    if(st) st.classList.toggle('visible',window.scrollY>400);
  }
  window.addEventListener('scroll',onScroll,{passive:true});

  // ── Section entrance ──
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:.08});
  sections.forEach(function(s){ obs.observe(s); });

  // ── Scroll to top ──
  window.scrollToTop = function(){ window.scrollTo({top:0,behavior:'smooth'}); };

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var t=document.querySelector(a.getAttribute('href'));
      if(t){ e.preventDefault(); var nav=document.getElementById('navbar');
        window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-(nav?nav.offsetHeight:62)-10,behavior:'smooth'}); }
    });
  });

  // ── Background Music ──
  var bgMusic=document.getElementById('bgMusic'), musicBtn=document.getElementById('musicBtn'),
      musicIcon=document.getElementById('musicIcon'), musicLabel=document.getElementById('musicLabel'),
      bgMuted=false;
  function startBg() {
    if(!bgMusic) return;
    var t=parseFloat(sessionStorage.getItem('bgMusicTime')||'0');
    var wasMuted=sessionStorage.getItem('bgMusicMuted')==='1';
    bgMusic.currentTime=t; bgMusic.volume=0.4;
    if(!wasMuted){ bgMusic.play().catch(function(){ document.addEventListener('click',function try1(){ bgMusic.play().catch(function(){}); document.removeEventListener('click',try1); }); }); }
    else { bgMuted=true; if(musicBtn) musicBtn.classList.add('muted'); if(musicIcon) musicIcon.innerHTML='&#9835;'; if(musicLabel) musicLabel.textContent='MUSIC OFF'; }
  }
  if(musicBtn){ musicBtn.addEventListener('click',function(){
    bgMuted=!bgMuted;
    if(bgMuted){ bgMusic.pause(); musicBtn.classList.add('muted'); musicIcon.innerHTML='&#9835;'; musicLabel.textContent='MUSIC OFF'; }
    else{ bgMusic.play().catch(function(){}); musicBtn.classList.remove('muted'); musicIcon.innerHTML='&#9834;'; musicLabel.textContent='MUSIC ON'; }
  }); }
  startBg();

  // ── Narration Audio ──
  var narAudios={ 'panel-title':document.getElementById('audioTitle'), 'panel-author':document.getElementById('audioAuthor'), 'panel-genre':document.getElementById('audioGenre') };
  var curNar=null, narMuted=false;
  function stopNar(){ Object.keys(narAudios).forEach(function(k){ var a=narAudios[k]; if(a){a.pause();a.currentTime=0;} }); curNar=null; }
  function playNar(cls){ stopNar(); var a=narAudios[cls]; if(!a||narMuted) return; curNar=a; a.volume=1; a.play().catch(function(){}); }

  // ── Panel Modal ──
  var panelData={
    'panel-title':{ icon:String.fromCodePoint(0x1F4DA), title:'Once\u2026', sub:'A Suspenseful Horror Novel \u00b7 James Herbert \u00b7 2001',
      paragraphs:['Once\u2026 is a suspenseful horror novel that follows the story of Thom Kindred, a stroke survivor struggling to rebuild his life. Hoping to reconnect with memories of his youth, Thom returns to Castle Bracken, the wooded place where he grew up.',
        'However, his return awakens a mysterious and ancient evil hidden within the castle. As strange and terrifying events unfold, Thom must confront forces that challenge his understanding of reality, fear, and survival.',
        'The novel blends psychological tension, supernatural mystery, and suspense to create an atmosphere where the line between dreams and nightmares becomes dangerously thin.'] },
    'panel-author':{ icon:'\u2712', title:'James Herbert', sub:'1943 \u2013 2013 \u00b7 British Horror Novelist',
      paragraphs:['James Herbert (1943\u20132013) was a renowned British horror novelist known for creating suspenseful and chilling stories. His works often combine supernatural horror with psychological depth, exploring how ordinary people respond when faced with terrifying and unexplained events.',
        'Herbert\u2019s novels have sold millions of copies worldwide and have been translated into numerous languages. He is widely recognized as one of the most influential writers in modern horror literature.'] },
    'panel-genre':{ icon:String.fromCodePoint(0x1F3AD), title:'Horror / Supernatural Thriller', sub:'Dark \u00b7 Psychological \u00b7 Supernatural',
      paragraphs:['The novel belongs to the horror and supernatural thriller genre. Stories in this genre aim to create suspense, fear, and mystery through dark settings, psychological tension, and supernatural elements.',
        'In Once\u2026, these elements appear through the mysterious events surrounding Castle Bracken and the ancient evil awakened by Thom Kindred\u2019s return. The story gradually builds tension as the boundary between dreams, memories, and reality becomes increasingly uncertain.'] }
  };
  var modal=document.getElementById('panelModal'), backdrop=document.getElementById('modalBackdrop'),
      modalBox=document.getElementById('modalBox'), closeBtn=document.getElementById('modalClose'),
      iconEl=document.getElementById('modalIcon'), titleEl=document.getElementById('modalTitle'),
      subEl=document.getElementById('modalSub'), contentEl=document.getElementById('modalContent'),
      audioBtn=document.getElementById('modalAudioBtn'), audioIcon=document.getElementById('modalAudioIcon'),
      audioLblEl=document.getElementById('modalAudioLabel'), activePanel='';

  function updateAudioBtn(){
    if(!audioBtn) return;
    if(narMuted){ audioBtn.classList.add('muted'); if(audioIcon) audioIcon.innerHTML='&#128264;'; if(audioLblEl) audioLblEl.textContent='NARRATION OFF'; }
    else{ audioBtn.classList.remove('muted'); if(audioIcon) audioIcon.innerHTML='&#128266;'; if(audioLblEl) audioLblEl.textContent='NARRATION ON'; }
  }
  function openModal(cls){
    var d=panelData[cls]; if(!d||!modal) return;
    activePanel=cls;
    if(iconEl) iconEl.textContent=d.icon;
    if(titleEl) titleEl.innerHTML=d.title;
    if(subEl) subEl.textContent=d.sub;
    if(contentEl) contentEl.innerHTML=d.paragraphs.map(function(p){return'<p>'+p+'</p>';}).join('');
    updateAudioBtn(); modal.classList.add('open'); document.body.style.overflow='hidden';
    if(modalBox) modalBox.scrollTop=0;
    playNar(cls);
  }
  function closeModal(){ if(modal) modal.classList.remove('open'); document.body.style.overflow=''; stopNar(); activePanel=''; }

  if(audioBtn){ audioBtn.addEventListener('click',function(e){ e.stopPropagation(); narMuted=!narMuted; updateAudioBtn(); if(narMuted) stopNar(); else if(activePanel) playNar(activePanel); }); }
  document.querySelectorAll('.panel').forEach(function(panel){
    panel.addEventListener('click',function(){ var cls=''; panel.classList.forEach(function(c){if(panelData[c])cls=c;}); if(cls) openModal(cls); });
  });
  if(closeBtn) closeBtn.addEventListener('click',closeModal);
  if(backdrop) backdrop.addEventListener('click',closeModal);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') closeModal(); });

  // ── Accordion (Summary) ──
  document.querySelectorAll('.accordion-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.closest('.accordion-item');
      var isOpen=item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(function(i){ i.classList.remove('open'); });
      if(!isOpen) item.classList.add('open');
    });
  });

  // ── Analysis Cards ──
  document.querySelectorAll('.analysis-card').forEach(function(card){
    card.addEventListener('click',function(){ card.classList.toggle('open'); });
  });

  // ── Key Element Cards ──
  document.querySelectorAll('.key-card').forEach(function(card){
    card.addEventListener('click',function(){ card.classList.toggle('open'); });
  });

  // ── Strengths & Weaknesses Cards ──
  document.querySelectorAll('.sw-card').forEach(function(card){
    card.addEventListener('click',function(){ card.classList.toggle('open'); });
  });

  // ── Recommendation Cards ──
  document.querySelectorAll('.rec-card').forEach(function(card){
    card.addEventListener('click',function(){ card.classList.toggle('open'); });
  });

  // ── Conclusion Reveal ──
  var revealBtn=document.getElementById('revealBtn'), conclusionText=document.getElementById('conclusionText');
  if(revealBtn && conclusionText){
    revealBtn.addEventListener('click',function(){
      conclusionText.style.display='block';
      setTimeout(function(){ conclusionText.classList.add('visible'); },10);
      document.getElementById('conclusionReveal').style.display='none';
    });
  }

  // ── Emotion Bar Animation ──
  var emotionFill=document.getElementById('emotionFill'), emotionMarker=document.getElementById('emotionMarker');
  var personalSec=document.getElementById('personal');
  if(emotionFill && personalSec){
    var emotionTriggered=false;
    var eObs=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting && !emotionTriggered){
          emotionTriggered=true;
          setTimeout(function(){ emotionFill.style.width='75%'; emotionMarker.style.left='75%'; },300);
        }
      });
    },{threshold:.3});
    eObs.observe(personalSec);
  }

  // ── Star Rating Tooltips ──
  var stars=document.querySelectorAll('.star'), starTip=document.getElementById('starTooltip');
  stars.forEach(function(star){
    star.addEventListener('mouseenter',function(){ if(starTip) starTip.textContent=star.getAttribute('data-tip')||''; });
    star.addEventListener('mouseleave',function(){ if(starTip) starTip.textContent=''; });
  });

});