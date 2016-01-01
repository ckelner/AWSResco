var g_PleaseWaitIntervalId = null;

function displayEc2DataTable(data) {
  getEc2DataTableBody().innerHTML = "";
  getEc2DataTableBody().innerHTML += buildEc2DataTable(data);
  // let it be sortable :)
  Sortable.init();
  hidePleaseWaitDiv();
  showAwsQueryResults();
}

function resetEc2DataTable() {
  hideAwsQueryResults();
  getEc2DataTableBody().innerHTML = "";
}

function showQueryError(htmlSnippit) {
  getEc2DataTableBody().innerHTML = htmlSnippit;
}

// TODO: Make this prettier :)
function buildEc2DataTable(data) {
  var htmlSnippit = "";
  var dataLen = data.length;
  for (var i = 0; i < dataLen; i++) {
    htmlSnippit += "<tr><th scope='row'>" +
      data[i]["count"] +
      "</th><td>" + data[i]["running"] +
      "</th><td>" + data[i]["diff"] +
      "</th><td>" + data[i]["type"] +
      "</td><td>" + data[i]["az"] +
      "</td><td>" + data[i]["windows"].toString() +
      "</td><td>" + data[i]["vpc"].toString() +
      "</td><td>" + data[i]["running_ids"].join(",<br/>") +
      "</td><td>" + data[i]["running_names"].join(",<br/>") +
      "</td></tr>";
  }
  return htmlSnippit;
}

function setPleaseWaitDivUpdateInterval() {
  g_PleaseWaitIntervalId = setInterval(updatePleaseWaitDiv, 1000);
}

function updatePleaseWaitDiv() {
  if (getPleaseWaitDiv().innerHTML.toLowerCase().indexOf("please wait.....") == -1) {
    getPleaseWaitDiv().innerHTML += "."
  } else {
    getPleaseWaitDiv().innerHTML = "Please Wait"
  }
}

function getPleaseWaitDiv() {
  return document.getElementById("pleaseWait");
}

function showPleaseWaitDiv() {
  setPleaseWaitDivUpdateInterval();
  getPleaseWaitDiv().style.display = "block";
}

function hidePleaseWaitDiv() {
  clearInterval(g_PleaseWaitIntervalId);
  getPleaseWaitDiv().style.display = "none";
}

function getEc2DataTableBody() {
  return document.getElementById("ec2DataTableBody");
}

function getAwsQueryResultsDiv() {
  return document.getElementById("awsQueryResults");
}

function showAwsQueryResults() {
  getAwsQueryResultsDiv().style.display = "block";
}

function hideAwsQueryResults() {
  getAwsQueryResultsDiv().style.display = "none";
}
