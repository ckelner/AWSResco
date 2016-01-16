var g_AWSRegions = [
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
  g_EC2ResData = [];
  clearInterval(g_EC2DataTimer);
  g_EC2DataTimer = null;
}

function queryAllAWSRegionsForEC2Data(key, secret) {
  if (key != null && secret != null) {
    resetEc2DataTable();
    resetAWSValues();
    for (var i = 0; i < g_AWSRegions.length; i++) {
      queryAWSforEC2Data(g_AWSRegions[i], key, secret, false);
      queryAWSforEC2Data(g_AWSRegions[i], key, secret, true);
    }
    // Because of the asynchronous nature of the AWS SDK calls, we need to
    // wait until all data is returned for all regions before we proceed
    g_EC2DataTimer = setInterval(waitForEC2ToGetReturned, 1000);
  }
}

function waitForEC2ToGetReturned() {
  if (g_EC2Data.length == g_AWSRegions.length &&
    g_EC2ResData.length == g_AWSRegions.length) {
    clearInterval(g_EC2DataTimer);
    displayEc2DataTable(
      combineEC2AndResData(g_EC2Data, g_EC2ResData)
    );
  }
}

// takes our custom data object segregated by region and
// creates one giant array of all data
function mergeDataFromAllRegionsIntoSingleArray(customRegionDataObj) {
  var objLen = customRegionDataObj.length;
  var newArr = [];
  for (var i = 0; i < objLen; i++) {
    Array.prototype.push.apply(newArr, customRegionDataObj[i].data);
  }
  return newArr;
}

function combineEC2AndResData(ec2, res) {
  var ec2Arr = mergeDataFromAllRegionsIntoSingleArray(ec2);
  var resArr = mergeDataFromAllRegionsIntoSingleArray(res);
  // first
  // merge all reservation data down
  // reservation data is grouped by "purchase" while we want to handle this
  // data by a unique combo of: type, az, windows, and vpc.
  var resLen = resArr.length;
  var newRes = [];
  var uniqCount = 0;
  var uniqKeeper = {};
  for (var i = 0; i < resLen; i++) {
    var resDataTop = resArr[i];
    var uniqResId = resDataTop["type"] + resDataTop["az"] + resDataTop["windows"] + resDataTop["vpc"];
    if (uniqKeeper[uniqResId] === undefined || uniqKeeper[uniqResId] === null) {
      uniqKeeper[uniqResId] = uniqCount;
      newRes[uniqCount] = resDataTop;
      uniqCount++;
    }
    for (var y = 0; y < resLen; y++) {
      var resDataBottom = resArr[y];
      // TODO: take relevant data and mash it into the new array
      if (
        resDataTop["type"] === resDataBottom["type"] &&
        resDataTop["az"] === resDataBottom["az"] &&
        resDataTop["windows"] === resDataBottom["windows"] &&
        resDataTop["vpc"] === resDataBottom["vpc"] &&
        i !== y // make sure we aren't looking at the same reservation
      ) {
        // we have the same reservation, just different purchase time
        console.log(uniqResId + " --- " + newRes[uniqKeeper[uniqResId]]["count"] + " --- " + resDataBottom["count"]);
        newRes[uniqKeeper[uniqResId]]["count"] += resDataBottom["count"];
        Array.prototype.push.apply(newRes[uniqKeeper[uniqResId]]["resIds"], resDataBottom["resIds"]);
      }
    }
  }
  // second
  // combine unique reservations with running ec2 instances
  var ec2Len = ec2Arr.length;
  for (var p = 0; p < ec2Len; p++) {
    var uniqResLen = newRes.length;
    var ec2Inst = ec2Arr[p];
    var foundRes = false;
    for (var q = 0; q < uniqResLen; q++) {
      var resInst = newRes[q];
      if (newRes[q]["running"] == null) {
        newRes[q]["running"] = 0;
        newRes[q]["running_ids"] = [];
        newRes[q]["running_names"] = [];
        newRes[q]["diff"] = 0 - newRes[q]["count"];
      }
      if (
        ec2Inst["type"] == resInst["type"] &&
        ec2Inst["az"] == resInst["az"] &&
        ec2Inst["windows"] == resInst["windows"] &&
        ec2Inst["vpc"] == resInst["vpc"]
      ) {
        // got a match
        newRes[q]["running"] += 1;
        newRes[q]["diff"] = newRes[q]["count"] - newRes[q]["running"];
        newRes[q]["running_ids"].push(ec2Inst["id"]);
        if (ec2Inst["name"] != undefined && ec2Inst["name"] != null && ec2Inst["name"] != "") {
          newRes[q]["running_names"].push(ec2Inst["name"]);
        }
        foundRes = true;
        break; // exit since we found a match
      }
    }
    // if not reservation was found that matched, then add this to collection to report
    if (foundRes === false) {
      var aNewRes = {};
      aNewRes["running"] = 1;
      aNewRes["running_ids"] = [ec2Inst["id"]];
      aNewRes["running_names"] = [];
      if (ec2Inst["name"] != undefined && ec2Inst["name"] != null && ec2Inst["name"] != "") {
        aNewRes["running_names"].push(ec2Inst["name"]);
      }
      aNewRes["diff"] = -1;
      aNewRes["resIds"] = [];
      aNewRes["type"] = ec2Inst["type"];
      aNewRes["count"] = 0;
      aNewRes["az"] = ec2Inst["az"];
      aNewRes["cost"] = 0;
      aNewRes["windows"] = ec2Inst["windows"];
      aNewRes["vpc"] = ec2Inst["vpc"];
      newRes.push(aNewRes);
    }
  }
  return newRes;
}

function queryAWSforEC2Data(region, key, secret, reservations) {
  var ec2 = new AWS.EC2({
    accessKeyId: key,
    secretAccessKey: secret,
    region: region,
    maxRetries: 5,
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#sslEnabled-property
    sslEnabled: true
  });
  if (!reservations) {
    var params = {
      Filters: [{ // only find running instances
        Name: 'instance-state-name',
        Values: ['running']
      }, ],
      MaxResults: 1000 // max
    };
    ec2.describeInstances(params, function(err, data) {
      handleAWSQueryReturnErr(err, data, region, reservations);
    });
  } else {
    var params = {
      Filters: [{ // only active reservations
        Name: 'state',
        Values: ['active']
      }, ],
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
  if (!reservations) {
    g_EC2Data.push({
      "region": region,
      "data": mungeEc2Data(regionData)
    });
  } else {
    g_EC2ResData.push({
      "region": region,
      "data": mungeEc2ResData(regionData)
    });
  }
}

function mungeEc2ResData(data) {
  var mungedDataArr = [];
  if (!data || !data.ReservedInstances || data.ReservedInstances.length == 0) {
    return mungedDataArr;
  }
  var dataLen = data.ReservedInstances.length;
  for (var i = 0; i < dataLen; i++) {
    mungedDataArr[i] = {};
    mungedDataArr[i]["resIds"] = [data.ReservedInstances[i].ReservedInstancesId];
    mungedDataArr[i]["type"] = data.ReservedInstances[i].InstanceType;
    mungedDataArr[i]["count"] = data.ReservedInstances[i].InstanceCount;
    mungedDataArr[i]["az"] = data.ReservedInstances[i].AvailabilityZone;
    mungedDataArr[i]["cost"] = data.ReservedInstances[i].RecurringCharges[0].Amount;
    if (data.ReservedInstances[i].ProductDescription.toLowerCase().indexOf("windows") != -1) {
      mungedDataArr[i]["windows"] = true;
    } else {
      mungedDataArr[i]["windows"] = false;
    }
    if (data.ReservedInstances[i].ProductDescription.toLowerCase().indexOf("vpc") != -1) {
      mungedDataArr[i]["vpc"] = true;
    } else {
      mungedDataArr[i]["vpc"] = false;
    }
  }
  return mungedDataArr;
}

function mungeEc2Data(data) {
  var mungedDataArr = [];
  if (!data || !data.Reservations || data.Reservations.length == 0) {
    return mungedDataArr;
  }
  var dataLen = data.Reservations.length;
  for (var i = 0; i < dataLen; i++) {
    var tags = data.Reservations[i].Instances[0].Tags;
    var name = "";
    if (tags.length > 1) {
      var tagLen = tags.length;
      for (var y = 0; y < tagLen; y++) {
        try {
          if (tags[y].Key != null) {
            if (tags[y].Key.toLowerCase() == "aws:autoscaling:groupName".toLowerCase() && name == "") {
              name = tags[y].Value;
            }
            if (tags[y].Key.toLowerCase() == "name") {
              name = tags[y].Value;
            }
          } else {
            try {
              console.log("Tags[" + y + "] empty: " + tags.toString());
            } catch (e) {
              console.log("Exception Id 00x1");
            }
          }
        } catch (e) {
          console.log("Exception Id 00x3");
        }
      }
    } else {
      if (tags.length == 1) {
        name = tags[0].Value;
      } else {
        try {
          console.log("No name tag found for instance with id: " + data.Reservations[i].Instances[0].InstanceId);
        } catch (e) {
          console.log("Exception Id 00x2");
        }
      }
    }
    mungedDataArr[i] = {};
    mungedDataArr[i]["name"] = name;
    mungedDataArr[i]["id"] = data.Reservations[i].Instances[0].InstanceId;
    mungedDataArr[i]["type"] = data.Reservations[i].Instances[0].InstanceType;
    mungedDataArr[i]["az"] = data.Reservations[i].Instances[0].Placement.AvailabilityZone;
    try {
      if (data.Reservations[i].Instances[0].Platform != undefined && data.Reservations[i].Instances[0].Platform != null) {
        if (data.Reservations[i].Instances[0].Platform.toLowerCase() == "windows") {
          mungedDataArr[i]["windows"] = true;
        } else {
          mungedDataArr[i]["windows"] = false;
        }
      } else {
        // Doesn't have 'Platform' defined, assuming linux
        mungedDataArr[i]["windows"] = false;
      }
    } catch (e) {
      console.log("Exception Id 00x4");
    }
    if (data.Reservations[i].Instances[0].VpcId != null &&
      data.Reservations[i].Instances[0].VpcId != "") {
      mungedDataArr[i]["vpc"] = true;
    } else {
      mungedDataArr[i]["vpc"] = false;
    }
  }
  return mungedDataArr;
}
