'use strict';
const grid = document.querySelector('#projects');
const dialog = document.querySelector('#project-dialog');
const player = document.querySelector('#project-player');
const video = document.querySelector('#hero-video');
let projects = [], filter = 'All', limit = 6, lastTrigger;
const safe = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render() {
  const visible = projects.filter(p => filter === 'All' || p.category === filter);
  grid.innerHTML = visible.slice(0, limit).map(p => {
    const index = projects.indexOf(p);
    return `<article class="project-card"><button data-project="${index}" aria-label="Watch ${safe(p.title)} — ${safe(p.category)}"><div class="project-image"><img src="assets/${p.cover}.jpg" alt="Frame from ${safe(p.title)}" loading="lazy" width="1200" height="900"><span class="project-index">${String(index + 1).padStart(2,'0')} / ${safe(p.category).toUpperCase()}</span><span class="project-play" aria-hidden="true">▶</span></div><div class="project-info"><div><h3>${safe(p.title)}</h3><p>${safe(p.category)} &nbsp;·&nbsp; ${p.files.length} ${p.files.length === 1 ? 'film' : 'films'}</p></div><span aria-hidden="true">↗</span></div></button></article>`;
  }).join('');
  document.querySelector('#work-status').textContent = `${Math.min(limit, visible.length)} of ${visible.length} projects`;
  document.querySelector('#load-more').hidden = limit >= visible.length;
}
function selectFilm(project, index) {
  const file = project.files[index];
  player.src = `https://drive.google.com/file/d/${file.id}/preview`;
  player.title = `${project.title} — ${file.title}`;
  document.querySelector('#drive-original').href = `https://drive.google.com/file/d/${file.id}/view`;
  document.querySelectorAll('.playlist button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
}
function openProject(index, trigger) {
  const project = projects[index];
  if (!project) return;
  lastTrigger = trigger;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category.toUpperCase() + ' / VIDEO EDITING';
  const playlist = document.querySelector('#playlist');
  playlist.innerHTML = project.files.map((f, i) => `<button data-film="${i}" aria-pressed="${i === 0}">${String(i+1).padStart(2,'0')} — ${safe(f.title)}</button>`).join('');
  playlist.onclick = event => { const b = event.target.closest('[data-film]'); if (b) selectFilm(project, Number(b.dataset.film)); };
  selectFilm(project, 0);
  video.pause();
  document.querySelector('#motion-toggle').textContent = '▶';
  document.querySelector('#motion-toggle').setAttribute('aria-label', 'Play background preview');
  document.body.classList.add('modal-open');
  dialog.showModal();
}
grid.addEventListener('click', event => {const b = event.target.closest('[data-project]'); if(b) openProject(Number(b.dataset.project), b);});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter; limit = 6;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed',String(b === button)));
  render();
}));
document.querySelector('#load-more').addEventListener('click', () => { const old = limit; limit += 6; render(); grid.querySelectorAll('button')[old]?.focus({preventScroll:true}); });
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => {player.removeAttribute('src'); document.body.classList.remove('modal-open');lastTrigger?.focus({preventScroll:true});});
document.querySelector('#featured-play').addEventListener('click', event => openProject(0, event.currentTarget));
const motionButton = document.querySelector('#motion-toggle');
motionButton.addEventListener('click', async () => {
  if(video.paused) { try {await video.play(); motionButton.textContent='Ⅱ';motionButton.setAttribute('aria-label','Pause background preview');} catch {motionButton.textContent='▶';} }
  else {video.pause();motionButton.textContent='▶';motionButton.setAttribute('aria-label','Play background preview');}
});
if(matchMedia('(prefers-reduced-motion: reduce)').matches) {video.autoplay=false;video.pause();motionButton.textContent='▶';motionButton.setAttribute('aria-label','Play background preview');}
video.addEventListener('error', () => {motionButton.hidden=true;});
const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('.header nav');
menu.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') !== 'true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open);});
nav.addEventListener('click', () => {menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');nav.classList.remove('open');});
document.querySelector('#copy-email').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try {await navigator.clipboard.writeText('Sharathchandra0122@gmail.com');status.textContent='Email copied';}
  catch {status.textContent='Select the email above to copy it.';}
});
fetch('projects.json').then(r=>{if(!r.ok)throw new Error('Projects unavailable');return r.json();}).then(data=>{projects=data;document.querySelector('#total-count').textContent=projects.length;render();}).catch(()=>{grid.innerHTML='<p>Explore the complete <a href="https://drive.google.com/drive/folders/1mRFZlkO5Euvz-O2XW0Yg2n1jTw8EczcL" target="_blank" rel="noopener">work archive ↗</a>.</p>';document.querySelector('#load-more').hidden=true;});
