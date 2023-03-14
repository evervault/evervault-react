[![Evervault](https://evervault.com/evervault.svg)](https://evervault.com/)

# Evervault React.js SDK

The [Evervault](https://evervault.com) React.js SDK is a toolkit for encrypting data on the client. Using the Evervault React.js SDK means your customer's data never leaves their device unencrypted.

## Getting Started

Before starting with the Evervault Node.js SDK, you will need to [create an account](https://app.evervault.com/register) and a team.

For full installation support, [book time here](https://calendly.com/evervault/support).

## Documentation

See the Evervault [React.js SDK documentation](https://docs.evervault.com/reference/react-sdk).

## Installation

Our React.js SDK is distributed via [npm](https://www.npmjs.com/), and can be installed using your preferred package manager.

```shell
npm i @evervault/react
```

## Initialization

Once installed, initialize the React.js SDK with your team's unique ID found in the [Settings](https://app.evervault.com/settings). Use an `EvervaultProvider` component as a provider for your app.

```javascript
import { EvervaultProvider } from "@evervault/react";
export const App = () => (
  <EvervaultProvider teamId={"<YOUR-TEAM-ID>" appId="<YOUR_APP_ID>"}>
    <ChildComponent />
  </EvervaultProvider>;
);
```

## Reference

The Evervault React.js SDK exposes two functions.

### evervault.encrypt()

`evervault.encrypt()` encrypts data for use in your [Cages](https://docs.evervault.com/tutorial). To encrypt data on the client, simply pass the value into the `evervault.encrypt()` function. Store the encrypted data in your database as normal. Send it to your API and use our [server-side SDKs](https://docs.evervault.com/reference/nodejs-sdk) to forward the data to your Cage.

```javascript
async evervault.encrypt(data: Object | Array | String | Number);
```

| Parameter | Type                                    | Description           |
| --------- | --------------------------------------- | --------------------- |
| data      | `Object`, `Array`, `String` or `Number` | Data to be encrypted. |

Any time you want to encrypt data, simply import `useEvervault` in your component.

```jsx
import React from 'react';
import { useEvervault } from '@evervault/react';

export const MyComponent = ({ someState }) => {
  const evervault = useEvervault();
  const [encryptedState, setEncryptedState] = React.useState(undefined);

  const encryptState = React.useCallback(
    async () => setEncryptedState(await evervault.encrypt(someState)),
    [setEncryptedState, evervault]
  );

  React.useEffect(() => encryptState(), [encryptState])

  return (
    {encryptedState && <p>encryptedState</p>}
  );
}
```

### evervault.inputs()

`evervault.inputs()` initializes Evervault Inputs which make it easy to collect encrypted cardholder data in a completely PCI-compliant environment.

Evervault Inputs are served within an iFrame retrieved directly from Evervault’s PCI-compliant infrastructure, which can reduce your PCI DSS compliance scope to the simplest form (SAQ-A) once integrated correctly.

Simply pass the id of the element in which the iFrame should be embedded.

We also support [themes](https://docs.evervault.com/concepts/inputs/overview#customising-inputs) so you can customise how Inputs looks in your UI.

```javascript
evervault.inputs(id: String, config: Object);
```

| Parameter | Type   | Description                                                               |
| --------- | ------ | ------------------------------------------------------------------------- |
| id        | string | Id of the element in which the Evervault Inputs iFrame should be embedded |
| config    | Object | A config object for custom styling.                                       |

#### config

| Parameter                  | Type   | Description                                                                        |
| -------------------------- | ------ | ---------------------------------------------------------------------------------- |
| theme                      | String | The base styling for Inputs. Currently supports default, minimal and material.     |
| height                     | String | The height of the Evervault Inputs iframe.                                         |
| primaryColor               | String | The main theme color.                                                              |
| labelColor                 | String | The color CSS property applied to the input labels.                                |
| inputBorderColor           | String | The border-color CSS property applied to inputs.                                   |
| inputTextColor             | String | The color CSS property applied to inputs.                                          |
| inputBackgroundColor       | String | The color CSS property applied to the ::placeholder CSS pseudo-element for inputs. |
| inputBorderRadius          | String | The border-radius CSS property applied to inputs.                                  |
| inputHeight                | String | The height CSS property applied to inputs.                                         |
| cardNumberLabel            | String | The label for the card number input                                                |
| expirationDateLabel        | String | The label for the expiration date input                                            |
| securityCodeLabel          | String | The label for the security code input                                              |
| expirationDatePlaceholder  | String | The placeholder shown for the expiration date input                                |
| invalidCardNumberLabel     | String | The message shown on an invalid card number                                        |
| invalidExpirationDateLabel | String | The message shown on an invalid expiration date                                    |
| invalidSecurityCodeLabel   | String | The message shown on an invalid security code                                      |
| fontUrl                    | String | Load a custom font with the Google Fonts API                                       |
| fontFamily                 | String | Set the font-family for the fontUrl                                                |
| disableCVV                 | Boolean | If true the CVV field will not be displayed                                       |

#### Retrieving card data

There are two ways of accessing encrypted card data once it has been entered.
In each case, a `cardData` object containing details about the card data your user has entered is returned.

```json
{
  "card": {
    "type": "visa_credit",
    "number": "ev:encrypted:abc123",
    "cvc": "ev:encrypted:def456",
    "expMonth": "01",
    "expYear": "23"
  },
  "isValid": true,
  "isPotentiallyValid": true,
  "isEmpty": false,
  "error": {
    "type": "invalid_pan",
    "message": "The credit card number you entered was invalid"
  }
}
```

##### `onChange` hook

This option is best when you are looking to handle the card values in realtime, like displaying validation errors as a user is inputting their card data. The callback for the hook is run every time your user updates the card data.

```javascript
const evervault = useEvervault();
const [encryptedData, setEncryptedData] = useState(undefined);

const initEvForm = async () => {
  const encryptedInput = evervault?.input?.generate("encryptedInput");
  encryptedInput?.on("change", async (cardData) => {
    setEncryptedData(cardData);
  });

  useEffect(() => {
    initEvForm();
  }, [evervault]);
};
```

#### `getData` method

This option is best when you are looking to retrieve card data occasionally, like when your form is submitted.

```javascript
const cardData = await inputs.getData();
```

#### Localization

The iFrame can be localized on initialization by providing a set of labels in the [config](#config). The labels can then be updated as required using the `setLabels` method.

```javascript
await inputs.setLabels({});
```

| Parameter                  | Type   | Description                                         |
| -------------------------- | ------ | --------------------------------------------------- |
| cardNumberLabel            | String | The label for the card number input                 |
| expirationDateLabel        | String | The label for the expiration date input             |
| securityCodeLabel          | String | The label for the security code input               |
| expirationDatePlaceholder  | String | The placeholder shown for the expiration date input |
| invalidCardNumberLabel     | String | The message shown on an invalid card number         |
| invalidExpirationDateLabel | String | The message shown on an invalid expiration date     |
| invalidSecurityCodeLabel   | String | The message shown on an invalid security code       |

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/evervault/evervault-react.

## Feedback

Questions or feedback? [Let us know](mailto:support@evervault.com).
