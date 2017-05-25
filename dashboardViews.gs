/*
function test_t(){
  var source_sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1221129725)
  var data = source_sheet.getSheetValues(1,1,source_sheet.getMaxRows(),source_sheet.getMaxColumns())
  for (i=0; i<data.length; i++){
    for (ii=0; ii<data[i].length; ii++){
      if (data[i][ii] instanceof Date){
        data[i][ii] = data[i][ii].toISOString().slice(0,10)
      }
    }
  }
  var timecards = makeJSON(data)
  Logger.log(_tock_updateTotalsByPeriodByTeamHours(timecards))
}
*/

function _floattock_updateFloatVTockByPeriodByProjectHours(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1463314933)
  var x = 'start_date'
  var y = 'project_name'
  var values = 'diff_total_weekly_hours'
  var data = totalsByXByY(timecards, x, y, values)
  addSummaryColumns(
    formatSheet(setNumberFormats(addTotalLine(
      sortSheet(
        dumpTo2DSheet(sheet, data, x, y, 'Sum of ' + values), 1)
    ), '#,###')), ['Sum', 'Average'])
  sheet.getRange(1,1).setValue('Tock actual hours minus Float scheduled hours').setFontStyle('italic')
  sheet.setColumnWidth(1,400)
  return timecards
}

function _floattock_updateFloatVTockByPeriodByPersonHours(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 866138618)
  var x = 'start_date'
  var y = 'user'
  var values = 'diff_total_weekly_hours'
  var data = totalsByXByY(timecards, x, y, values)
  addSummaryColumns(
    formatSheet(setNumberFormats(addTotalLine(
      sortSheet(
        dumpTo2DSheet(sheet, data, x, y, 'Sum of ' + values), 1)
    ), '#,###')), ['Sum', 'Average'])
  sheet.getRange(1,1).setValue('Tock actual hours minus Float scheduled hours').setFontStyle('italic')
  return timecards
}

function _floattock_updateFloatVTockByPeriodByTeamHours(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1723363751)
  var x = 'start_date'
  var y = 'team'
  var values = 'diff_total_weekly_hours'
  var data = totalsByXByY(timecards, x, y, values)
  addSummaryColumns(
    formatSheet(setNumberFormats(addTotalLine(
      sortSheet(
        dumpTo2DSheet(sheet, data, x, y, 'Sum of ' + values), 1)
    ), '#,###')), ['Sum', 'Average'])
  sheet.getRange(1,1).setValue('Tock actual hours minus Float scheduled hours').setFontStyle('italic')
  return timecards
}

function _float_updateFloatHoursByPeriod(tasks){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 2085314104)
  var data = totalsByX(tasks, 'tock_start_date', ['total_weekly_hours'])
  formatSheet(
    addTotalLine(
      sortSheet(
        dumpToSheet(sheet, data), 1)
    ))
}

function _float_updateFloatHoursByPeriodByTeam(tasks){  
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 8214245)
  var x = 'tock_start_date'
  var y = 'roster_team'
  var values = 'total_weekly_hours'
  var data = totalsByXByY(tasks, x, y, values)
    addSummaryColumns(
      formatSheet(setNumberFormats(addTotalLine(
        sortSheet(
          dumpTo2DSheet(sheet, data, x, y, 'Sum of ' + values), 1)
      ), '#,###')), ['Sum', 'Average'])
  return tasks
}

function _roster_updateBillableEmployeesByTeam(roster){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1661309010)
  var x = 'Billable Category'
  var y = 'Team (Chapter/BU)'
  var values = 'count'

  
  
  // !! NEEDS TO BE REFACTORED
  var data = totalsByXByYTalent(roster, x, y)
  
  
  
    addSummaryColumns(
      formatSheet(setNumberFormats(addTotalLine(
        sortSheet(
          dumpTo2DSheet(sheet, data, x, y, values), 1)
      ), '#,###')), ['Sum'])
  return roster
}

function _tock_updateTotalsByGrade(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1134487883)
  var data = totalsByX(timecards, 'grade', ['hours_spent', 'labor_charge'])
  formatSheet(setNumberFormats(addTotalLine(
    sortSheet(
      dumpToSheet(sheet, data), 3, true)
  ), '#,###'))
  return timecards
}

function _tock_updateTotalsByPerson(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1923937217)
  var data = totalsByX(timecards, 'user', ['hours_spent', 'labor_charge'])
  formatSheet(setNumberFormats(addTotalLine(
    sortSheet(
      dumpToSheet(sheet, data), 3, true)
  ), '#,###'))
  return timecards
}

function _tock_updateTotalsByProject(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 470073330)
  var data = totalsByX(timecards, 'project_name', ['hours_spent', 'labor_charge'])
  formatSheet(setNumberFormats(addTotalLine(
    sortSheet(
      dumpToSheet(sheet, data), 3, true)
  ), '#,###'))
  sheet.setColumnWidth(1,400)
  return timecards
}

function _tock_updateTotalsByTeam(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 398072027)
  var data = totalsByX(timecards, 'team', ['hours_spent', 'labor_charge'])
  formatSheet(
    setNumberFormats(addTotalLine(
      sortSheet(
        dumpToSheet(sheet, data), 3, true)
    ), '#,###'))
  return timecards
}

function _tock_updateTotalsByPeriodByTeamHours(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1561473113)
  var x = 'start_date'
  var y = 'team'
  var values = 'hours_spent'
  var data = totalsByXByY(timecards, x, y, values)
  addSummaryColumns(
    formatSheet(setNumberFormats(addTotalLine(
      sortSheet(
        dumpTo2DSheet(sheet, data, x, y, 'Sum of ' + values), 1)
    ), '#,###')), ['Sum', 'Average'])
  return timecards}

function _tock_updateTotalsByPeriodByTeamCharges(timecards){
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 873303413)
  var x = 'start_date'
  var y = 'team'
  var values = 'labor_charge'
  var data = totalsByXByY(timecards, x, y, values)
  addSummaryColumns(
    formatSheet(setNumberFormats(addTotalLine(
      sortSheet(
        dumpTo2DSheet(sheet, data, x, y, 'Sum of ' + values), 1)
    ), '#,###')), ['Sum', 'Average'])
  sheet.setColumnWidth(1,400)
  return timecards
}