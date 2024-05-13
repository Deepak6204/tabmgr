chrome.commands.onCommand.addListener(function(command) {
    if (command === "openExtension") {
      // Check if the extension's popup is already open in any window
      chrome.windows.getAll({populate: true}, function(windows) {
        for (let window of windows) {
          for (let tab of window.tabs) {
            if (tab.url === chrome.runtime.getURL("popup.html")) {
              // If the extension's popup is already open, focus on the window containing it
              chrome.windows.update(window.id, {focused: true});
              chrome.tabs.update(tab.id, {active: true});
              return;
            }
          }
        }
        // If the extension's popup is not open in any window, open it in a floating window
        chrome.windows.create({
          url: "popup.html",
          type: "popup",
          width: 500, // Adjust the width as needed
          height: 700, // Adjust the height as needed
        });
      });
    }
  });
  