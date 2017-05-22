/*

// ****** At compile. ******

// This is an incomplete feature intended to create a set of anonymous functions accessible via a UI menu that when called
// update a specific reporting period. After speeding up the full data update (decrease from ~20 minutes to ~3 minutes)
// this feature was no longer needed. However, this is a greate template for dynamically building a large number of anonymous functions
// at compile time (won't work at runtime) that can be used to make menus much more powerful.

function createMenuFunctions(scope, functions){
  for (i=0; i<functions.length; i++){
    scope['get_' + functions[i].key] = functions[i].func
  }
}

var dates = [{fy: '2017', end_dates: ['2016-10-01', '2017-03-01', '2016-10-03']}, {fy: '2016', end_dates: ['2015-11-01', '2016-04-01']}] 

var functions = []
for (d=0; d<dates.length; d++){
  for (dd=0; dd<dates[d]['end_dates'].length; dd++){
    var end_date = dates[d]['end_dates'][dd]
    var fy = dates[d].fy
    functions.push({
      key: end_date,
      func: eval("function(){update_single_period('"+ end_date +"')}"), 
      fy: fy
    })
  }
}

createMenuFunctions(this, functions)

// ****** At runtime. ******

// Implements the UI menu elements linked to dynamically created
// anonymous functions.
function onOpen(){
  var ui = SpreadsheetApp.getUi()
  var menu = ui.createMenu('Management')
  menu.addItem('Update all data', 'run_update')
  
  var by_date_menu = ui.createMenu('Update by period end date')
  var fys = []
  for (i=0; i<functions.length; i++){
    if (fys.indexOf(functions[i].fy) == -1){
      fys.push(functions[i].fy)
    }
  }
  for (i=0; i<fys.length; i++){
    var sub_menu = ui.createMenu(fys[i])
    for (ii=0; ii<functions.length; ii++){
      if (fys[i] == functions[ii].fy){
        sub_menu.addItem(functions[ii].key, 'get_' + functions[ii].key)
      }
    }
    by_date_menu.addSubMenu(sub_menu)
  }
  menu.addSubMenu(by_date_menu)
  menu.addToUi()
}
  
// Part of incomplete feature described at top of file.
function update_single_period(){
  var ed ='2016-10-02'
  var sheet = SpreadsheetApp.getActiveSheet()
  var new_data = JSON.parse(call_tock('timecards.json', '?date=' + ed))
  var end_date = new_data[0]['end_date']
  clear_single_period(end_date, sheet)
  add_single_period(new_data, sheet)
}

function clear_single_period(end_date, sheet){
  var header = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues()
  Logger.log(header)
  var index = header[0].indexOf('end_date')
  Logger.log(index)
  for (i=2; i<sheet.getMaxRows()+1; i++){
    var row = sheet.getRange(i, 1, 1, sheet.getMaxColumns()).getDisplayValues()
    if (row[0][index] == end_date){
      sheet.deleteRow(i)
    }
  }
}

function add_single_period(new_data, sheet){
  var last_row = sheet.getMaxRows()
  var keys = Object.keys(new_data[0])
  //var header = sheet.getRange(1, 1, 1, sheet.getMaxColumns()).getValues() / don't need
  for (i=0; i<new_data.length; i++){
    var new_row = []
    for (k=0; k<keys.length; k++){
      new_row.push(new_data[i][k])        
    }
    var dest_row = sheet.getRange(1, last_row + 1 + i, 1, sheet.getMaxColumns())
    dest_row.setValues(new_row)
  }
}

// Functions for exporting data to a CSV saved in the user's drive.
function make_csv(response){
  var keys = Object.keys(response[0])
  var output = ''
  for (i=0; i<keys.length; i++){
    output += keys[i]
    if (i+1 != keys.length){
      output += ','
    } else {
      output += '\n'
    }
  }
  for (r=0; r<response.length; r++){
    for (k=0; k<keys.length; k++){
      var value = String(response[r][keys[k]])
      if (value.indexOf(',')){
          value = '"'+ value + '"'
          }
      output += value
      if (k+1 != Object.keys(response[r]).length){
        output += ','
      } else {
        output += '\n'
      }
    }
  }
  return output
}
  
function write_file(title, output){
  var name = title + '_' + Utilities.formatDate(new Date(), 'EDT', 'yyyy-MM-dd_HH:mm') +  '.csv'
  var id = DriveApp.createFile(
   name,
   output
 ).getId()
 return name
}  

function trim_columns(sheet, break_point){
  if (break_point){
    sheet.deleteColumns(break_point + 1, sheet.getMaxColumns() - break_point)  
  } else {
    var row_one = sheet.getRange(1, 1, 1, sheet.getMaxColumns())
    var row_one_values = row_one.getValues()[0]
    for (i=0; i<row_one_values.length; i++){
      if (row_one_values[i].length < 1){
        break_point = i
        break
      } else {
        break_point = sheet.getMaxColumns()
      }
    }
    if (break_point < sheet.getMaxColumns()){
      sheet.deleteColumns(break_point + 1, sheet.getMaxColumns() - break_point)
    }
  }
}


*/