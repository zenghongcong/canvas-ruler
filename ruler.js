(function(win){
	
	function Ruler(options){
		if(!(this instanceof Ruler)) {
			return new Ruler(options)
		}
		this.ver = '1.0.0';
		this.options = options;
		this.options.scaleplate = this.options.scaleplate === undefined ? {} : this.options.scaleplate;
	    this.options.scaleplate.color = this.options.scaleplate.color === undefined ? '#f00' : this.options.scaleplate.color; 							//刻度颜色
	    this.options.scaleplate.width = this.options.scaleplate.width === undefined ? 1 : this.options.scaleplate.width;                      			//刻度宽度
	    this.options.scaleplate.fontsize = this.options.scaleplate.fontsize === undefined ? 12 : this.options.scaleplate.fontsize;                		//刻度值字体大小
	    this.options.scaleplate.fontcolor = this.options.scaleplate.fontcolor === undefined ? '#f00' : this.options.scaleplate.fontcolor;         		//刻度值字体颜色
	    this.options.scaleplate.fontfamily = this.options.scaleplate.fontfamily === undefined ? 'Courier New' : this.options.scaleplate.fontfamily;		//刻度值字体样式
	    this.options.unit = this.options.unit === undefined ? 10 : this.options.unit;                        											//刻度间隔，默认值5
	    this.options.value = this.options.value === undefined ? this.options.start : this.options.value;                     							//中心线位置，默认值为开始值
	    this.options.background = this.options.background === undefined ? '#fff' : this.options.background; 											//画布背景色，默认白色
	    this.options.linecolor = this.options.linecolor === undefined ? '#000' : this.options.linecolor;    											//中心线颜色，默认黑色 
	    this.options.capacity = this.options.capacity === undefined ? 1 : this.options.capacity;    													//每个刻度代表的值
		this.init();
	}
	
	Ruler.prototype = {
		constructor: Ruler,
		init: function(){
			this.canvas = document.querySelector(this.options.elem);
			this.canvas.width = this.options.width;
			this.canvas.height = this.options.height;
    		this.addEvent();
    		this.renderCanvas();
		},
		renderCanvas: function(){
			var ctx = this.canvas.getContext('2d');
			var options = this.options;
			var curScaleValue = options.value; //当前刻度值
			var i = 0;
			
			ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
			ctx.lineWidth = options.scaleplate.width;
			
			//绘制右侧刻度
	        for(i = options.width/2; i < options.width && curScaleValue <= options.end; i+=options.unit){
	        	ctx.beginPath();
	        	ctx.moveTo(i, Math.ceil(options.height*3/4));
	            ctx.fillStyle = options.scaleplate.fontcolor;
	            if(curScaleValue%(options.capacity*options.unit) == 0){ //第1或10格刻度
	                ctx.moveTo(i, Math.ceil(options.height*3/4));
	                ctx.font = options.scaleplate.fontsize+'px '+options.scaleplate.fontfamily; //设置文本的字体大小和字体样式
	            	ctx.fillStyle = options.scaleplate.fontcolor;
	            	ctx.fillText(curScaleValue, i - (curScaleValue + '').length*3.5, options.height*3/4 - 4);
	            }else if(curScaleValue%(options.capacity*options.unit/2) == 0){ //第5格刻度
	            	ctx.moveTo(i, Math.ceil(options.height*5/6));
	            }else{ //其他刻度
	            	ctx.moveTo(i, Math.ceil(options.height*8/9));
	            }
	            ctx.lineTo(i, options.height);
	            ctx.strokeStyle = options.scaleplate.color;
	            ctx.stroke();     //实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
	            ctx.closePath();  //关闭当前的绘制路径
	            curScaleValue = curScaleValue + options.capacity;
	        }
	        
	        //绘制左侧刻度
	        curScaleValue = options.value-options.capacity;
	        for(i = options.width/2 - options.unit; i > -options.width && curScaleValue >= options.start; i-=options.unit){
	        	ctx.beginPath();
	        	ctx.moveTo(i, Math.ceil(options.height*3/4));
	            ctx.fillStyle = options.scaleplate.fontcolor;
	            if(curScaleValue%(options.capacity*options.unit) == 0){ //第1或10格刻度
	                ctx.moveTo(i, Math.ceil(options.height*3/4));
	                ctx.font = options.scaleplate.fontsize+'px '+options.scaleplate.fontfamily; //设置文本的字体大小和字体样式
	            	ctx.fillStyle = options.scaleplate.fontcolor;
	            	ctx.fillText(curScaleValue, i - (curScaleValue + '').length*3.5, options.height*3/4 - 4);
	            }else if(curScaleValue%(options.capacity*options.unit/2) == 0){ //第5格刻度
	            	ctx.moveTo(i, Math.ceil(options.height*5/6));
	            }else{ //其他刻度
	            	ctx.moveTo(i, Math.ceil(options.height*8/9));
	            }
	            ctx.lineTo(i, options.height);
	            ctx.strokeStyle = options.scaleplate.color;
	            ctx.stroke();     //实际地绘制出通过 moveTo() 和 lineTo() 方法定义的路径
	            ctx.closePath();  //关闭当前的绘制路径
	            curScaleValue = curScaleValue - options.capacity;
	        }
	        
	        //绘制中心线
	        ctx.fillStyle = this.canvas.background;
	        ctx.fillRect = (0, 0, this.canvas.width, this.canvas.height);
	        ctx.lineWidth = options.scaleplate.width;
	        ctx.moveTo(Math.floor(this.canvas.width/2), 0);
	        ctx.lineTo(Math.floor(this.canvas.width/2), this.canvas.height);
	        ctx.strokeStyle = options.linecolor;
	        ctx.stroke();
	        ctx.closePath();
	        
	        //标尺底部线
	        ctx.moveTo(0, this.canvas.height);
	        ctx.lineTo(this.canvas.width, this.canvas.height);
	        ctx.strokeStyle = options.scaleplate.color;
	        ctx.stroke();
	        ctx.closePath();
	        
	        
		},
		addEvent: function(){
			var x, curX, nowx, moveDistance, _this = this;
	        //添加手指触碰屏幕时的touchstart事件
	        this.canvas.addEventListener('touchstart',function(e){
	        	e.stopPropagation();
	        	e.preventDefault();
	        	x = e.touches[0].clientX;  //获取第一个手指对象的X轴坐标值
	        },false);
	        //添加手指滑动屏幕时的touchmove事件
	        this.canvas.addEventListener('touchmove',function(e){
	        	e.stopPropagation();
	        	e.preventDefault();
	        	curX = e.touches[0].clientX;
				if(Math.abs(curX - x) > _this.options.unit){
					moveDistance = curX - x;
					x = curX;
					_this.options.value -= Math.ceil(moveDistance/_this.options.unit)*_this.options.capacity;
					_this.options.value = _this.options.value < _this.options.start ? _this.options.start : (_this.options.value > _this.options.end ? _this.options.end : _this.options.value);
					_this.renderCanvas();
					_this.options.callback && _this.options.callback(_this.options.value);
				}
	        },false);
		}
	}
	
	win.Ruler = Ruler;
})(window);
