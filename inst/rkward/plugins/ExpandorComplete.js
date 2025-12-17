// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(tidyr)\n");
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    var func = getValue("exp_func");
    var vars = getValue("exp_vars");

    var first_var = vars.split("\n")[0];
    var df = first_var.split("$")[0];

    var args = vars.replace(/\n/g, ", ");

    echo("expand_result <- tidyr::" + func + "(" + df + ", " + args + ")\n");
  
}

function printout(is_preview){
	// printout the results
	new Header(i18n("Expand or Complete results")).print();

    var save_name = getValue("exp_save_obj.objectname");
    echo("rk.header(\"Table Expanded/Completed: " + save_name + "\", level=3);\n");
  
	//// save result object
	// read in saveobject variables
	var expSaveObj = getValue("exp_save_obj");
	var expSaveObjActive = getValue("exp_save_obj.active");
	var expSaveObjParent = getValue("exp_save_obj.parent");
	// assign object to chosen environment
	if(expSaveObjActive) {
		echo(".GlobalEnv$" + expSaveObj + " <- expand_result\n");
	}

}

