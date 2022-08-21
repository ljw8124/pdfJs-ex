
/**
Constructor
Do not call Function in Constructor.
*/
class ex03()
{
	super();

	//TODO:edit here

}
extends AView;


function ex03*init(context, evtListener)
{
	super.init(context, evtListener);

	//TODO:edit here

};

function ex03*onInitDone()
{
	super.onInitDone();

};

function ex03*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	this.activePdf();

};

function ex03*activePdf()
{
	var thisObj = this;
	
	var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf';
// 	var url = './Assets/compressed.tracemonkey-pldi-09.pdf';

	//로컬에서 작동안됨
// 	var url = 'C:\\Users\\asoosoft10\\Documents\\SpiderGenWorkspace\\pdfJs-ex\\Assets\\compressed.tracemonkey-pldi-09.pdf';
	
	var pdfjsLib = window['pdfjs-dist/build/pdf'];
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.15.349/build/pdf.worker.min.js';
	
	this.pdfDoc = null;
	this.pageNum = 1;
	this.pageRendering = false;
	this.pageNumPending = null;
	
	pdfjsLib.getDocument(url).promise.then(pdfPages => {
		this.pdfDoc = pdfPages;
		this.pageCountLbl.setText(" / " + this.pdfDoc.numPages);

		this.renderPage(this.pageNum);
	});
		
};

function ex03*renderPage(num)
{
	var scale = 0.8,
		canvas = this.exCanvas,
		ctx = canvas.ctx;
		
	this.pageRendering = true;
	this.pdfDoc.getPage(num).then(page => {
		var viewport = page.getViewport({ scale: scale });
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		
		var renderContext = {
			canvasContext: ctx,
			viewport: viewport
		};
		var renderTask = page.render(renderContext);
		
		renderTask.promise.then(() => {
			this.pageRendering = false;
			if(this.pageNumPending != null) {
				this.renderPage(this.pageNumPending);
				this.pageNumPending = null;
			}
		});
	});
	this.pageNumLbl.setText(num);
};

function ex03*queueRenderPage(num)
{
	if(this.pageRendering) this.pageNumPending = num;
	else this.renderPage(num);
};

function ex03*onPrevBtnClick(comp, info, e)
{
	if(this.pageNum <= 1 ) return;
	
	this.pageNum--;
	this.queueRenderPage(this.pageNum);
};
function ex03*onNextBtnClick(comp, info, e)
{
	if(this.pageNum > this.pdfDoc.numPages) return;
	if(this.pageNum == this.pdfDoc.numPages) {
		console.log('last page....');
		alert('마지막 페이지 입니다.');
		return;
	}
	
	this.pageNum++;
	this.queueRenderPage(this.pageNum);
	
};
