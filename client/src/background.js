chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.event === "ID needed"){
        chrome.identity.getProfileUserInfo(function(userInfo){
            console.log(userInfo.id);
            chrome.tabs.sendMessage(sender.tab.id, {uid: userInfo.id}, function(){console.log("Done");});
        });
        sendResponse({event:"Done"});
      }
    }
);