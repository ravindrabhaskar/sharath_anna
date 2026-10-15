import urllib.request,pathlib,concurrent.futures,subprocess
root=pathlib.Path(__file__).parent
items=[('oneplus','1HN43Sx1XFT9R2jkLvL7QbXhEVNZUUdH9'),('ashya','1kqPwbP8r_SbLhpPuxblDyPdF5xyYeloa'),('jam','1KoCPQFEKR0zz9ImmibL0yE3CeOgCGn9-'),('wedding','1R273HRCGG5OyqlelvtE3d8mpufDa_1ds')]
(root/'tmp').mkdir(exist_ok=True)
def get(item):
 name,id=item; p=root/'tmp'/f'{name}.mp4'
 try:
  if not p.exists(): urllib.request.urlretrieve(f'https://drive.usercontent.google.com/download?id={id}&export=download&confirm=t',p)
  print(name,p.stat().st_size,flush=True)
  subprocess.run(['ffmpeg','-y','-ss','8','-i',str(p),'-frames:v','1','-update','1',str(root/'dist/assets'/f'{id}.jpg')],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True)
  if name!='wedding':
   subprocess.run(['ffmpeg','-y','-ss','3','-i',str(p),'-t','4','-an','-vf','scale=960:540:force_original_aspect_ratio=increase,crop=960:540,setsar=1','-r','24','-c:v','libx264','-crf','25','-preset','fast',str(root/'tmp'/f'{name}-clip.mp4')],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,check=True)
 except Exception as e: print(name,str(e),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex: list(ex.map(get,items))
clips=[root/'tmp'/f'{n}-clip.mp4' for n,i in items if n!='wedding']
if all(p.exists() for p in clips):
 (root/'tmp/concat.txt').write_text('\n'.join("file '"+p.as_posix()+"'" for p in clips))
 subprocess.run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(root/'tmp/concat.txt'),'-c','copy','-movflags','+faststart',str(root/'dist/assets/motion-preview.mp4')],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
