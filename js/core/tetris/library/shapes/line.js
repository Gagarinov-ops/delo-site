export class LineShape {
  constructor() { this.type='line'; this.name='Линия'; this.defaultLength=200; }
  draw(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.strokeStyle='#00A651'; ctx.lineWidth=3; ctx.stroke(); this._tick(ctx,x1,y1); this._tick(ctx,x2,y2); }
  _tick(ctx,x,y) { const t=8; ctx.beginPath(); ctx.moveTo(x-t,y-t); ctx.lineTo(x+t,y+t); ctx.moveTo(x-t,y+t); ctx.lineTo(x+t,y-t); ctx.strokeStyle='#D32F2F'; ctx.lineWidth=1.5; ctx.stroke(); }
  hitTest(px,py,x1,y1,x2,y2) { return this._dist(px,py,x1,y1,x2,y2) < 10; }
  _dist(px,py,x1,y1,x2,y2) { const A=px-x1,B=py-y1,C=x2-x1,D=y2-y1,dot=A*C+B*D,lenSq=C*C+D*D; let param=lenSq!==0?dot/lenSq:-1,xx,yy; if(param<0){xx=x1;yy=y1;}else if(param>1){xx=x2;yy=y2;}else{xx=x1+param*C;yy=y1+param*D;} return Math.sqrt((px-xx)**2+(py-yy)**2); }
}