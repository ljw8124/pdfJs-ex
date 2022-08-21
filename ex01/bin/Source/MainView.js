
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

	this.tabView.addTab('ex01', 'Source/ex01/ex01.lay', 'ex01');
	this.tabView.addTab('ex02', 'Source/ex02/ex02.lay', 'ex02');
	this.tabView.addTab('ex03', 'Source/ex03/ex03.lay', 'ex03');
};

MainView.prototype.onInitDone = function()
{
	this.tabView.selectTabByIndex(0);
};

MainView.prototype.onActiveDone = function(isFirst)
{
	AView.prototype.onActiveDone.call(this, isFirst);

	//TODO:edit here

};
