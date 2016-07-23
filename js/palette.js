// cobj 绘制对象 2d
// canvas 标签

//数据初始化
function palette(cobj,canvas,top){
	this.o=cobj;
	this.canvas=canvas;
	this.width=canvas.width;
	this.height=canvas.height;
	this.style="line"; 	//line rect circle triangle pencil
	this.type="stroke";	//stroke  fill
	this.status=[];
	this.strokeStyle="#000";
	this.fillStyle="#000";
	this.lineWidth=1;
	this.bnum=5;	//多边形的边数
	this.cnum=5;	//多角形的边数	
	this.top=top;
	//1.鼠标抬起   getImageData(0,0,that.width,that.height)
	// 截图 保留 上次绘制结果
	//2.鼠标移动   填充 最后保留的截图
	//putImageData(ImageData,0,0,0,0,that.width,that.height)
}
palette.prototype.init=function(){
	this.o.strokeStyle=this.strokeStyle;
	this.o.fillStyle=this.fillStyle;
	this.o.type=this.type;
	this.o.style=this.style;
	this.o.lineWidth=this.lineWidth;
}
//画板核心  规则图形
palette.prototype.draw=function(){
	var that=this;
	this.top.onmousedown=function(e){
		var ev=e||window.event;
		var sx=ev.offsetX;
		var sy=ev.offsetY;
		that.init();
		document.onmousemove=function(e){
			var ev=e||window.event;
			that.o.clearRect(0,0,that.width,that.height);
			if(that.status.length>0){
				that.o.putImageData(that.status[that.status.length-1],0,0,0,0,that.width,that.height);
			}
			var nx=ev.offsetX;
			var ny=ev.offsetY;
			that[that.style](sx,sy,nx,ny);
		}
		document.onmouseup=function(){
			that.status.push(that.o.getImageData(0,0,that.width,that.height))
			document.onmousemove=null;
			document.onmouseup=null;
		}
	}
}
//铅笔画图
palette.prototype.pencil=function(){
	var that=this;
	this.top.onmousedown=function(e){
		var ev=e||window.event;
		that.init();
		that.o.beginPath();
		document.onmousemove=function(e){
			var x=e.offsetX;
			var y=e.offsetY;
			that.o.lineTo(x,y);
			that.o.stroke();
		}
		document.onmouseup=function(){
			that.o.closePath();
			that.status.push(that.o.getImageData(0,0,that.width,that.height))
			document.onmousemove=null;
			document.onmouseup=null;
		}
	}
}
//画直线
palette.prototype.line=function(x1,y1,x2,y2){
	this.o.beginPath();
	this.o.lineTo(x1,y1);
	this.o.lineTo(x2,y2);
	this.o.closePath();
	this.o.stroke();
}
//画矩形
palette.prototype.rect=function(x1,y1,x2,y2){
	var w=x2-x1;
	var h=y2-y1;
	this.o.beginPath();
	this.o.rect(x1-.5,y1-.5,w,h);
	this.o.closePath();
	this.o[this.type]();
}
//画圆
palette.prototype.circle=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	this.o.beginPath();
	this.o.arc(x1,y1,r,0,Math.PI*2)
	this.o.closePath();
	this.o[this.type]();
}
//画三角
palette.prototype.triangele=function(x1,y1,x2,y2){
	this.o.beginPath();
	this.o.lineTo(x1-0.5,y1-.5);
	this.o.lineTo(x2-.5,y2-.5);
	this.o.lineTo(x1-.5,y2-.5);
	this.o.closePath();
	this.o[this.type]();
}
//计算圆的半径
palette.prototype._r=function(x1,y1,x2,y2){
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}
//多边形
palette.prototype.poly=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var n=this.bnum;
	var ang=360/n;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r,y1+Math.sin(Math.PI/180*ang*i)*r)
	}
	this.o.closePath();
	this.o[this.type]();
}
//多角形
palette.prototype.polystar=function(x1,y1,x2,y2){
	var r=this._r(x1,y1,x2,y2);
	var r1=r*.5;
	var n=this.cnum*2;
	var ang=360/n;
	this.o.beginPath();
	for(var i=0;i<n;i++){
		if(i%2==0){
			this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r,y1+Math.sin(Math.PI/180*ang*i)*r)
		}else{
			this.o.lineTo(x1+Math.cos(Math.PI/180*ang*i)*r1,y1+Math.sin(Math.PI/180*ang*i)*r1)
		}
	}
	this.o.closePath();
	this.o[this.type]();
}
//橡皮擦
palette.prototype.del=function(){
	var that=this;
	var w=30;
	this.top.onmousedown=function(e){
		var sx=e.offsetX;
		var sy=e.offsetY;
		var box=document.querySelector(".palette-box");
		var a=document.createElement("div");
		a.style.cssText="width:30px;height:30px;border:1px solid red;position:absolute";
		document.onmousemove=function(e){
			var nx=e.offsetX;
			var ny=e.offsetY;
			a.style.left=nx-w/2+"px";
			a.style.top=ny-w/2+"px";
			box.appendChild(a);
			that.o.clearRect(nx-w/2,ny-w/2,w,w)
		}
		document.onmouseup=function(){
			box.removeChild(a);
			document.onmousemove=null;
			document.onmouseup=null;
		}
	}
}