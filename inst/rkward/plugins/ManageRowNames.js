// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!



function preprocess(is_preview){
	// add requirements etc. here
	echo("require(tibble)\n");
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
  
    var mode = getValue("rn_mode");
    var col_var = getValue("rn_input_var");
    var new_name = getValue("rn_input_text");

    // We need a dataframe context.
    // If "r2c", user might not select a var.
    // Logic: If col_var exists, extract DF. If not, we cannot guess DF (limitation).

    var p = parseVar(col_var);
    var df = p.df;

    if (df == "") {
       echo("stop(\"Please select a variable/column from the dataframe to identify the object.\")\n");
    } else {
        if (mode == "r2c") {
            // tibble::rownames_to_column(data, var)
            echo("tibble_result <- tibble::rownames_to_column(" + df + ", var = \"" + new_name + "\")\n");
        } else {
            // tibble::column_to_rownames(data, var)
            // p.col contains quoted name ("col")
            echo("tibble_result <- tibble::column_to_rownames(" + df + ", var = " + p.col + ")\n");
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

