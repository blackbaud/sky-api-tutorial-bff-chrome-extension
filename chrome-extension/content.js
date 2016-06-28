(function () {
    'use strict';

    var config;

    // For local development:
    // Uncomment the following line of code to get your temporary redirect URI.
    // Copy and paste this redirect URI into your SKY API Application config.
    // alert(chrome.identity.getRedirectURL('oauth2'));

    // Fetch configuration variables and initialize the extension.
    chrome.runtime.sendMessage({
        type: 'getConfig'
    }, function (response) {
        config = response;
        init();
    });

    function getConstituentsByEmailAddress(contacts) {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({
                type: 'apiSearch',
                data: contacts
            }, function (response) {
                if (response.error) {
                    return reject(response.error);
                }
                resolve(response);
            });
        });
    }

    function init() {
        InboxSDK.load(config.CHROME_SDK_VERSION, config.CHROME_APP_ID).then(function (sdk) {
            sdk.Compose.registerComposeViewHandler(function (composeView) {
                composeView.addButton({
                    title: "Constituent Information",
                    onClick: function (event) {
                        var contacts;

                        sdk.ButterBar.showMessage({
                            text: "Attempting to match recipients to constituent records. Please wait..."
                        });

                        contacts = event.composeView.getToRecipients();

                        getConstituentsByEmailAddress(contacts).then(function (data) {
                            console.log("getConstituentsByEmailAddress then", data);
                            if (data.count === 0) {
                                sdk.ButterBar.showMessage({
                                    text: "The recipient email addresses did not match any constituent records.",
                                    time: 5000
                                });
                            } else {
                                sdk.ButterBar.showMessage({
                                    text: data.count + " constituent record(s) found! Please wait...",
                                    time: 5000
                                });
                            }
                        }).catch(function (reason) {
                            sdk.ButterBar.showMessage({
                                text: reason,
                                time: 5000
                            });
                        });
                    }
                });
            });
        });
    }
}());
