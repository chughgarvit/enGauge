function addButtonCanvas(){
  const targetNode = document.getElementsByClassName("SGP0hd kunNie")[0];
  userName = document.getElementsByClassName("zWGUib")[0].innerText;
  var button = document.createElement("button");
  button.addEventListener("click", viewPanel);
  var mainDiv = document.createElement("div");
  mainDiv.id = "EngagementDiv";
  mainDiv.setAttribute("class", "r6xAKc");
  button.setAttribute("class", "VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc");
  button.setAttribute("jscontroller", "soHxf");
  button.setAttribute("jsaction","click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef");
  button.setAttribute("aria-label","Engagement Metrics");
  button.setAttribute("data-panel-id","7");
  button.innerHTML = "ATS";
  mainDiv.appendChild(button);

  targetNode.insertBefore(mainDiv, targetNode.childNodes[0]);
  let vid = document.createElement("video");
  vid.id = "cam_input";
  vid.height="480";
  vid.width="640";
  document.body.append(vid);
  faceCanvas = document.createElement('canvas');
  presentationCanvas = document.createElement('canvas');
}

function createPanel(){
  var displayer = document.getElementsByClassName("R3Gmyc qwU8Me qdulke")[0];

  var enclosingDivHeading = document.createElement("div");
  enclosingDivHeading.innerHTML = `
    <div class="CYZUZd">
      <div class="J8vCN zHGix" role="heading" aria-level="2" tabindex="-1" jsname="rQC7Ie" id="c10">
        Student Engagement
      </div>
      <!--Close Button-->
      <div class="VUk8eb">
        <div jsaction="JIbuQc:hR1TY;rcuQ6b:npT2md" jscontroller="AXYg3e">
          <span data-is-tooltip-wrapper="true">
            <button class="VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ IWtuld wBYOYb" jscontroller="soHxf" jsaction="click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef" data-disable-idom="true" aria-label="Close" data-tooltip-enabled="true" data-tooltip-id="tt-c17">
              <div class="VfPpkd-Bz112c-Jh9lGc">
              </div>
              <i class="google-material-icons VfPpkd-kBDsod" aria-hidden="true">close</i>
            </button>
              <div class="EY8ABd-OWXEXe-TAWMXe" role="tooltip" aria-hidden="true" id="tt-c17">
                Close
              </div>
          </span>
        </div>
      </div>
    </div>
  `;

  var controlDiv = document.createElement("div");
  controlDiv.setAttribute("class", "control");

  var panel = document.createElement("div");
  panelAttrs = {"id":"MyPanel","class":"WUFI9b qdulke","data-tab-id":"7","jsname":"b0t70b",
  "jscontroller":"dkJU2d","jsaction":"VOcP9c:QPhnyd;ntQuZe:EuYDs"};
  for(let key in panelAttrs){
    panel.setAttribute(key, panelAttrs[key]);
  }
  panel.append(enclosingDivHeading);
  panel.append(controlDiv);
  let metricsDiv = document.createElement("div");
  metricsDiv.setAttribute("class", "Metrics");
  metricsDiv.innerHTML = '<h3 class="heading">Engagement Metrics</h3>';

  var chartDiv = document.createElement("div");
  chartDiv.id = "Charts";
  
  if(typeUser==="Host"){
    controlDiv.innerHTML = `
      <h3 class="heading" style="margin-bottom:10px">Manual Control</h3>
      <text>Off</text>
      <label class="switch">
        <input type="checkbox" id="controlSwitch">
        <span class="slider round"></span>
      </label>
      <text>On</text>
    `;
    // appendChart(chartDiv, "Presentation Score", initMsg.uid);
    metricsDiv.append(chartDiv);
    
    var tableDiv1 = document.createElement("div");
    tableDiv1.className = "TableDiv";
    var tableSchema1 = {
      columns: ["Time", "Presentation Score", "Aggregated Audience Score"]
    };

    appendTable(tableDiv1, "Table1", tableSchema1);
    metricsDiv.append(tableDiv1);
  }
  else if(typeUser==="Audi"){
    appendChart(chartDiv, "You", initMsg.uid);
    metricsDiv.append(chartDiv) 
  }
  panel.append(metricsDiv);

  displayer.insertBefore(panel, displayer.childNodes[0]);
}

function viewPanel() {
  var displayer = document.getElementsByClassName("R3Gmyc qwU8Me qdulke")[0];
  if(!!displayer){
      displayer.setAttribute("class", "R3Gmyc qwU8Me");
  }

  var oldPanel = document.getElementsByClassName("WUFI9b");
  Array.from(oldPanel).forEach(element => {
      element.setAttribute("class","WUFI9b qdulke");
  });

  document.getElementById("MyPanel").setAttribute("class", "WUFI9b");
}

function manualControls(){
  var controlDiv = document.getElementsByClassName("control")[0];
  var manualDiv = document.createElement("div");
  manualDiv.setAttribute("id", "manualControls");
  manualDiv.innerHTML = `
    <button id="manualMetrics">Get Metrics</button>
  `;
  controlDiv.append(manualDiv);
}