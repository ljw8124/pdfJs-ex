
/**
Constructor
Do not call Function in Constructor.
*/
class MainView()
{
	super();

	//TODO:edit here

}
extends AView;


function MainView*init(context, evtListener)
{
	super.init(context, evtListener);

	this.tabView.addTab('ex01', 'Source/ex01/ex01.lay', 'ex01');
	this.tabView.addTab('ex02', 'Source/ex02/ex02.lay', 'ex02');
	this.tabView.addTab('ex03', 'Source/ex03/ex03.lay', 'ex03');
};

function MainView*onInitDone()
{
	this.tabView.selectTabByIndex(0);
};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};
