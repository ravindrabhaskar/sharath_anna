'use strict';
const introCover=document.querySelector('.cover');
const introPreference=matchMedia('(prefers-reduced-motion: reduce)');
let introTimer;
function finishIntro(){introCover.classList.remove('intro-running');introCover.classList.add('intro-complete');}
function replayIntro(){
  clearTimeout(introTimer);
  if(introPreference.matches){finishIntro();return;}
  introCover.classList.remove('intro-running','intro-complete');
  void introCover.offsetWidth;
  introCover.classList.add('intro-running');
  introTimer=setTimeout(finishIntro,3270);
}
document.querySelector('.replay-intro').addEventListener('click',replayIntro);
introPreference.addEventListener('change',()=>{clearTimeout(introTimer);finishIntro();});
const introImages=[...introCover.querySelectorAll('img')];
Promise.all(introImages.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve())).then(replayIntro);
