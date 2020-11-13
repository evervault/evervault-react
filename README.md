<p>
[![Evervault](https://evervault.com/evervault.svg)](https://welcome.evervault.com/)
</p>

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

## Setup

To make Evervault available for use in your app, use an `EvervaultProvider` component as a provider for your app.

```javascript
import { EvervaultProvider } from '@evervault/react';

export const App = () => {
  <EvervaultProvider teamId={'<YOUR-TEAM-ID>'}>
    <ChildComponent />
  </EvervaultProvider>
}
```

Then any time you want to encrypt data, simply import `useEvervault` in your component.

```javascript
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

## Reference

At present, there's one function available in the React.js SDK: `evervault.encrypt()`.

`evervault.encrypt()` encrypts data for use in your [Cages](https://docs.evervault.com/tutorial). To encrypt data on the client, simply pass an object or string into the `evervault.encrypt()` function. Store the encrypted data in your database as normal. Send it to your API and use our [Node.js SDK](https://docs.evervault.com/nodejs) to forward the data to your Cage.

```javascript
async evervault.encrypt(data: Object | String);
```

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| data | Object or String | Data to be encrypted. |

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/evervault/evervault-js.

## Feedback

Questions or feedback? [Let us know](mailto:support@evervault.com).
