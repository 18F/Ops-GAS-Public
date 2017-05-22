function getFloatData(section, params) {
  // See https://github.com/floatschedule/api. Returns parsable JSON string.
  //
  // Requires API section string and optional REST-style parameters (e.g. "?date=2016-01-01&billable=True") string.
  if (!params){
    var params = ''
  }
  var url = 'https://api.float.com/api/v1/'
  var options = {
    'method': 'get',   
    'contentType': 'application/json',
    'headers': {'Authorization': 'Bearer '+ float_api_key},
  }
  try {
    var response = UrlFetchApp.fetch(url + section + '?' +  params, options)
    }
  catch(err){
    var response = err
    }
  return response
}

function getFloatTasks(start_date, weeks){
  // See https://github.com/floatschedule/api/blob/master/Sections/tasks.md. Returns array of task objects.
  //
  // Requires 10 digit ISO date string for start date and optional string or int number of weeks to including going forward in time from start date.
  if (!weeks){
    var weeks = 1
  }
  var response = JSON.parse(
    getFloatData('tasks', buildRESTParams({start_day: start_date, weeks: weeks}))
  ).people
  var output = []
  for (i=0; i<response.length; i++){
    for (ii=0; ii<response[i].tasks.length; ii++){
      response[i].tasks[ii].fetched_at = new Date((new Date()).getTime() - 1000*60*60*4).toISOString()
      output.push(response[i].tasks[ii])
    }
  }
  return output
}

function addTockDataToTasks(tasks){
  // Returns array of task objects with meta data concerning Tock from each person's and project's Float metadata.
  //
  // Requires an array of Float task objects.
  var projects = JSON.parse(getFloatData('projects')).projects
  var people = JSON.parse(getFloatData('people')).people
  var tock_project_info = JSON.parse(callTock('projects.json',''))
  for (i=0; i<tasks.length; i++){
    tasks[i].tock_id = null
    tasks[i].tock_user = null
    tasks[i].tock_billable = null
    for (p=0; p<projects.length; p++){
      if (tasks[i].project_id == projects[p].project_id){
        for (t=0; t<projects[p].tags.length; t++){
          if (parseInt(projects[p].tags[t])){
            tasks[i].tock_id = projects[p].tags[t]
            for (tp=0; tp<tock_project_info.length; tp++){
              if (tock_project_info[tp].id == tasks[i].tock_id){
                tasks[i].tock_billable = tock_project_info[tp].billable
              }
            }
          }
        }
      }
    }
    for (p=0; p<people.length; p++){
      if (tasks[i].people_id == people[p].people_id){
        tasks[i].tock_user = String(people[p].im).toLowerCase()
      }
    }
  }
  return tasks
}

function addRosterDataToTasks(tasks){
  // Returns array of task objects with roster information gathered from the TTS Talent database workbook.
  // See https://docs.google.com/spreadsheets/d/1JabICP7b0QtXOYa00dAW5m8n7YmEaWy5RVQ-7BrodC8/edit#gid=1388593896.
  //
  // Requires an array of Float task objects WITH TOCK DATA already appended.
  var roster = getOnly18F(getRoster())
  for (i=0; i<tasks.length; i++){
    tasks[i].roster_team = 'Not specified'
    for (rr=0; rr<roster.length; rr++){
      if (tasks[i].tock_user == roster[rr].tock_username){
        tasks[i].roster_team = roster[rr]['Team (Chapter/BU)'] 
      }
    }
  }
  return tasks
}

function getTasksByReportingPeriods(start_date, end_date){
  // Returns an array of objects, with each object representing all or part of a task for a given Tock reporting period.
  // Relies on (1) existing Tock reporting periods available via the Tock API; plus (2) projected Tock reporting periods
  // generated based on the start date of the latest Tock reporting period.
  // Also calculates the hours per week of a given task by multiplying the Float value hours_pd by five (days).
  //
  // Requires a string 10-digit ISO date for each start_date and end_date.
  var start_date = new Date(start_date + 'T04:00:00.000Z').getTime()
  var output = []
  var rps = getReportingPeriods()
  if (end_date){
    var future_dates = makeDateMap(rps[0].start_date, end_date)
    for (f=1; f<future_dates.length; f++){
      rps.push({
        start_date: future_dates[f], 
        end_date: new Date(
          new Date(future_dates[f] + 'T04:00:00.000Z').getTime() + 1000*60*60*24*6).toISOString().slice(0,10) 
      })
    }
  }
  for (z=0; z<rps.length; z++){
    var rps_start_date = new Date(rps[z].start_date + 'T04:00:00.000Z').getTime()
    if (rps_start_date >= start_date){
      var tasks = getFloatTasks(rps[z].start_date, '1')
      for (zz=0; zz<tasks.length; zz++){
        tasks[zz].tock_start_date = rps[z].start_date
        tasks[zz].tock_end_date = rps[z].end_date
        tasks[zz].total_weekly_hours = tasks[zz].hours_pd * 5
        output.push(tasks[zz])
      }
      Utilities.sleep(100)
    }
  }
  return output
}
