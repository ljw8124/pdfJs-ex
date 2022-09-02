/**
Constructor
*/
class TabItemView01 extends AView
{
	constructor()
	{
		super()
		
		this.url = null;
		this.canvasEle = null;
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)
		
		this.url = 'Assets/pdffiles/helloworld.pdf';
		
		this.canvasEle = this.the_canvas.element;
		
	}

	onInitDone()
	{
		super.onInitDone();
		
		const thisObj = this;
		
		const loadingTask = pdfjsLib.getDocument(this.url);
		
		loadingTask.promise.then(function(pdf)
		{
			console.log('PDF loaded');
			
			const pageNumber = 1;
			
			pdf.getPage(pageNumber).then(function(page){
				
				console.log('Page loaded');
								
				const scale = 1.5;
    			const viewport = page.getViewport({scale: scale});
				const outputScale = window.devicePixelRatio || 1;
console.log(viewport);
				const canvas = thisObj.canvasEle;
				const context = canvas.getContext('2d');
				
canvas.width = Math.floor(viewport.width * outputScale);
canvas.height = Math.floor(viewport.height * outputScale);
canvas.style.width = Math.floor(viewport.width) + "px";
canvas.style.height =  Math.floor(viewport.height) + "px";

var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

				// Render PDF page into canvas context
				const renderContext = {
					canvasContext: context,
					transform: transform,
					viewport: viewport
				};
				
				const renderTask = page.render(renderContext);
				renderTask.promise.then(function () {
				  	console.log('Page rendered');
				});
				
				
				
			});
			
		});
		
	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

}

window["TabItemView01"] = TabItemView01