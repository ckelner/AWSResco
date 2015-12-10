var g_AWSRegions =[
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-central-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'sa-east-1'
];
var g_EC2Data = [];
var g_EC2DataTimer = null;

function queryAllAWSRegionsForEC2Data(key, secret) {
  for(var i = 0; i < g_AWSRegions.length; i++) {
    queryAWS(g_AWSRegions[i], key, secret);
  }
  // Because of the asynchronous nature of the AWS SDK calls, we need to
  // wait until all data is returned for all regions before we proceed
  g_EC2DataTimer = setInterval(waitForEC2ToGetReturned, 1000);
}

function waitForEC2ToGetReturned() {
  if( g_EC2Data.length == g_AWSRegions.length ) {
    clearInterval(g_EC2DataTimer);
    displayEc2DataTable(g_EC2Data);
  }
}

function queryAWSReturn(regionData) {
  g_EC2Data.concat( mungeEc2Data(regionData) );
}

function queryAWS(region, key, secret) {
  var ec2 = new AWS.EC2(
    {
      accessKeyId: key,
      secretAccessKey: secret,
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
    if (err) {
      console.log(err, err.stack);
      resultsDiv.innerHTML = "<b><font color='red'>The following error has occured: " +
        err + "; see the javascript console for more details.";
    } else {
      queryAWSReturn( data );
    }
  });
}

function mungeEc2Data(data) {
  var mungedDataArr = [];
  if( !data || !data.Reservations || data.Reservations.length == 0 ) {
    return mungedDataArr;
  }
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
    mungedDataArr[i]["name"] = name;
    mungedDataArr[i]["id"] = data.Reservations[i].Instances[0].InstanceId;
    mungedDataArr[i]["type"] = data.Reservations[i].Instances[0].InstanceType;
    mungedDataArr[i]["region"] = region;
  }
  return mungedDataArr;
}
