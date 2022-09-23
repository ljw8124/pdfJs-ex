/**
Constructor
*/
class TabItemView04 extends AView
{
	constructor()
	{
		super()
		
		//TODO:edit here
	
	}

	init(context, evtListener)
	{
		super.init(context, evtListener)
		this.url = "Assets/pdffiles/compressed.tracemonkey-pldi-09.pdf";
		this.page_number = 1;
		this.page_scale = 1;
		this.SVG_NS = "http://www.w3.org/2000/svg";
		this.container_ele = this.pageContainer.element;

	}
	
	onInitDone()
	{
		super.onInitDone();
		
		this.pageLoaded();
		
	}
	
	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst);
		
		
		
	}
	
	buildSVG(viewport, textContent)
	{
		const thisObj = this;
		
		const svg = document.createElementNS(thisObj.SVG_NS, "svg:svg");
		svg.setAttribute('width', viewport.width + "px");
		svg.setAttribute('height', viewport.height + "px");
		svg.setAttribute("font-size", 1);
		
		textContent.items.forEach(function(textItem) {
			const tx = pdfjsLib.Util.transform(
				pdfjsLib.Util.transform(viewport.transform, textItem.transform),
				[1, 0, 0, -1, 0, 0]
			);
			const style = textContent.styles[textItem.fontName];
			
			const text = document.createElementNS(thisObj.SVG_NS, "svg:text");
			text.setAttribute("transform", "matrix(" + tx.join(" ") + ")");
			text.setAttribute("font-family", style.fontFamily);
			text.textContent = textItem.str;
			svg.append(text);
		});
		return svg;
	}
	
	async pageLoaded()
	{
		var thisObj = this;
		const loadingTask = pdfjsLib.getDocument({url: thisObj.url});
		const pdfDocument = await loadingTask.promise;
		const page = await pdfDocument.getPage(thisObj.page_number);
		const viewport = page.getViewport({scale: thisObj.page_scale});
		const textContent = await page.getTextContent();
		
		const svg = thisObj.buildSVG(viewport, textContent);
		
		this.container_ele.append(svg);
		
		page.cleanup();
	}
	
	
}

window["TabItemView04"] = TabItemView04
