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
        cols.push(p.raw_col);
    }
    
    var args = cols.join(", ");
    var cmd = "";
    
    if (func == "drop_na") {
        cmd = "tidyr::drop_na(" + dfName + ", " + args + ")";
    } 
    else if (func == "fill") {
        cmd = "tidyr::fill(" + dfName + ", " + args + ", .direction = \"" + fill_dir + "\")";
    } 
    else if (func == "replace_na") {
        cmd = "tidyr::replace_na(" + dfName + ", replace = " + replace_val + ")";
    }
  
    echo("preview_data <- " + cmd + "\n");
  
}

function preprocess(is_preview){
	// add requirements etc. here
	if(is_preview) {
		echo("if(!base::require(tidyr)){stop(" + i18n("Preview not available, because package tidyr is not installed or cannot be loaded.") + ")}\n");
	} else {
		echo("require(tidyr)\n");
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
        cols.push(p.raw_col);
    }
    
    var args = cols.join(", ");
    var cmd = "";
    
    if (func == "drop_na") {
        cmd = "tidyr::drop_na(" + dfName + ", " + args + ")";
    } 
    else if (func == "fill") {
        cmd = "tidyr::fill(" + dfName + ", " + args + ", .direction = \"" + fill_dir + "\")";
    } 
    else if (func == "replace_na") {
        cmd = "tidyr::replace_na(" + dfName + ", replace = " + replace_val + ")";
    }
  
    echo("missing_result <- " + cmd + "\n");
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Handle Missing Values results")).print();	
	}
    var func = getValue("na_func");
    var save_name = getValue("na_save_obj.objectname");
    echo("rk.header(\"Missing Values Handled (" + func + "): " + save_name + "\", level=3);\n");
  
	if(!is_preview) {
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

}

