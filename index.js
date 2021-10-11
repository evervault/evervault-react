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

export const EvervaultProvider = ({ teamId, children, ...props }) => {
  const [ev, setEv] = React.useState(undefined);
  const METRICS_URL = 'https://metrics.evervault.com';

  const customConfig = {
    urls: {
      keysUrl: process.env.REACT_APP_EV_API_URL
    }
  };

  React.useEffect(() => {
    loadEvervault().then((evervault) => setEv(new evervault(teamId, customConfig)));
  }, [loadEvervault]);

  return (
    <EvervaultContext.Provider {...props} value={ev}>
      {children}
    </EvervaultContext.Provider>
  );
};

export function useEvervault() {
  if (typeof React.useContext !== 'function') {
    throw new Error(
      'You must use React >= 16.8 in order to use useEvervault()'
    );
  }
  const evervault = React.useContext(EvervaultContext);
  return evervault;
}
