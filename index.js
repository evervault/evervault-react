/** @format */

import React from 'react';

const EVERVAULT_URL = 'https://js.evervault.com/v1';
const EVERVAULT_URL_REGEX = /^https:\/\/js\.evervault\.com\/v1\/?(\?.*)?$/;
const injectScript = () => {
  const script = document.createElement('script');
  script.src = EVERVAULT_URL;

  const headOrBody = document.head || document.body;

  if (!headOrBody) {
    throw new Error(
      'Expected document.body not to be null. Evervault.js requires a <body> element.'
    );
  }

  headOrBody.appendChild(script);

  return script;
};

let evervaultPromise = null;

const loadScript = () => {
  // Ensure that we only attempt to load Evervault.js at most once
  if (evervaultPromise !== null) {
    return evervaultPromise;
  }

  evervaultPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    if (window.Evervault) {
      console.warn('Evervault has already been loaded');
    }

    if (window.Evervault) {
      resolve(window.Evervault);
      return;
    }

    try {
      let script = findScript();

      if (script) {
        console.warn('Evervault has already been loaded');
      } else if (!script) {
        script = injectScript();
      }

      script.addEventListener('load', () => {
        if (window.Evervault) {
          resolve(window.Evervault);
        } else {
          reject(new Error('Evervault.js not available'));
        }
      });

      script.addEventListener('error', () => {
        reject(new Error('Failed to load Evervault.js'));
      });
    } catch (error) {
      reject(error);
      return;
    }
  });

  return evervaultPromise;
};

const findScript = () => {
  const scripts =
    document.querySelectorAll <
    HTMLScriptElement >
    `script[src^="${EVERVAULT_URL}"]`;

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    if (!EVERVAULT_URL_REGEX.test(script.src)) {
      continue;
    }

    return script;
  }

  return null;
};

const loadEvervault = async () => {
  const evervaultPromise = Promise.resolve().then(() => loadScript());

  let loadCalled = false;

  evervaultPromise.catch((err) => {
    if (!loadCalled) {
      console.warn(err);
    }
  });

  loadCalled = true;
  return evervaultPromise.then(() => {
    if (typeof window !== 'undefined') return window.Evervault;
  });
};

export const EvervaultContext = React.createContext(undefined);

export const EvervaultProvider = ({ teamId, customConfig, children, ...props }) => {
  if(typeof window === 'undefined') {
    return (
      <EvervaultContext.Provider>
        {children}
      </EvervaultContext.Provider>
    );
  }

  const [ev, setEv] = React.useState(undefined);

  React.useEffect(() => {
    loadEvervault().then((evervault) => setEv(new evervault(teamId, customConfig)));
  }, [loadEvervault]);

  return (
    <EvervaultContext.Provider {...props} value={ev}>
      {children}
    </EvervaultContext.Provider>
  );
};

export const EvervaultInput = ({ onChange, config }) => {
  if(typeof window === 'undefined') {
    return (<div id='encryptedInput'></div>)
  }

  const evervault = useEvervault();

  const initEvForm = async () => {
    const encryptedInput = evervault?.inputs('encryptedInput', config);
    encryptedInput?.on('change', async (cardData) => {
      if (typeof onChange === 'function') {
        onChange(cardData);
      }
    });
  }
  
  React.useEffect(() => {
    initEvForm();
  }, [evervault]);

  return (<div id='encryptedInput'></div>)
}

export function useEvervault() {
  if(typeof window === 'undefined') {
    return;
  }

  if (typeof React.useContext !== 'function') {
    throw new Error(
      'You must use React >= 16.8 in order to use useEvervault()'
    );
  }
  const evervault = React.useContext(EvervaultContext);
  return evervault;
}
