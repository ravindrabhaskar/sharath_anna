from pathlib import Path
import re
p=Path('dist/index.html');s=p.read_text(encoding='utf-8')
def film(title,name,poster,cls='',card=''):
 return f'<button class="{cls} project-link {card}" data-title="{title}" aria-label="Watch {title}"><video class="preview-video" muted loop playsinline preload="none" poster="assets/{poster}.jpg" aria-hidden="true" tabindex="-1" data-src="assets/{name}-preview.mp4"></video><span class="play-mark" aria-hidden="true">▶</span><span class="film-caption">{title.upper()}</span></button>'
old=re.search(r'<button class="portrait-film project-link" data-title="OnePlus".*?</button>',s).group(0)
stack='<div class="motion-stage"><div class="card-stack" aria-label="Animated project previews">'+film('Ashya Foods','ashya','1kqPwbP8r_SbLhpPuxblDyPdF5xyYeloa',card='stack-card stack-left')+film('Jam Junxion','jam','1KoCPQFEKR0zz9ImmibL0yE3CeOgCGn9-',card='stack-card stack-right')+film('OnePlus','oneplus','1HN43Sx1XFT9R2jkLvL7QbXhEVNZUUdH9',card='stack-card stack-center')+'</div><button class="preview-toggle" aria-label="Pause motion previews" aria-pressed="false">Ⅱ <span>Pause previews</span></button></div>'
s=s.replace(old,stack)
for title,name,poster,cls in [('Ashya Foods','ashya','1kqPwbP8r_SbLhpPuxblDyPdF5xyYeloa','portrait-film'),('Anuhya & Sai','wedding','1R273HRCGG5OyqlelvtE3d8mpufDa_1ds','landscape-film')]:
 pattern=r'<button class="'+cls+' project-link" data-title="'+re.escape(title)+'".*?</button>'
 new='<div class="preview-block">'+film(title,name,poster,cls)+'<button class="preview-toggle" aria-label="Pause project preview" aria-pressed="false">Ⅱ <span>Pause preview</span></button></div>'
 s=re.sub(pattern,lambda _:new,s,count=1)
s=s.replace('style.css?v=2','style.css?v=3').replace('app.js?v=2','app.js?v=3')
p.write_text(s,encoding='utf-8')
