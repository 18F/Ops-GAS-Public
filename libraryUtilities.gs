function findFiscalYear(iso_date){
  // Returns an integer representing the fiscal year in which a date falls.
  // 
  // Requires ten digit ISO format date (`YYYY-MM-DD`).
  var month = Number(iso_date.slice(5,7))
  var year = Number(iso_date.slice(0,4))
  if (month > 9){
    return year + 1
  } else {
    return year
  }
}

function getUnique(data, key){
  // Returns array of unique values given an array of objects and key.
  //
  // Requires an array of objects with common keys and the key (as a string) for which 
  // the unique set should be created.
  var output = []
  for (i=0; i<data.length; i++){
    if (output.indexOf(data[i][key]) == -1){
      output.push(data[i][key])
    }
  }
  return output
}

function makeDateMap(start_date, end_date){
  // Generates array of `YYYY-MM-DD` string dates by week, starting w/ start date and ending < 7 days of today.
  //
  // Requires `YYYY-MM-DD` string start date.
  start_date = new Date(start_date + 'T04:00:00.000Z')
  var week = 1000 * 60 * 60 * 24 * 7
  if (end_date){
    var end_date = new Date(end_date + 'T04:00:00.000Z')
    } else {
      var end_date = new Date()
      }
  var weeks_between = Math.round(((end_date.getTime() + 1000*60*60*24*7) - start_date.getTime()) / week)
  var dates = []
  for (i=0; i<weeks_between; i++){
    dates.push(new Date(start_date.getTime() + (week*i)).toISOString().slice(0,10))
  }
  return dates
}

function buildRESTParams(raw_params){
  // Given an object, returns a RESTful formatted string of parameters for API calls.
  //
  // Requires a single object with at least one attribute that has a non-null value.
  var ex_params = ''
  for (i=0; i<Object.keys(raw_params).length; i++){
    ex_params += Object.keys(raw_params)[i] + '=' + raw_params[Object.keys(raw_params)[i]]
    if (i+1 != Object.keys(raw_params).length){
      ex_params += '&'
    }
  }
  return ex_params
}

function getSheetById(workbook, id){
  // Google Apps Script lacks a built in to get a sheet within a workbook by its unique and
  // (most importantly!) _unchanging_ `gid`. This remedies that situation.
  // 
  // Requires a Workbook object and the sheet ID as a string.
  for (i=0; i<workbook.getSheets().length; i++){
    if (workbook.getSheets()[i].getSheetId() == id){
      return workbook.getSheets()[i]
    }
  }
}

/*

function dumpTo2DSheet(sheet, data, x_field, y_field, sum_field){
  // Clean up existing sheet.
  sheet.clear()
  var to_write = []
  //if (sheet.getMaxRows() > 1){
  //  sheet.deleteRows(1, sheet.getMaxRows() - 1)
  //}
  var categories = getUnique(data, y_field)  
  var header = getUnique(data, x_field)
  Logger.log(header)
  var header_row = ['']
  for (i=0; i<header.length; i++){
    header_row.push(header[i])
  }
  to_write.push(header_row)
  for (i=0; i<categories.length; i++){
    var cat_row = []
    cat_row.push(categories[i])
    for (ii=0; ii<header.length; ii++){
      cat_row.push('')
    }
    to_write.push(cat_row)  
  }
  Logger.log(to_write)
  var data_map = []
  for (d=0; d<data.length; d++){
    var hash = data[d][x_field] + data[d][y_field]
    var obj = {}
    obj[hash] = data[d]
    data_map.push(obj)
  }
  Logger.log(data_map)

  // For each y-axis category...
  for (i=0; i<categories.length; i++){
    // For each x-axis category...
    for (ii=0; ii<header.length; ii++){
      // For each item in the supplied data...
      var hash = header[ii] + categories[i]
      Logger.log(data_map[0][hash])
      //to_write[i+1][ii+1] = data_map[0][hash][sum_field]
    }
  }  
  Logger.log(to_write)
  return sheet 
}

*/
function dumpTo2DSheet(sheet, data, x_field, y_field, sum_field){
  // Clean up existing sheet.
  sheet.clear()
  if (sheet.getMaxRows() > 1){
    sheet.deleteRows(1, sheet.getMaxRows() - 1)
  }
  // Get y-axis categories.
  var categories = getUnique(data, y_field)
  if (sheet.getMaxRows() - 1 < categories.length){
    sheet.insertRows(sheet.getMaxRows(),(categories.length - sheet.getMaxRows()))
  }
  // Get x-axis fields.
  var header = getUnique(data, x_field)
  if (sheet.getMaxColumns() - 1 < header.length){
    sheet.insertColumns(sheet.getMaxColumns(), (header.length - sheet.getMaxColumns()))
  }
  // Set header to bold.
  for (i=0; i<header.length; i++){
    sheet.getRange(1, i + 2).setValue(header[i]).setFontWeight("bold")
  }
  // Set y-axis categories in first column.
  for (i=0; i<categories.length; i++){
    sheet.getRange(i + 2, 1).setValue(categories[i])
  }
  // For each y-axis category...
  for (i=0; i<categories.length; i++){
    // For each x-axis category...
    for (ii=0; ii<header.length; ii++){
      // For each item in the supplied data...
      for (d=0; d<data.length; d++){
        // If the item's attributes match the x- and y- axes...
        if (data[d][y_field] == categories[i] && data[d][x_field] == header[ii]){
          // Set the value of the corresponding cell to the value of the item's specified attribute.
          sheet.getRange(i + 2, ii + 2).setValue(data[d][sum_field])
        }
      }
    }
  }  
  return sheet 
}

function addSummaryColumns(sheet, func_names, data_start){
  if (!data_start){
    var data_start = 1
    }
  var data_end = sheet.getMaxColumns()
  var data_width = (data_end - data_start)
  for (i=0; i<func_names.length; i++){
    var func_name = func_names[i]
    sheet.insertColumnAfter(sheet.getMaxColumns())
    var range = sheet.getRange(1, sheet.getMaxColumns(), sheet.getMaxRows(), 1)
    range.getCell(1,1).setValue(func_name)
    for (ii=1; ii<sheet.getMaxRows(); ii++){
      range.getCell(ii + 1, 1).setFormulaR1C1(
        "=" + func_names[i] + "(R[0]C[" + (-data_width - i) +"]:R[0]C["+ (-1 - i) +"])")
    }
    range.setFontWeight("bold")
  }
  return sheet
}

function getDiffForTwoArrays(array_1, array_2, match_array, diff_field, operator, compare_name){
  // array_1 is canonical array.
  //
  var array_1_map = {}
  for (i=0; i<array_1.length; i++){
    var hash = ''
    for (ii=0; ii<match_array.length; ii++){
      hash = hash + array_1[i][match_array[ii]]
    }
    array_1_map[hash] = {value: array_1[i][diff_field], diff: 0}
  }
  for (i=0; i<array_2.length; i++){
    var hash = ''
    for (ii=0; ii<match_array.length; ii++){
      hash = hash + array_2[i][match_array[ii]]
    }
    if (array_1_map[hash]){
      array_1_map[hash].diff = eval(array_1_map[hash].value + operator + array_2[i][diff_field])
    }
  }
  for (i=0; i<array_1.length; i++){
    var hash = ''
    for (ii=0; ii<match_array.length; ii++){
      hash = hash + array_1[i][match_array[ii]]
    }
    array_1[i]['diff_' + diff_field] = array_1_map[hash].diff
    array_1[i][compare_name] = array_1_map[hash].value
  }
  return array_1
}


function totalsByX(data, category_field, array_of_sum_bys){
  // Requires array of data objects, a string field to determine categories, and
  // and array of string fields for which sums are sought.
  //
  // Returns an array of objects for delivery to a sheet.
  //
  // Get list of unique x-axis categories.
  var categories = getUnique(data, category_field)
  // For each x-axis category, create a new attribute in the output object with the category's name. Set the value of
  // the attribute to zero.
  var output = {}
  for (i=0; i<categories.length; i++){
    var name = categories[i]
    var sum_obj = {}
    for (ii=0; ii<array_of_sum_bys.length; ii++){
      var sum_name = 'Sum of ' + array_of_sum_bys[ii]
      sum_obj[sum_name] = 0
    }
    output[name] = sum_obj
  }
  // For each item in the data array, increment the corresponding attribute of the output array by the value of the
  // item's sum_by attribute.
  for (i=0; i<data.length; i++){
    for (ii=0; ii<array_of_sum_bys.length; ii++){
      var sum_name = 'Sum of ' + array_of_sum_bys[ii]
      output[data[i][category_field]][sum_name] += parseFloat(data[i][array_of_sum_bys[ii]]) || 0
    }    
  }
  // Create an output array for delivery to spreadsheet.
  var keys = Object.keys(output)
  var array = []
  for (i=0; i<keys.length; i++){
    var obj = {}
    obj[category_field] = keys[i]
    for (ii=0; ii<array_of_sum_bys.length; ii++){
      var sum_name = 'Sum of ' + array_of_sum_bys[ii]
      obj[sum_name] = output[keys[i]][sum_name]
    }
    array.push(obj)
  }
  return array
}

function totalsByXByY(data, x_key, y_key, sum_by){
  // Builds a two dimensional summary table.
  // Requires an array of objects, a string value for the x-axis category, a string value for the
  // y-axis category, and a string value for the field for which the data should be summed.
  //
  // Returns an array of objects for delivery to sheet.
  var output = []
  var x_keys = getUnique(data, x_key)
  for (x=0; x<x_keys.length; x++){
    var sub_data = []
    for (t=0; t<data.length; t++){
      if (data[t][x_key] == x_keys[x]){
        sub_data.push(data[t])
      }
    }
    var sub_output = totalsByX(sub_data, y_key, [sum_by])
    for (s=0; s<sub_output.length; s++){
      sub_output[s][x_key] = x_keys[x]
      output.push(sub_output[s])
    }
  }
  return output
}


// !!!!!!!!!!!!!!!! \/ NEED TESTS \/ !!!!!!!!!!!!!!!!

function getFromSheet(sheet){
  // Gets values, not display values. Dates returned as JS Date objects.
  var data = sheet.getSheetValues(1,1,sheet.getMaxRows(), sheet.getMaxColumns())
  data = makeJSON(data)
  return data
}

function getLastColumn(sheet){
  // Returns the last column with values in a sheet.
  var row = sheet.getSheetValues(1,1,1,sheet.getMaxColumns())[0]
  var last_col_index = sheet.getMaxColumns()
  for (i=1; i<row.length; i++){
    if (String(row[i]).length < 1){
      last_col_index = i
      break
    }
  }
  return last_col_index
}

function getLastRow(sheet){
  var values = sheet.getSheetValues(1,1,sheet.getMaxRows(),sheet.getMaxColumns())
  for (i=1; i<values.length; i++){
    if (values[i][0].length == 0){
      return i + 1
    }
  }
}

function formatSheet(sheet){
  // Clears excess columns, freezes rows/columns for easier viewing.
  var last_col_index = getLastColumn(sheet)
  if (last_col_index < sheet.getMaxColumns()){
    sheet.deleteColumns(last_col_index + 1, (sheet.getMaxColumns() - last_col_index))
  }
  sheet.setFrozenColumns(1)
  sheet.setFrozenRows(1)
  sheet.autoResizeColumn(1)
  return sheet
}


function setNumberFormats(sheet, format){
  // Given a number format and sheet, formats all values beginning in the second row.
  var rows = sheet.getMaxRows() - 1
  var columns = sheet.getMaxColumns() 
  var format_list = []
  for (r=0; r<rows; r++){
    var row_format = []
    for (i=0; i<columns; i++){
      row_format.push(format)
    }
    format_list.push(row_format)
  }
  sheet.getRange(2, 1, rows, columns).setNumberFormats(format_list)
  return sheet
}

function addTotalLine(sheet, start_col_index){
  // Add a total line at the bottom of a sheet that totals the rows above it, except for the first row.
  if (!start_col_index){
    var start_col_index = 2  
  }
  var total_row = ['Total']
  var data = sheet.getSheetValues(1,1,sheet.getMaxRows(), sheet.getMaxColumns())
  var num_of_cols = data[0].length
  var last_row_index = data.length
  sheet.insertRowAfter(data.length)
  for (i=start_col_index - 1; i<num_of_cols; i++){
    total_row.push("=SUM(R[-" + (last_row_index - 1) + "]C[0]:R[-1]C[0])")
  }
  data.push(total_row)
  sheet.getRange(1,1,data.length, data[0].length).setValues(data)
  return sheet
}

function makeJSON(data, to_string){
  // Morphs array of arrays (row * columns) representing spreadsheet data into more usable array of
  // JSON objects.
  //
  // Requires array of arrays and optional boolean if string should be return (true=JSON string, false/NaN=array of objects).
  // See https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet#getSheetValues(Integer,Integer,Integer,Integer)
  // for example of input data.
  var keys = data[0]
  var json = []
  for (i=1; i<data.length; i++){
    var row = new Object()
    row.index = i
    for (ii=0; ii<keys.length; ii++){
      row[keys[ii]] = data[i][ii] 
    }
    json.push(row)
  }
  if (to_string){
    return JSON.stringify(json)
  } else { 
    return json
  }
}

function dumpToSheet(sheet, data){
  // Given a target and list of JSON objects, clears all existing data, insersts enough rows,
  // drops in a header (list of the first object's keys), and fills in a row for each object in
  // the list.
  //
  // Requires a Sheet object and array of objects.
  sheet.clear()
  if (sheet.getMaxRows() > 1){
    sheet.deleteRows(1, sheet.getMaxRows() - 1)
  }
  sheet.insertRows(1, data.length)
  var keys = Object.keys(data[0])
  for (i=0; i<keys.length; i++){
    sheet.getRange(1, i + 1).setValue(keys[i])
  }
  var data_array = []
  for (i=0; i<data.length; i++){
    var row_array = []
    for (ii=0; ii<keys.length; ii++){
      row_array.push(data[i][keys[ii]])
    }
    data_array.push(row_array)
  }
  sheet.getRange(2,1,data.length, keys.length).setValues(data_array)
  return sheet
}

function sortSheet(sheet, col_index, descending){
  // Sorts a sheet based on data in a column. Assumes first row is header.
  //
  // Requires a Sheet object and the index of the column by which the sheet should be sorted.
  // Accepts optional boolean to control sort direction (true=descending; false/NaN=ascending).
  var range = sheet.getRange(2, 1, sheet.getMaxRows() - 1, sheet.getMaxColumns())
  if (descending){
    range.sort({column: col_index, ascending: false})
  } else {
    range.sort({column: col_index, ascending: true})
  }
  return sheet
}

function findEmail(array){
  // Given an array of values (likely representing an arbitrary row in a sheet), returns
  // the column index (list position plus one) of the value containing an '@'.
  //
  // Requires an array of strings.
  for (i=0; i<array.length; i++){
    if (String(array[i]).indexOf('@') > 0){
      return i + 1 // Return sheet column index (one more than list index).
    }
  }
}

function doFilter(data, filter_kv){
  // Given an array of objects and a filter object with a single attribute and value, removes 
  // any objects in the array that contain an attribute with the value in the filter.
  //
  // Requires array of objects and filter object with single attribute and value.
  var to_remove = []
  for (i=0; i<data.length; i++){
    var filter_len = Object.keys(filter_kv).length
    var meets_len = 0
    for (f=0; f<filter_len; f++){
      var key = Object.keys(filter_kv)[f]
      var item_value = String(data[i][key])
      var filter_value = new RegExp('(' + String(filter_kv[key]) + ')', 'i')
      if (item_value.search(filter_value) != -1){
        meets_len += 1
      }
      if (meets_len == filter_len){
        to_remove.push(i)
      }
    }
  }
  var output = []
  for (i=0; i<data.length; i++){
    if (to_remove.indexOf(i) == -1){
      output.push(data[i])
    }
  }
  return output
}

function makeStatic(sheet){
  var sheet_display_values = []
  var cols = sheet.getMaxColumns()
  for (i=1; i<sheet.getMaxRows() + 1; i++){
    sheet_display_values.push(sheet.getRange(i, 1, 1, cols).getDisplayValues()[0])
  }
  sheet.getRange(1,1,sheet_display_values.length, cols).setValues(sheet_display_values)
  return sheet
}

function createStaticCopy(){
  var source_wb = SpreadsheetApp.openById(ACTIVE_WORKBOOK)
  var dest_wb = source_wb.copy(source_wb.getName().replace('[live]', '[static]'))
  var dest_sheets = dest_wb.getSheets()
  for (i=0; i<dest_sheets.length; i++){
    makeStatic(dest_sheets[i])
  }
}

// Cache functions.

function updateReset(){
  var cache = CacheService.getDocumentCache()
  cache.put('updating', false)
}

function updateStart(){
  var cache = CacheService.getDocumentCache()
  if (cache.get('updating') == 'true'){
    SpreadsheetApp.getUi().alert('Whoops! There is an update already in progress initiated by ' + cache.get('update_user') + '.')
    return false
  } else {
    cache.put('updating', true)
    cache.put('update_user', Session.getEffectiveUser())
    return true
  }
}

function updateStatus(){
  return CacheService.getDocumentCache().get('updating')
}

function updateEnd(){
  CacheService.getDocumentCache().put('updating', false)
  return false
}

function displayUpdateStatus(){
  SpreadsheetApp.getUi().alert('update_status: ' + updateStatus())
}


// Cache functions end.


// In sheet function.
function superLOOKUP(x_key, y_key, range, sheet_name){
  if (sheet_name && sheet_name.length > 0){
    var sheet = SpreadsheetApp.getActive().getSheetByName(sheet_name)
    var range = sheet.getRange(1,1,sheet.getMaxRows(),sheet.getMaxColumns())    
  }
  if (x_key instanceof Date){
    x_key = x_key.toISOString().slice(0,10)
  }
    if (y_key instanceof Date){
    y_key = y_key.toISOString().slice(0,10)
  }
  var x_values = []
  var y_values = []
  for (i=0; i<range.length; i++){
    if (range[i][0] instanceof Date){
      y_values.push(range[i][0].toISOString().slice(0,10))
    } else {
      y_values.push(range[i][0])
    }
    if (i == 0){
      for (ii=0; ii<range[i].length; ii++){
        if (range[i][ii] instanceof Date){
          x_values.push(range[i][ii].toISOString().slice(0,10))
        } else {
          x_values.push(range[i][ii])
        }
      }
    }
  }
  var x_index = x_values.indexOf(x_key)
  var y_index = y_values.indexOf(y_key)
  if (x_index == -1 || y_index == -1){
    return 0
  }
  var output = range[y_index][x_index]
  if (!output){
    return 0
  }
  return range[y_index][x_index]
}

function forceISOStringDate(data){
  // Accepts row * column array of arrays.
  for (i=0; i<data.length; i++){
    for (ii=0; ii<data[i].length; ii++){
      if (data[i][ii] instanceof Date){
        data[i][ii] = data[i][ii].toISOString().slice(0,10)
      }
    }
  }
  return data 
}

function captureAndFreezeSheet(sheet){
  var output = []
  var empty = []
  for (i=0; i<sheet.getMaxRows(); i++){
    var row = []
    for (ii=0; ii<sheet.getMaxColumns(); ii++){
      var cell_data = ''
      var cell = sheet.getRange(i+1, ii+1)
      cell_data = cell.getFormula()
      if (cell_data.slice(1,cell_data.indexOf('(')) == 'UNIQUE'){
        var unique_form = cell.getFormulaR1C1().split('!')[1].slice(0,-1).split(':')
        var unique_rows = []
        for (s=0; s<unique_form.length; s++){
          unique_rows.push(unique_form[s].split('C')[0].replace('R',''))
        }
        var diff = unique_rows[1] - unique_rows[0]
        for (d=1; d<diff+1; d++){
          empty.push([i + d, ii])
        }
      }
      if (cell_data.length == 0){
        cell_data = cell.getValue()
      }
      row.push(cell_data)
    }
    output.push(row)
  }
  for (i=0; i<empty.length; i++){
    output[empty[i][0]][empty[i][1]] = ''
  }
  makeStatic(sheet)
  return output
}