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
  
    var vars = getValue("unite_vars");
    var new_col = getValue("unite_colname");
    var sep = getValue("unite_sep");
    var remove = getValue("unite_remove");
    var save_name = getValue("unite_save_obj.objectname");

    var varList = vars.split("\n");
    var dfName = "";
    var cols = [];

    // Parse all selected variables
    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df; // Assume all vars are from the same dataframe
        cols.push(p.col);
    }

    // tidyr::unite(data, col, <cols...>, sep)
    var args = "col = \"" + new_col + "\", " + cols.join(", ");
    args += ", sep = \"" + sep + "\"";

    if (remove != "1") {
        args += ", remove = FALSE";
    }

    echo("unite_result <- tidyr::unite(data = " + dfName + ", " + args + ")\n");
  
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

