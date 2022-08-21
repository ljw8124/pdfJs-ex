
/**
Constructor
Do not call Function in Constructor.
*/
class ex02()
{
	super();

	//TODO:edit here

}
extends AView;


function ex02*init(context, evtListener)
{
	super.init(context, evtListener);
	
};

function ex02*onInitDone()
{
	super.onInitDone();

};

function ex02*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	this.activePdf();

};

function ex02*activePdf()
{
	var thisObj = this;
	
	//atob 함수로 base64 인코딩 문자열데이터를 디코딩
	var pdfData = atob(
		'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
		'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
		'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
		'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
		'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
		'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
		'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
		'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
		'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
		'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
		'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
		'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
		'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'
	);
	
	var pdfjsLib = window['pdfjs-dist/build/pdf'];
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.15.349/build/pdf.worker.min.js';
	
	var loadingTask = pdfjsLib.getDocument({ data: pdfData });
	loadingTask.promise.then(pdf => {
		console.log('pdf loaded...');
		
		//page 가져오기
		var pageNumber = 1;
		pdf.getPage(pageNumber).then(page => {
			console.log('page loaded...');
			
			var scale = 1.5;
			var viewport = page.getViewport({ scale: scale });
			
			//캔버스 그리기
			var canvas = thisObj.exCanvas;
			var context = canvas.ctx;
			
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			
			//렌더링
			var renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			var renderTask = page.render(renderContext);
			renderTask.promise.then(() => {
				console.log('page rendered...');
			});
		});	
	}, reason => {
		conosle.error(reason);
	});
	
};
