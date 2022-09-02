import "Framework/afc/component/ACanvas.js"
import 'Framework/afc/event/ACanvasEvent.js'
import "Framework/afc/component/AView.js"

//싱크 생각해봐야함 , 그리고있을때 상대방이 바로 데이터를 받을수있음
//스크롤 가속도를 줄것인가
class Paint(targetView)
{
	//할거
	// 도중에 참여했을때 선 데이터 불러오기
	// 스크롤되게하기
	// 고객은 그리지못하게하고 버튼이벤트 할수있게하기 
	this.targetView = targetView;
	
	//채팅방에 유저가 추가될때마다 동적으로 늘어남
	this.canvasItems = {};
	this.pointArrItems = {}; //각 객체별로 선의 정보를 배열로저장
	this.pointItems = {}; //각 객체별로 선의 정보를 저장해서 그리는용도
	
	this.scale = 1;
	this.lineWidth = 3;
	this.eraserSize = 50; 
	this.color = '#000000';
	
	//페인트 element
	this.paintContainer = new AView();
	this.paintContainer.init();
	
	//다른 유저의 캔버스를 담을 컨테이너
	this.cvContainer = new AView();
	this.cvContainer.init();
	
	//최종 반영되는 캔버스
	this.mainCanvas = new ACanvas();
	this.mainCanvas.init();
	this.mainCtx = this.mainCanvas.ctx;
	
	this.eraserBox = new AView();
	this.eraserBox.init();

	this.point = { begin:null , dot:[], lineWidth:this.lineWidth , color:this.color }; 
	this.pointArr = [];
	this.dotArr = [];
	
	this.isDraw = false;
	this.isPen = false;
	this.isEraser = false;
	
	this.isValidate = false;
	
	this.offset = {x:0 , y:0};
	this.sclOffset = {x:0 , y:0};

	this.canvasSetting();
		
	if(navigator.userAgent == 'V3NO') // test
		afc.isMobile=true;
}

function Paint*addCanvasItems(id) //다른 유저들의 캔버스를 세팅
{	
	this.pointArrItems[id] = [];
	
	if(theApp.loginMgr.isAgent() && theApp.loginMgr.getUserId != id)
	{
				
	}

	if( id == theApp.loginMgr.getUserId()) return;
	
	var style = { 
				"background-color":"rgba(0,0,0,0)" , 	
				'position':'absolute' , 'left':'0px' , 'top': '0px'
				};
	
	this.pointItems[id] = {begin:null ,dot:[],lineWidth:null,color:null};	

	this.canvasItems[id] = new ACanvas();
	this.canvasItems[id].init();

	this.canvasItems[id].setComponentId('canvas_'+id);
	this.canvasItems[id].setSize(this.targetView.getWidth(),this.targetView.getHeight());
	this.canvasItems[id].resizeCanvas();
	this.canvasItems[id].setStyleObj(style);
	this.cvContainer.addComponent(this.canvasItems[id] ,false);
	
};

function Paint*canvasSetting() 
{ 
	var style = {
				"background-color":"rgba(0,0,0,0)" , 
				'position':'absolute' , 'left':'0px' , 'top': '0px'
				};
	
	this.paintContainer.setComponentId('paintContainer');
	this.paintContainer.setStyleObj(style);
	this.paintContainer.setSize(this.targetView.getWidth(),this.targetView.getHeight());
	this.targetView.addComponent(this.paintContainer, false);
	this.paintContainer.hide();
	
	this.mainCanvas.setComponentId('mainCanvas');
	this.mainCanvas.setSize(this.targetView.getWidth(),this.targetView.getHeight());
	this.mainCanvas.resizeCanvas();
	this.mainCanvas.setStyleObj(style);
	this.paintContainer.addComponent(this.mainCanvas ,false);	
		
	this.cvContainer.setComponentId('cvContainer');
	this.cvContainer.setStyleObj(style);
	this.cvContainer.setSize(this.targetView.getWidth(),this.targetView.getHeight());
	this.paintContainer.addComponent(this.cvContainer, false);
	
	//가장 상단에 있게되는 캔버스
	this.canvas = new ACanvas();
	this.canvasItems[theApp.loginMgr.getUserId()] = this.canvas;
	this.canvas.init();
	this.ctx = this.canvas.ctx;

	this.canvas.setComponentId('myCanvas');
	this.canvas.setSize(this.targetView.getWidth(),this.targetView.getHeight());
	this.canvas.resizeCanvas();
	this.canvas.setStyleObj(style);
	this.paintContainer.addComponent(this.canvas ,false);	
	
	this.canvas.addEventListener('actionmove', this,'onCanvasActionMove');
	this.canvas.addEventListener('actionup', this,'onCanvasActionUp');
	this.canvas.addEventListener('actiondown', this, 'onCanvasActionDown');
	
	this.eraserBox.setSize(this.eraserSize,this.eraserSize );
	style = {"background-color":"rgba(0,0,0,0)","border":"1px solid",'display':'none'};
	this.eraserBox.setStyleObj(style);
	this.paintContainer.addComponent(this.eraserBox);
};

function Paint*usePaint(isUse)
{	
	if(isUse) 
	{
		this.paintContainer.show();
	}
	
	else
	{
		this.paintContainer.hide();
	}
};

function Paint*usePen(size)
{
	this.eraserBox.hide();
	
	this.isPen=true;
	this.isEraser=false;
	
	this.lineWidth= size ;
	this.point.lineWidth = this.lineWidth;
	this.ctx.lineWidth=this.lineWidth;
	
	this.ctx.beginPath();
};

function Paint*useEraser()
{
	this.isPen=false;
	this.isEraser=true;
};

function Paint*clearCanvas()
{
	this.ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
	this.mainCtx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
	for(var id in this.pointArrItems)
	{
		this.pointArrItems[id].splice(0, this.pointArrItems[id].length);
	}

	this.ctx.beginPath();
};

function Paint*reFreshEraserBox(x , y)
{
	var scaleSize = this.eraserSize;
	this.eraserBox.setPos(x - (scaleSize/2) , y - (scaleSize/2));
};

function Paint*onCanvasActionMove(comp, info, e) //무브
{
	//if(theApp.loginMgr.isClient())	 return;

	if(this.doublefinger) return;
	if(!this.isPen && !this.isEraser) return;
	
	var pos = {x:0, y:0};
	
	if(afc.isMobile)
	{	
		pos.x = e.touches[0].clientX - this.targetView.getPos().left - theApp.offsetX;
		pos.y = e.touches[0].clientY - this.targetView.getPos().top -  theApp.offsetY;
		
	}
	else
	{
		pos.x = e.offsetX;
		pos.y = e.offsetY;
	
	}
		if( e.which == 1 || e.touches.length == 1)
		{
			if(this.isPen)
			{	
				this.drawForLine(pos);
			}
			else if(this.isEraser)
			{	
				this.eraserBox.show();
				this.reFreshEraserBox(pos.x, pos.y);
				this.checkRemoveLine(pos.x, pos.y);
			}
		}
		else if(this.isEraser)
			this.eraserBox.hide();	
};

function Paint*onCanvasActionUp(comp, info, e) // 업
{	
	//if(theApp.loginMgr.isClient())		return;
	
	if(this.isEraser) this.eraserBox.hide();

	if(this.isEraser || !this.isPen || !this.point.begin) return;

	//this.pointArr.push(this.point);
	this.pointArrItems[theApp.loginMgr.getUserId()].push(this.point);
	
	//SUtil.sendJSONMessage('syncDrawPaint', {'func' : 'setPointArr', 'value':this.point});
	
	this.updateMainCanvas();
	
	SUtil.sendJSONMessage('syncDrawPaint', {'func' : 'syncMainCanvas', 'value':theApp.loginMgr.getUserId()});
	
};

function Paint*onCanvasActionDown(comp, info, e) // 마우스 down시 
{
	//if(theApp.loginMgr.isClient())		return;
	
	var pos = {x:0, y:0};
	
	if(afc.isMobile)
	{
		pos.x = e.touches[0].clientX - this.targetView.getPos().left -  theApp.offsetX;
		pos.y = e.touches[0].clientY-this.targetView.getPos().top - theApp.offsetY;
		
		if(e.touches[1]) this.doublefinger = true;
		else this.doublefinger = false;
	}
	else
	{
		pos.x = e.offsetX;
		pos.y = e.offsetY;
	}
	
	if(this.isEraser)
	{
		this.eraserBox.show();
		this.reFreshEraserBox(pos.x, pos.y);
		this.checkRemoveLine(pos.x, pos.y);
	}
	else return;
};

function Paint*drawForLine(pos)
{
	var id = theApp.loginMgr.getUserId();
	
	if(!this.isDraw)
	{
	  this.isDraw=true;
	  var begin = {x:pos.x, y:pos.y};
	  this.point.begin = begin;
	  this.ctx.moveTo(pos.x, pos.y);				
	}
				
	 var dot = { x:pos.x, y:pos.y };
	 this.point.dot.push(dot);
		
	 this.ctx.clearRect(0,0,this.canvas.getWidth(),this.canvas.getHeight());
	 this.ctx.beginPath();
				
	 this.ctx.lineCap = 'round';
	 this.ctx.lineJoin = 'round';
	
	 if(this.ctx.lineWidth >=6)
	 {
	 	this.ctx.strokeStyle =this.color + '59';
		this.point.color = this.color + '59';
	 }
	 else
	 {
		this.ctx.strokeStyle =this.color;
		this.point.color = this.color;
	 }
	 	
	 for(var i =0; i<this.point.dot.length; i++)
		 this.ctx.lineTo(this.point.dot[i].x, this.point.dot[i].y);
	
	 this.ctx.stroke();
	 
	 SUtil.sendJSONMessage('syncDrawPaint', {'func' : 'syncDraw','value':{ pos:pos, id:id }});

};

function Paint*reDrawing() // 다시그림
{ 
   this.mainCtx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
  
   for(var id in this.pointArrItems)
   {
		for(var i=0; i<this.pointArrItems[id].length; i++)
	   {	
			this.ctx.beginPath();
			this.ctx.moveTo(this.pointArrItems[id][i].begin.x , this.pointArrItems[id][i].begin.y );
	
			for(var j=0; j<this.pointArrItems[id][i].dot.length; j++)
			{	
				this.ctx.lineWidth=this.pointArrItems[id][i].lineWidth;
				this.ctx.lineCap = 'round';
				this.ctx.lineJoin = 'round';
				this.ctx.strokeStyle = this.pointArrItems[id][i].color;
				this.ctx.lineTo(this.pointArrItems[id][i].dot[j].x  ,this.pointArrItems[id][i].dot[j].y );

			}
			this.ctx.stroke();
			this.updateMainCanvas();
	   }
   }
};

function Paint*updateMainCanvas(id) //선을 다른캔버스에 옮겨그림
{
	this.mainCtx.save();
	this.mainCtx.drawImage(this.ctx.canvas,0,0);

	this.mainCtx.restore();
	
	this.ctx.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
	
	this.isDraw=false;
	this.point = { begin:null , dot:[], lineWidth:this.lineWidth, color:this.color };

};

function Paint*syncMainCanvas(id) //공통으로 쓰이는 maincanvas를 다른화면에서도 업데이트함
{	
	this.pointArrItems[id].push(this.pointItems[id]);
 
	this.pointItems[id] =  { begin:null , dot:[], lineWidth:this.lineWidth, color:this.color };
	var ctx = this.canvasItems[id].ctx;
	this.mainCtx.drawImage(ctx.canvas, 0, 0);
	ctx.clearRect(0, 0, this.canvasItems[id].getWidth(), this.canvasItems[id].getHeight());

};

function Paint*checkRemoveLine(x ,y) //지울 선을 체크
{
	//console.log(Object.keys(this.pointArrItems).length);
	if(Object.keys(this.pointArrItems).length.length<=0) return ;
	
	var scaleSize = this.eraserSize;
	
	var touchPoint =[
					  {dot1:{x:x-(scaleSize/2) , y:y-(scaleSize/2)}, // leftLine
							  dot2:{x:x-(scaleSize/2) , y:y+(scaleSize/2)}}  
					  ,
					   {dot1:{x:x+(scaleSize/2) , y:y-(scaleSize/2)}, //rightLine
							   dot2:{x:x+(scaleSize/2) , y:y+(scaleSize/2)}}
					  ,
					   {dot1:{x:x-(scaleSize/2) , y:y-(scaleSize/2)}, //topLine
							  dot2:{x:x+(scaleSize/2) , y:y-(scaleSize/2)}} 
					  ,
					   {dot1:{x:x-(scaleSize/2) , y:y+(scaleSize/2)}, //bottomLine
							  dot2:{x:x+(scaleSize/2) , y:y+(scaleSize/2)}} 
					];
	//dot Info				
	var left = x-(scaleSize/2); 
	var right = x+(scaleSize/2);
	var top = y-(scaleSize/2);
	var bottom = y+(scaleSize/2);
	
	
	for(var id in this.pointArrItems)
	{
	
		for(var i=0; i<this.pointArrItems[id].length; i++)
		{
			for(var j=0; j<this.pointArrItems[id][i].dot.length; j++)
			{	
			
				var length = j+1;
				var isCheck = false;

				if(length >=this.pointArrItems[id][i].dot.length) break; //dot의 최대를 넘어서면 break
				
				//begin end 선분
				var begin = { x: this.pointArrItems[id][i].dot[j].x  , y:this.pointArrItems[id][i].dot[j].y} ;
				var end = { x: this.pointArrItems[id][i].dot[j+1].x , y: this.pointArrItems[id][i].dot[j+1].y} ;
				
				for(var k=0; k<touchPoint.length; k++)
				{	
					// 두 값이 0일때 처리 해야함

					//지우개박스 안에있다(예외처리)
					if(begin.x >= left && begin.x <= right && begin.y >= top && begin.y <= bottom) 
							isCheck=true;
					//일반적인 처리 (선이 교차하는가)
					else if(this.CCW(begin,end,touchPoint[k].dot1)*this.CCW(begin,end,touchPoint[k].dot2) <0 && 											this.CCW(touchPoint[k].dot1,touchPoint[k].dot2,begin)*this.CCW(touchPoint[k].dot1,touchPoint[k].dot2,end)<0)
							isCheck=true;
					

					if(isCheck) break; //찾았으면 break
				}
				if(isCheck) // 선택된 선을 지우고 당겨진 배열로 이동함
				{		
					this.pointArrItems[id].splice(i,1);
					this.reDrawing();
					SUtil.sendJSONMessage('syncDrawPaint', {'func' : 'removePointIndex', 'value':{id:id, index:i}});

					i-=1;
					break;
				}
			}
		}
	}
};

function Paint*CCW(dot1,dot2,dot3) //외적으로 선이 교차했는지 체크함
{
	var result = (dot2.x  - dot1.x) * (dot3.y - dot1.y) - (dot2.y - dot1.y) * (dot3.x - dot1.x);
	
	if(result<0) return 1;
	else if(result>0) return -1;
	else return 0;
};

//setter
function Paint*setColor(colorName)
{
	this.color= colorName;
	this.ctx.strokeStyle=this.color;
	this.point.color = this.color;
	this.ctx.beginPath();
};
function Paint*setEraserSize(size)
{ 
	this.eraserSize= size; 
	this.eraserBox.setSize(this.eraserSize,this.eraserSize );
};

function Paint*setBeginPoint(begin)
{
	this.ctx.moveTo(begin.x, begin.y);
};

function Paint*setDotPoint(dot)
{	
	this.ctx.lineTo(dot.x, dot.y);
	this.ctx.stroke();
};

function Paint*setPointArr(point)
{
	this.pointArr.push(point);
};

function paint*setOffset(posX,posY) { this.offset.x = posX; this.offset.y = posY;};
function paint*setSclOffset(posX,posY) { this.sclOffset.x = posX; this.sclOffset.y = posYl; };

//getter
function Paint*getColor(){ return this.color; };
function Paint*paintIsUse(){return this.paintContainer.isShow(); };
function Paint*getPointArr(){ return this.pointArr; };


function Paint*removePointIndex(value)
{
	var id = value.id;
	var index = value.index;
	
	this.pointArrItems[id].splice(index, 1);
	//this.pointArr.splice(index,1);
	this.reDrawing();
};

function Paint*syncDraw(value)
{
	var id = value.id;

	var pos = value.pos;
	var ctx = this.canvasItems[id].ctx;
	
	ctx.lineWidth = this.lineWidth;
	this.pointItems[id].lineWidth = ctx.lineWidth;
	
	this.pointItems[id].dot.push(pos);
				
	ctx.moveTo(this.pointItems[id].dot[0].x, this.pointItems[id].dot[0].my);	
	this.pointItems[id].begin = {x:this.pointItems[id].dot[0].x, my:this.pointItems[id].dot[0].y };
	
	ctx.clearRect(0,0,this.canvasItems[id].getWidth(),this.canvasItems[id].getHeight());
	ctx.beginPath();
			
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	
	 if(ctx.lineWidth >=6)
	 {
	 	ctx.strokeStyle =this.color + '59';
		this.pointItems[id].color = this.color + '59';
	 }
	 else
	 {
		ctx.strokeStyle =this.color;
		this.pointItems[id].color = this.color;
	 }
	 	
	 for(var i =0; i<this.pointItems[id].dot.length; i++)
		ctx.lineTo(this.pointItems[id].dot[i].x, this.pointItems[id].dot[i].y);
	
	ctx.stroke();
};