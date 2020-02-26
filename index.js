import React from 'react';
import evervault from '@evervault/sdk'

export const EvervaultContext = React.createContext(undefined);
export const EvervaultProvider = EvervaultContext.Provider;
export const EvervaultConsumer = EvervaultContext.Consumer;

export function withEvervault(WrappedComponent, APP_ID, AUTH_URL, API_URL, useEvervaultContext) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      evervault.init({auth: AUTH_URL, api: API_URL}, { appId: APP_ID });
      evervault.checkAuth(APP_ID);
      this.state = { 
        evervault 
      };
    }
    
    render() {
      if(useEvervaultContext){
        return (
          <EvervaultProvider value={this.state.evervault}>
            <WrappedComponent />
          </EvervaultProvider>
        );
      }
      return(
        <WrappedComponent evervault={this.state.evervault} />
      )
    }
  }
}
