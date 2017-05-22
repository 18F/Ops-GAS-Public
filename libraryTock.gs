function callTock(section, params) {
  // See https://github.com/18F/tock/tree/master/api-docs. Returns parsable JSON string.
  //
  // Requires API section string and REST-style parameters (e.g. "?date=2016-01-01&billable=True") string.
  var url = 'https://tock.18f.gov/api/'
  var options = {
    'method': 'get',   
    'contentType': 'application/json',
    'headers': {'Authorization': 'Token '+ tock_api_key},
  }
  try {
    var response = UrlFetchApp.fetch(url + section + params, options)
    }
  catch(err){
    var response = err
    }
  return response
}

function getReportingPeriods(){
  // Returns array of reporting period objects from Tock per 
  // https://github.com/18F/tock/blob/7a8ce9226d1e83b19fb8c27fed882c630e387462/api-docs/reporting-period-audit.md.
  return JSON.parse(callTock('reporting_period_audit.json',''))
}

function getReportingPeriodsWFiscalYear(){
  // Returns array of reporting period objects with fiscal year attribute from Tock per 
  // https://github.com/18F/tock/blob/master/api-docs/reporting-period-audit.md.
  var periods = getReportingPeriods()
  for (i=0; i<periods.length; i++){
    periods[i].fiscal_year = findFiscalYear(periods[i].end_date) 
  }
  return periods
}

function getReportingPeriodEndDateArray(){
  // Returns array of Tock reporting period end dates as strings.
  var periods = getReportingPeriods()
  var array = []
  for (i=0; i<periods.length; i++){
    array.push(periods[i].end_date)
  }
  return array
}

function getReportingPeriodStartDateArray(){
  // Returns array of Tock reporting period start dates as strings.
  var periods = getReportingPeriods()
  var array = []
  for (i=0; i<periods.length; i++){
    array.push(periods[i].start_date)
  }
  return array
}

function getTimecardsByDates(dates){
  // Returns an array of all timecards from periods in which dates provide fall. 
  // Getting individual `date=' instead of using the `after=` parameter availabe from the Tock API
  // reduces the instances of Tock failing b/c of resource constraints or the response timing out.
  // See https://github.com/18F/tock/blob/22a90a306bb6677bd1ea32ac9f2dc63abc289495/api-docs/timecards.md.
  //
  // Requires an array of ten digit ISO format dates (`YYYY-MM-DD`).
  var output = []
  var now = (new Date()).toISOString().slice(0, 16)
  for (i=0; i<dates.length; i++){
    var sub = JSON.parse(callTock('timecards.json', '?date=' + dates[i]))
    for (ii=0; ii<sub.length; ii++){
      sub[ii].fetched_at = now
      output.push(sub[ii])
    }
  }
  return output
}

function getBillableTimecardsByDates(dates){
  // Returns an array of all _billable_ timecards from periods in which dates provide fall. 
  // Getting individual `date=' instead of using the `after=` parameter availabe from the Tock API
  // reduces the instances of Tock failing b/c of resource constraints or the response timing out.
  //
  // Requires an array of ten digit ISO format dates (`YYYY-MM-DD`).
  var output = []
  var now = (new Date()).toISOString().slice(0, 16)
  for (i=0; i<dates.length; i++){
    var sub = JSON.parse(callTock('timecards.json', '?date=' + dates[i] + '&billable=True'))
    for (ii=0; ii<sub.length; ii++){
      sub[ii].fetched_at = now
      output.push(sub[ii])
    }
  }
  return output
}

function getTruants(start_date){
  // Returns array of objects representing users who have not filed a timecard for the reporting period
  // corresponding with the supplied start date.
  //
  // Requires ten-digit ISO string date for reporting period requested.
  return JSON.parse(callTock('reporting_period_audit/' + start_date + '.json', '')) 
}

// !!!!!!!!!!!!!!!! \/ NEED TESTS \/ !!!!!!!!!!!!!!!!

function getPeriods(timecards){
  // Get a list of reporting periods from a list of timecards.
  var periods = []
  for (i=0; i<timecards.length; i++){
    var start_date = timecards[i].start_date
    if (periods.indexOf(start_date) == -1){
        periods.push(start_date)        
    }
  }
  return periods
}

function selectPeriods(timecards, start, end){
  // Given a start ISO-format start and end date, return the timecards that fall b/w those dates.
  var output = []
  var start = new Date(start + 'T04:00:00.000Z')
  var end = new Date(end + 'T04:00:00.000Z')
  for (i=0; i<timecards.length; i++){
    if(start <= timecards[i].start_date && end >= timecards[i].end_date){
      output.push(timecards[i])
    }
  }
  return output
}