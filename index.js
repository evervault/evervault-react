import * as React from 'react';
import evervault from '@evervault/sdk'

export const EvervaultContext = React.createContext(undefined);
export const EvervaultProvider = EvervaultContext.Provider;
export const EvervaultConsumer = EvervaultContext.Consumer;

export function useEvervault(){
  const evervault = React.useContext(EvervaultContext);
  if(!evervault){
    throw new Error('evervault context could not be found. Please ensure that you have declared an evervault provider');
  }
  return evervault;
}

export function withEvervault(WrappedComponent, APP_ID, AUTH_URL, API_URL, useEvervaultContext) {
  return class extends React.Component {
    state = {
      evervault: null
    }
    
    constructor(props) {
      super(props);
      evervault.init({auth: AUTH_URL, api: API_URL});
      evervault.checkAuth(APP_ID);
    }

    componentDidMount() {
      this.setState({
        evervault
      })
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
