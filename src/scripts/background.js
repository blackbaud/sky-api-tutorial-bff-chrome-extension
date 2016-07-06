(function () {
    'use strict';

    var config,
        session;

    // For local development:
    // Uncomment the following line of code to get your temporary redirect URI.
    // It will appear on the background page's console.
    // Copy and paste this redirect URI into your SKY API Application config.
    //console.log('OAUTH_REDIRECT_URI', chrome.identity.getRedirectURL('oauth2'));


    /**
     *
     */
    function checkAccessToken() {
        return new Promise(function (resolve, reject) {
            if (session.access_token) {
                resolve(session);
            } else {
                getAccessToken().then(resolve).catch(reject);
            }
        });
    }


    /**
     *
     */
    function getConstituentByEmailAddress(emailAddress) {
        return new Promise(function (resolve, reject) {
            http('GET',
                'https://api.sky.blackbaud.com/constituent/v1/constituents/search',
                {
                    'searchText': emailAddress
                },
                {
                    'bb-api-subscription-key': config.SKY_API_SUBSCRIPTION_KEY,
                    'Authorization': 'Bearer ' + session.access_token
                }
            ).then(resolve).catch(reject);
        });
    }


    /**
     *
     */
    function getAccessToken() {
        return new Promise(function (resolve, reject) {

            // Starts an auth flow at the specified URL.
            // https://developer.chrome.com/apps/identity#method-launchWebAuthFlow
            chrome.identity.launchWebAuthFlow(
                {
                    'url': config.AUTH_SERVICE_BASE_URI + 'authorization',
                    'interactive': true
                },
                function (responseUrl) {

                    // Handle any errors encountered.
                    if (chrome.runtime.lastError) {
                        return reject({
                            error: chrome.runtime.lastError.message
                        });
                    }

                    // Exchange the provided code for an access token
                    // with the authentication microservice
                    http('GET',
                        config.AUTH_SERVICE_BASE_URI + 'token',
                        getUrlParams(responseUrl)
                    ).then(function (data) {
                        session = data;
                        resolve(data);
                    }).catch(reject);
                }
            );
        });
    }


    /**
     *
     */
    function refreshAccessToken() {
        return new Promise(function (resolve, reject) {
            http('GET',
                config.AUTH_SERVICE_BASE_URI + 'refresh-token',
                {
                    refresh_token: session.refresh_token
                }
            ).then(resolve).catch(function () {
                getAccessToken().then(resolve).catch(reject);
            });
        });
    }


    /**
     * Parses URL attributes into a usable object.
     */
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


    /**
     * Makes HTTP requests.
     */
    function http(method, url, data, headers) {
        return $.ajax({
            method: method || 'GET',
            url: url,
            data: data,
            headers: headers
        });
    }


    /**
     * Receives (and returns) messages from the content script.
     */
    function messageHandler(request, sender, callback) {
        var emailAddress,
            parseError;

        parseError = function (reason) {
            callback({
                error: reason.responseJSON.message
            });
        };

        switch (request.type) {

        // Make a request to the constituent search API.
        // Ideally, these endpoints would live in a microservice of their own.
        case 'apiSearch':
            emailAddress = request.message.emailAddress;
            checkAccessToken().then(function () {
                getConstituentByEmailAddress(emailAddress).then(function (data) {

                    // The token has expired. Attempt to refresh.
                    if (data.StatusCode === 401) {
                        refreshAccessToken().then(function () {
                            getConstituentByEmailAddress(emailAddress).then(callback).catch(parseError);
                        }).catch(parseError);
                    }

                    // All is well, return the constituent data.
                    else {
                        callback(data);
                    }

                }).catch(parseError);
            }).catch(parseError);
            break;

        // Get configuration YAML file.
        case 'getConfig':
            http(
                'GET',
                chrome.runtime.getURL('config.yml')
            ).then(function (data) {
                config = YAML.parse(data);
                callback(config);
            });
            break;

        // Get the HTML file used to build the detail flyup.
        case 'getConstituentDetailTemplate':
            http(
                'GET',
                chrome.runtime.getURL('src/templates/constituent-detail.html')
            ).then(callback);
            break;

        // Unrecognized message type.
        default:
            callback({
                error: 'Invalid message type.'
            });
            break;
        }

        // Indicate that we wish to send a response message asynchronously.
        // http://developer.chrome.com/extensions/runtime.html#event-onMessage
        return true;
    }


    session = {};


    chrome.runtime.onMessage.addListener(messageHandler);
}());
