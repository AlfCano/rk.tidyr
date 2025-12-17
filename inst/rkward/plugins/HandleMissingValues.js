// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(tidyr)\n");
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    var func = getValue("na_func");
    var vars = getValue("na_vars");
    var fill_dir = getValue("na_fill_dir");
    var replace_val = getValue("na_replace_val");

    var first_var = vars.split("\n")[0];
    var df = first_var.split("$")[0];

    var args = "";

    if (func == "drop_na") {
        args = vars.replace(/\n/g, ", ");
        echo("missing_result <- tidyr::drop_na(" + df + ", " + args + ")\n");
    }
    else if (func == "fill") {
        args = vars.replace(/\n/g, ", ");
        echo("missing_result <- tidyr::fill(" + df + ", " + args + ", .direction = \"" + fill_dir + "\")\n");
    }
    else if (func == "replace_na") {
        echo("missing_result <- tidyr::replace_na(" + df + ", replace = " + replace_val + ")\n");
    }
  
}

function printout(is_preview){
	// printout the results
	new Header(i18n("Handle Missing Values results")).print();

    var func = getValue("na_func");
    var save_name = getValue("na_save_obj.objectname");
    echo("rk.header(\"Missing Values Handled (" + func + "): " + save_name + "\", level=3);\n");
  
	//// save result object
	// read in saveobject variables
	var naSaveObj = getValue("na_save_obj");
	var naSaveObjActive = getValue("na_save_obj.active");
	var naSaveObjParent = getValue("na_save_obj.parent");
	// assign object to chosen environment
	if(naSaveObjActive) {
		echo(".GlobalEnv$" + naSaveObj + " <- missing_result\n");
	}

}

