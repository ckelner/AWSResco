window.onload = function() {
  init();
};

function init() {
  document.getElementById("awsQueryButton").addEventListener("click", function(){
    awsQueryButtonAction();
  });
}

function awsQueryButtonAction() {
  queryAWS();
}
