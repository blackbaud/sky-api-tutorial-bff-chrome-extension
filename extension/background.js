(function () {
    'use strict';

    var config;
    var OAUTH_BASE_URI = 'https://oauth2.sky.blackbaud.com/';
    var SKY_API_BASE_URI = 'https://api.sky.blackbaud.com/';
    var REDIRECT_URI = chrome.identity.getRedirectURL('oauth2');

    $.get('config.yml').then(function (data) {
        config = YAML.parse(data);
    });

    function checkToken() {
        var urlParams,
            webAuthCallback,
            webAuthOptions;

        webAuthOptions = {
            'url': getAuthorizationUrl(),
            'interactive': true
        };

        return new Promise(function (resolve, reject) {
            chrome.identity.launchWebAuthFlow(webAuthOptions, function (responseUrl) {
                urlParams = getUrlParams(responseUrl);
                http('POST',
                    OAUTH_BASE_URI + 'token',
                    {
                        'grant_type': 'authorization_code',
                        'code': urlParams.code,
                        'redirect_uri': REDIRECT_URI
                    },
                    {
                        'Authorization': 'Basic ' + btoa(config.CLIENT_ID + ':' + config.CLIENT_SECRET)
                    }
                ).then(resolve);
            });
        });
    }

    function getAuthorizationUrl() {
        return OAUTH_BASE_URI + 'authorization?' + $.param({
            'client_id': config.CLIENT_ID,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI
        });
    }

    function getUrlParams(str) {
        var params;
        params = {};
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
        case 'search':
            checkToken().then(function (res) {
                http('GET',
                    SKY_API_BASE_URI + 'constituent/v1/constituents/search',
                    {
                        'searchText': request.data[0].emailAddress
                    },
                    {
                        'bb-api-subscription-key': config.API_SUBSCRIPTION_KEY,
                        'Authorization': 'Bearer ' + res.access_token
                    }
                ).then(sendResponse);
            });
            break;
        default:
            sendResponse({
                error: {
                    text: 'No constituents found.'
                }
            });
            break;
        }
    }

    chrome.runtime.onMessage.addListener(messageHandler);

}());
