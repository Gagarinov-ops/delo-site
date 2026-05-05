export class SquareShape {
  constructor() { this.type='square'; this.name='Квадрат'; this.defaultSize=100; }
  draw(ctx, x, y, s=this.defaultSize) { ctx.strokeStyle='#00A651'; ctx.lineWidth=2; ctx.strokeRect(x-s/2,y-s/2,s,s); ctx.fillStyle='rgba(0,166,81,.1)'; ctx.fillRect(x-s/2,y-s/2,s,s); }
  hitTest(px,py,x,y,s=this.defaultSize) { const h=s/2; return px>=x-h&&px<=x+h&&py>=y-h&&py<=y+h; }
}