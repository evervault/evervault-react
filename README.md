# evervault-react
The official React SDK for interacting with Evervault.

To learn more about Evervault, visit [the docs](https://docs.evervault.com/).

## Installing
```shell
npm i @evervault/react
```

## Getting started
To make Evervault available for use in your application, use an `EvervaultProvider` component as a provider for your App.

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

## Using Evervault React with Evervault Cages
Using Evervault react means your customer's data never leaves their device unencrypted.

Evervault React encrypts data that can be sent directly into an Evervault Cage and operated on.

Once your data is encrypted, send it to your API and use our [Node SDK](https://github.com/evervault/evervault-node-sdk) to forward the data to your cage.
