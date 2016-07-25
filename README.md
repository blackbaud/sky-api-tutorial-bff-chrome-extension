# SKY API Tutorial: Backends For Frontend (BFF) Pattern

## Overview
This tutorial demonstrates the interaction of a client application with an authorization microservice, using the Backends For Frontend (BFF) Pattern. This repository contains both the backend microservice, as well as the frontend (Google Chrome extension), but in a real-world scenario these components would be isolated on different machines. The files responsible for the microservice are located within the `microservice` directory and the files for the Chrome extension are stored in the `extension` directory.

## Installing Locally

### Basic Requirements:

- Familiarity with git commands
- The latest, stable version of [Git](https://git-scm.com/)
- The [Chrome Browser](https://www.google.com/chrome/browser/desktop/) installed on your desktop
- A Google Inbox SDK App ID ([free registration](https://www.inboxsdk.com/register))
- [.NET Core SDK](https://www.microsoft.com/net/core) installed locally

### Sky API Requirements:

- **A Blackbaud Developer Subscription Key**
    - If you have not already done so, be sure to complete the [Getting started guide](https://apidocs.sky.blackbaud.com/docs/getting-started/). This will guide you through the process of registering for a Blackbaud developer account and requesting a subscription to an API product.
    - Once approved, your subscription will contain a **Primary Key** and a **Secondary Key**.  You can use either key as the subscription key value for the `bb-api-subscription-key` request header when making calls to the API.
    - You can view your subscription keys on your [Blackbaud Developer Profile](https://developer.sky.blackbaud.com/developer).
- **A Blackbaud Developer Application ID and Application Secret**
    - [Register your application](https://developerapp.sky.blackbaud.com/applications) in order to obtain the **Application ID** (client ID) and **Application Secret** (client secret).


### Step 1 — Clone the files
- Open Terminal/Command Prompt and type:
```
$  git clone https://github.com/blackbaud/sky-api-tutorial-bff-pattern
```

### Step 2 — Configure the extension
- Duplicate **config.yml-sample** (located in the project root) as **config.yml** and fill in the missing values (all required).
    <table>
        <tr>
            <td>`AUTH_SERVICE_BASE_URI`</td>
            <td>
                The base URI of the authorization microservice (see Step 4)<br>
                Default: `http://localhost:5000/`
            </td>
        </tr>
        <tr>
            <td>`CHROME_APP_ID`</td>
            <td>Your Google Inbox SDK App ID ([free registration](https://www.inboxsdk.com/register)).</td>
        </tr>
        <tr>
            <td>`CHROME_SDK_VERSION`</td>
            <td>The version of the [Inbox SDK](https://www.inboxsdk.com/docs/#InboxSDK) to use.<br>Default: `1.0`</td>
        </tr>
        <tr>
            <td>`SKY_API_SUBSCRIPTION_KEY`</td>
            <td>Your [SKY API (Blackbaud) developer subscription key](https://developer.sky.blackbaud.com/developer) (primary or secondary)</td>
        </tr>
    </table>

### Step 3 — Install the extension
- Open Google Chrome on your desktop.
- Visit [chrome://extensions](chrome://extensions).
- Make sure **Developer Mode** is checked in the top-right corner of the page.
- Click **Load unpacked extension** and choose the `extension` directory.
- **IMPORTANT:** Make note of the `ID` field beneath the new extension's title on your list of installed extensions (you'll need the Extension ID for the next step).

### Step 4 — Configure the microservice
- Duplicate **appsettings.Development.json-sample** as **appsettings.Development.json** and fill in the missing values (all required).
    <table>
        <tr>
            <td>`AppSettings.ClientID`</td>
            <td>
                Your SKY API registered application's [Application ID](https://developerapp.sky.blackbaud.com/applications)
            </td>
        </tr>
        <tr>
            <td>`AppSettings.RedirectUri`</td>
            <td>
                The respective Redirect URI listed under your [registered application](https://developerapp.sky.blackbaud.com/applications)'s Redirect URIs.<br>
                <ul>
                  <li>The redirect URI follows the pattern `https://<extension-id>.chromiumapp.org/oauth2`.</li>
                  <li>The `<extension-id>` represents the unique ID that is automatically generated when the Chrome extension is uploaded to Google's servers.</li>
                  <li>When developing locally, Chrome generates a random ID automatically when you load it as an "unpacked extension".</li>
                  <li>The ID can be found by visiting [chrome://extensions](chrome://extensions) in your Chrome browser; look for the `ID` label beneath the extension's listing.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td>`AppSettings.Secret`</td>
            <td>Your SKY API registered application's Application Secret</td>
        </tr>
    </table>

### Step 5 — Start the microservice
- Open Terminal/Command Prompt and type:
```
$  dotnet restore
```
- On a Mac, type:
```
$  export ASPNETCORE_ENVIRONMENT=Development && dotnet run
```
- On a PC, type:
```
$  set ASPNETCORE_ENVIRONMENT=Development && dotnet run
```

### Step 6 — Test the extension
- Visit [Gmail](http://mail.google.com/) using Google Chrome.
- Click **Compose** to start writing a new email.
- In the "To:" field, add any email address associated with a [constituent record](https://renxt.blackbaud.com/lists/constituents).
- Click the green "b" icon next to **Send**. This will begin the authorization flow.
- After successfully authorizing the Chrome extension, a new fly-up should appear at the bottom of the screen, containing the constituent data that matches the email address provided.
