/**
Constructor
*/
class TabItemView03 extends AView
{
	constructor()
	{
		super()
		
		//TODO:edit here
	
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

// 		this.url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
		this.url = './Assets/pdffiles/compressed.tracemonkey-pldi-09.pdf';
		
		this.canvasEle = this.the_canvas.element;
		
		this.currentPDF = {};
		
		this.pageRendering = false;
		this.pageNumPending = null;
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
			
			if(theApp.isMobile) console.error('mobile');
			
			canvas.width = Math.floor(viewport.width);
			canvas.height = Math.floor(viewport.height);
			
			canvas.style.width = Math.floor(viewport.width) + "px";
			canvas.style.height =  Math.floor(viewport.height) + "px";
			
			const renderContext = {
				canvasContext: ctx,
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
		this.currentPDF.scale += 0.1;
		
		this.queueRenderPage();
		
	}
	
	decreaseScale()
	{
		this.currentPDF.scale -= 0.1;
		
		this.queueRenderPage();
	}


	onAView1Swipe(comp, info, e)
	{

		console.log(comp);
		console.log(info);
		console.log(e);
	}
}
window["TabItemView03"] = TabItemView03

;
