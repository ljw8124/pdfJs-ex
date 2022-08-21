
/**
Constructor
Do not call Function in Constructor.
*/
class expdfjsApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function expdfjsApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	

};

function expdfjsApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
