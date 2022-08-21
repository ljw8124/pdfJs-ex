
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
	super.onInitDone();

	//TODO:edit here

};

function MainView*onActiveDone(isFirst)
{
	super.onActiveDone(isFirst);

	//TODO:edit here

};

function MainView*onToBtnClick(comp, info, e)
{
	this.tabView.selectTabById(comp.compId);

};

function MainView*onHideBtnClick(comp, info, e)
{
	var btn = this.hideBtn;
	var btnGroup = this.headerView.findCompByGroup('btn');
	
	if(btn.getText() == 'HIDE') {
		btn.setText('SHOW');
		btnGroup.forEach(btn => {
			btn.hide();
		});
	} else {
		btn.setText('HIDE');
		btnGroup.forEach(btn => {
			btn.show();
		});
	}

};
