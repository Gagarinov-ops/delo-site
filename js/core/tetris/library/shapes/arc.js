export class ArcShape {
  constructor() { this.type='arc'; this.name='Дуга'; this.defaultRadius=60; this.defaultStartAngle=0; this.defaultEndAngle=Math.PI; }
  draw(ctx, x, y, r=this.defaultRadius, sa=this.defaultStartAngle, ea=this.defaultEndAngle) { ctx.beginPath(); ctx.arc(x,y,r,sa,ea); ctx.strokeStyle='#00A651'; ctx.lineWidth=2; ctx.stroke(); this._tick(ctx,x+r*Math.cos(sa),y+r*Math.sin(sa)); this._tick(ctx,x+r*Math.cos(ea),y+r*Math.sin(ea)); }
  _tick(ctx,x,y) { ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fillStyle='#D32F2F'; ctx.fill(); }
  hitTest(px,py,x,y,r=this.defaultRadius) { return Math.abs(Math.sqrt((px-x)**2+(py-y)**2)-r) < 8; }
}