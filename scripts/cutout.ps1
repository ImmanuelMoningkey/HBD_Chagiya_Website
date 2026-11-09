# Removes the flat light backdrop from generated object renders -> transparent PNG with soft shadow kept.
# Usage: powershell -ExecutionPolicy Bypass -File scripts/cutout.ps1 -In a.jpg -Out b.png [-Size 720]
param([string]$In, [string]$Out, [int]$Size = 720, [double]$Chroma = 6, [int]$MinHole = 2500)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging; using System.Collections.Generic;
using System.Runtime.InteropServices;
public static class Cutout2 {
  public static Bitmap Run(Bitmap src, double chromaMax, int minHole) {
    int w = src.Width, h = src.Height, n = w*h;
    Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    using (Graphics g = Graphics.FromImage(bmp)) g.DrawImage(src, 0, 0, w, h);
    var data = bmp.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    byte[] px = new byte[n*4]; Marshal.Copy(data.Scan0, px, 0, px.Length);
    // blurred luminance & chroma (5x5 box) to suppress JPEG noise
    double[] L = new double[n], C = new double[n], bl = new double[n], bc = new double[n];
    for (int i=0;i<n;i++){ int o=i*4; int b=px[o],gg=px[o+1],r=px[o+2];
      L[i]=0.299*r+0.587*gg+0.114*b; C[i]=Math.Max(r,Math.Max(gg,b))-Math.Min(r,Math.Min(gg,b)); }
    int R=2;
    for (int y=0;y<h;y++) for (int x=0;x<w;x++){ double sl=0,sc=0; int c=0;
      for (int dy=-R;dy<=R;dy++){ int yy=y+dy; if(yy<0||yy>=h) continue;
        for (int dx=-R;dx<=R;dx++){ int xx=x+dx; if(xx<0||xx>=w) continue; int j=yy*w+xx; sl+=L[j]; sc+=C[j]; c++; } }
      bl[y*w+x]=sl/c; bc[y*w+x]=sc/c; }
    var border = new List<double>();
    for (int x=0;x<w;x++){ border.Add(bl[x]); border.Add(bl[(h-1)*w+x]); }
    for (int y=0;y<h;y++){ border.Add(bl[y*w]); border.Add(bl[y*w+w-1]); }
    border.Sort(); double bg = border[border.Count/2];
    bool[] cand = new bool[n];
    for (int i=0;i<n;i++) cand[i] = bc[i] <= chromaMax && bl[i] >= bg - 95;
    // connected components of candidate mask
    int[] comp = new int[n]; for (int i=0;i<n;i++) comp[i]=-1;
    bool[] isBg = new bool[n]; var q = new Queue<int>(); var members = new List<int>();
    int id=0;
    for (int s=0;s<n;s++){ if(!cand[s]||comp[s]>=0) continue;
      members.Clear(); bool touches=false; double sumL=0; comp[s]=id; q.Enqueue(s);
      while(q.Count>0){ int i=q.Dequeue(); members.Add(i); sumL+=bl[i]; int x=i%w,y=i/w;
        if(x==0||y==0||x==w-1||y==h-1) touches=true;
        if(x>0&&cand[i-1]&&comp[i-1]<0){comp[i-1]=id;q.Enqueue(i-1);}
        if(x<w-1&&cand[i+1]&&comp[i+1]<0){comp[i+1]=id;q.Enqueue(i+1);}
        if(y>0&&cand[i-w]&&comp[i-w]<0){comp[i-w]=id;q.Enqueue(i-w);}
        if(y<h-1&&cand[i+w]&&comp[i+w]<0){comp[i+w]=id;q.Enqueue(i+w);} }
      bool bgc = touches || (members.Count>=minHole && sumL/members.Count >= bg-8);
      if (bgc) foreach(int m in members) isBg[m]=true;
      id++; }
    // --- speckle cleanup: opening on the object mask, keep only significant components ---
    bool[] obj = new bool[n]; for (int i=0;i<n;i++) obj[i]=!isBg[i];
    bool[] opened = Morph(Morph(obj,w,h,3,false),w,h,3,true);
    int[] oc = new int[n]; for (int i=0;i<n;i++) oc[i]=-1;
    var sizes = new List<int>(); int cid=0;
    for (int s=0;s<n;s++){ if(!opened[s]||oc[s]>=0) continue; int cnt=0; oc[s]=cid; q.Enqueue(s);
      while(q.Count>0){ int i=q.Dequeue(); cnt++; int x=i%w,y=i/w;
        if(x>0&&opened[i-1]&&oc[i-1]<0){oc[i-1]=cid;q.Enqueue(i-1);}
        if(x<w-1&&opened[i+1]&&oc[i+1]<0){oc[i+1]=cid;q.Enqueue(i+1);}
        if(y>0&&opened[i-w]&&oc[i-w]<0){oc[i-w]=cid;q.Enqueue(i-w);}
        if(y<h-1&&opened[i+w]&&oc[i+w]<0){oc[i+w]=cid;q.Enqueue(i+w);} }
      sizes.Add(cnt); cid++; }
    int largest=0; foreach(int sz in sizes) largest=Math.Max(largest,sz);
    bool[] keep = new bool[n];
    for (int i=0;i<n;i++) keep[i] = oc[i]>=0 && sizes[oc[i]] >= largest*0.03;
    keep = Morph(keep,w,h,4,true);
    for (int i=0;i<n;i++) if (obj[i] && !keep[i]) isBg[i]=true;
    const double shade = 70.0;
    for (int i=0;i<n;i++){ if(!isBg[i]) continue; int o=i*4;
      double a=(bg - bl[i] - 5)/(bg - shade); if(a<0)a=0; if(a>1)a=1;
      px[o]=82; px[o+1]=66; px[o+2]=112; px[o+3]=(byte)(a*255*0.8); }
    // fringe softening for light object pixels next to background
    for (int y=1;y<h-1;y++) for (int x=1;x<w-1;x++){ int i=y*w+x; if(isBg[i]) continue;
      if(isBg[i-1]||isBg[i+1]||isBg[i-w]||isBg[i+w]){ int o=i*4; if(L[i] > bg-20) px[o+3]=(byte)140; } }
    Marshal.Copy(px,0,data.Scan0,px.Length); bmp.UnlockBits(data); return bmp;
  }
  // separable square morphology: dilate=true grows mask, false erodes
  static bool[] Morph(bool[] m, int w, int h, int r, bool dilate){
    bool[] t = new bool[m.Length], o = new bool[m.Length];
    for (int y=0;y<h;y++) for (int x=0;x<w;x++){ bool v=!dilate;
      for (int d=-r; d<=r; d++){ int xx=x+d; bool s = (xx<0||xx>=w) ? !dilate : m[y*w+xx];
        if (dilate && s){v=true;break;} if(!dilate && !s){v=false;break;} } t[y*w+x]=v; }
    for (int y=0;y<h;y++) for (int x=0;x<w;x++){ bool v=!dilate;
      for (int d=-r; d<=r; d++){ int yy=y+d; bool s = (yy<0||yy>=h) ? !dilate : t[yy*w+x];
        if (dilate && s){v=true;break;} if(!dilate && !s){v=false;break;} } o[y*w+x]=v; }
    return o;
  }
}
"@
$src = [System.Drawing.Bitmap]::FromFile((Resolve-Path $In).Path)
$cut = [Cutout2]::Run($src, $Chroma, $MinHole)
$canvas = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.InterpolationMode = 'HighQualityBicubic'; $g.PixelOffsetMode = 'HighQuality'; $g.CompositingMode = 'SourceCopy'
$g.DrawImage($cut, 0, 0, $Size, $Size)
New-Item -ItemType Directory -Force -Path (Split-Path $Out) | Out-Null
$canvas.Save((Join-Path (Get-Location) $Out), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $canvas.Dispose(); $cut.Dispose(); $src.Dispose()
Write-Output "saved $Out"
