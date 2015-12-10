function displayEc2DataTable(data) {
  getEc2DataTableBody().innerHTML += buildEc2DataTable(data);
  // let it be sortable :)
  Sortable.init();
  showAwsQueryResults();
}

// TODO: Make this prettier :)
function buildEc2DataTable(data) {
  var htmlSnippit = "";
  var dataLen = data.length;
  for(var i = 0; i < dataLen; i++) {
    htmlSnippit += "<tr><th scope='row'>" + data[i]["id"] +"</th><td>" + data[i]["name"] +
      "</td><td>" + data[i]["type"] + "</td><td>" + data[i]["region"] + "</td></tr>";
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
