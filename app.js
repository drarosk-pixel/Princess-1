/* ===== Princess — shared behaviour (music resume + fx + nav) ===== */

/* ---- continuous music across pages via localStorage ---- */
const aud = document.getElementById('aud');
const mbar = document.getElementById('mbar');
const KEY_ON = 'princess_music_on';
const KEY_TIME = 'princess_music_time';

function saveMusic(){
  if(aud){
    localStorage.setItem(KEY_TIME, aud.currentTime || 0);
    localStorage.setItem(KEY_ON, aud.paused ? '0' : '1');
  }
}
function markPlaying(on){
  if(mbar){
    mbar.classList.toggle('playing', on);
    mbar.querySelector('.sname').textContent = on ? 'now playing 🎵' : 'tap to play 🎵';
  }
}

if(aud){
  // resume position
  const t = parseFloat(localStorage.getItem(KEY_TIME) || '0');
  if(t) try{ aud.currentTime = t; }catch(e){}

  // if music was on previously, try to continue (allowed because nav = user gesture)
  if(localStorage.getItem(KEY_ON) === '1'){
    aud.play().then(()=>markPlaying(true)).catch(()=>{
      // autoplay blocked — resume on first interaction
      const resume = ()=>{ aud.play().then(()=>markPlaying(true)); document.removeEventListener('pointerdown', resume); };
      document.addEventListener('pointerdown', resume);
      markPlaying(false);
    });
  }

  mbar && (mbar.onclick = ()=>{
    if(aud.paused){
      aud.play().then(()=>markPlaying(true)).catch(()=>{
        mbar.querySelector('.sname').textContent = 'song.mp3 add karo 🎵';
      });
    }else{ aud.pause(); markPlaying(false); }
    saveMusic();
  });

  aud.addEventListener('timeupdate', ()=>{ if(!aud.paused) localStorage.setItem(KEY_TIME, aud.currentTime); });
  window.addEventListener('pagehide', saveMusic);
  window.addEventListener('beforeunload', saveMusic);
}

/* start music from a button (cover page Enter) */
function startMusicAndGo(url){
  if(aud){
    localStorage.setItem(KEY_ON,'1');
    aud.play().then(()=>markPlaying(true)).catch(()=>{});
  }
  goTo(url);
}

/* ---- page transition navigation ---- */
function goTo(url){
  saveMusic();
  document.body.classList.add('leaving');
  setTimeout(()=>{ window.location.href = url; }, 480);
}
document.addEventListener('click', e=>{
  const a = e.target.closest('a[data-nav]');
  if(a){ e.preventDefault(); goTo(a.getAttribute('href')); }
});

/* ---- scroll reveal ---- */
const io = new IntersectionObserver(es=>{
  es.forEach(x=>{ if(x.isIntersecting) x.target.classList.add('in'); });
},{threshold:.15});
document.querySelectorAll('.rev').forEach(el=>io.observe(el));

/* ---- floating hearts ---- */
const HEARTS=['💕','🌸','👑','💗','🎀','✨','🤍'];
setInterval(()=>{
  if(document.hidden) return;
  const s=document.createElement('div'); s.className='fx';
  s.textContent=HEARTS[Math.random()*HEARTS.length|0];
  s.style.left=Math.random()*100+'vw';
  s.style.fontSize=(12+Math.random()*16)+'px';
  s.style.animation=`floatUp ${6+Math.random()*5}s linear forwards`;
  document.body.appendChild(s);
  setTimeout(()=>s.remove(),11000);
},1000);

/* ---- sparkle cursor / tap ---- */
function sparkleAt(x,y){
  const s=document.createElement('div'); s.className='sparkle';
  s.textContent=['✨','💖','🌟'][Math.random()*3|0];
  s.style.left=x+'px'; s.style.top=y+'px';
  document.body.appendChild(s);
  setTimeout(()=>s.remove(),1000);
}
let last=0;
addEventListener('pointermove',e=>{const n=Date.now();if(n-last<70)return;last=n;sparkleAt(e.clientX,e.clientY);});
addEventListener('pointerdown',e=>sparkleAt(e.clientX,e.clientY));

/* ---- confetti ---- */
function confetti(n){
  const cols=['#e8a0b4','#c2607a','#e9c46a','#fce4ec','#fff'];
  for(let i=0;i<n;i++){
    const c=document.createElement('div'); c.className='confetti';
    c.style.left=Math.random()*100+'vw';
    c.style.background=cols[Math.random()*cols.length|0];
    c.style.setProperty('--cx',(Math.random()*200-100)+'px');
    c.style.animationDuration=(1.8+Math.random()*1.4)+'s';
    if(Math.random()>.5) c.style.borderRadius='50%';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),3400);
  }
}
