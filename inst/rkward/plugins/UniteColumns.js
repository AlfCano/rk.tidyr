// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(tidyr)\n");
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    var vars = getValue("unite_vars");
    var new_col = getValue("unite_colname");
    var sep = getValue("unite_sep");
    var remove = getValue("unite_remove");
    var save_name = getValue("unite_save_obj.objectname");

    // Guess the dataframe from the first variable (format: df$col)
    var first_var = vars.split("\n")[0];
    var df = first_var.split("$")[0];

    // Construct args
    var args = "col = \"" + new_col + "\", " + vars.replace(/\n/g, ", ");
    args += ", sep = \"" + sep + "\"";

    if (remove != "1") {
        args += ", remove = FALSE";
    }

    echo("unite_result <- tidyr::unite(data = " + df + ", " + args + ")\n");
  
}

function printout(is_preview){
	// printout the results
	new Header(i18n("Unite Columns results")).print();

    var save_name = getValue("unite_save_obj.objectname");
    echo("rk.header(\"Columns United into: " + save_name + "\", level=3);\n");
  
	//// save result object
	// read in saveobject variables
	var uniteSaveObj = getValue("unite_save_obj");
	var uniteSaveObjActive = getValue("unite_save_obj.active");
	var uniteSaveObjParent = getValue("unite_save_obj.parent");
	// assign object to chosen environment
	if(uniteSaveObjActive) {
		echo(".GlobalEnv$" + uniteSaveObj + " <- unite_result\n");
	}

}

