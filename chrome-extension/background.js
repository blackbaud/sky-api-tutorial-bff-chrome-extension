(function () {
    'use strict';

    var config;

    function checkToken() {
        var webAuthOptions;

        webAuthOptions = {
            'url': getAuthorizationUrl(),
            'interactive': true
        };

        return new Promise(function (resolve, reject) {
            chrome.identity.launchWebAuthFlow(webAuthOptions, function (responseUrl) {
                var urlParams;

                if (chrome.runtime.lastError) {
                    return reject({
                        error: chrome.runtime.lastError.message
                    });
                }

                urlParams = getUrlParams(responseUrl);

                http('POST',
                    config.OAUTH_BASE_URI + 'token',
                    {
                        'grant_type': 'authorization_code',
                        'code': urlParams.code,
                        'redirect_uri': config.OAUTH_REDIRECT_URI
                    },
                    {
                        'Authorization': 'Basic ' + btoa(config.OAUTH_CLIENT_ID + ':' + config.OAUTH_SECRET)
                    }
                ).then(resolve);
            });
        });
    }

    function getAuthorizationUrl() {
        return config.OAUTH_BASE_URI + 'authorization?' + $.param({
            'client_id': config.OAUTH_CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': config.OAUTH_REDIRECT_URI
        });
    }

    function getUrlParams(str) {
        var params;
        params = {};
        if (!str) {
            return params;
        }
        str.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
            params[key] = value;
        });
        return params;
    }

    function http(method, url, data, headers) {
        return $.ajax({
            method: method || 'GET',
            url: url,
            data: data,
            headers: headers
        });
    }

    function messageHandler(request, sender, sendResponse) {
        switch (request.type) {
        case 'apiSearch':
            checkToken().then(function (res) {
                http('GET',
                    config.SKY_API_BASE_URI + 'constituent/v1/constituents/search',
                    {
                        'searchText': request.data[0].emailAddress
                    },
                    {
                        'bb-api-subscription-key': config.SKY_API_SUBSCRIPTION_KEY,
                        'Authorization': 'Bearer ' + res.access_token
                    }
                ).then(sendResponse).catch(function (reason) {
                    sendResponse({
                        error: reason.responseJSON.message
                    });
                });
            }).catch(sendResponse);
            break;
        case 'getConfig':
            http('GET', 'config.yml').then(function (data) {
                config = YAML.parse(data);
                sendResponse(config);
            });
            break;
        default:
            sendResponse({
                error: 'Invalid request type.'
            });
            break;
        }

        // Indicate that we wish to send a response asynchronously.
        // http://developer.chrome.com/extensions/runtime.html#event-onMessage
        return true;
    }

    chrome.runtime.onMessage.addListener(messageHandler);
}());
