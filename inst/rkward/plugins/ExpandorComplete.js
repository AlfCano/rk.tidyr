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
  
    var func = getValue("exp_func");
    var vars = getValue("exp_vars");
    
    var varList = vars.split("\n");
    var dfName = "";
    var cols = [];
    
    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df;
        cols.push(p.raw_col); 
    }
    var args = cols.join(", ");
  
    echo("preview_data <- tidyr::" + func + "(" + dfName + ", " + args + ")\n");
  
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
  
    var func = getValue("exp_func");
    var vars = getValue("exp_vars");
    
    var varList = vars.split("\n");
    var dfName = "";
    var cols = [];
    
    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df;
        cols.push(p.raw_col); 
    }
    var args = cols.join(", ");
  
    echo("expand_result <- tidyr::" + func + "(" + dfName + ", " + args + ")\n");
  
}

function printout(is_preview){
	// read in variables from dialog


	// printout the results
	if(!is_preview) {
		new Header(i18n("Expand or Complete results")).print();	
	}
    var save_name = getValue("exp_save_obj.objectname");
    echo("rk.header(\"Table Expanded/Completed: " + save_name + "\", level=3);\n");
  
	if(!is_preview) {
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

}

