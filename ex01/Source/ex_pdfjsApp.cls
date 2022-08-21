
/**
Constructor
Do not call Function in Constructor.
*/
class ex_pdfjsApp()
{
	super();

	//TODO:edit here

}
extends AApplication;


function ex_pdfjsApp*onReady()
{
	super.onReady();

	this.setMainContainer(new APage('main'));
	this.mainContainer.open('Source/MainView.lay');

	//TODO:edit here

};

function ex_pdfjsApp*unitTest(unitUrl)
{
	//TODO:edit here

	this.onReady();

	super.unitTest(unitUrl);
};
