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
  
    var func = getValue("na_func");
    var vars = getValue("na_vars");
    var fill_dir = getValue("na_fill_dir");
    var replace_val = getValue("na_replace_val");

    var varList = vars.split("\n");
    var dfName = "";
    var cols = [];

    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df;
        cols.push(p.col);
    }

    var args = cols.join(", ");

    if (func == "drop_na") {
        echo("missing_result <- tidyr::drop_na(" + dfName + ", " + args + ")\n");
    }
    else if (func == "fill") {
        echo("missing_result <- tidyr::fill(" + dfName + ", " + args + ", .direction = \"" + fill_dir + "\")\n");
    }
    else if (func == "replace_na") {
        // replace_na typically takes the dataframe and the list. Columns are inferred from list keys.
        echo("missing_result <- tidyr::replace_na(" + dfName + ", replace = " + replace_val + ")\n");
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

