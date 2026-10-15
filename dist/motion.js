'use strict';
const previewGroups=[...document.querySelectorAll('.motion-stage,.preview-block')];
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
function syncPreviews(){
  for(const group of previewGroups){
    const paused=group.dataset.paused==='true';
    const playing=group.dataset.visible==='true'&&!paused&&!document.hidden&&!document.body.classList.contains('modal-open')&&!document.body.classList.contains('menu-open');
    group.classList.toggle('is-playing',playing);
    group.querySelectorAll('video').forEach(video=>{
      if(playing){
        if(!video.src){video.src=video.dataset.src;video.load();}
        video.play().catch(()=>{
          if(!group.classList.contains('is-playing'))return;
          group.dataset.paused='true';group.classList.remove('is-playing');
          group.querySelectorAll('video').forEach(v=>v.pause());
          const control=group.querySelector('.preview-toggle');
          control.setAttribute('aria-pressed','true');control.setAttribute('aria-label','Play project previews');
          control.innerHTML='▶ <span>Play previews</span>';
        });
      }else video.pause();
    });
    const button=group.querySelector('.preview-toggle');
    button.setAttribute('aria-pressed',String(paused));
    button.setAttribute('aria-label',paused?'Play project previews':'Pause project previews');
    button.innerHTML=paused?'▶ <span>Play previews</span>':'Ⅱ <span>Pause previews</span>';
  }
}
const previewsObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{entry.target.dataset.visible=String(entry.isIntersecting);});syncPreviews();
},{threshold:.2});
previewGroups.forEach(group=>{
  group.dataset.paused=String(reducedMotion.matches);group.dataset.visible='false';
  group.querySelector('.preview-toggle').addEventListener('click',()=>{group.dataset.paused=String(group.dataset.paused!=='true');syncPreviews();});
  previewsObserver.observe(group);
});
document.addEventListener('visibilitychange',syncPreviews);
new MutationObserver(syncPreviews).observe(document.body,{attributes:true,attributeFilter:['class']});
reducedMotion.addEventListener('change',event=>{previewGroups.forEach(group=>{group.dataset.paused=String(event.matches);});syncPreviews();});
syncPreviews();
