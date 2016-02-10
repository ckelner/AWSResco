function getTableDataAsCSV() {
  var dataTable = document.getElementById("resCoTable");
  var csvData = "data:text/csv;charset=utf-8,";
  for (var i = 0, row; row = dataTable.rows[i]; i++) {
    for (var j = 0, col; col = row.cells[j]; j++) {
      if (j > 0) {
        csvData += ",";
      }
      var cellContents = col.innerHTML.toString().trim();
      // sanitize contents
      if (cellContents.indexOf(',') >= 0 || cellContents.indexOf('\"') >= 0 || cellContents.indexOf('\n') >= 0) {
        cellContents = "\"" + cellContents.replace(/\"/g, "\"\"") + "\"";
      }
      if (cellContents.indexOf('<br>') >= 0) {
        cellContents = cellContents.replace(/<br>/g, "");
      }
      csvData += cellContents;
    }
    csvData += '\n';
  }
  window.open(encodeURI(csvData));
}

// Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  };
}
