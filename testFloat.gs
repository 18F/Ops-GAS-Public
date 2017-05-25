function _test_getFloatData(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var result = JSON.parse(getFloatData('people'))
    // Test people endpoint.
    if (!result.people){
      return [1, name + ' failed with ' + result.people +' for people attribute of response. Expected people attribute to be included in response.']
    }
    if (Object.keys(result.people[0]).length != 24){
      return [1, name + ' failed with ' + Object.keys(result.people[0]).length +
        ' keys in first object in people attribute. Expected 24.']
    }
    if (result.count != result.people.length){
      return [1, name + ' failed with ' + result.count + ' stated count vs ' + result.people.length + ' calculated count. Expected counts to be same.']
    
    }
    var params = buildRESTParams({start_day: '2016-10-01', weeks: 1})
    var result = JSON.parse(getFloatData('tasks', params))
    if (!result.people[0].tasks){
      return [1, name + ' failed with ' + result.people[0].tasks +
        ' for tasks attribute of the first object in the people attribute of the response. Expected list of tasks.']
    }
    if (Object.keys(result.people[0].tasks[0]).length != 21){
      return [1, name + ' failed with ' + Object.keys(result.people[0].tasks[0]).length +
        ' keys in first object in people attribute. Expected 21.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getFloatTasks(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var result = getFloatTasks('2016-10-01', 2)
    var now = new Date((new Date()).getTime() - 1000*60*60*4).getTime()
    var result_time = new Date(result[0].fetched_at).getTime()
    if (result.length < 1){
      return [1, name + ' failed with ' + result.length +' length. Expected >= 1.']
    }
    if (Object.keys(result[0]).length != 22){
      return [1, name + ' failed with ' + Object.keys(result[0]).length +' keys for first object in array. Expected == 22.']
    
    }
    if (now < result_time){
      return [1, name + ' failed with fetched_at attirbute of first object not less than current time' 
              + result_time +' vs. ' + now + '. Expected opposite.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_addTockDataToTasks(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var tasks = getFloatTasks('2016-10-02', 1)
    var result = addTockDataToTasks(tasks)
    if (!result[0].tock_user){
      return [1, name + ' failed with ' + result[0].tock_user +
              ' for tock_user attribute of first object in returned array. Expected null or value.']
    }
    var billable = result[0].tock_billable
    if (typeof billable == typeof undefined){
      return [1, name + ' failed with ' + result[0].tock_billable +
              ' for tock_billable attribute of first object in returned array. Expected null, true, or false.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}


function _test_addRosterDataToTasks(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var tasks = getFloatTasks('2016-10-02', 1)
    tasks = addTockDataToTasks(tasks)
    var result = addRosterDataToTasks(tasks)
    if (!result[0].roster_team){
      return [1, name + ' failed with ' + result[0].roster_team +
        ' for the roster_team attribute for the first item in the returned array. Expected null or value.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getTasksByReportingPeriods(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var result = getTasksByReportingPeriods('2016-10-02', '2016-10-15')
    if (!result[0].tock_start_date){
      return [1, name + ' failed with ' + result[0].tock_start_date +
        ' for tock_start_date attribute of first object in returned array. Expected a string ten-digit ISO date value.']
    }
    if (result[0].hours_pd * 5 != result[0].total_weekly_hours){
      return [1, name + ' failed with ' + result[0].total_weekly_hours +
        ' for total_weekly_hours attribute of first object in returned array. Expected 5  * ' + result[0].hours_pd]
    }
    
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}
