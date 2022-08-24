
function MainView()
{
	AView.call(this);

	//TODO:edit here

}
afc.extendsClass(MainView, AView);


MainView.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'Assets/pdfjs/pdf.worker.js';
	
	this.tabview.addTab('HelloWorld', 'Source/tabs/TabItemView01.lay', 'tab01');
	this.tabview.addTab('HelloWorldB64', 'Source/tabs/TabItemView02.lay', 'tab02');
	this.tabview.addTab('HelloPrevNext', 'Source/tabs/TabItemView03.lay', 'tab03');
	
};

MainView.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
		
	
	this.tabview.selectTabById('tab03');
	
		

};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};
