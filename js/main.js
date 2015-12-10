window.onload = function() {
  init();
};

function init() {
  document.getElementById("awsQueryButton").addEventListener("click", function(){
    awsQueryButtonAction();
  });
}

function getAccessKeyValue() {
  return document.getElementById('awsAccessKey').value;
}

function getSecretKeyValue() {
  return document.getElementById('awsSecretKey').value;
}

function awsQueryButtonAction() {
  queryAllAWSRegionsForEC2Data(
    getAccessKeyValue(),
    getSecretKeyValue()
  );
  // always return false to avoid page refresh
  return false;
}
