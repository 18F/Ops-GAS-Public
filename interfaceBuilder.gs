// This script utilizes annotated Tock timecard data to generate summary sheets for use in business analysis.
// Submitted of OCISO review 04/17/2017.

function makeMenus(){
  var ui = SpreadsheetApp.getUi()  
  var user = Session.getActiveUser()
  if (MGMT_USERS.indexOf(String(user)) < 0){
    return null
  }
  var test_status = CacheService.getScriptCache().get('test_status')
  if (test_status === '0'){
    var menu = ui.createMenu('Management')
    menu.addItem('Full update', 'updateDataSourcesAndRefreshAllSheets')
    menu.addItem('Check truants', 'getLatestTruants')
    menu.addItem('Update public dashboard', 'updatePublicDash')
    menu.addSeparator()
    var dev_tools_menu = ui.createMenu('Developer tools')
    dev_tools_menu.addItem('View test report', 'displayTestReport')
    dev_tools_menu.addItem('View update status', 'displayUpdateStatus')
    dev_tools_menu.addItem('Reset update cache', 'updateReset')
    menu.addSubMenu(dev_tools_menu)
    menu.addToUi()
  } else if(test_status === null) {
    ui.createMenu('Tests missing')
    .addItem('Run tests (reload page after)', 'autoTestRunner')
    .addToUi()
  } else {
    ui.createMenu('Tests failing')
    .addItem('Show report', 'displayTestReport')
    .addToUi()      
  }
}

function getLatestTruants(){
  var start_date = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 2107937955)
  .getRange("B1")
  .getValue()
  .toISOString().slice(0,10)
  try {
  var truants = getTruants(start_date)
  }
  catch (e){
    SpreadsheetApp.getUi().alert('Failed to return truant list with: \n \n' + e)
    return null
  }
  var msg = 'There are ' + truants.length + ' truants for the period starting ' + start_date + ': \n\n'
  for (i=0; i<truants.length; i++){
    msg = msg + truants[i].username + '\n'
  }
  SpreadsheetApp.getUi().alert(msg)
}

