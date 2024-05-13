function updateTabList() {
    const tabList = document.getElementById('tab-list');
    tabList.innerHTML = ''; // Clear existing tab info

    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
            let div = document.createElement('div');
            div.className = 'tab-item';

            // Create an image element for the favicon
            let img = document.createElement('img');
            img.src = tab.favIconUrl ? tab.favIconUrl : 'default_icon.png'; // Use favicon if available, otherwise use default
            img.className = 'favicon';
            img.onerror = function() { // Fallback if the favicon doesn't load or is broken
                this.src = 'default_icon.png';
            };
            img.alt = 'Tab Icon';

            // Create a span for the tab title
            let title = document.createElement('span');
            title.textContent = tab.title;
            title.className = 'tab-title';

            // Create a button to close the tab
            let closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.onclick = function (e) {
                e.stopPropagation(); // Prevent the click from affecting the div
                chrome.tabs.remove(tab.id, function() {
                    // Remove the tab item from the DOM after it's closed
                    div.remove();
                });
            };

            // Assemble the div
            div.appendChild(img);
            div.appendChild(title);
            div.appendChild(closeButton);

            // Clicking the div switches to the tab
            div.onclick = function () {
                chrome.tabs.update(tab.id, {active: true});
                chrome.windows.update(tab.windowId, {focused: true});
                updateTabList()
            };

            tabList.appendChild(div);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('dark-mode-toggle');
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        toggleButton.checked = true;
    }

    toggleButton.addEventListener('change', function () {
        document.body.classList.toggle('dark-mode', this.checked);
        localStorage.setItem('darkMode', this.checked);
    });

    updateTabList();
});


