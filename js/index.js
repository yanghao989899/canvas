$(function(){
	var add=$('.add');
	var patbox=$('.palette-box');
	var rep=$('.rep');
	var eraser=$('.eraser');
	var canvas=null;
	var copy=null;
	add.click(function(){
		var w=prompt("请输入画布的宽度",900);
		var h=prompt("请输入画布的高度",600);
		canvas=$('<canvas>').attr({width:w,height:h});
		copy=$('<div>').css({width:w,height:h,position:'absolute',top:0,left:0,zIndex:9999});
		patbox.css({width:w,height:h}).append(canvas).append(copy);
		creat();
	})
	
	function creat(){
		var cobj=canvas[0].getContext('2d');
		var pat=new palette(cobj,canvas[0],copy[0]);
		var divs=$('.left>div>div');
		pat.draw();
		divs.click(function(){
			var attr=$(this).attr('role');
			if(attr!=undefined){
				if(attr=='pencil'){
					pat.pencil();
				}else{
					pat.draw();
					if(attr=='fill'||attr=='stroke'){
						pat.type=attr;
					}else if(attr=='poly'){
						var bnum=prompt('请输入边数',5)||5;
						pat.style=attr;
						pat.bnum=bnum;
					}else if(attr=='polystar'){
						var cnum=prompt('请输入边数',5)||5;
						pat.style=attr;
						pat.cnum=cnum;
					}else if(attr=='fillStyle'){
						var inputf=$('.fillStyle input');
						inputf.change(function(){
							pat.fillStyle=this.value;
						})
					} if(attr=='strokeStyle'){
						var inputf=$('.strokeStyle input');
						inputf.change(function(){
							pat.strokeStyle=this.value;
						})
					}else{
						pat.style=attr;
					}
				}		
			}
		})
		eraser.click(function(){
			pat.del();
		})

		rep.click(function(){
			if(pat.status.length>1){
				pat.status.pop();
				pat.o.putImageData(pat.status[pat.status.length-1],0,0,0,0,pat.width,pat.height);
			}else if(pat.status.length==1){
				cobj.clearRect(0,0,pat.width,pat.height);
			}else{
				alert("不能撤销了");
			}
		})
	}

})