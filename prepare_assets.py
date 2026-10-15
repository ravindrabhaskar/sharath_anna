import json, pathlib, urllib.request, concurrent.futures, shutil
from PIL import Image
root=pathlib.Path(__file__).parent
assets=root/'dist/assets'
groups=json.loads((root/'media-source.json').read_text())
def thumb(f):
    target=assets/(f['id']+'.jpg')
    try:
        if not target.exists():
            data=urllib.request.urlopen('https://drive.google.com/thumbnail?id='+f['id']+'&sz=w1200',timeout=40).read()
            target.write_bytes(data)
        im=Image.open(target); im.convert('RGB').save(target,quality=85)
        return f['id'],True
    except Exception as e: return f['id'],str(e)
files=[f for g in groups for f in g['files']]
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    for r in ex.map(thumb,files): print(r)
for name,out in [('WhatsApp Image 2026-09-26 at 13.03.34.jpeg','brand.jpg'),('WhatsApp Image 2026-09-26 at 13.14.04.jpeg','portrait.jpg')]:
    im=Image.open(pathlib.Path('C:/Users/USER/Downloads')/name)
    im.thumbnail((1600,1600)); im.save(assets/out,quality=92)
shutil.copyfile('C:/Users/USER/Downloads/Naukri_MudedlaSharathchandra[4y_5m].pdf',assets/'Sharath-Chandra-Resume.pdf')
try:
    data=urllib.request.urlopen(urllib.request.Request('https://www.behance.net/gallery/242441991/Portfolio-2026-Video-Editor',headers={'User-Agent':'Mozilla/5.0'}),timeout=30).read()
    (root/'reference.html').write_bytes(data); print('Reference downloaded',len(data))
except Exception as e: print('Reference unavailable:',e)
