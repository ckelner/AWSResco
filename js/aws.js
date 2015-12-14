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
var g_EC2ResData = [];
var g_EC2DataTimer = null;

function resetAWSValues() {
  g_EC2Data = [];
  clearInterval(g_EC2DataTimer);
  g_EC2DataTimer = null;
}

function queryAllAWSRegionsForEC2Data(key, secret) {
  resetEc2DataTable();
  resetAWSValues();
  for(var i = 0; i < g_AWSRegions.length; i++) {
    queryAWSforEC2Data(g_AWSRegions[i], key, secret, false);
    queryAWSforEC2Data(g_AWSRegions[i], key, secret, true);
  }
  // Because of the asynchronous nature of the AWS SDK calls, we need to
  // wait until all data is returned for all regions before we proceed
  g_EC2DataTimer = setInterval(waitForEC2ToGetReturned, 1000);
}

function waitForEC2ToGetReturned() {
  if( g_EC2Data.length == g_AWSRegions.length &&
    g_EC2ResData.length == g_AWSRegions.length) {
    clearInterval(g_EC2DataTimer);
    displayEc2DataTable(
      combineEC2AndResData(g_EC2Data,g_EC2ResData)
    );
  }
}

function combineEC2AndResData(ec2,res) {
  var resLen = res.length;
  var newRes = [];
  for(var i=0; i<resLen; i++) {
    var resDataTop = res[i].data;
    for(var y=0; y<resLen; y++) {
      var resDataBottom = res[y].data;
    }
  }
}

function queryAWSforEC2Data(region, key, secret, reservations) {
  var ec2 = new AWS.EC2(
    {
      accessKeyId: key,
      secretAccessKey: secret,
      region: region,
      maxRetries: 5
    }
  );
  if( !reservations ) {
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
      handleAWSQueryReturnErr(err, data, region, reservations);
    });
  } else {
    var params = {
      Filters: [
        { // only active reservations
          Name: 'state',
          Values: [ 'active' ]
        },
      ],
    };
    ec2.describeReservedInstances(params, function(err, data) {
      handleAWSQueryReturnErr(err, data, region, reservations);
    });
  }
}

function handleAWSQueryReturnErr(err, data, region, reservations) {
  if (err) {
    console.log(err, err.stack);
    showQueryError("<b><font color='red'>The following error has occured: " +
      err + "; see the javascript console for more details.</font></b>");
  } else {
    //console.log(data);
    queryAWSReturn(data, region, reservations);
  }
}

function queryAWSReturn(regionData, region, reservations) {
  if(!reservations) {
    g_EC2Data.push(
      {
        "region": region,
        "data": mungeEc2Data(regionData)
      }
    );
  } else {
    g_EC2ResData.push(
      {
        "region": region,
        "data": mungeEc2ResData(regionData)
      }
    );
  }
}

function mungeEc2ResData(data) {
  var mungedDataArr = [];
  if( !data || !data.ReservedInstances || data.ReservedInstances.length == 0 ) {
    return mungedDataArr;
  }
  var dataLen = data.ReservedInstances.length;
  for(var i=0; i < dataLen; i++) {
    mungedDataArr[i] = {};
    mungedDataArr[i]["type"] = data.ReservedInstances[i].InstanceType;
    mungedDataArr[i]["count"] = data.ReservedInstances[i].InstanceCount;
    mungedDataArr[i]["az"] = data.ReservedInstances[i].AvailabilityZone;
    mungedDataArr[i]["cost"] = data.ReservedInstances[i].RecurringCharges[0].Amount;
    if(data.ReservedInstances[i].ProductDescription.toLowerCase().indexOf("windows")) {
      mungedDataArr[i]["windows"] = true;
    } else {
      mungedDataArr[i]["windows"] = false;
    }
    if(data.ReservedInstances[i].ProductDescription.toLowerCase().indexOf("vpc")) {
      mungedDataArr[i]["vpc"] = true;
    } else {
      mungedDataArr[i]["vpc"] = false;
    }
  }
  return mungedDataArr;
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
    if(tags.length > 1) {
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
      if(tags.length == 1) {
        name = tags[0].Value;
      } else {
        console.log("No name tag found for instance with id: " + data.Reservations[i].Instances[0].InstanceId)
      }
    }
    mungedDataArr[i] = {};
    mungedDataArr[i]["name"] = name;
    mungedDataArr[i]["id"] = data.Reservations[i].Instances[0].InstanceId;
    mungedDataArr[i]["type"] = data.Reservations[i].Instances[0].InstanceType;
    mungedDataArr[i]["az"] = data.Reservations[i].Instances[0].Placement.AvailabilityZone;
    if(data.Reservations[i].Instances[0].Platform.toLowerCase() == "windows") {
      mungedDataArr[i]["windows"] = true;
    } else {
      mungedDataArr[i]["windows"] = false;
    }
    if(data.Reservations[i].Instances[0].VpcId != null &&
      data.Reservations[i].Instances[0].VpcId != "") {
      mungedDataArr[i]["vpc"] = true;
    } else {
      mungedDataArr[i]["vpc"] = false;
    }
  }
  return mungedDataArr;
}
