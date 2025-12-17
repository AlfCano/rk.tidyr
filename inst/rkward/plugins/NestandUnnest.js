// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(tidyr)\n");
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: ''};

        if (fullPath.indexOf('[[') > -1) {
            // Format: df[["col"]] or df[['col']]
            var parts = fullPath.split('[[');
            var df = parts[0];
            var col = parts[1].replace(']]', ''); // Returns "col" or 'col' with quotes
            return {df: df, col: col};
        } else if (fullPath.indexOf('$') > -1) {
            // Format: df$col
            var parts = fullPath.split('$');
            return {df: parts[0], col: '\"' + parts[1] + '\"'}; // Add quotes for safety
        } else {
            // Fallback or whole object
            return {df: '', col: fullPath};
        }
    }
  
    var mode = getValue("nest_mode");
    var group_vars = getValue("nest_group_vars");
    var target_vars = getValue("nest_target_vars");
    var new_col = getValue("nest_new_col");
    var list_col = getValue("unnest_list_col");

    var cmd = "";

    if (mode == "nest") {
        var df = "";

        // Extract DF from groups or targets
        if (group_vars) {
            df = parseVar(group_vars.split("\n")[0]).df;
        } else if (target_vars) {
            df = parseVar(target_vars.split("\n")[0]).df;
        }

        cmd = df;
        echo("require(dplyr)\n");

        if (group_vars) {
             var g_list = group_vars.split("\n");
             var g_cols = [];
             for(var i=0; i<g_list.length; i++) g_cols.push(parseVar(g_list[i]).col);
             cmd = "dplyr::group_by(" + cmd + ", " + g_cols.join(", ") + ")";
        }

        var t_list = target_vars.split("\n");
        var t_cols = [];
        for(var i=0; i<t_list.length; i++) t_cols.push(parseVar(t_list[i]).col);

        if (group_vars) {
             cmd += " %>% tidyr::nest(" + new_col + " = c(" + t_cols.join(", ") + "))";
        } else {
             cmd = "tidyr::nest(" + cmd + ", " + new_col + " = c(" + t_cols.join(", ") + "))";
        }
    }
    else if (mode == "unnest") {
        if (!list_col) echo("stop(\"Select a list-column.\")\n");

        var p = parseVar(list_col);
        cmd = "tidyr::unnest_longer(" + p.df + ", col = " + p.col + ")";
    }
    else if (mode == "rowwise") {
        // Try to find DF from list_col slot, or group vars slot
        var df = "";
        if (list_col) df = parseVar(list_col).df;
        if (!df && group_vars) df = parseVar(group_vars.split("\n")[0]).df;

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

