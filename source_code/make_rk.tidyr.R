local({
  # =========================================================================================
  # 1. Package Definition and Metadata
  # =========================================================================================
  require(rkwarddev)
  rkwarddev.required("0.10-3")

  package_about <- rk.XML.about(
    name = "rk.tidyr",
    author = person(
      given = "Alfonso",
      family = "Cano",
      email = "alfonso.cano@correo.buap.mx",
      role = c("aut", "cre")
    ),
    about = list(
      desc = "An RKWard plugin package for data manipulation using the 'tidyr', 'dplyr' and 'tibble' libraries.",
      version = "0.0.3", # Frozen as requested
      url = "https://github.com/AlfCano/rk.tidyr",
      license = "GPL (>= 3)"
    )
  )

  common_hierarchy <- list("data", "Tidy Data (tidyr)")

  # =========================================================================================
  # JS Helper: Robust Variable Parsing (Returns Quoted and Unquoted)
  # =========================================================================================
  js_parse_helper <- "
    function parseVar(fullPath) {
        if (!fullPath) return {df: '', col: '', raw_col: ''};

        var df = '';
        var raw_col = '';

        if (fullPath.indexOf('[[') > -1) {
            // Format: df[[\"col\"]] or df[['col']]
            var parts = fullPath.split('[[');
            df = parts[0];
            // Remove brackets and quotes to get raw name
            var inner = parts[1].replace(']]', '');
            raw_col = inner.replace(/[\"']/g, '');
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
            col: '\\\"' + raw_col + '\\\"', // Quoted: \"col\"
            raw_col: raw_col               // Unquoted: col
        };
    }
  "

  # =========================================================================================
  # MAIN PLUGIN: Unite Columns
  # =========================================================================================

  help_unite <- rk.rkh.doc(
    title = rk.rkh.title(text = "Unite Multiple Columns"),
    summary = rk.rkh.summary(text = "Combines multiple columns into a single column using a separator."),
    usage = rk.rkh.usage(text = "Select columns to unite, specify a separator, and provide a name for the new column.")
  )

  unite_selector <- rk.XML.varselector(id.name = "unite_selector")
  unite_vars <- rk.XML.varslot(label = "Columns to Unite", source = "unite_selector", multi = TRUE, required = TRUE, id.name = "unite_vars")
  unite_colname <- rk.XML.input(label = "New Column Name", initial = "new_col", id.name = "unite_colname")
  unite_sep <- rk.XML.input(label = "Separator (e.g., _ or -)", initial = "_", id.name = "unite_sep")
  unite_remove <- rk.XML.cbox(label = "Remove input columns", value = "1", chk = TRUE, id.name = "unite_remove")
  unite_save <- rk.XML.saveobj(label = "Save result as", chk = TRUE, initial = "unite_result", id.name = "unite_save_obj")
  unite_preview <- rk.XML.preview(mode = "data")

  dialog_unite <- rk.XML.dialog(
    label = "Unite Columns",
    child = rk.XML.row(
        unite_selector,
        rk.XML.col(unite_vars, unite_colname, unite_sep, unite_remove, unite_save, unite_preview)
    )
  )

  js_body_unite <- '
    var vars = getValue("unite_vars");
    var new_col = getValue("unite_colname");
    var sep = getValue("unite_sep");
    var remove = getValue("unite_remove");

    var varList = vars.split("\\n");
    var dfName = "";
    var cols = [];

    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df;
        cols.push(p.col);
    }

    var args = "col = \\\"" + new_col + "\\\", " + cols.join(", ");
    args += ", sep = \\\"" + sep + "\\\"";

    if (remove != "1") {
        args += ", remove = FALSE";
    }
  '

  js_calc_unite <- paste0(js_parse_helper, js_body_unite, '
    echo("unite_result <- tidyr::unite(data = " + dfName + ", " + args + ")\\n");
  ')

  js_preview_unite <- paste0(js_parse_helper, js_body_unite, '
    echo("preview_data <- tidyr::unite(data = " + dfName + ", " + args + ")\\n");
  ')

  js_print_unite <- '
    var save_name = getValue("unite_save_obj.objectname");
    echo("rk.header(\\"Columns United into: " + save_name + "\\", level=3);\\n");
  '

  # =========================================================================================
  # COMPONENT 1: Manage Row Names
  # =========================================================================================

  help_rownames <- rk.rkh.doc(
    title = rk.rkh.title(text = "Manage Row Names"),
    summary = rk.rkh.summary(text = "Convert row names to a column or a column to row names using tibble."),
    usage = rk.rkh.usage(text = "Choose the operation mode and specify the target variable.")
  )

  rn_selector <- rk.XML.varselector(id.name = "rn_selector")

  rn_mode <- rk.XML.radio(label = "Operation", options = list(
      "Row names to Column" = list(val = "r2c", chk = TRUE),
      "Column to Row names" = list(val = "c2r")
  ), id.name = "rn_mode")

  # NEW SLOT: Dataframe selector (Required for r2c mode)
  rn_df_slot <- rk.XML.varslot(label = "Dataframe (for Row->Col)", source = "rn_selector", classes = "data.frame", id.name = "rn_df_slot")

  rn_input_var <- rk.XML.varslot(label = "Column (for Col->Row)", source = "rn_selector", id.name = "rn_input_var")
  rn_input_text <- rk.XML.input(label = "Name for new Column (for Row->Col)", initial = "rowname", id.name = "rn_input_text")
  rn_save <- rk.XML.saveobj(label = "Save result as", chk = TRUE, initial = "tibble_result", id.name = "rn_save_obj")
  rn_preview <- rk.XML.preview(mode = "data")

  dialog_rownames <- rk.XML.dialog(
    label = "Manage Row Names",
    child = rk.XML.row(
        rn_selector,
        rk.XML.col(rn_mode, rn_df_slot, rn_input_var, rn_input_text, rn_save, rn_preview)
    )
  )

  # Logic:
  # r2c: uses rn_df_slot + input_text
  # c2r: uses rn_input_var
  js_body_rownames <- '
    var mode = getValue("rn_mode");
    var df_obj = getValue("rn_df_slot");
    var col_var = getValue("rn_input_var");
    var new_name = getValue("rn_input_text");

    var cmd = "";

    if (mode == "r2c") {
        if (df_obj == "") {
             // Stop is handled in calc block
        } else {
             cmd = "tibble::rownames_to_column(" + df_obj + ", var = \\\"" + new_name + "\\\")";
        }
    } else {
        // c2r
        var p = parseVar(col_var);
        if (p.df != "") {
             cmd = "tibble::column_to_rownames(" + p.df + ", var = " + p.col + ")";
        }
    }
  '

  js_calc_rownames <- paste0(js_parse_helper, js_body_rownames, '
    if (mode == "r2c" && df_obj == "") {
        echo("stop(\\\"Please select a Dataframe.\\\")\\n");
    } else if (mode == "c2r" && col_var == "") {
        echo("stop(\\\"Please select a Column.\\\")\\n");
    } else {
        echo("tibble_result <- " + cmd + "\\n");
    }
  ')

  js_preview_rownames <- paste0(js_parse_helper, js_body_rownames, '
    if (cmd != "") {
        echo("preview_data <- " + cmd + "\\n");
    }
  ')

  js_print_rownames <- '
    var save_name = getValue("rn_save_obj.objectname");
    echo("rk.header(\\"Row Names Managed: " + save_name + "\\", level=3);\\n");
  '

  component_rownames <- rk.plugin.component(
    "Manage Row Names",
    xml = list(dialog = dialog_rownames),
    js = list(require="tibble", calculate = js_calc_rownames, preview = js_preview_rownames, printout = js_print_rownames),
    hierarchy = common_hierarchy,
    rkh = list(help = help_rownames)
  )

  # =========================================================================================
  # COMPONENT 2: Expand and Complete
  # =========================================================================================

  help_expand <- rk.rkh.doc(
    title = rk.rkh.title(text = "Expand or Complete Tables"),
    summary = rk.rkh.summary(text = "Generates all combinations of variables or completes missing combinations."),
    usage = rk.rkh.usage(text = "Select variables to expand/complete by.")
  )

  exp_selector <- rk.XML.varselector(id.name = "exp_selector")

  exp_func <- rk.XML.radio(label = "Function", options = list(
      "Expand (tidyr::expand)" = list(val = "expand", chk = TRUE),
      "Complete (tidyr::complete)" = list(val = "complete")
  ), id.name = "exp_func")

  exp_vars <- rk.XML.varslot(label = "Variables to cross", source = "exp_selector", multi = TRUE, required = TRUE, id.name = "exp_vars")
  exp_save <- rk.XML.saveobj(label = "Save result as", chk = TRUE, initial = "expand_result", id.name = "exp_save_obj")
  exp_preview <- rk.XML.preview(mode = "data")

  dialog_expand <- rk.XML.dialog(
    label = "Expand / Complete",
    child = rk.XML.row(
        exp_selector,
        rk.XML.col(exp_func, exp_vars, exp_save, exp_preview)
    )
  )

  js_body_expand <- '
    var func = getValue("exp_func");
    var vars = getValue("exp_vars");

    var varList = vars.split("\\n");
    var dfName = "";
    var cols = [];

    for (var i = 0; i < varList.length; i++) {
        var p = parseVar(varList[i]);
        if (i === 0) dfName = p.df;
        cols.push(p.raw_col);
    }
    var args = cols.join(", ");
  '

  js_calc_expand <- paste0(js_parse_helper, js_body_expand, '
    echo("expand_result <- tidyr::" + func + "(" + dfName + ", " + args + ")\\n");
  ')

  js_preview_expand <- paste0(js_parse_helper, js_body_expand, '
    echo("preview_data <- tidyr::" + func + "(" + dfName + ", " + args + ")\\n");
  ')

  js_print_expand <- '
    var save_name = getValue("exp_save_obj.objectname");
    echo("rk.header(\\"Table Expanded/Completed: " + save_name + "\\", level=3);\\n");
  '

  component_expand <- rk.plugin.component(
    "Expand or Complete",
    xml = list(dialog = dialog_expand),
    js = list(require="tidyr", calculate = js_calc_expand, preview = js_preview_expand, printout = js_print_expand),
    hierarchy = common_hierarchy,
    rkh = list(help = help_expand)
  )

  # =========================================================================================
  # COMPONENT 3: Handle Missing Values
  # =========================================================================================

  help_na <- rk.rkh.doc(
    title = rk.rkh.title(text = "Handle Missing Values"),
    summary = rk.rkh.summary(text = "Drop, fill, or replace missing values (NA)."),
    usage = rk.rkh.usage(text = "Choose a strategy and apply it to selected columns.")
  )

  na_selector <- rk.XML.varselector(id.name = "na_selector")

  na_func <- rk.XML.dropdown(label = "Function", options = list(
      "Drop NAs (drop_na)" = list(val = "drop_na", chk = TRUE),
      "Fill NAs (fill)" = list(val = "fill"),
      "Replace NAs (replace_na)" = list(val = "replace_na")
  ), id.name = "na_func")

  na_vars <- rk.XML.varslot(label = "Target Variables", source = "na_selector", multi = TRUE, required = TRUE, id.name = "na_vars")
  na_fill_dir <- rk.XML.dropdown(label = "Fill Direction", options = list(
      "Down" = list(val = "down", chk = TRUE),
      "Up" = list(val = "up"),
      "Down then Up" = list(val = "downup"),
      "Up then Down" = list(val = "updown")
  ), id.name = "na_fill_dir")
  na_replace_val <- rk.XML.input(label = "Replacement List (R code, e.g., list(col=0))", initial = "list()", id.name = "na_replace_val")
  na_save <- rk.XML.saveobj(label = "Save result as", chk = TRUE, initial = "missing_result", id.name = "na_save_obj")
  na_preview <- rk.XML.preview(mode = "data")

  dialog_na <- rk.XML.dialog(
    label = "Handle Missing Values",
    child = rk.XML.row(
        na_selector,
        rk.XML.col(
            na_func,
            na_vars,
            rk.XML.frame(na_fill_dir, label = "Fill Options"),
            rk.XML.frame(na_replace_val, label = "Replace Options"),
            na_save,
            na_preview
        )
    )
  )

  js_body_na <- '
    var func = getValue("na_func");
    var vars = getValue("na_vars");
    var fill_dir = getValue("na_fill_dir");
    var replace_val = getValue("na_replace_val");

    var varList = vars.split("\\n");
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
        cmd = "tidyr::fill(" + dfName + ", " + args + ", .direction = \\\"" + fill_dir + "\\\")";
    }
    else if (func == "replace_na") {
        cmd = "tidyr::replace_na(" + dfName + ", replace = " + replace_val + ")";
    }
  '

  js_calc_na <- paste0(js_parse_helper, js_body_na, '
    echo("missing_result <- " + cmd + "\\n");
  ')

  js_preview_na <- paste0(js_parse_helper, js_body_na, '
    echo("preview_data <- " + cmd + "\\n");
  ')

  js_print_na <- '
    var func = getValue("na_func");
    var save_name = getValue("na_save_obj.objectname");
    echo("rk.header(\\"Missing Values Handled (" + func + "): " + save_name + "\\", level=3);\\n");
  '

  component_na <- rk.plugin.component(
    "Handle Missing Values",
    xml = list(dialog = dialog_na),
    js = list(require="tidyr", calculate = js_calc_na, preview = js_preview_na, printout = js_print_na),
    hierarchy = common_hierarchy,
    rkh = list(help = help_na)
  )

  # =========================================================================================
  # COMPONENT 4: Nested Data (Nest, Unnest, Rowwise)
  # =========================================================================================

  help_nest <- rk.rkh.doc(
    title = rk.rkh.title(text = "Manage Nested Data"),
    summary = rk.rkh.summary(text = "Nest columns into list-columns, unnest them, or perform row-wise operations."),
    usage = rk.rkh.usage(text = "Select Nest, Unnest, or Rowwise, then select the appropriate grouping and target variables.")
  )

  nest_selector <- rk.XML.varselector(id.name = "nest_selector")

  nest_mode <- rk.XML.radio(label = "Operation", options = list(
      "Nest Data" = list(val = "nest", chk = TRUE),
      "Unnest Data (unnest_longer)" = list(val = "unnest"),
      "Rowwise Grouping" = list(val = "rowwise")
  ), id.name = "nest_mode")

  nest_group_vars <- rk.XML.varslot(label = "Grouping Variables (Keep outside nest)", source = "nest_selector", multi = TRUE, id.name = "nest_group_vars")
  nest_target_vars <- rk.XML.varslot(label = "Variables to Nest (Inside list-column)", source = "nest_selector", multi = TRUE, id.name = "nest_target_vars")
  nest_new_col <- rk.XML.input(label = "Name for new List-Column", initial = "data", id.name = "nest_new_col")
  unnest_list_col <- rk.XML.varslot(label = "List-Column to Unnest", source = "nest_selector", id.name = "unnest_list_col")
  nest_save <- rk.XML.saveobj(label = "Save result as", chk = TRUE, initial = "nested_result", id.name = "nest_save_obj")
  nest_preview <- rk.XML.preview(mode = "data")

  dialog_nest <- rk.XML.dialog(
    label = "Nested Data Operations",
    child = rk.XML.row(
        nest_selector,
        rk.XML.col(
            nest_mode,
            rk.XML.frame(nest_group_vars, nest_target_vars, nest_new_col, label = "Nest Options"),
            rk.XML.frame(unnest_list_col, label = "Unnest/Rowwise Options"),
            nest_save,
            nest_preview
        )
    )
  )

  js_body_nest <- '
    var mode = getValue("nest_mode");
    var group_vars = getValue("nest_group_vars");
    var target_vars = getValue("nest_target_vars");
    var new_col = getValue("nest_new_col");
    var list_col = getValue("unnest_list_col");

    var cmd = "";

    if (mode == "nest") {
        var df = "";
        if (group_vars) {
            df = parseVar(group_vars.split("\\n")[0]).df;
        } else if (target_vars) {
            df = parseVar(target_vars.split("\\n")[0]).df;
        }

        cmd = df;

        if (group_vars) {
             var g_list = group_vars.split("\\n");
             var g_cols = [];
             for(var i=0; i<g_list.length; i++) g_cols.push(parseVar(g_list[i]).raw_col);
             cmd = "dplyr::group_by(" + cmd + ", " + g_cols.join(", ") + ")";
        }

        var t_list = target_vars.split("\\n");
        var t_cols = [];
        for(var i=0; i<t_list.length; i++) t_cols.push(parseVar(t_list[i]).raw_col);

        if (group_vars) {
             cmd += " %>% tidyr::nest(" + new_col + " = c(" + t_cols.join(", ") + "))";
        } else {
             cmd = "tidyr::nest(" + cmd + ", " + new_col + " = c(" + t_cols.join(", ") + "))";
        }
    }
    else if (mode == "unnest") {
        if (list_col) {
            var p = parseVar(list_col);
            cmd = "tidyr::unnest_longer(" + p.df + ", col = " + p.raw_col + ")";
        }
    }
    else if (mode == "rowwise") {
        var df = "";
        if (list_col) df = parseVar(list_col).df;
        if (!df && group_vars) df = parseVar(group_vars.split("\\n")[0]).df;

        if (df) {
            cmd = "dplyr::rowwise(" + df + ")";
        }
    }
  '

  js_calc_nest <- paste0(js_parse_helper, js_body_nest, '
    echo("require(dplyr)\\n");
    if (cmd == "") {
         if (mode == "unnest") echo("stop(\\\"Select a list-column.\\\")\\n");
    } else {
         echo("nested_result <- " + cmd + "\\n");
    }
  ')

  js_preview_nest <- paste0(js_parse_helper, js_body_nest, '
    echo("require(dplyr)\\n");
    if (cmd != "") {
         echo("preview_data <- " + cmd + "\\n");
    }
  ')

  js_print_nest <- '
    var mode = getValue("nest_mode");
    var save_name = getValue("nest_save_obj.objectname");
    echo("rk.header(\\"Nested Operation (" + mode + "): " + save_name + "\\", level=3);\\n");
  '

  component_nest <- rk.plugin.component(
    "Nest and Unnest",
    xml = list(dialog = dialog_nest),
    js = list(require="tidyr", calculate = js_calc_nest, preview = js_preview_nest, printout = js_print_nest),
    hierarchy = common_hierarchy,
    rkh = list(help = help_nest)
  )

  # =========================================================================================
  # BUILD SKELETON
  # =========================================================================================

  rk.plugin.skeleton(
    about = package_about,
    path = ".",
    xml = list(dialog = dialog_unite),
    js = list(
        require = "tidyr",
        calculate = js_calc_unite,
        preview = js_preview_unite,
        printout = js_print_unite
    ),
    rkh = list(help = help_unite),
    components = list(
        component_rownames,
        component_expand,
        component_na,
        component_nest
    ),
    pluginmap = list(
        name = "Unite Columns",
        hierarchy = common_hierarchy
    ),
    create = c("pmap", "xml", "js", "desc", "rkh"),
    load = TRUE,
    overwrite = TRUE,
    show = FALSE
  )

  cat("\nPlugin package 'rk.tidyr' generated successfully.\n")
  cat("To complete installation:\n")
  cat("  1. rk.updatePluginMessages(path=\".\")\n")
  cat("  2. devtools::install(\".\")\n")
})
