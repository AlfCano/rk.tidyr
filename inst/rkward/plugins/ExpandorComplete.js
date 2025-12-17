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
  
    var func = getValue("exp_func");
    var vars = getValue("exp_vars");

    var varList = vars.split("\n");
    var dfName = "";
    var cols = [];

    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df;
        cols.push(p.col);
    }

    var args = cols.join(", ");
    echo("expand_result <- tidyr::" + func + "(" + dfName + ", " + args + ")\n");
  
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

