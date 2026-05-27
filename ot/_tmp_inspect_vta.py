import pandas as pd
from pathlib import Path

f = Path(r"C:\Users\hecto\Downloads\VTA SM 02 AL 16.xlsx")
out = Path(r"C:\Users\hecto\Nexus_Core\ot\INSPECT_VTA_SM_02_AL_16.txt")
lines = []
if not f.exists():
    lines.append("FILE NOT FOUND: " + str(f))
else:
    xl = pd.ExcelFile(f)
    lines.append("HOJAS: " + ", ".join(xl.sheet_names))
    for s in xl.sheet_names:
        df = pd.read_excel(f, sheet_name=s, nrows=3)
        lines.append(f"\n--- {s} ({len(pd.read_excel(f, sheet_name=s))} filas) ---")
        lines.append("COLS: " + repr(list(df.columns)))
        if len(df):
            lines.append(df.head(1).to_string())
out.write_text("\n".join(lines), encoding="utf-8")
print("WROTE", out)
