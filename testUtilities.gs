function _test_findFiscalYear(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var output = findFiscalYear('2016-09-30')
    if (output != 2016){
      return [1, name + ' failed with ' + output + ' items in array. Expected == 2016.']
    }
    var output = findFiscalYear('2016-10-01')
    if (output != 2017){
      return [1, name + ' failed with ' + output + ' items in array. Expected == 2017.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getUnique(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var data = [{foo: 'bar', bar: 'foo'}, {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'foo'}]
    var key = 'foo'
    var response = getUnique(data, key)
    if (response.length != 2){
      return [1, name + ' failed with array length of ' + response.length + '. Expected == 2.']
    }
    if (response.indexOf('bar') == -1){
      return [1, name + ' failed with missing array item "bar".']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_makeDateMap(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var start_date = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 14)).toISOString().slice(0, 10)
    var result = makeDateMap(start_date)
    if (result.length != 3){
      return [1, name + ' failed with array length of ' + result.length +' using start date of ' + start_date + '. Expected == 3.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_buildRESTParams(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var raw_params = {foo: 'bar', bar: 'foo'}
    var result = buildRESTParams(raw_params)
    if (result != 'foo=bar&bar=foo'){
      return [1, name + ' failed with ' + result +'. Expected == "foo=bar&bar=foo".']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getSheetById(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var now = (new Date()).getTime()
    var wb = SpreadsheetApp.create('temp_test_' + now)
    var sheet = wb.getActiveSheet()
    sheet.getRange(1, 1).setValue(now)
    var result = getSheetById(wb, sheet.getSheetId())
    if (result.getRange(1,1).getValue() != now){
      return [1, name + ' failed with sheet ID' + sheet.getSheetId() +' and value ' + result.getRange(1,1).getValue() + 
              '. Expected == ' + now + '.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  DriveApp.getFilesByName(wb.getName()).next().setTrashed(true)
  return [0, name + ' passed!']
}

function _test_dumpTo2DSheet(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var now = (new Date()).getTime()
    var wb = SpreadsheetApp.create('temp_test_' + now)
    var sheet = wb.getActiveSheet()
    var data = [{"team":"Design Experience Branch","total_hours":979,"total_charge":222875,"end_date":"2017-04-15"},{"team":"Strategy Branch","total_hours":272,"total_charge":69428,"end_date":"2017-04-15"},{"team":"Product Branch","total_hours":162,"total_charge":37983,"end_date":"2017-04-15"},{"team":"Engineering Branch","total_hours":1283,"total_charge":300411,"end_date":"2017-04-15"},{"team":"Transformation Services Division","total_hours":40,"total_charge":9680,"end_date":"2017-04-15"},{"team":"18F Custom Partner Solutions","total_hours":14,"total_charge":3768,"end_date":"2017-04-15"},{"team":"Learn Division","total_hours":2,"total_charge":477,"end_date":"2017-04-15"},{"team":"18F Products & Platforms","total_hours":80,"total_charge":18765,"end_date":"2017-04-15"},{"team":"18F Infrastructure","total_hours":16,"total_charge":3872,"end_date":"2017-04-15"},{"team":"18F Team Operations","total_hours":9,"total_charge":2178,"end_date":"2017-04-15"}]
    var result = dumpTo2DSheet(sheet, data, 'end_date', 'team', 'total_hours')
    if (sheet.getRange(1, 2).getValue().toISOString().slice(0,10) != '2017-04-15'){
      return [1, name + ' failed with ' + sheet.getRange(1, 2).getValue() +'. Expected == 2017-04-15.']
    }
    if (sheet.getMaxRows() != 11){
      return [1, name + ' failed with ' + sheet.getMaxRows() +' for getMaxRows(). Expected == 2017-04-15.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_addSummaryColumns(){
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var now = (new Date()).getTime()
    var wb = SpreadsheetApp.create('temp_test_' + now)
    var sheet = wb.getActiveSheet()
    var data = [{"team":"Strategy Branch","total_hours":272,"total_charge":69428,"end_date":"2017-04-15"}, {"team":"Design Experience Branch","total_hours":979,"total_charge":222875,"end_date":"2017-04-15"}, {"team":"Product Branch","total_hours":162,"total_charge":37983,"end_date":"2017-04-15"},{"team":"Engineering Branch","total_hours":1283,"total_charge":300411,"end_date":"2017-04-15"},{"team":"Transformation Services Division","total_hours":40,"total_charge":9680,"end_date":"2017-04-15"},{"team":"18F Custom Partner Solutions","total_hours":14,"total_charge":3768,"end_date":"2017-04-15"},{"team":"Learn Division","total_hours":2,"total_charge":477,"end_date":"2017-04-15"},{"team":"18F Products & Platforms","total_hours":80,"total_charge":18765,"end_date":"2017-04-15"},{"team":"18F Infrastructure","total_hours":16,"total_charge":3872,"end_date":"2017-04-15"},{"team":"18F Team Operations","total_hours":9,"total_charge":2178,"end_date":"2017-04-15"}]
    dumpTo2DSheet(sheet, data, 'end_date', 'team', 'total_hours')
    var result = addSummaryColumns(sheet, ['Sum', 'Average'])

    if (result.getRange(1, sheet.getMaxColumns()).getCell(1,1).getValue() != 'Average'){
      return [1, name + ' failed with ' + result.getRange(1, sheet.getMaxColumns()).getCell(1,1).getValue() +
              ' in upper rightmost cell. Expected "Average".']
    }
    var row_2_values = result.getSheetValues(2,2,1,result.getMaxColumns() - 2)
    var row_2_sum = 0
    for (i=0; i<row_2_values.length; i++){
      row_2_sum += parseInt(row_2_values[i])
    }
    if (row_2_sum != result.getSheetValues(2,result.getMaxColumns() - 1, 1, 1)[0]){
      return [1, name + ' failed with ' + row_2_sum +
              ' as sum for values in second row. Expected ' + result.getSheetValues(2,result.getMaxColumns() - 1, 1, 1)[0] +'.']
    }
    var row_2_average = row_2_sum / row_2_values.length
    if (row_2_average != result.getSheetValues(2,result.getMaxColumns(), 1, 1)[0]){
      return [1, name + ' failed with ' + row_2_average +
              ' as average for values in second row. Expected ' + result.getSheetValues(2,result.getMaxColumns(), 1, 1)[0] +'.']   
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_getDiffForTwoArrays(){
  // Expected result:
  // [{total=1.0, bar=foo, foo=bar, diff=null}, {total=3.0, bar=fa, foo=bar, diff=4.5}, {total=1.0, bar=la, foo=foo, diff=4.0}]
  // [{compare_value=1.0, total=1.0, bar=foo, diff_total=2.0, foo=bar}, {compare_value=3.0, total=3.0, bar=fa, diff_total=6.0, foo=bar}, {compare_value=1.0, total=1.0, bar=la, diff_total=2.5, foo=foo}]
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var a = [{foo: 'bar', total: 1, bar: 'foo'}, {foo: 'bar', total: 3, bar: 'fa'}, {foo: 'foo', total: 1, bar: 'la'}]
    var b = [{foo: 'bar', total: 1, bar: 'la'}, {foo: 'foo', total: 3, bar: 'la'}, {foo: 'bar', total: 1.5, bar: 'fa'}]
    var ma = ['foo', 'bar']
    var d = 'total'
    var o = '+'
    var cn = 'compare_value'
    var result = new_getDiffForTwoArrays(a, b, ma, d, o, cn)
    if (result[0]['diff_' + d] != 0){
      return [1, name + ' failed with ' + result[0]['diff_' + d] +
        ' for diff attribute of first object in returned result. Expected 0.']
    }
    if (result[1]['diff_' + d] != 4.5){
      return [1, name + ' failed with ' + result[1]['diff_' + d] +
        ' for diff attribute of second object in returned result. Expected 4.5.']
    }
    if (result[2]['diff_' + d] != 4.0){
      return [1, name + ' failed with ' + result[1]['diff_' + d] +
        ' for diff attribute of third object in returned result. Expected 4.0.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_totalsByX(){
  // Expected output:
  // [{Sum of cats=2.5, name=foo, Sum of dogs=4.3}, {Sum of cats=7.0, name=bar, Sum of dogs=5.0}]
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var data = [{name: 'foo', cats: 1, dogs: 2, fish: 0}, {name: 'bar', cats: 1, dogs: 3, fish: 10}, {name: 'foo', cats: 1.5, dogs: 2.3, fish:0}, {name: 'bar', cats: 6, dogs: 2, fish: 1}]
    var cf = 'name'
    var aosb = ['cats', 'dogs']
    var result = totalsByX(data, cf, aosb)
    Logger.log(result)
    if (result.length != 2){
      return [1, name + ' failed with array length of' + result.length +'. Expected 2.']
    }
    if (result[0]['Sum of cats'] != 2.5){
      return [1, name + ' failed with ' + result[0]['Sum of cats'] +' for Sum of cats value for first object in returned array. Expected 2.5.']
    }
    if (result[0]['Sum of fish']){
      return [1, name + ' failed with ' + result[0]['Sum of fish'] +' for Sum of fish value for first object in returned array. Expected undefined.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}

function _test_totalsByXByY(){
  // Expected output:
  // [{Sum of cats=1.0, color=blue, name=foo}, {Sum of cats=1.5, color=red, name=foo}, {Sum of cats=1.0, color=blue, name=bar}, {Sum of cats=6.0, color=red, name=bar}]
  var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
  try{
    var data = [{name: 'foo', cats: 1, dogs: 2, fish: 0, color: 'blue'}, {name: 'bar', cats: 1, dogs: 3, fish: 10, color: 'blue'}, {name: 'foo', cats: 1.5, dogs: 2.3, fish:0, color: 'red'}, {name: 'bar', cats: 6, dogs: 2, fish: 1, color: 'red'}]
    var x = 'name'
    var y = 'color'
    var sb = 'cats'    
    var result = totalsByXByY(data, x, y, sb)
    if (result.length != data.length){
      return [1, name + ' failed with array length of' + result.length +'. Expected ' + data.length + '.']
    }
    if (result[0]['Sum of cats'] != 1.0){
      return [1, name + ' failed with ' + result[0]['Sum of cats'] +' Sum of cats value for first object in returned array. Expected 1.']
    }
    if (result[0].color != 'blue'){
      return [1, name + ' failed with ' + result[0]['Sum of cats'] +' Sum of cats value for first object in returned array. Expected 1.']
    }
    if (result[0]['Sum of fish']){
      return [1, name + ' failed with ' + result[0]['Sum of fish'] +' Sum of fish value for first object in returned array. Expected undefined.']
    }
  }
  catch(err){
    var name = arguments.callee.toString().slice(0, arguments.callee.toString().indexOf(')') + 1).replace('\n', '')
    return [1, name + ' failed with ' + err]  
  }
  return [0, name + ' passed!']
}
