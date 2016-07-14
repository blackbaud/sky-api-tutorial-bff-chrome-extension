# SKY API Tutorial: BFF - Chrome Extension

## Overview
This tutorial demonstrates the interaction of a client application with an authorization microservice, using the Back-end For Front-end (BFF) Pattern. The files in this repository operate as a Google Chrome browser extension, which depends on a remote authorization microservice. The files responsible for the microservice are located within the [sky-api-tutorial-bff-auth-microservice](https://github.com/blackbaud/sky-api-tutorial-bff-auth-microservice/) Github repository.

## Installing Locally

### Requirements:
- Familiarity with git commands
- The [Chrome Browser](https://www.google.com/chrome/browser/desktop/) installed on your desktop
- A Google InboxSDK App ID ([free registration](https://www.inboxsdk.com/register))
- The authorization microservice running on your local machine ([read the installation instructions](https://github.com/blackbaud/sky-api-tutorial-bff-auth-microservice/))

### Step 1 — Download the extension's files
- Open Terminal/Command Prompt and type:
```
$  git clone https://github.com/blackbaud/sky-api-tutorial-bff-chrome-extension.git
```

### Step 2 — Configure the extension
- Duplicate **config.yml-sample** (located in the project root) as **config.yml** and fill in the missing values (all required).
    <table>
        <tr>
            <td>`AUTH_SERVICE_BASE_URI`</td>
            <td>
                The base URI of the [authorization microservice](https://github.com/blackbaud/sky-api-tutorial-bff-auth-microservice/). <br>
                <em>Default: `http://localhost:5000/`</em>
            </td>
        </tr>
        <tr>
            <td>`CHROME_APP_ID`</td>
            <td>Your Google InboxSDK App ID ([free registration](https://www.inboxsdk.com/register)).</td>
        </tr>
        <tr>
            <td>`CHROME_SDK_VERSION`</td>
            <td>The version of the SDK to use.<br><em>Default: `1.0`</em></td>
        </tr>
        <tr>
            <td>`SKY_API_SUBSCRIPTION_KEY`</td>
            <td>Your [SKY API developer subscription key](https://developer.sky.blackbaud.com/developer) (primary or secondary)</td>
        </tr>
    </table>

### Step 3 — Install the extension
- Open Google Chrome on your desktop.
- Visit [chrome://extensions](chrome://extensions).
- Make sure that **Developer Mode** is checked in the top-right corner of the page.
- Click **Load unpacked extension** and choose the root project folder you created in Step 1.
- Make note of the `ID` field beneath the new extension's title (you'll need the extension ID for the next step).

### Step 4 — Setup the microservice and server
- Visit the [sky-api-tutorial-bff-auth-microservice](https://github.com/blackbaud/sky-api-tutorial-bff-auth-microservice/) repo and complete all steps listed in the README.
- Once finished, continue to Step 5.

### Step 5 — Test the extension
- Visit [Gmail](http://mail.google.com/) using Google Chrome.
- Click **Compose** to start writing a new email.
- In the "To:" field, add the email address `robertcarloshernandez1@gmail.com` (this email address belongs to a [demo constituent record](https://renxt.blackbaud.com/constituents/280?tenantid=d698f0de-73f5-4a81-a4b1-ff353509faec)).
- Click the green "b" icon next to **Send**. This will begin the authorization flow.
- After successfully authorizing the Chrome extension, a new fly-up should appear at the bottom of the screen, containing the constituent data that matches the email address provided.
