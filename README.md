# rk.tidyr: Tidy Data Tools for RKWard

![Version](https://img.shields.io/badge/Version-0.0.1-blue.svg)
![License](https://img.shields.io/badge/License-GPL--3-green.svg)
![R Version](https://img.shields.io/badge/R-%3E%3D%203.0.0-lightgrey.svg)

This package provides a suite of RKWard plugins that create a graphical user interface for data manipulation using the powerful `tidyr`, `dplyr`, and `tibble` libraries. It is designed to help users reshape data, handle missing values, and manage nested data structures—core tasks for achieving "Tidy Data"—without writing complex code manually.

## Features / Included Plugins

This package installs a new submenu in RKWard: **Data > Tidy Data (tidyr)**, which contains the following plugins:

*   **Unite Columns:** Combines multiple columns into a single column using a specified separator.
    *   `unite()`: Convenience function to paste together multiple columns.

*   **Manage Row Names:** Tools to convert row names into a proper data column and vice versa.
    *   `rownames_to_column()`: Move row names into a new column.
    *   `column_to_rownames()`: Set a specific column as the row names.

*   **Expand or Complete Tables:** Generates implicit missing values or ensures all combinations of variables exist.
    *   `expand()`: Generates a new dataset with all possible combinations of the selected variables.
    *   `complete()`: Turns implicit missing values into explicit missing values (NAs) by expanding the data.

*   **Handle Missing Values:** A set of strategies to clean up NA values in your data.
    *   `drop_na()`: Drop rows containing missing values.
    *   `fill()`: Fill missing values with previous or next values (up/down).
    *   `replace_na()`: Replace missing values with specific known values.

*   **Manage Nested Data:** Advanced tools for working with list-columns and nested dataframes.
    *   `nest()`: Create a list-column of data frames (supports grouping).
    *   `unnest_longer()`: Flatten a list-column.
    *   `rowwise()`: Apply operations to data one row at a time.

## Requirements

1.  A working installation of **RKWard**.
2.  The R packages **`tidyr`**, **`dplyr`**, and **`tibble`**. If you do not have them, install them from the R console:
    ```R
    install.packages(c("tidyr", "dplyr", "tibble"))
    ```
3.  The R package **`devtools`** is required for installation from the source code.
    ```R
    install.packages("devtools")
    ```

## Installation

To install the `rk.tidyr` plugin package, you need the source code (e.g., by downloading it from GitHub).

1.  Open R in RKWard.
2.  Run the following commands in the R console:

```R
local({
## Preparar
require(devtools)
## Computar
  install_github(
    repo="AlfCano/rk.tidyr"
  )
## Imprimir el resultado
rk.header ("Resultados de Instalar desde git")
})

```
    
3.  Restart RKWard to ensure the new menu items appear correctly.

## Usage

Once installed, all plugins can be found under the **Data > Tidy Data (tidyr)** menu in RKWard.

### Example: Uniting Columns

1.  Load a dataset (e.g., `iris`) into your workspace.
2.  Navigate to **Data > Tidy Data (tidyr) > Unite Columns**.
3.  In the RKWard dialog, select the `iris` dataframe.
4.  Select `Sepal.Length` and `Sepal.Width` and move them to the "Columns to Unite" box.
5.  In "New Column Name", type `Sepal_Dimensions`.
6.  In "Separator", type `_` (underscore).
7.  Ensure "Remove input columns" is checked.
8.  Click **Submit**.

A new dataframe (`unite_result` by default) will be created where the two sepal columns have been merged into one string column (e.g., "5.1_3.5").

## Author

Alfonso Cano Robles (alfonso.cano@correo.buap.mx)

Assisted by Gemini, a large language model from Google.
