import React, { useContext } from 'react';
import evervault from '@evervault/sdk'

export const EvervaultContext = React.createContext(undefined);
export const EvervaultProvider = EvervaultContext.Provider;
export const EvervaultConsumer = EvervaultContext.Consumer;

export function useEvervault() {
  const evervault = React.useContext(EvervaultContext);
  if (!evervault) {
    throw new Error('No context found for evervault');
  }
  if (typeof useContext !== "function") {
    throw new Error('You must use React >= 16.8 in order to use useEvervault()');
  }
  return evervault;
}


export function withEvervault(WrappedComponent, params) {
  const {appId, authUrl, apiUrl, useEvervaultContext} = params;
  return class extends React.Component {
    constructor(props) {
      super(props);
      evervault.init({auth: authUrl, api: apiUrl}, { appId });
      evervault.checkAuth();
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
