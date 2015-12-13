function displayEc2DataTable(data) {
  getEc2DataTableBody().innerHTML += buildEc2DataTable(data);
  // let it be sortable :)
  Sortable.init();
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
  for(var z = 0; z < dataLen; z++) {
    var regionData = data[z]["data"];
    var regionLen = regionData.length;
    for(var i = 0; i < regionLen; i++) {
      htmlSnippit += "<tr><th scope='row'>" + regionData[i]["id"] +"</th><td>" +
        regionData[i]["name"] + "</td><td>" + regionData[i]["type"] +
        "</td><td>" + regionData[i]["az"] + "</td></tr>";
    }
  }
  return htmlSnippit;
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
