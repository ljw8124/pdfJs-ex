
/**
Constructor
Do not call Function in Constructor.
*/
class ex01()
{
	super();

	//TODO:edit here

}
extends AView;


function ex01*init(context, evtListener)
{
	super.init(context, evtListener);

};

function ex01*onInitDone()
{
	super.onInitDone();
	
};

function ex01*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	this.activePdf();

};

function ex01*activePdf()
{
	var thisObj = this;
	var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
	
	var pdfjsLib = window['pdfjs-dist/build/pdf'];
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.15.349/build/pdf.worker.min.js';
	
	var loadingTask = pdfjsLib.getDocument(url);
	loadingTask.promise.then(pdf => {
		console.log("pdf loaded...");
		
		var pageNumber = 1;
		pdf.getPage(pageNumber).then(page => {
			console.log("page loaded...");
			
			var scale = 1.5;
			var viewport = page.getViewport({scale: scale});
			
			var canvas = thisObj.exCanvas;
			var context = canvas.ctx;
			
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			//렌더링
			var renderTask = page.render(renderContext);
			renderTask.promise.then(() => {
				console.log("page rendered...");
			});
		});
	}, reason => {
		console.error(reason);
	});
	
};
