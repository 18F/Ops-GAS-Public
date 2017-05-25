function _test_callTock(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try {
    var response = callTock('reporting_period_audit.json', '')
    if (response.getResponseCode() != 200){
      return [1, name + '  failed with ' + response.getResponseCode()]
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + '  failed with ' + err]
  }
  return [0, name + '  passed!']
}

function _test_getBillableTimecardsByDates(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  var dates = ['2015-01-01', '2016-01-01']
  try {
    var response = getBillableTimecardsByDates(dates)
    if (response.length < 1) {
      return [1, name + '  failed with ' + response.length + ' items in array. Expected > 0.']
    } 
    if (!response[0].end_date){
      return [1, name + '  failed with missing end_date attribute from first item in array.' + 
              'Expected YYYY-MM-DD date.']
    }
    if (Object.keys(response[0]).length != 16){
      return [1, name + '  failed with ' + Object.keys(response[0]).length + ' keys for' +
        'first item in array. Expected == 16.']
    }
    for (i=0; i<response.length; i++){
      if (response[i].billable == false){
        return [1, name + '  failed with non-billable item found at index ' + i +
        '. Expected only billable items.']
      }
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + '  failed with ' + err]  
  }  
  return [0, name + '  passed!']
}

function _test_getTimecardsByDates(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  var dates = ['2015-01-01', '2016-01-01']
  try {
    var response = getTimecardsByDates(dates)
    if (response.length < 1) {
      return [1, name + '  failed with ' + response.length + ' items in array. Expected > 0.']
    } 
    if (!response[0].end_date){
      return [1, name + '  failed with missing end_date attribute from first item in array.' + 
              'Expected YYYY-MM-DD date.']
    }
    if (Object.keys(response[0]).length != 16){
      return [1, name + '  failed with ' + Object.keys(response[0]).length + ' keys for' +
        'first item in array. Expected == 16.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }  
  return [0, name + ' passed!']
}

function _test_getReportingPeriods(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var response = getReportingPeriods()
    if (response.length == 0){
      return [1, name + ' failed with array length of' + response.length +'. Expected > 0.']
    }
    if (!response[0].start_date){
      return [1, name + ' failed with missing start_date attribute for first item in array. Expected YYYY-MM-DD value.']
    }
    if (Object.keys(response[0]).length != 5){
      return [1, name + '  failed with ' + Object.keys(response[0]).length + ' keys for' +
        'first item in array. Expected == 5.']
        }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getReportingPeriodsWFiscalYear(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var response = getReportingPeriodsWFiscalYear()
    if (!response[0].fiscal_year){
      return [1, name + ' failed with missing fiscal year attribute for first item in array. Expected integer.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getReportingPeriodEndDateArray(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var response = getReportingPeriodEndDateArray()
    if (response[0].length != 10){
      return [1, name + ' failed with the length of the first item in return array != 10. Expected array of YYYY-MM-DD end dates.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getReportingPeriodStartDateArray(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
   try{
    var response = getReportingPeriodStartDateArray()
    if (response[0].length != 10){
      return [1, name + ' failed with the length of the first item in return array != 10. Expected array of YYYY-MM-DD start dates.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getTruants(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var sd = getReportingPeriods()[0].start_date
    var result = getTruants(sd)[0]
    if (Object.keys(result).length != 5){
      return [1, name + ' failed with ' + Object.keys(result).length +
              ' for number of attributes in first object in array. Expected == 5.']
    }
    if (!result.last_name){
      return [1, name + ' failed with ' + result.last_name +
              ' for last_name attribute of first object in array. Expected string.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}
