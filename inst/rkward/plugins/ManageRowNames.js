// this code was generated using the rkwarddev package.
// perhaps don't make changes here, but in the rkwarddev script instead!

function preview(){
	
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        
        var df = '';
        var raw_col = '';
        
        if (fullPath.indexOf('[[') > -1) {
            // Format: df[["col"]] or df[['col']]
            var parts = fullPath.split('[[');
            df = parts[0];
            // Remove brackets and quotes to get raw name
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, ''); 
        } else if (fullPath.indexOf('$') > -1) {
            // Format: df$col
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        
        // Return object with safe quoted version and raw symbol version
        return {
            df: df,
            col: '\"' + raw_col + '\"', // Quoted: "col"
            raw_col: raw_col               // Unquoted: col
        };
    }
  
    var mode = getValue("rn_mode");
    var df_obj = getValue("rn_df_slot");
    var col_var = getValue("rn_input_var");
    var new_name = getValue("rn_input_text");
    
    var cmd = "";

    if (mode == "r2c") {
        if (df_obj == "") {
             // Stop is handled in calc block
        } else {
             cmd = "tibble::rownames_to_column(" + df_obj + ", var = \"" + new_name + "\")";
        }
    } else {
        // c2r
        var p = parseVar(col_var);
        if (p.df != "") {
             cmd = "tibble::column_to_rownames(" + p.df + ", var = " + p.col + ")";
        }
    }
  
    if (cmd != "") {
        echo("preview_data <- " + cmd + "\n");
    }
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(tibble)){stop(" + i18n("Preview not available, because package tibble is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(tibble)\n");
	}
}

function calculate(is_preview){
	// read in variables from dialog


	// the R code to be evaluated

    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};
        
        var df = '';
        var raw_col = '';
        
        if (fullPath.indexOf('[[') > -1) {
            // Format: df[["col"]] or df[['col']]
            var parts = fullPath.split('[[');
            df = parts[0];
            // Remove brackets and quotes to get raw name
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/["']/g, ''); 
        } else if (fullPath.indexOf('$') > -1) {
            // Format: df$col
            var parts = fullPath.split('$');
            df = parts[0];
            raw_col = parts[1];
        } else {
            raw_col = fullPath;
        }
        
        // Return object with safe quoted version and raw symbol version
        return {
            df: df,
            col: '\"' + raw_col + '\"', // Quoted: "col"
            raw_col: raw_col               // Unquoted: col
        };
    }
  
    var mode = getValue("rn_mode");
    var df_obj = getValue("rn_df_slot");
    var col_var = getValue("rn_input_var");
    var new_name = getValue("rn_input_text");
    
    var cmd = "";

    if (mode == "r2c") {
        if (df_obj == "") {
             // Stop is handled in calc block
        } else {
             cmd = "tibble::rownames_to_column(" + df_obj + ", var = \"" + new_name + "\")";
        }
    } else {
        // c2r
        var p = parseVar(col_var);
        if (p.df != "") {
             cmd = "tibble::column_to_rownames(" + p.df + ", var = " + p.col + ")";
        }
    }
  
    if (mode == "r2c" && df_obj == "") {
        echo("stop(\"Please select a Dataframe.\")\n");
    } else if (mode == "c2r" && col_var == "") {
        echo("stop(\"Please select a Column.\")\n");
    } else {
        echo("tibble_result <- " + cmd + "\n");
    }
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Manage Row Names results")).print();	
	}
    var save_name = getValue("rn_save_obj.objectname");
    echo("rk.header(\"Row Names Managed: " + save_name + "\", level=3);\n");
  
	if(!is_preview) {
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

}

