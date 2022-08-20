
/**
Constructor
Do not call Function in Constructor.
*/
function MainView()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MainView, AView);


MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	//url 모질라 서버에서 로드
	this.url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';
	
	//script 태그에서 바로가기 생성
	this.pdfjsLib = window['pdfjs-dist/build/pdf'];

};

MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);

	//워커설정
	this.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.15.349/build/pdf.worker.min.js';
	
	this.activeTab();
};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};

MainView.prototype.activeTab = function()
{
	var loadingTask = this.pdfjsLib.getDocument(this.url);
	
	loadingTask.promise.then(pdf => {
		console.log("PDF loaded");
		
		var pageNumber = 1;
		pdf.getPage(pageNumber).then(page => {
			console.log('Page loaded');
			
			var scale = 1.5;
			var viewport = page.getViewport({scale: scale});
			var outputScale = window.devicePixelRatio || 1;
			
			var canvas = this.the_canvas.element;
			var context = canvas.getContext('2d');
			
			//캔버스 크기 조정
			canvas.height = Math.floor(viewport.height * outputScale);
			canvas.width = Math.floor(viewport.width * outputScale);
			canvas.style.height = Math.floor(viewport.height) + "px";
			canvas.style.width = Math.floor(viewport.width) + "px";
			
			var transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
			
			var renderContext = {
				canvasContext: context,
				transform: transform,
				viewport: viewport
			};
			var renderTask = page.render(renderContext);
			renderTask.promise.then(() => {
				console.log('Page rendered');
			});
		});
	}, reason => console.error(reason));
};