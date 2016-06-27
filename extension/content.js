(function () {
    'use strict';

    var CHROME_APP_ID = 'sdk_Sky-Integration_809ded04d4';
    var SDK_VERSION = '1.0';

    /**
     *
     */
    function getConstituentsByEmailAddress(contacts) {
        return new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage({
                type: 'search',
                data: contacts
            }, function (response) {
                console.log("getConstituentsByEmailAddress", response);
                resolve(response);
            });
        });
    }

    InboxSDK.load(SDK_VERSION, CHROME_APP_ID).then(function (sdk) {
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
                        sdk.ButterBar.showMessage({
                            text: data.text || "Hmm...",
                            time: 5000
                        });
                    });
                }
            });
        });
    });
}());
