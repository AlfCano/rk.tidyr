# rk.tidyr: Tidy Data Tools for RKWard

![Version](https://img.shields.io/badge/Version-0.0.3-blue.svg)
![License](https://img.shields.io/badge/License-GPL--3-green.svg)
![R Version](https://img.shields.io/badge/R-%3E%3D%203.0.0-lightgrey.svg)

This package provides a suite of RKWard plugins that create a graphical user interface for data manipulation using the powerful `tidyr`, `dplyr`, and `tibble` libraries. It is designed to help users reshape data, handle missing values, and manage nested data structures—core tasks for achieving "Tidy Data"—without writing complex code manually.

## Features / Included Plugins

This package installs a new submenu in RKWard: **Data > Tidy Data (tidyr)**, which contains the following plugins:

*   **Unite Columns:** Combines multiple columns into a single column.
*   **Manage Row Names:** Tools to convert row names into a proper data column and vice versa.
*   **Expand or Complete Tables:** Generates implicit missing values or ensures all combinations of variables exist.
*   **Handle Missing Values:** Drop, fill, or replace missing values (NA).
*   **Manage Nested Data:** Advanced tools for nesting columns into list-columns and unnesting them.

## Requirements

1.  A working installation of **RKWard**.
2.  The R packages **`tidyr`**, **`dplyr`**, and **`tibble`**.
    ```R
    install.packages(c("tidyr", "dplyr", "tibble"))
    ```
3.  The R package **`devtools`** (for installation from source).

## Installation

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

## Usage & Examples

To try the examples below, first run this code in your RKWard console to generate the sample datasets:

```R
# Dataset for Expand/Complete examples
stocks <- tibble::tibble(
  year   = c(2020, 2020, 2020, 2020, 2021, 2021, 2021),
  qtr    = c(   1,    2,    3,    4,    2,    3,    4),
  price  = c(1.88, 0.59, 0.35,   NA, 0.92, 0.17, 2.66)
)

# Dataset for Nest/Unnest examples
classroom <- data.frame(
  class   = c("Math", "Math", "Math", "Science", "Science", "History"),
  student = c("Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"),
  grade   = c(90, 85, 92, 88, 91, 75),
  stringsAsFactors = FALSE
)

# Load mtcars for Row Names examples
data(mtcars)
```

### Example 1: Manage Row Names (mtcars)

The `mtcars` dataset stores car names as row names, which is not "tidy". Let's move them to a real column.

1.  Navigate to **Data > Tidy Data (tidyr) > Manage Row Names**.
2.  Select **"Row names to Column"**.
3.  In the **Dataframe** field, select `mtcars`.
4.  In **Name for new Column**, type `model`.
5.  Click **Submit**.
    *   *Result:* A new object `tibble_result` is created where "Mazda RX4" etc., are now in a column named `model`.

### Example 2: Expand or Complete (stocks)

The `stocks` dataset is missing the row for 2021 Quarter 1.

1.  Navigate to **Data > Tidy Data (tidyr) > Expand or Complete Tables**.
2.  Select **"Complete (tidyr::complete)"**.
3.  In the variable selector, choose `stocks`.
4.  Select `year` and `qtr` and move them to **Variables to cross**.
5.  Click **Submit**.
    *   *Result:* The new dataset will include a row for `2021`, `1` with `price = NA`.

### Example 3: Nest Data (classroom)

Let's group the students by class so we have one row per class.

1.  Navigate to **Data > Tidy Data (tidyr) > Nest and Unnest**.
2.  Select **"Nest Data"**.
3.  **Grouping Variables:** Select `class` (from the `classroom` dataframe).
4.  **Variables to Nest:** Select `student` and `grade`.
5.  **Name for new List-Column:** Leave as `data`.
6.  Click **Submit**.
    *   *Result:* A 3-row dataframe. The `student` and `grade` columns are compressed into a list-column named `data`.

### Example 4: Unnest Data

To reverse the previous operation:

1.  Select **"Unnest Data"**.
2.  **List-Column to Unnest:** Select the `data` column from the result created in Example 3 (e.g., `nested_result$data`).
3.  Click **Submit**.
    *   *Result:* The dataframe expands back to the original 6 rows.

## Author

Alfonso Cano Robles (alfonso.cano@correo.buap.mx)

Assisted by Gemini, a large language model from Google.
