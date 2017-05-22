/* Sample test.
function _test_funcName(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var foo = null
    if (foo != 'bar'){
      return [1, name + ' failed with ' + foo +'. Expected == bar.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}
*/

/* Sample single test.
function single(){
  Logger.log(_test_sleepFor())
}
*/

function testRunner(){
  var keys = Object.keys(this)
  var call_list = []
  var fail_count = 0
  var out_msg = []
  var display_msg = ''
  for (i=0; i<keys.length; i++){
    if (keys[i].slice(0,6) == '_test_'){
        call_list.push(keys[i] + '()')
    }
  }
  for (x=0; x<call_list.length; x++){
    var result = eval(call_list[x])
    Logger.log(result)
    out_msg.push(result)
    fail_count += result[0]
  }
  var msg = '\n\n'+ (call_list.length - fail_count) + ' tests passed, ' + fail_count + ' tests failed.'
  Logger.log(msg)
  for (i=0; i<out_msg.length; i++){
    display_msg = display_msg + out_msg[i][1] + '\n'
  }
  if (fail_count > 0){
    return [1,msg, display_msg]
  } else {
    return [0, msg, display_msg]
  }
}

function autoTestRunner(){
  var result = testRunner()
  CacheService.getScriptCache().put('test_status', result[0], 21600)
  CacheService.getScriptCache().put(
    'test_report', 'Test(s) complete at ' + new Date() + '\n\n' + result[2] + result[1], 
    21600)
  for (i=0; i<DEV_NOTIFICATIONS.length; i++){
    GmailApp.sendEmail(
      DEV_NOTIFICATIONS[i], 
      'Test results for ' + PROJ_NAME, 
      'Test(s) complete at ' + new Date() + '\n\n' + result[2] + result[1])
  }
}

function getTestReport(){
  return CacheService.getScriptCache().get('test_report')
}

function getTestStatus(){
  return CacheService.getScriptCache().get('test_status')
}

function displayTestReport(){
  var status = getTestStatus()
  var report = getTestReport()
  SpreadsheetApp.getUi().alert('test_status: ' + status + '\n\n' + report)
}
