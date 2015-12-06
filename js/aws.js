var g_AWSRegions =[
  'us-east-1',

];

function queryAWS() {
  var region = ;
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

    }
  });
  // always return false to avoid page refresh
  return false;
}
