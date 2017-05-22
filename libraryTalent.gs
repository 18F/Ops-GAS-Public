function totalsByXTalent(roster, field){
  var categories = getUnique(roster, field)
  var output = {}
  for (i=0; i<categories.length; i++){
    var name = categories[i]
    output[name] = {count: 0}
  }
  for (i=0; i<roster.length; i++){
    output[roster[i][field]].count += 1
  }
  var keys = Object.keys(output)
  var array = []
  for (i=0; i<keys.length; i++){
    var obj = {}
    obj[field] = keys[i]
    obj.count = output[keys[i]].count
    array.push(obj)
  }
  return array
}

function totalsByXByYTalent(roster, x_key, y_key){
  // Builds 2D summary table.
  //
  // Requires array of annotated timecard objects.
  var output = []
  var x_keys = getUnique(roster, x_key)
  for (x=0; x<x_keys.length; x++){
    var sub_roster = []
    for (t=0; t<roster.length; t++){
      if (roster[t][x_key] == x_keys[x]){
        sub_roster.push(roster[t])
      }
    }
    var sub_output = totalsByXTalent(sub_roster, y_key)
    for (s=0; s<sub_output.length; s++){
      sub_output[s][x_key] = x_keys[x]
      output.push(sub_output[s])
    }
  }
  return output
}
