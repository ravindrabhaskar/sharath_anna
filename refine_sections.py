from pathlib import Path
import re
p=Path('dist/index.html');s=p.read_text(encoding='utf-8')
labels={'experience-title':'THE EXPERIENCE','motion-title':'01 / MOTION DESIGN','short-title':'02 / SOCIAL & BRAND CONTENT','long-title':'03 / LONG-FORM STORIES','wedding-title':'04 / WEDDING FILMS','contact-title':'HAVE A PROJECT IN MIND?'}
for id,label in labels.items():
 needle=f'<h2 id="{id}">'
 # Shared heading wrapper keeps section labels attached to their headings.
 match=re.search(re.escape(needle)+r'.*?</h2>',s)
 if match:
  heading=match.group(0)
  if id=='experience-title':s=s.replace(heading,f'<div class="section-title"><span class="section-overline">{label}</span>{heading}</div>',1)
  else:s=s.replace(heading,f'<span class="section-overline">{label}</span>{heading}',1)
s=s.replace('Sharathchandra0122<br>@gmail.com','Sharathchandra0122<wbr>@gmail.com')
s=s.replace('<div class="contact-links"><a href="tel:', '<div class="contact-links"><span class="contact-link-label">OR REACH ME DIRECTLY</span><a href="tel:')
s=s.replace('layout.css?v=9','layout.css?v=10')
# Put metadata below the frame, so the picture and information have clear edges.
meta={
 'Ashya Foods':('Ashya Foods','03 films / Short form'),
 'Tech Burner':('Tech Burner','07 chapters / Long form'),
 'Anuhya & Sai':('Wedding collection','04 films / Cinematic stories')}
for title,(name,detail)in meta.items():
 # Each featured visual has one image/video button, separate from the text link.
 pattern=r'(<button class="(?:portrait-film|landscape-film) project-link[^"\n]*" data-title="'+re.escape(title)+r'".*?</button>)'
 match=re.search(pattern,s)
 if not match:continue
 block=match.group(1)
 # Captions currently overlap the movie; move the information below instead.
 clean=re.sub(r'<span class="film-caption">.*?</span>','',block)
 caption=f'<div class="media-meta"><strong>{name}</strong><span>{detail}</span></div>'
 if title=='Tech Burner':
  s=s.replace(block,'<div class="preview-block static-preview">'+clean+caption+'</div>',1)
 else:s=s.replace(block,clean+caption,1)
p.write_text(s,encoding='utf-8')
