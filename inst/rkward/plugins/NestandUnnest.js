// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(tidyr)\n");
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    var mode = getValue("nest_mode");
    var group_vars = getValue("nest_group_vars");
    var target_vars = getValue("nest_target_vars");
    var new_col = getValue("nest_new_col");
    var list_col = getValue("unnest_list_col");

    var cmd = "";
    function getDF(v) { return v ? v.split("$")[0] : ""; }

    if (mode == "nest") {
        var df = "";
        if (group_vars) df = getDF(group_vars.split("\n")[0]);
        else if (target_vars) df = getDF(target_vars.split("\n")[0]);

        cmd = df;
        echo("require(dplyr)\n");

        if (group_vars) {
            var g_args = group_vars.replace(/\n/g, ", ");
            cmd = "dplyr::group_by(" + cmd + ", " + g_args + ")";
        }

        var t_args = target_vars.replace(/\n/g, ", ");
        if (group_vars) {
             cmd += " %>% tidyr::nest(" + new_col + " = c(" + t_args + "))";
        } else {
             cmd = "tidyr::nest(" + cmd + ", " + new_col + " = c(" + t_args + "))";
        }
    }
    else if (mode == "unnest") {
        if (!list_col) {
            echo("stop(\"Select a list-column to unnest.\")\n");
        }
        var df = getDF(list_col);
        var clean_col = list_col.split("$")[1];
        cmd = "tidyr::unnest_longer(" + df + ", col = " + clean_col + ")";
    }
    else if (mode == "rowwise") {
        var df = getDF(list_col);
         if (!df && group_vars) df = getDF(group_vars.split("\n")[0]);
        cmd = "dplyr::rowwise(" + df + ")";
    }

    echo("nested_result <- " + cmd + "\n");
  
}

function printout(is_preview){
	// printout the results
	new Header(i18n("Nest and Unnest results")).print();

    var mode = getValue("nest_mode");
    var save_name = getValue("nest_save_obj.objectname");
    echo("rk.header(\"Nested Operation (" + mode + "): " + save_name + "\", level=3);\n");
  
	//// save result object
	// read in saveobject variables
	var nestSaveObj = getValue("nest_save_obj");
	var nestSaveObjActive = getValue("nest_save_obj.active");
	var nestSaveObjParent = getValue("nest_save_obj.parent");
	// assign object to chosen environment
	if(nestSaveObjActive) {
		echo(".GlobalEnv$" + nestSaveObj + " <- nested_result\n");
	}

}

