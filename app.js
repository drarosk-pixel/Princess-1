/* ===== Princess — single-page version (music never reloads) ===== */

const aud = document.getElementById('aud');
const mbar = document.getElementById('mbar');
const screens = [...document.querySelectorAll('.screen')];
const dots = [...document.querySelectorAll('.dots a')];
let cur = 0;

/* ---- page navigation (no reload → music keeps playing) ---- */
function go(n){
  if(n < 0 || n >= screens.length || n === cur) {
    if(n === cur){ window.scrollTo({top:0,behavior:'smooth'}); return; }
    return;
  }
  screens[cur].classList.remove('show');
  cur = n;
  screens[cur].classList.add('show');
  dots.forEach((d,i)=> d.classList.toggle('on', i === cur));
  window.scrollTo({top:0, behavior:'auto'});
  // replay reveal animations on the now-visible screen
  screens[cur].querySelectorAll('.rev').forEach((el,i)=>{
    el.classList.remove('in');
    setTimeout(()=> el.classList.add('in'), 70*i + 60);
  });
}

/* ---- music ---- */
function markPlaying(on){
  mbar.classList.toggle('playing', on);
  mbar.querySelector('.sname').textContent = on ? 'now playing 🎵' : 'tap to play 🎵';
}
function enterSite(){
  aud.play().then(()=> markPlaying(true)).catch(()=>{
    mbar.querySelector('.sname').textContent = 'tap disc to play 🎵';
  });
  go(1);
}
mbar.onclick = ()=>{
  if(aud.paused){
    aud.play().then(()=> markPlaying(true)).catch(()=>{
      mbar.querySelector('.sname').textContent = 'song.mp3 missing 🎵';
    });
  } else {
    aud.pause(); markPlaying(false);
  }
};

/* ---- gift reveal ---- */
function openGift(){
  document.getElementById('giftLocked').style.display = 'none';
  document.getElementById('giftReveal').classList.add('on');
  confetti(60);
}

/* ---- floating hearts ---- */
const HEARTS = ['💕','🌸','👑','💗','🎀','✨','🤍'];
setInterval(()=>{
  if(document.hidden) return;
  const s = document.createElement('div'); s.className = 'fx';
  s.textContent = HEARTS[Math.random()*HEARTS.length|0];
  s.style.left = Math.random()*100 + 'vw';
  s.style.fontSize = (12 + Math.random()*16) + 'px';
  s.style.animation = `floatUp ${6 + Math.random()*5}s linear forwards`;
  document.body.appendChild(s);
  setTimeout(()=> s.remove(), 11000);
}, 1000);

/* ---- sparkle cursor / tap ---- */
function sparkleAt(x,y){
  const s = document.createElement('div'); s.className = 'sparkle';
  s.textContent = ['✨','💖','🌟'][Math.random()*3|0];
  s.style.left = x + 'px'; s.style.top = y + 'px';
  document.body.appendChild(s);
  setTimeout(()=> s.remove(), 1000);
}
let last = 0;
addEventListener('pointermove', e=>{ const n = Date.now(); if(n-last < 70) return; last = n; sparkleAt(e.clientX, e.clientY); });
addEventListener('pointerdown', e=> sparkleAt(e.clientX, e.clientY));

/* ---- confetti ---- */
function confetti(n){
  const cols = ['#e8a0b4','#c2607a','#e9c46a','#fce4ec','#fff'];
  for(let i=0;i<n;i++){
    const c = document.createElement('div'); c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = cols[Math.random()*cols.length|0];
    c.style.setProperty('--cx', (Math.random()*200-100) + 'px');
    c.style.animationDuration = (1.8 + Math.random()*1.4) + 's';
    if(Math.random() > .5) c.style.borderRadius = '50%';
    document.body.appendChild(c);
    setTimeout(()=> c.remove(), 3400);
  }
}

/* reveal initial (cover has none) */
go(0);
