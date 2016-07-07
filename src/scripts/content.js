(function () {
    'use strict';

    var config;

    function sendMessage(type, message) {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({
                type: type,
                message: message
            }, resolve);
        });
    }

    function getConstituentByEmailAddress(emailAddress) {
        return new Promise(function (resolve, reject) {
            sendMessage('apiSearch', {
                emailAddress: emailAddress
            }).then(resolve).catch(reject);
        });
    }

    function init(sdk) {
        var showAlert;

        showAlert = function (message) {
            sdk.ButterBar.showMessage({
                text: message || "Please wait...",
                time: 5000
            });
        };

        // When the user begins writing a new email...
        sdk.Compose.registerComposeViewHandler(function (composeView) {

            // Add a custom button next to the Submit button.
            composeView.addButton({
                title: "Constituent Information",
                iconUrl: chrome.runtime.getURL('build/img/bbicon.png'),
                onClick: function (event) {
                    showAlert("Attempting to match recipients to constituent records. Please wait...");

                    // First, get the Handlebars template for the constituent flyups.
                    sendMessage('getConstituentDetailTemplate').then(function (data) {
                        var element,
                            source,
                            template;

                        source = data;
                        template = Handlebars.compile(source);

                        // For each email address in the <TO> field...
                        event.composeView.getToRecipients().forEach(function (contact) {

                            // Attempt to match the email address with a SKY API constituent record.
                            getConstituentByEmailAddress(contact.emailAddress).then(function (data) {

                                // Something bad happened with the API.
                                if (data.error) {
                                    return showAlert(data.error);
                                }

                                // The request to the API was valid, but didn't return any records.
                                if (data.count === 0) {
                                    return showAlert("The recipient email addresses did not match any constituent records.");
                                }

                                showAlert(data.count + " constituent record(s) found!");

                                // Create a mole view displaying the constituent's information.
                                data.value.forEach(function (constituent) {
                                    element = document.createElement('div');
                                    element.innerHTML = template({
                                        constituent: constituent
                                    });
                                    sdk.Widgets.showMoleView({
                                        el: element,
                                        chrome: true,
                                        title: constituent.name
                                    });
                                });
                            }).catch(showAlert);
                        });
                    });
                }
            });
        });
    }

    // Fetch configuration variables and initialize the extension.
    sendMessage('getConfig').then(function (data) {
        config = data;
        InboxSDK.load(config.CHROME_SDK_VERSION, config.CHROME_APP_ID).then(init);
    });
}());
