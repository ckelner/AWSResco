var g_PleaseWaitIntervalId = null;
var g_ReservationTotal = 0; //shitty hax
var g_RunningTotal = 0; //shitty hax
var g_Zones = [];

function displayEc2DataTable(data) {
  getEc2DataTableBody().innerHTML = "";
  getEc2DataTableBody().innerHTML += buildEc2DataTable(data);
  getTotalDiv().innerHTML = "<b>Total Reservations: " + g_ReservationTotal +
    " --- Total Running Instances: " + g_RunningTotal +
    " --- <button id='downloadAsCSV' class='btn btn-primary'> " +
    "Download Data as CSV</button><br><hr>";
  // let it be sortable :)
  new Tablesort(document.getElementById('resCoTable'));
  document.getElementById("differentialHeader").click();
  hidePleaseWaitDiv();
  setupDownloadAsCSVButtonClick();
  showAwsQueryResults();
}

function setupDownloadAsCSVButtonClick() {
  document.getElementById("downloadAsCSV").addEventListener("click", function() {
    getTableDataAsCSV();
  });
}

// Currently not in use
function buildZoneCheckListWithButton() {
  var html = "<form class='form-inline' id='zoneForm'>";
  for (var x = 0; x < g_Zones.length; x++) {
    html += "<div class='checkbox'><label><input type='checkbox'" +
      " name='" + g_Zones[x] + "'>" + g_Zones[x] + "</input></label></div>" +
      "&nbsp;&nbsp;&nbsp;&nbsp;";
  }
  html += "<button id='zoneSelectButton' type='submit' class='btn btn-success'>" +
    "Filter</button></form>";
  return html;
}

function resetEc2DataTable() {
  hideAwsQueryResults();
  getEc2DataTableBody().innerHTML = "";
  getTotalDiv().innerHTML = "";
  g_ReservationTotal = 0;
  g_RunningTotal = 0;
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
    g_ReservationTotal += data[i]["count"];
    g_RunningTotal += data[i]["running"];
    if (!g_Zones.contains(data[i]["az"])) {
      g_Zones.push(data[i]["az"]);
    }
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

function getTotalDiv() {
  return document.getElementById("totalData");
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

function getAccessSecretErrorDiv() {
  return document.getElementById("errorAccessSecretKey");
}

function showAccessSecretErrorDiv() {
  hidePleaseWaitDiv();
  getAccessSecretErrorDiv().style.display = "block";
}

function hideAccessSecretErrorDiv() {
  getAccessSecretErrorDiv().style.display = "none";
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
