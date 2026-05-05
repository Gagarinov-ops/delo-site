export class HingeShape {
  constructor() { this.type='hinge'; this.name='Шарнир'; this.defaultLength=100; }
  draw(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.strokeStyle='#00A651'; ctx.lineWidth=2; ctx.stroke(); const cx=(x1+x2)/2,cy=(y1+y2)/2; ctx.beginPath(); ctx.arc(cx,cy,8,0,Math.PI*2); ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy,3,0,Math.PI*2); ctx.fillStyle='#00A651'; ctx.fill(); }
  hitTest(px,py,x1,y1,x2,y2) { const cx=(x1+x2)/2,cy=(y1+y2)/2; return Math.sqrt((px-cx)**2+(py-cy)**2) < 12; }
}