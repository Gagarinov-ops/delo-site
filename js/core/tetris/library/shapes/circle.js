export class CircleShape {
  constructor() { this.type='circle'; this.name='Кружок'; this.defaultRadius=50; }
  draw(ctx, x, y, r=this.defaultRadius) { ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.strokeStyle='#00A651'; ctx.lineWidth=2; ctx.stroke(); ctx.fillStyle='rgba(0,166,81,.1)'; ctx.fill(); }
  hitTest(px,py,x,y,r=this.defaultRadius) { return Math.sqrt((px-x)**2+(py-y)**2) <= r; }
}