function awsQuery() {
  var ec2 = new AWS.EC2(
    {
      accessKeyId: document.getElementById('awsAccessKey').value,
      secretAccessKey: document.getElementById('awsSecretKey').value,
      region: 'us-east-1',
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
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(data);
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
