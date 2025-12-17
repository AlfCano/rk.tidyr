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
  
    var vars = getValue("unite_vars");
    var new_col = getValue("unite_colname");
    var sep = getValue("unite_sep");
    var remove = getValue("unite_remove");
    
    var varList = vars.split("\n");
    var dfName = "";
    var cols = [];
    
    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df; 
        cols.push(p.col); 
    }
    
    var args = "col = \"" + new_col + "\", " + cols.join(", ");
    args += ", sep = \"" + sep + "\"";
    
    if (remove != "1") {
        args += ", remove = FALSE";
    }
  
    echo("preview_data <- tidyr::unite(data = " + dfName + ", " + args + ")\n");
  
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
  
    var vars = getValue("unite_vars");
    var new_col = getValue("unite_colname");
    var sep = getValue("unite_sep");
    var remove = getValue("unite_remove");
    
    var varList = vars.split("\n");
    var dfName = "";
    var cols = [];
    
    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df; 
        cols.push(p.col); 
    }
    
    var args = "col = \"" + new_col + "\", " + cols.join(", ");
    args += ", sep = \"" + sep + "\"";
    
    if (remove != "1") {
        args += ", remove = FALSE";
    }
  
    echo("unite_result <- tidyr::unite(data = " + dfName + ", " + args + ")\n");
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Unite Columns results")).print();	
	}
    var save_name = getValue("unite_save_obj.objectname");
    echo("rk.header(\"Columns United into: " + save_name + "\", level=3);\n");
  
	if(!is_preview) {
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

}

