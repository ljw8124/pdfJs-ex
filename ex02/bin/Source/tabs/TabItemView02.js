/**
Constructor
*/
class TabItemView02 extends AView
{
	constructor()
	{
		super()

		//TODO:edit here

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//base64 인코딩데이터 -> 디코딩
		this.pdfData = atob(
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
		
		this.canvasEle = this.the_canvas.element;

	}

	onInitDone()
	{
		super.onInitDone()

		const thisObj = this;
		
		const loadingTask = pdfjsLib.getDocument({data: this.pdfData});
		
		loadingTask.promise.then(pdf => {
		
			console.log('PDF loaded');
			
			const pageNumber = 1;
			
			pdf.getPage(pageNumber).then(page => {
				console.log('Page loaded');
				
				const scale = 2;
				const viewport = page.getViewport({scale: scale});
				console.log(viewport);
				const canvas = thisObj.canvasEle;
				const context = canvas.getContext('2d');
				
				canvas.height = viewport.height;
				canvas.width = viewport.width;
				
				const renderContext = {
					canvasContext: context,
					viewport: viewport
				};
				
				const renderTask = page.render(renderContext);
				renderTask.promise.then(() => {
					console.log('Page rendered');
				});
				
			});
		}, reason => console.log(reason));

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}

}

window["TabItemView02"] = TabItemView02