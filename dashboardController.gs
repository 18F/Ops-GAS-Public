function updateDataSourcesAndRefreshAllSheets(){
  var s = new Date().getTime()
  if (CacheService.getScriptCache().get('test_status') !== '0'){
    return null
  }
  if (updateStatus() == 'true'){
    return updateStart()
  }
  Logger.log('captureAndFreezeSheet, ' + new Date().getTime())
  var dashboard_sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), DASHBOARD_SHEET_ID)
  var dashboard_formulas = captureAndFreezeSheet(dashboard_sheet)
  Logger.log('updateTimecards, ' + new Date().getTime())
  updateTimecards()
  Logger.log('updateRoster, ' + new Date().getTime())
  updateRoster()
  Logger.log('updateFloatTasks, ' + new Date().getTime())
  updateFloatTasks()
  Logger.log('updateFloatVersusTock, ' + new Date().getTime())
  updateFloatVersusTock()
  Logger.log('refreshFromData tock, ' + new Date().getTime())
  refreshFromData(0, 'tock')
  Logger.log('refreshFromData roster, ' + new Date().getTime())
  refreshFromData(631505845, 'roster')
  Logger.log('refreshFromData float, ' + new Date().getTime())
  refreshFromData(1029809414, 'float')
  Logger.log('clean up, ' + new Date().getTime())
  dashboard_sheet.clearContents()
  dashboard_sheet.getRange(1,1,dashboard_sheet.getMaxRows(),dashboard_sheet.getMaxColumns()).setValues(dashboard_formulas)
  dashboard_sheet.getRange(1,7).setValue('=TEXT(SUMIF(\'Float, By Period (Billable Hours)\'!A:A,">"&B1,\'Float, By Period (Billable Hours)\'!B:B)*B2,"$0,00")')
  dashboard_sheet.getRange(1,1).setNote('Latest execution time:\n' + Math.round((new Date().getTime() - s)/1000/60) + ' minutes.' +
    '\n\nCompleted at:\n' + new Date())
}

function refreshFromData(data_sheet_id, name){
  var source_sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), data_sheet_id)
  var data = source_sheet.getSheetValues(1,1,source_sheet.getMaxRows(),source_sheet.getMaxColumns())
  data = makeJSON(forceISOStringDate(data))
  var keys = Object.keys(this)
  var call_list = []
  var function_prefix = '_' + name +  '_update'
  for (i=0; i<keys.length; i++){
    if (keys[i].slice(0,function_prefix.length) == function_prefix){
      call_list.push(keys[i] + '(data)')
    }
  }
  for (var x=0; x<call_list.length; x++){
    eval(call_list[x])
  }
}

