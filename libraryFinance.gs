function getRoster() {
  // Returns array of objects representing the data in TTS-Talent Database - v1.0.
  // See https://docs.google.com/spreadsheets/d/1JabICP7b0QtXOYa00dAW5m8n7YmEaWy5RVQ-7BrodC8/edit#gid=1388593896.
  var workbook = SpreadsheetApp.openById(roster_wb)
  var sheet = getSheetById(workbook, roster_sheet)
  return makeJSON(sheet.getSheetValues(1,1,sheet.getMaxRows(), sheet.getMaxColumns()))
}

function getOnly18F(roster){
  // Returns an array of objects, each representing an employee, from the TTS roster where only 18F (TE*) employees are
  // included.
  //
  // Requires array of objects same or similar to the result of getRoster().
  var office_sym_regex = new RegExp('^(TE)')
  var output = []
  var keys = Object.keys(roster[0])
  for (i=0; i<keys.length; i++){
    var key = keys[i]
    if (String(roster[0][key]).indexOf('@') != -1){
      var email_key = key
      break
    }
  }
  for (i=0; i<roster.length; i++){
    if (roster[i]['Office Symbol'].search(office_sym_regex) != -1 || 
        roster[i]['ARCHIVE - Office Symbol'].search(office_sym_regex) != -1){
      roster[i].tock_username = roster[i][email_key].split('@')[0].toLowerCase()
      output.push(roster[i])
    }
  }
  return output
}

function addTimecardData(roster, start_date, end_date){
  var dates = makeDateMap(start_date, end_date)
  var timecard_data = getBillableTimecardsByDates(dates)
  var timecard_data_map = {}
  for (var i=0; i<timecard_data.length; i++){
    timecard_data_map[timecard_data[i].user] = []
  }
  for (var i=0; i<timecard_data.length; i++){
    timecard_data_map[timecard_data[i].user].push(timecard_data[i])
  }
  for (var i=0; i<roster.length; i++){
    roster[i].tock_data = timecard_data_map[roster[i].tock_username] || []
  }
  return roster
}

function getLaborRates(){
  // Returns array of objects. Parses the sheet containing matrix of labor rates by grade level across 
  // different revenue codes. Revenue codes correspond with different labor rate structures. When a new 
  // set of labor rates is approved, a new revenue code is used to differentiate b/w the new and old 
  // set of rates, etc...
  var workbook = SpreadsheetApp.openById(revenue_facts_wb)
  var sheet = getSheetById(workbook, '999075704')
  var labor_rates = sheet.getSheetValues(2,1,sheet.getMaxRows(),sheet.getMaxColumns())
  var output = []
  var keys = []
  for (i=0; i<labor_rates[0].length; i++){
    if (String(labor_rates[0][i]).length > 0){
      keys.push(labor_rates[0][i])
    } else {
      break
    }
  }
  for (i=0; i<labor_rates.length; i++){
    if (String(labor_rates[i][0]).length > 0){
      output.push(labor_rates[i].slice(0, keys.length))
    }  
  }
  return makeJSON(output)
}

function getRevenueCodes(){
  // Parses each project's revenue code across each Tock reporting period. If organizational labor rates are changed 
  // during the life of a project, the project's revenue code may also change (unless it is somehow "grandfathered" in
  // to the prior rates.
  //
  // Temporal considerations: Organized by Tock reporting period end date.
  var workbook = SpreadsheetApp.openById(revenue_facts_wb)
  var sheet = getSheetById(workbook, '40632649')
  var revenue_codes = sheet.getSheetValues(1,1,sheet.getMaxRows(),sheet.getMaxColumns())
  var periods = sheet.getRange(1,1,1,sheet.getMaxColumns()).getDisplayValues()
  revenue_codes[0] = periods[0]
  for (i=1; i<revenue_codes[0].length; i++){
    revenue_codes[0][i] = new Date(revenue_codes[0][i]).toISOString().slice(0,10)
  }
  return makeJSON(revenue_codes)
}

function getGradeHistory(){
  // Parses each employee's GS grade history across each Tock reporting period. If a person's grade changes during the life of
  // a project(s), the hourly rate charged for their hours should also change too.
  //
  // Temporal considerations: Organized by Tock reporting period end date.
  var workbook = SpreadsheetApp.openById(revenue_facts_wb)
  var sheet = getSheetById(workbook, '859799498')
  var grade_history = sheet.getSheetValues(1,1,sheet.getMaxRows(),sheet.getMaxColumns())
  var periods = sheet.getRange(1,1,1,sheet.getMaxColumns()).getDisplayValues()
  grade_history[0] = periods[0]
  for (i=1; i<grade_history[0].length; i++){
    grade_history[0][i] = new Date(grade_history[0][i]).toISOString().slice(0,10)
  }
  return makeJSON(grade_history)
}

function addGradeHistory(roster, grade_history){
  // Adds GS grade info for each employee in a roster.
  //
  // Requires an array of employee objects and an array of employee grade history objects.
  var output = []
  var grade_history_map = {}
  for (i=0; i<grade_history.length; i++){
    grade_history_map[grade_history[i].employee] = grade_history[i]
  }
  for (i=0; i<roster.length; i++){
    roster[i].grade_history =  grade_history_map[roster[i].tock_username] || {}
  }
  return roster
}

function addRateInfo(roster, revenue_codes, labor_rates){
  for (i=0; i<roster.length; i++){
    // For each employee.
    for (ii=0; ii<roster[i].tock_data.length; ii++){ /*****/
      roster[i].tock_data[ii].grade = roster[i].grade_history[roster[i].tock_data[ii].end_date]
      // For each timecard for each employee, add grade for that timecard.
      for (iii=0; iii<revenue_codes.length; iii++){
        // For each revenue code.
        if (roster[i].tock_data[ii].project_name.toLowerCase() == revenue_codes[iii].project_name.toLowerCase()){
          // If the project name on the employee's timecard matches the project name of a revenue code.
          roster[i].tock_data[ii].revenue_code = revenue_codes[iii][roster[i].tock_data[ii].end_date]
          // Append the revenue code to the timecard by matching the end date of the revenue code with the
          // end date of the timecard.
        }
      }
      for (q=0; q<labor_rates.length; q++){
        if (labor_rates[q]['Rate Type Code'] == roster[i].tock_data[ii].grade){
          roster[i].tock_data[ii].labor_rate = labor_rates[q][roster[i].tock_data[ii].revenue_code]
        }
      }
      roster[i].tock_data[ii].labor_charge = 
        parseFloat(roster[i].tock_data[ii].labor_rate) * parseFloat(roster[i].tock_data[ii].hours_spent)
    }
  }
  return roster
}

function getTimecardsWLaborCharge(start_date, end_date){
  // Returns array of Tock timecards with calculated labor charge and team info.
  //
  // Requires ten-digit ISO start date (YYYY-MM-DD).
  if (!end_date){
    var end_date = (new Date()).toISOString().slice(0,10)
    }
  var output = []
  var grade_history = getGradeHistory()
  var revenue_codes = getRevenueCodes()
  var labor_rates = getLaborRates()
  var roster = getRoster()
  roster = getOnly18F(roster)
  roster = addTimecardData(roster, start_date, end_date)
  roster = addGradeHistory(roster, grade_history)
  roster = addRateInfo(roster, revenue_codes, labor_rates)
  for (var i=0; i<roster.length; i++){
    for (var ii=0; ii<roster[i].tock_data.length; ii++){
      roster[i].tock_data[ii].team = roster[i]['Team (Chapter/BU)']
      output.push(roster[i].tock_data[ii])
    }
  }
  return output
}
