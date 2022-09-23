/**
Constructor
*/
class Paint
{
	constructor(targetView)
	{
		this.targetView = targetView;			//호출한 화면의 메인뷰
		
		this.canvasView = null;					//캔버스 감싼 뷰
		this.canvas = null;						//캔버스
		this.ctx = null;						//캔버스 컨텍스트
		
		this.toolCanvas = null;					//도구 캔버스
		this.toolCtx = null;					//도구 캔버스 컨텍스트
		
		this.scale = 1;							//기본 scale
		this.lineWidth = 3;						//기본 펜 두깨
		this.eraseSize = 50;					//기본 erase 크기
		this.color = '#000000';					//기본 펜 색깔
		this.neonLineWidth = 10;				//기본 neon 두께
		this.neonColor = 'rbg(244, 203, 47';	//기본 neon 색깔
		
		this.tool = 'pen';						//pen, erase, neon
		this.isDrawing = false;					//현재 드로잉중 여부
		this.drawInfo = null;					//현재 드로잉 정보
		
		this.isSingleTouch = false
		
// 		this.isActive = null;					//현재 페이지 사용여부
		
		this.init();
		
	}
	
	 init()
	{
		//캔버스 뷰
		const canvasView = new AView();
		canvasView.init();
		canvasView.setComponentId('canvasView');
		canvasView.setStyleObj({
			"left": '0px',
            "right": '0px',
            "width": '100%',
            "height": '100%',
            "background-color": 'transparent',
            "position": 'absolute',
            "overflow": 'auto',
            "z-index": '2',
            "border": '2px solid black'
		});
		
		this.canvasView = canvasView;
		
		this.targetView.addComponent(this.canvasView);
		
		//그림 그릴 캔버스
		const canvas = new ACanvas();
		canvas.init();
		canvas.setComponentId('paint_canvas');
		canvas.setStyleObj({
			"left": '0px',
            "right": '0px',
            "width": '100%',
            "height": '100%',
            "background-color": 'transparent',
            "position": 'absolute',
			"overflow": 'auto'
		});
		
		canvas.addEventListener('actiondown', this, 'onCanvasActionDown');
		canvas.addEventListener('actionmove', this, 'onCanvasActionMove');
        canvas.addEventListener('actionup', this, 'onCanvasActionUp');
		
		this.canvas = canvas;
		this.ctx = this.canvas.ctx;
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		
		this.canvasView.addComponent(this.canvas);
		
		//도구 캔버스
		const toolCanvas = new ACanvas();
		toolCanvas.init();
		toolCanvas.setComponentId('tool_canvas');
		toolCanvas.setStyleObj({
			"left": '0px',
            "right": '0px',
            "width": '100%',
            "height": '100%',
            "background-color": 'rgba(0, 0, 0, 0)',
            "pointer-events": 'none',
            "position": 'absolute'
		});
		
		this.toolCanvas = toolCanvas;
		this.toolCtx = this.toolCanvas.ctx;
		
		this.canvasView.addComponent(this.toolCanvas);
		
		this.canvasView.hide();
		
	}
	
	getRealPos(pos)
	{
		const scrollTop = this.canvasView.$ele.scrollTop();
		const targetViewPos = this.targetView.element.getBoundingClientRect();
		
		return {
			x: pos.x - targetViewPos.left,
			y: pos.y - targetViewPos.top + scrollTop
		}
	}
	
	onCanvasActionDown(comp, info, e)
	{
		e.stopPropagation();
		
		this.isDrawing = true;
		
		//권한설정 필요
		
		if(e.targetTouches.leghth > 1) this.isSingleTouch = false;
		else this.isSingleTouch = true;
		
		let pos = {
			x: afc.isMobile ? e.touches[0].clientX : e.clientX,
			y: afc.isMobile ? e.touches[0].clientY : e.clientY
		}
		
		let realPos = this.getRealPos(pos);
		
		this.isDrawStart = true;
		
		this.doDraw(realPos, this.isDrawStart)
		
		
	}
	
	onCanvasActionMove(comp, info, e)
	{``
		e.stopPropagation();
		
		if(!this.isSingleTouch || !this.isDrawing) return;
		
		let pos = {
			x: afc.isMobile ? e.touches[0].clientX : e.clientX,
			y: afc.isMobile ? e.touches[0].clientY : e.clientY
		}
		
		let realPos = this.getRealPos(pos);
		
		//그리기 시작
		this.doDraw(realPos);
		
	}
	
	onCanvasActionUp(comp, info, e)
	{
		e.stopPropagation();
		
		this.isDrawing = false;
	}
	
	doDraw(pos, isDrawStart)
	{
		switch(this.tool)
		{
			case 'pen': 
				if(isDrawStart) {
					this.ctx.beginPath();
					this.ctx.moveTo(pos.x, pos.y);
				}
				
				this.ctx.lineTo(pos.x, pos.y);
				
				this.ctx.stroke();
				
				break;
		}
		
	}
	
}