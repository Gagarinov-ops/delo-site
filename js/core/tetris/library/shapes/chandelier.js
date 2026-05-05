export class ChandelierShape {
  constructor() { this.type='chandelier'; this.name='Люстра'; this.defaultSize=30; }
  draw(ctx, x, y, s=this.defaultSize) { const h=s/2; ctx.beginPath(); ctx.arc(x,y,h,0,Math.PI*2); ctx.strokeStyle='#FF9800'; ctx.lineWidth=1.5; ctx.stroke(); ctx.beginPath(); ctx.moveTo(x-h+4,y); ctx.lineTo(x+h-4,y); ctx.moveTo(x,y-h+4); ctx.lineTo(x,y+h-4); ctx.stroke(); ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); }
  hitTest(px,py,x,y,s=this.defaultSize) { return Math.sqrt((px-x)**2+(py-y)**2) <= s/2+4; }
}