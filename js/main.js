function awsQuery() {
  var region = 'us-east-1';
  var ec2 = new AWS.EC2(
    {
      accessKeyId: document.getElementById('awsAccessKey').value,
      secretAccessKey: document.getElementById('awsSecretKey').value,
      region: region,
      maxRetries: 5
    }
  );
  var params = {
    Filters: [
      { // only find running instances
        Name: 'instance-state-name',
        Values: [ 'running' ]
      },
    ],
    MaxResults: 1000 // max
  };
  ec2.describeInstances(params, function(err, data) {
    var resultsDiv = document.getElementById("awsQueryResults");
    if (err) {
      console.log(err, err.stack);
      resultsDiv.innerHTML = "<b><font color='red'>The following error has occured: " +
        err + "; see the javascript console for more details.";
    } else {
      console.log(data);
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
  });
  // always return false to avoid page refresh
  return false;
}

function init() {
  document.getElementById("awsQueryButton").addEventListener("click", function(){
    awsQuery();
  });
}

window.onload = function() {
  init();
};
