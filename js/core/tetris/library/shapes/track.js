export class TrackShape {
  constructor() { this.type='track'; this.name='Трек'; this.defaultLength=120; }
  draw(ctx, x1, y1, x2, y2, count=3) { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.strokeStyle='#FF9800'; ctx.lineWidth=1.5; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]); for(let i=0;i<count;i++){const t=i/(count-1),tx=x1+(x2-x1)*t,ty=y1+(y2-y1)*t; ctx.beginPath(); ctx.arc(tx,ty,4,0,Math.PI*2); ctx.fillStyle='#FFF'; ctx.fill(); ctx.strokeStyle='#FF9800'; ctx.lineWidth=1; ctx.stroke();} }
  hitTest(px,py,x1,y1,x2,y2) { return this._dist(px,py,x1,y1,x2,y2) < 8; }
  _dist(px,py,x1,y1,x2,y2) { const A=px-x1,B=py-y1,C=x2-x1,D=y2-y1,dot=A*C+B*D,lenSq=C*C+D*D; let param=lenSq!==0?dot/lenSq:-1,xx,yy; if(param<0){xx=x1;yy=y1;}else if(param>1){xx=x2;yy=y2;}else{xx=x1+param*C;yy=y1+param*D;} return Math.sqrt((px-xx)**2+(py-yy)**2); }
}