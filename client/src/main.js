const captureTime = 10*1000 // in milliseconds
const manualCaptureTime = 5*1000;
const faceFPS = 30;
const presentationFPS = 15;

var isTabVisible = true;
var manualFlag = false;
var stopFlag = false;
var userName = null;
var ws = null;
var videoInterval = 15000;
var faceCanvas = null;
var presentationCanvas = null;
var intervalId = 0;
var bgUpdateId = 0;
var startTime = null;
var frameNum = 0;
var typeUser = "Audi";

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === 'visible') {
    isTabVisible = true;
  }
  else{
    if(typeUser == "Audi"){ //Only audience members need to be judged on whether they have the tab active
      isTabVisible = false;
    }
  }
});

function getElementsByText(str, tag = 'a') {
  return Array.prototype.slice.call(document.getElementsByTagName(tag)).filter(el => el.innerText.trim().includes(str.trim()));
}

function sendContent(){
  if(getElementsByText("(Presentation)", "div")[0]){
    let video = getElementsByText("(Presentation)", "div")[0].nextElementSibling.nextElementSibling.children[0];
    let ctx = presentationCanvas.getContext('2d');
    presentationCanvas.width = video.offsetWidth;
    presentationCanvas.height = video.offsetHeight;

    ctx.drawImage(video, 0, 0, screen.availWidth, screen.availWidth*(presentationCanvas.height/presentationCanvas.width), 0, 0, presentationCanvas.width, presentationCanvas.height);
    let data = presentationCanvas.toDataURL("image/png");
    // console.log(data);
    sendContentToServer(data);
  }
  else{
    presentationObserver.observe(document, config);
  }
}

function sendFrames(){
  getInput();
  startTime = Date.now();
  console.log("Starting Sending Frames.");
  intervalId = window.setInterval(updatePanel, 1000/faceFPS);
}

function updatePanel(){
  let ctx = faceCanvas.getContext('2d');
  let video = document.getElementById("cam_input");
  ctx.drawImage(video, 0, 0, faceCanvas.width, faceCanvas.height);
  let data = faceCanvas.toDataURL("image/png");
  frameNum += 1;
  sendSnapshotToServer(data, false, isTabVisible);

  if(intervalId!=0 && (stopFlag || (manualFlag && Date.now()-startTime > manualCaptureTime) || (Date.now()-startTime > captureTime))){
    console.log(frameNum);
    frameNum = 0;
    clearInterval(intervalId);
    sendSnapshotToServer("END", true, true);
    if(manualFlag){
      manualFlag = false;
    }
    if(stopFlag){
      stopFlag = false;
    }
    intervalId = 0;
    video.pause();
    video.srcObject.getTracks()[0].stop();
  }
}

function getInput(){
  let video = document.getElementById("cam_input"); // video is the id of video tag
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function(stream) {
      video.srcObject = stream;
      video.play();
  })
  .catch(function(err) {
      console.log("An error occurred! " + err);
  });
}

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
  const targetNode = document.getElementsByClassName("SGP0hd kunNie")[0];
  if (targetNode){
    console.log(window.location.pathname)
    attendees = document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc")[1];
    setTimeout(function(){attendees.click();}, 500);
    setTimeout(function(){attendees.click();}, 2000);
    setTimeout(callbackHost, 3000);
    observer.disconnect();
    return;
  }
};

const presentationCallback = function(mutationsList, observer) {
  if(typeUser == "Host"){
    const targetNode = getElementsByText("(Presentation)", "div")[0];
    if (targetNode){
      setTimeout(function(){
        setInterval(sendContent, 1000/presentationFPS, targetNode.nextElementSibling.nextElementSibling.children[0]);
      }, 5000);
      observer.disconnect();
      return;
    }
  }
}

// Options for the observer (which mutations to observe)
const config = { attributes: false, childList: true, subtree: true };

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);
const presentationObserver = new MutationObserver(presentationCallback);

// Start observing the target node for configured mutations
observer.observe(document, config);

const callbackHost = function() {
  addButtonCanvas();

  var hostCheck = document.querySelectorAll('[aria-label="Host controls"]')[0];
  if(hostCheck){
    console.log("Host");
    typeUser = "Host";
  }
  else{
    console.log("Audi");
    typeUser = "Audi";
  }

  initMsg = {
    event: "init",
    meetCode: window.location.pathname,
    role: typeUser,
    uid: "",
    name: userName
  };
  chrome.runtime.sendMessage({event: "ID needed"}, function(response){
    console.log(response);
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var hostCheck = document.querySelectorAll('[aria-label="Host controls"]')[0];
    initMsg["uid"] = request.uid;
    console.log("initMsg", initMsg);
    createPanel();
    if(hostCheck){
      let controlSwitch = document.getElementById("controlSwitch");
      controlSwitch.addEventListener("change", function(){
        if(this.checked){
          console.log("Manual On");
          manualControls();
          var manualSubmit = document.getElementById("manualMetrics");
          manualSubmit.addEventListener("click", function(){
            manualFlag = true;
            sendRequestToServer();
          });
        }
        else{
          console.log("Manual Off");
          var manualDiv = document.getElementById("manualControls");
          manualDiv.remove();
        }
      });
    }
    openConnection();
    sendResponse({event:"Done"});
    presentationObserver.observe(document, config);
  }
);

