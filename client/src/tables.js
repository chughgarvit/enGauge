function addRow(row, table, vals, isHeader){
  console.log(row);
  if(row === null){
    var row = document.createElement("tr");
  }
  if(isHeader){
    for (const header of vals) {
      addHeader(row, header);
    }
    table.append(row);
  }
  else{
    for (const data of vals){
      row.setAttribute("class", "dataRow");
      addData(row, data);
    }
  }
}

function addHeader(row, val){
  var header = document.createElement("th");
  header.innerText = val;
  row.append(header);
}

function addData(row, val){
  var data = row.insertCell(-1);
  data.innerText = val;
}


function appendTable(tableDiv, tableId, tableSchema){
  var table = document.createElement("table");
  table.className = "Tables";
  table.id = tableId;

  addRow(null, table, tableSchema.columns, true);
  
  if(tableSchema.data){
    for(const rowData of tableSchema.data){
      addRow(table.insertRow(-1), table, rowData, false);
    }
  }
  tableDiv.append(table);
}