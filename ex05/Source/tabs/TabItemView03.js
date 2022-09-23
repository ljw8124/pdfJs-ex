/**
Constructor
*/
class TabItemView03 extends AView
{
	constructor()
	{
		super()
		
		this.paint = null;
	
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

// 		this.url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
		this.url = './Assets/pdffiles/compressed.tracemonkey-pldi-09.pdf';
		
		this.canvasEle = this.pdf_canvas.element;
		
		this.currentPDF = {};
		
		this.pageRendering = false;
		this.pageNumPending = null;
		
		this.paint = new Paint(this.mainView);
	}
	
	onInitDone()
	{
		super.onInitDone();
		
		this.resetCurrentPDF(this.url);

		const thisObj = this;
		
		const loadingTask = pdfjsLib.getDocument(this.currentPDF.fileUrl);
		
		loadingTask.promise.then(pdfDoc => {
		
			thisObj.currentPDF.file = pdfDoc;
			thisObj.currentPDF.countOfPages = pdfDoc.numPages
			
			thisObj.renderPage(thisObj.currentPDF.currentPage);
			
			thisObj.totalNum.setText(" / " + thisObj.currentPDF.countOfPages);
			
		});
		
// 		this.zoomPinchSpread();
		
	}
	
	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);
		
		if(!isFirst) this.renderPage(this.currentPDF.currentPage);
		
		
	}
	
	//default setting
	resetCurrentPDF(url)
	{
		//TODO: default option 추가설정 필요
		const currentPDF = {
			file: null,
			fileUrl: url,
			countOfPages: 0,
			currentPage: 1,
			
			scale: 1,
		}
		this.currentPDF = currentPDF;
	}
	
	renderPage(num)
	{
		const thisObj = this;
		
		const canvas = this.canvasEle;
		const ctx = canvas.getContext('2d');
		
		this.scaleSize.setText(Math.floor(this.currentPDF.scale * 100) + "%");
		this.pageRendering = true;
		
		this.currentPDF.file.getPage(num).then(page => {
		
			const viewport = page.getViewport({scale: this.currentPDF.scale});
			
			const outputScale = window.devicePixelRatio || 1;
			
			canvas.width = Math.floor(viewport.width * outputScale);
			canvas.height = Math.floor(viewport.height * outputScale);
			
			canvas.style.width = Math.floor(viewport.width) + "px";
			canvas.style.height =  Math.floor(viewport.height) + "px";
			
			var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
			
			const renderContext = {
				canvasContext: ctx,
				transform: transform,
				viewport: viewport
			};
			const renderTask = page.render(renderContext);
			
			renderTask.promise.then(() => {
			
				thisObj.pageRendering = false;
				
				if(thisObj.pageNumPending !== null) {
					thisObj.renderPage(thisObj.pageNumPending);
					thisObj.pageNumPending = null;
				}
				console.log('Page rendered');
			});
			
		});
		
// 		this.currentNum.element.textContent = num;
		this.currentNum.setText(num);
	}
	
	queueRenderPage()
	{
		var num = this.currentPDF.currentPage;
		
		if(this.pageRendering) {
			this.pageNumPending = num;
		} else {
			this.renderPage(num);
		}
		
	}
	
	onPrevBtnClick(comp, info, e)
	{
		var pdfPage = this.currentPDF;
		if(pdfPage.currentPage <= 1) return;
		
		pdfPage.currentPage--;
		
		this.queueRenderPage();
	}
	
	onNextBtnClick()
	{
		var pdfPage = this.currentPDF;
		if(pdfPage.currentPage >= pdfPage.countOfPages) return;
		
		pdfPage.currentPage++;
		
		this.queueRenderPage();
	}
	
	increaseScale()
	{
		this.setScale(0.1);
		
	}
	
	decreaseScale()
	{
		this.setScale(-0.1);
		
	}
	
	setScale(ratio)
	{
		var scaleNum = this.scaleSize.getText();
	
		if(ratio > 1 || ratio < -1) return;
		if(scaleNum <= 0) return;	//min
		if(scaleNum > 300) return;	//max
		
		this.currentPDF.scale += ratio;
		
		this.queueRenderPage();
	}
	
	zoomPinchSpread()
	{
		var tabView = this.TabItemView03;
		
		function getDist(p1, p2) { return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2)); }
		
		this.lastDist = null;
		
		var thisObj = this;
		
		var currentPdf = this.currentPDF;
		
		this.touchMove = tabView.bindEvent(AEvent.ACTION_MOVE, function(e)
		{
			if(e.targetTouches.length != 2) return;
			
			var touch1 = e.targetTouches[0];
			var touch2 = e.targetTouches[1];
			
			var dist = Math.floor( getDist({ x: touch1.pageX, y: touch1.pageY }, { x: touch2.pageX, y: touch2.pageY }) );
			
			if(!this.lastDist) {
				this.lastDist = dist;
				return;
			}
			
			var ratio = dist / this.lastDist - 1;
			
			thisObj.setScale(ratio);

			this.lastDist = dist;
			
		});
		
		this.touchEnd = tabView.bindEvent(AEvent.ACTION_UP, function(e)
		{
			if(e.targetTouches.length == 0) return;
			
			this.listDist = null;
		});
	}
}

window["TabItemView03"] = TabItemView03
