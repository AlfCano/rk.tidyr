// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(tibble)\n");
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    var mode = getValue("rn_mode");
    var col_var = getValue("rn_input_var");
    var new_name = getValue("rn_input_text");

    // Extract DF name
    var df = "";
    if (col_var) {
        df = col_var.split("$")[0];
    }

    if (df == "") {
       // Logic to handle case where no var is selected in r2c mode would require a dedicated df selector.
       // For now, we assume user selects a var to contextually pick the DF.
       echo("stop(\"Please select a variable from the target dataframe to identify the object.\")\n");
    } else {
        if (mode == "r2c") {
            echo("tibble_result <- tibble::rownames_to_column(" + df + ", var = \"" + new_name + "\")\n");
        } else {
            // tibble::column_to_rownames(df, var = "colname")
            // extracting clean colname from df$colname
            var clean_col = col_var.split("$")[1];
            echo("tibble_result <- tibble::column_to_rownames(" + df + ", var = \"" + clean_col + "\")\n");
        }
    }
  
}

function printout(is_preview){
	// printout the results
	new Header(i18n("Manage Row Names results")).print();

    var save_name = getValue("rn_save_obj.objectname");
    echo("rk.header(\"Row Names Managed: " + save_name + "\", level=3);\n");
  
	//// save result object
	// read in saveobject variables
	var rnSaveObj = getValue("rn_save_obj");
	var rnSaveObjActive = getValue("rn_save_obj.active");
	var rnSaveObjParent = getValue("rn_save_obj.parent");
	// assign object to chosen environment
	if(rnSaveObjActive) {
		echo(".GlobalEnv$" + rnSaveObj + " <- tibble_result\n");
	}

}

