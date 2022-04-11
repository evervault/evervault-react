[![Evervault](https://evervault.com/evervault.svg)](https://evervault.com/)

# Evervault React.js SDK

The [Evervault](https://evervault.com) React.js SDK is a toolkit for encrypting data on the client. Using the Evervault React.js SDK means your customer's data never leaves their device unencrypted.

## Getting Started

Before starting with the Evervault Node.js SDK, you will need to [create an account](https://app.evervault.com/register) and a team.

For full installation support, [book time here](https://calendly.com/evervault/cages-onboarding).

## Documentation

See the Evervault [React.js SDK documentation](https://docs.evervault.com/reactjs).

## Installation

Our React.js SDK is distributed via [npm](https://www.npmjs.com/), and can be installed using your preferred package manager.

```shell
npm i @evervault/react
```

## Initialization

Once installed, initialize the React.js SDK with your team's unique ID found in the [Settings](https://app.evervault.com/settings). Use an `EvervaultProvider` component as a provider for your app.

```javascript
import { EvervaultProvider } from "@evervault/react";

export const App = () => {
  <EvervaultProvider teamId={"<YOUR-TEAM-ID>"}>
    <ChildComponent />
  </EvervaultProvider>;
};
```

## Reference

The Evervault React.js SDK exposes two functions.

### evervault.encrypt()

`evervault.encrypt()` encrypts data for use in your [Cages](https://docs.evervault.com/tutorial). To encrypt data on the client, simply pass the value into the `evervault.encrypt()` function. Store the encrypted data in your database as normal. Send it to your API and use our [Node.js SDK](https://docs.evervault.com/nodejs) to forward the data to your Cage.

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
    { encryptedState && (<p>encryptedState</p>) }
  );
}
```

### evervault.inputs()

`evervault.inputs()` initializes Evervault Inputs which make it easy to collect encrypted cardholder data in a completely PCI-compliant environment.

Evervault Inputs are served within an iFrame retrieved directly from Evervault’s PCI-compliant infrastructure, which can reduce your PCI DSS compliance scope to the simplest form (SAQ-A) once integrated correctly.

Simply pass the id of the element in which the iFrame should be embedded.

We also support [themes](https://docs.evervault.com/concepts/inputs/overview#customising-inputs) so you can customise how Inputs looks in your UI.

```javascript
evervault.inputs(id: String, theme: String);
```

| Parameter | Type   | Description                                                               |
| --------- | ------ | ------------------------------------------------------------------------- |
| id        | string | Id of the element in which the Evervault Inputs iFrame should be embedded |
| theme     | string | Optional theme for styling Inputs, currently supported: minimal           |

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

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/evervault/evervault-react.

## Feedback

Questions or feedback? [Let us know](mailto:support@evervault.com).
