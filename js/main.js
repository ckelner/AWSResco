window.onload = function() {
  init();
};

function init() {
  document.getElementById("awsQueryButton").addEventListener("click", function() {
    awsQueryButtonAction();
  });
}

function validateKeys(val) {
  if (val == undefined || val == null || val == "") {
    showAccessSecretErrorDiv();
    return null;
  }
  return val;
}

function getAccessKeyValue() {
  return validateKeys(document.getElementById('awsAccessKey').value);
}

function getSecretKeyValue() {
  return validateKeys(document.getElementById('awsSecretKey').value);
}

function awsQueryButtonAction() {
  showPleaseWaitDiv();
  hideAccessSecretErrorDiv();
  queryAllAWSRegionsForEC2Data(
    getAccessKeyValue(),
    getSecretKeyValue()
  );
  // always return false to avoid page refresh
  return false;
}

// utils
Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}
