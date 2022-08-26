
class MainView()
{
	super();

	//TODO:edit here

}
extends AView;


function MainView*init(context, evtListener)
{
	super.init(context, evtListener);
	
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'Assets/pdfjs/pdf.worker.js';
	
	this.tabview.addTab('HelloWorld', 'Source/tabs/TabItemView01.lay', 'tab01');
	this.tabview.addTab('HelloWorldB64', 'Source/tabs/TabItemView02.lay', 'tab02');
	this.tabview.addTab('HelloPrevNext', 'Source/tabs/TabItemView03.lay', 'tab03');
	
};

function MainView*onInitDone()
{
	super.onInitDone();
		
	
	this.tabview.selectTabById('tab03');
	
		

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};
