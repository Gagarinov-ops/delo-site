export class WindowShape {
  constructor() { this.type='window'; this.name='Окно'; this.defaultWidth=80; this.defaultHeight=10; }
  draw(ctx, x, y, w=this.defaultWidth, orientation='horizontal') { const hw=w/2,hh=this.defaultHeight/2; ctx.fillStyle='#FFF'; ctx.strokeStyle='#2D2D2D'; ctx.lineWidth=2; if(orientation==='horizontal'){ctx.fillRect(x-hw,y-hh,w,this.defaultHeight);ctx.strokeRect(x-hw,y-hh,w,this.defaultHeight);}else{ctx.fillRect(x-hh,y-hw,this.defaultHeight,w);ctx.strokeRect(x-hh,y-hw,this.defaultHeight,w);} }
  hitTest(px,py,x,y,w=this.defaultWidth,orientation='horizontal') { const hw=w/2,hh=this.defaultHeight/2; return orientation==='horizontal'?px>=x-hw&&px<=x+hw&&py>=y-hh&&py<=y+hh:px>=x-hh&&px<=x+hh&&py>=y-hw&&py<=y+hw; }
  validateAgainstWall(pw,wl) { return pw>wl?{valid:false,message:'Не умещается',riskId:'RISK-03'}:{valid:true}; }
}