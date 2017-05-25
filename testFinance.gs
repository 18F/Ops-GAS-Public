function _test_getRevenueCodes(){
  // Revenue codes. Example expected output structure:
  // {2016-04-30=2.0, 2015-12-05=2.0, 2016-07-23=2.0, 2016-11-05=3.0, 2017-01-14=3.0, 2017-06-24=3.0, 2017-04-01=3.0, 2017-09-16=3.0, project_name=foo, 2017-04-08=3.0, 2017-09-23=3.0, 2016-02-06=2.0, 2017-07-01=3.0, 2016-04-23=2.0, 2016-07-16=2.0, 2017-01-21=3.0, 2017-04-15=3.0, 2017-07-08=3.0, 2016-10-29=3.0, 2016-02-20=2.0, 2015-12-12=2.0, 2016-07-30=2.0, index=1.0, 2017-01-28=3.0, 2015-12-19=2.0, 2016-10-22=3.0, 2016-05-07=2.0, 2017-09-30=3.0, 2016-02-13=2.0, 2015-12-26=2.0, 2016-07-02=2.0, 2016-10-15=3.0, 2017-03-11=3.0, 2015-10-03=2.0, 2017-06-03=3.0, 2017-08-26=3.0, 2016-12-31=3.0, 2017-03-18=3.0, 2016-04-09=2.0, 2017-06-10=3.0, 2016-01-16=2.0, 2017-09-02=3.0, 2016-04-02=2.0, 2016-06-25=2.0, 2016-09-17=2.0, 2017-06-17=3.0, 2015-10-10=2.0, 2017-09-09=3.0, 2016-01-30=2.0, 2016-10-08=3.0, 2017-03-25=3.0, 2017-01-07=3.0, 2015-10-17=2.0, 2016-12-24=3.0, 2016-10-01=2.0, 2016-04-16=2.0, 2016-07-09=2.0, 2016-09-24=2.0, 2016-01-23=2.0, 2016-12-17=3.0, 2016-06-11=2.0, 2017-08-05=3.0, 2017-05-13=3.0, 2015-10-24=2.0, 2017-02-25=3.0, 2016-12-10=3.0, 2016-03-19=2.0, 2017-08-12=3.0, 2016-09-10=2.0, 2017-05-20=3.0, 2016-03-12=2.0, 2016-06-04=2.0, 2016-08-27=2.0, 2017-05-27=3.0, 2017-08-19=3.0, 2015-10-31=2.0, 2017-03-04=3.0, 2015-11-07=2.0, 2016-12-03=3.0, 2016-01-09=2.0, 2016-01-02=2.0, 2016-03-26=2.0, 2016-06-18=2.0, 2016-09-03=2.0, 2015-11-14=2.0, 2016-08-13=2.0, 2016-05-21=2.0, 2017-04-29=3.0, 2017-04-22=3.0, 2017-07-15=3.0, 2017-02-04=3.0, 2016-11-26=3.0, 2017-07-22=3.0, 2016-02-27=2.0, 2016-08-06=2.0, 2016-05-14=2.0, 2016-11-19=3.0, 2017-02-11=3.0, 2017-05-06=3.0, 2017-07-29=3.0, 2015-11-21=2.0, 2016-08-20=2.0, 2017-02-18=3.0, 2015-11-28=2.0, 2016-11-12=3.0, 2016-03-05=2.0, 2016-05-28=2.0}
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var result = getRevenueCodes()[0]
    if (!result.project_name){
      return [1, name + ' failed with ' + result.project_name +' for project_name attribute. Expected project name string.']
    }
    var now = new Date()
    var test_date = new Date(now.getTime() - ((now.getDay() + 1) * 1000 * 60 * 60 * 24)).toISOString().slice(0,10)
    if (!result[test_date]){
      return [1, name + ' failed with ' + result[test_date] + ' for key ' + test_date + ' for first object in array. ' +
      'Expected a revenue code number.']
    }
    if (Object.keys(result).length < 100){
      return [1, name + ' failed with ' + Object.keys(result).length + ' keys for first object in array. Expected >= 100.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getGradeHistory(){
  // Grade history. Example expected output structure:
  // {2016-11-05=15.0, 2016-12-17=15.0, 2017-01-14=15.0, 2017-06-24=15.0, 2017-08-05=15.0, 2017-04-01=15.0, 2017-05-13=15.0, 2017-02-25=15.0, 2017-09-16=15.0, 2016-12-10=15.0, employee=john.smith, 2017-04-08=15.0, 2017-08-12=15.0, 2017-05-20=15.0, 2017-09-23=15.0, 2017-07-01=15.0, 2017-01-21=15.0, 2017-04-15=15.0, 2017-05-27=15.0, 2017-07-08=15.0, 2016-10-29=15.0, 2017-08-19=15.0, 2017-03-04=15.0, index=1.0, 2017-01-28=15.0, 2016-10-22=15.0, 2016-12-03=15.0, 2017-09-30=15.0, 2016-10-15=15.0, 2017-03-11=15.0, 2017-04-29=15.0, 2017-04-22=15.0, 2017-07-15=15.0, 2017-02-04=15.0, 2017-06-03=15.0, 2017-08-26=15.0, 2016-12-31=15.0, 2017-03-18=15.0, 2016-11-26=15.0, 2017-07-22=15.0, 2017-06-10=15.0, 2017-09-02=15.0, 2017-06-17=15.0, 2016-11-19=15.0, 2017-02-11=15.0, 2017-05-06=15.0, 2017-07-29=15.0, 2017-09-09=15.0, 2016-10-08=15.0, 2017-03-25=15.0, 2017-01-07=15.0, 2017-02-18=15.0, 2016-11-12=15.0, 2016-12-24=15.0}
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var result = getGradeHistory()[0]
    if (!result.employee){
      return [1, name + ' failed with ' + result.employee +' for employee attribute. Expected an employee name string.']
    }
    var now = new Date()
    var test_date = new Date(now.getTime() - ((now.getDay() + 1) * 1000 * 60 * 60 * 24)).toISOString().slice(0,10)
    if (!result[test_date]){
      return [1, name + ' failed with ' + result[test_date] + ' for key ' + test_date + ' for first object in array. ' +
      'Expected a revenue code number.']
    }
    if (Object.keys(result).length < 50){
      return [1, name + ' failed with ' + Object.keys(result).length + ' keys for first object in array. Expected >= 50.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getLaborRates(){
  // Labor rates. Example expected output structure:
  // {0=107.0, 1=59.0, 2=146.0, Rate Type Code=7.0, P3=, 3=185.0, -1=0.0, P4=170.0, 4=, index=1.0}
  
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var result = getLaborRates()[0]
    if (!result['Rate Type Code']){
      return [1, name + ' failed with ' + result['Rate Type Code'] +' for attribute `Rate Type Code`. Expected a number representing a GS grade.']
    }
    if (Object.keys(result).length < 10){
      return [1, name + ' failed with ' + Object.keys(result).length + ' keys for first object in array. Expected >= 10.']   
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getRoster(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var result = getRoster()[0]
    if (!result['Official Email (UID)']){
      return [1, name + ' failed with ' + result['Official Email (UID)'] +' for attribute `Official Email (UID)`. Expected a string email address.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getOnly18F(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var roster = getRoster()
    var result = getOnly18F(roster)
    if (roster.length <= result.length){
      return [1, name + ' failed with a filtered roster length of ' + result.length +' vs unfiltered length of ' + roster.length + 
              '. Expected filtered roster to be shorter than unfiltered.']
    }
    for (i=0; i<result.length; i++){
      if (result[i]['Office Symbol'].slice(0, 2) != 'TE' &&
         result[i]['Office Symbol'] != 'Former'){
        return [1, name + ' failed with ' + result[i]['Office Symbol'].slice(0, 2) + '. Expected `TE`.' ]  
      }
    }
    for (i=0; i<result.length; i++){
      if (result[i]['ARCHIVE - Office Symbol'].slice(0, 2) != 'TE' && 
          result[i]['ARCHIVE - Office Symbol'].length > 0){
        return [1, name + ' failed with ' + result[i]['ARCHIVE - Office Symbol'].slice(0, 2) + '. Expected `TE`.' ]  
      }
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_addTimecardData(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var roster = getOnly18F(getRoster())
    var now = new Date()
    var test_date = new Date(now.getTime() - ((now.getDay() + 8) * 1000 * 60 * 60 * 24)).toISOString().slice(0,10)
    var full_result = addTimecardData(roster, test_date)
    for (i=0; i<full_result.length; i++){
      if (full_result[i].tock_data.length > 0){
        var result = full_result[i]
        break
      }
    }
    if (!result.tock_data){
      return [1, name + ' failed with ' + result.tock_data +'. Expected an array of Tock timecard objects.']
    }
    if (!result.tock_data[0].end_date && (result.tock_data.length > 0)){
      return [1, name + ' failed with ' + result.tock_data[0].end_date +'. Expected an string end date for the ' +
        'end_date attribute of the first Tock timecard object in the tock_data attribute of the first employee object.']
    }
    if (result.tock_data[0].user != result['Official Email (UID)'].toLowerCase().split('@')[0]){
      return [1, name + ' failed with ' + result.tock_data[0].user +' in first timecard. Expected ' + result['Official Email (UID)'].toLowerCase().split('@')[0] + '.']
    }    
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_addGradeHistory(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var now = new Date()
    var test_date = new Date(now.getTime() - ((now.getDay() + 8) * 1000 * 60 * 60 * 24)).toISOString().slice(0,10)
    var grade_history = getGradeHistory()
    var roster = getOnly18F(getRoster())
    roster = addGradeHistory(roster, grade_history)
    for (i=0; i<roster.length; i++){
      if (Object.keys(roster[i].grade_history).length > 1){
        var result = roster[i]
        break
      }
    }
    if (!result.grade_history){
      return [1, name + ' failed with ' + result.grade_history +'. Expected a grade history object.']
    }
    if (result.grade_history.employee != result['Official Email (UID)'].toLowerCase().split('@')[0]){
      return [1, name + ' failed with ' + result.grade_history.employee +'. Expected grade history employee attribute to be ' +
              result['Official Email (UID)'].toLowerCase().split('@')[0] + '.']
    }
    if (!result.grade_history[test_date]){
      return [1, name + ' failed with ' + result.grade_history[test_date] +' for grade history attribute of ' + test_date +
        '. Expected number representing a GS grade.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_addRateInfo(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var now = new Date()
    var test_date = new Date(now.getTime() - ((now.getDay() + 8) * 1000 * 60 * 60 * 24)).toISOString().slice(0,10)
    var grade_history = getGradeHistory()
    var revenue_codes = getRevenueCodes()
    var labor_rates = getLaborRates()
    var roster = addGradeHistory(addTimecardData(getOnly18F(getRoster()), test_date), grade_history)
    roster = addRateInfo(roster, revenue_codes, labor_rates)
    for (i=0; i<roster.length; i++){
      if (roster[i].tock_data.length > 0 && roster[i].tock_data[0].hours_spent > 0){
        var result = roster[i]
        break
      }
    }
    if (!result.tock_data[0].labor_charge){
      return [1, name + ' failed with ' + result.tock_data[0].labor_charge +
        ' for the labor_charge attribute. Expected a number representing the labor charge amount.']
    }
    if ((result.tock_data[0].labor_charge / result.tock_data[0].hours_spent) != result.tock_data[0].labor_rate){
      return [1, name + ' failed with ' + (result.tock_data[0].labor_charge / result.tock_data[0].hours_spent)  +
        ' when dividing labor_charge by hours_spent. Expected ' + result.tock_data[0].labor_rate + '.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function single(){
  Logger.log(_test_getTimecardsWLaborCharge())
}

function _test_getTimecardsWLaborCharge(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var now = new Date()
    var test_date = new Date(now.getTime() - ((now.getDay() + 8) * 1000 * 60 * 60 * 24)).toISOString().slice(0,10)
    var result = getTimecardsWLaborCharge(test_date)[0]
    if (Object.keys(result).length != 21){
      return [1, name + ' failed with ' + Object.keys(result).length +' keys for first object in array. Expected 21.']
    }
    if (!result.team){
      return [1, name + ' failed with ' + result.team +
              ' for the team attribute for first object in array. Expected string representing team of ' + result.user +' .']    
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

/*
// Needs to be updated to totalsByXByY.

function test_totalsByPeriodByTeam(){
  // Summarizes timecard info by period, by team. Example expected output structure:
  // [{end_date=2016-10-08, team=Engineering Branch, total_hours=1158.0, total_charge=272894.0}, {end_date=2016-10-08, team=Strategy Branch, total_hours=164.0, total_charge=39688.0}, {end_date=2016-10-08, team=18F Team Operations, total_hours=8.0, total_charge=1832.0}, {end_date=2016-10-08, team=Design Experience Branch, total_hours=825.0, total_charge=186451.0}, {end_date=2016-10-08, team=Learn Division, total_hours=4.0, total_charge=1030.0}, {end_date=2016-10-08, team=Product Branch, total_hours=237.0, total_charge=55618.0}, {end_date=2016-10-08, team=18F Products & Platforms, total_hours=66.0, total_charge=14508.0}, {end_date=2016-10-08, team=18F Infrastructure, total_hours=38.0, total_charge=9196.0}, {end_date=2016-10-08, team=Transformation Services Division, total_hours=10.0, total_charge=2420.0}]
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var now = new Date()
    var test_date = new Date(now.getTime() - ((now.getDay() + 8) * 1000 * 60 * 60 * 24)).toISOString().slice(0,10)
    var timecards = get18FAllTimecardsWLaborCharge(test_date)
    var result = totalsByX(timecards, 'team')
    if (!result[0].total_hours){
      return [1, name + ' failed with ' + result[0].total_hours +
        ' for total_hours attribute for first item in result. Expected >= 0 number representing total hours for ther period by a given team']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}
*/