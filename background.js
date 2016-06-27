(function () {
    'use strict';

    function get(endpoint) {
        return $.get(endpoint);
    }

    //robertcarloshernandez@gmail.com

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.type) {
        case 'search':
            get('https://api.sky.blackbaud.com/constituent/v1/constituents/search?' + $.param({
                searchText: request.data[0]
            })).then(function (res) {
                console.log("get", res);
                sendResponse(res);
            });
            break;
        default:
            sendResponse({
                error: {
                    text: "No constituents found."
                }
            });
            break;
        }
    });
}());
