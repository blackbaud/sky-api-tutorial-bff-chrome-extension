(function () {
    'use strict';

    var config;

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

        console.log("Inbox SDK installed. Loading dependencies...");

        // When the user begins writing a new email...
        sdk.Compose.registerComposeViewHandler(function (composeView) {

            // First, get the Handlebars template for the constituent flyups.
            sendMessage('getConstituentDetailTemplate').then(function (data) {
                var source,
                    template;

                source = data;
                template = Handlebars.compile(source);

                console.log("HTML template loaded. Ready for click events.");

                // Add a custom button next to the Submit button.
                composeView.addButton({
                    title: "Constituent Information",
                    iconUrl: chrome.runtime.getURL('build/img/bbicon.png'),
                    onClick: function (event) {
                        var recipients;
                        recipients = event.composeView.getToRecipients();

                        if (!recipients.length) {
                            return showAlert("Please enter a valid email address.");
                        }

                        showAlert("Attempting to match recipients to constituent records. Please wait...");

                        // For each email address in the <TO> field...
                        recipients.forEach(function (contact) {

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
                                    var element;
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
                    }
                });
            });
        });
    }

    // This method communicates with the background script.
    function sendMessage(type, message) {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({
                type: type,
                message: message
            }, resolve);
        });
    }

    // Load dependencies and initialize the extension.
    window.addEventListener("load", function load(event) {
        console.log("Page loaded. Fetching configuration...");
        sendMessage('getConfig').then(function (data) {
            console.log("Extension configuration loaded. Installing SDK...");
            config = data;
            InboxSDK.load(config.CHROME_SDK_VERSION, config.CHROME_APP_ID).then(init);
        });
    });
}());
