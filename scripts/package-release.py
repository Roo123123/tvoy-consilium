from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
out=root/'dist/downloads/case-club-github.zip'
out.parent.mkdir(parents=True,exist_ok=True)
with ZipFile(out,'w',ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(root.rglob('*')):
        rel=p.relative_to(root)
        if not p.is_file() or any(x in {'.git','.openai','node_modules','__pycache__'} for x in rel.parts):
            continue
        if rel.parts[:2]==('dist','downloads') or p.name.startswith('qa-'):
            continue
        z.write(p,'case-club-github/'+rel.as_posix())
print(str(out))
with ZipFile(out) as z:
    assert z.testzip() is None
    assert 'case-club-github/.github/workflows/pages.yml' in z.namelist()
    assert len([n for n in z.namelist() if n.endswith('/data/cases.json')])==1
    print(f'{len(z.namelist())} файлов, {out.stat().st_size} байт, архив проверен')
