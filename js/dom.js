function buildEc2DataTable() {
  var htmlInsert = "<table class='table table-condensed sortable-theme-bootstrap" +
    "table-striped table-hover' data-sortable>" +
    "<thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Region</th>" +
    "</tr></thead><tbody>";
  var dataLen = data.Reservations.length;
  for(var i=0; i < dataLen; i++) {
    var tags = data.Reservations[i].Instances[0].Tags;
    var name = "";
    if(tags.length > 0) {
      var tagLen = tags.length;
      for(var y=0; y < tagLen; y++) {
        if(tags[y].Key.toLowerCase() == "aws:autoscaling:groupName".toLowerCase() && name == "") {
          name = tags[y].Value;
        }
        if(tags[y].Key.toLowerCase() == "name") {
          name = tags[y].Value;
        }
      }
    } else {
      name = tags[0].Value;
    }
    var id = data.Reservations[i].Instances[0].InstanceId;
    var type = data.Reservations[i].Instances[0].InstanceType;
    htmlInsert += "<tr><th scope='row'>" + id +"</th><td>" + name +
    "</td><td>" + type + "</td><td>" + region + "</td></tr>";
  }
  resultsDiv.innerHTML = htmlInsert + "</tbody></table>";
  // let it be sortable :)
  Sortable.init()
}
