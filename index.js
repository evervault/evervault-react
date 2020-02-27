/** @format */

import React from 'react';
import evervault from '@evervault/sdk';

export const EvervaultContext = React.createContext(undefined);
export const EvervaultProvider = EvervaultContext.Provider;
export const EvervaultConsumer = EvervaultContext.Consumer;

export function withEvervault(WrappedComponent, params) {
  const { appId, authUrl, apiUrl, useEvervaultContext } = params;
  return class extends React.Component {
    constructor(props) {
      super(props);
      evervault.init(appId, { auth: authUrl, api: apiUrl });
      evervault.checkAuth();
      this.state = {
        evervault,
      };
    }

    render() {
      if (useEvervaultContext) {
        return (
          <EvervaultProvider value={this.state.evervault}>
            <WrappedComponent />
          </EvervaultProvider>
        );
      }
      return <WrappedComponent evervault={this.state.evervault} />;
    }
  };
}
