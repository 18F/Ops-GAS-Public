
function updateRoster(){
  if (updateStart() == false){
    return null
  } 
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 631505845)
  var roster = getOnly18F(getRoster())
  roster = doFilter(roster, {Status: 'zz - Former'})
  roster = doFilter(roster, {Status: 'Onboarding'})
  formatSheet(
    sortSheet(dumpToSheet(sheet, roster), 2)
  )
  sheet.hideSheet()
  updateEnd()
  return roster
}

function updateTimecards(){
  if (updateStart() == false){
    return null
  }
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 0)
  var timecards = getTimecardsWLaborCharge('2016-10-02')
  timecards = doFilter(timecards, {project_name: 'TTS Acq'})
  timecards = doFilter(timecards, {project_name: 'Federalist'})
  timecards = doFilter(timecards, {project_name: 'PIF'}).sort(function(a, b){
    var key_a = new Date(a.end_date + 'T04:00:00.000Z')
    var key_b = new Date(b.end_date + 'T04:00:00.000Z')
    return key_a.getTime() - key_b.getTime()
  })
  var sort_col = Object.keys(timecards[0]).indexOf('end_date') + 1
  formatSheet(
    sortSheet(dumpToSheet(sheet, timecards), sort_col)
  )
  sheet.hideSheet()
  updateEnd()
  return timecards
}

function updateFloatTasks() {
  if (updateStart() == false){
    return null
  } 
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1029809414)
  var tasks = getTasksByReportingPeriods('2016-10-02', '2017-09-30')
  tasks = addTockDataToTasks(tasks)
  tasks = addRosterDataToTasks(tasks)
  tasks = doFilter(tasks, {tock_billable: false})
  tasks = doFilter(tasks, {tock_billable: null})
  tasks = doFilter(tasks, {roster_team: 'Not specified'})
  var sort_col = sheet.getRange(1,1,1,sheet.getMaxColumns()).getValues()[0].indexOf('tock_start_date') + 1
  formatSheet(
    sortSheet(
      dumpToSheet(sheet, tasks), sort_col))
  sheet.hideSheet()
  updateEnd()
  return tasks
}

function updateFloatVersusTock(){
  if (updateStart() == false){
    return null
  }
  var sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1221129725)
  // Get and clean local Tock data.
  var tock_source_sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 0)
  var tock_data = tock_source_sheet.getSheetValues(1,1,tock_source_sheet.getMaxRows(),tock_source_sheet.getMaxColumns())
  for (i=0; i<tock_data.length; i++){
    for (ii=0; ii<tock_data[i].length; ii++){
      if (tock_data[i][ii] instanceof Date){
        tock_data[i][ii] = tock_data[i][ii].toISOString().slice(0,10)
      }
    }
  }
  var timecards = makeJSON(tock_data)
  for (t=0; t<timecards.length; t++){
    timecards[t].tock_start_date = timecards[t].start_date
    timecards[t].tock_id = timecards[t].project_id
    timecards[t].tock_user = timecards[t].user
    timecards[t].total_weekly_hours = timecards[t].hours_spent
  }
  // Get and clean local Float data.
  var float_source_sheet = getSheetById(SpreadsheetApp.openById(ACTIVE_WORKBOOK), 1029809414)
  var float_data = float_source_sheet.getSheetValues(1,1,float_source_sheet.getMaxRows(),float_source_sheet.getMaxColumns())
  for (i=0; i<float_data.length; i++){
    for (ii=0; ii<float_data[i].length; ii++){
      if (float_data[i][ii] instanceof Date){
        float_data[i][ii] = float_data[i][ii].toISOString().slice(0,10)
      }
    }
  }
  var tasks = makeJSON(float_data)
  // Match Tock and Float data to calculate diff (Tock hours minus Float hours).
  timecards = getDiffForTwoArrays(timecards, tasks, ['tock_start_date', 'tock_id', 'tock_user'], 'total_weekly_hours', '-', 'float_hours')
  // Clean up duplicative fields in Tock data used for matching.
  for (t=0; t<timecards.length; t++){
    delete timecards[t].tock_start_date 
    delete timecards[t].tock_id
    delete timecards[t].tock_user
    delete timecards[t].total_weekly_hours
  }
  // Dump result to sheet.
  var sort_col = sheet.getRange(1,1,1,sheet.getMaxColumns()).getValues()[0].indexOf('start_date') + 1
  formatSheet(
    sortSheet(
      dumpToSheet(sheet, timecards), sort_col))
  sheet.hideSheet()
  updateEnd()
  return timecards
}