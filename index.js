import React from 'react';
import evervault from '@evervault/sdk'

const EvervaultContext = React.createContext(undefined);
export EvervaultContext;

export const useEvervault = () => {
  const evervault = useContext(EvervaultContext);
  if(!evervault){
    throw new Error('evervault context could not be found. Please ensure that you have declared an evervault provider');
  }
  return evervault;
}

export default function withEvervault(WrappedComponent, APP_ID, AUTH_URL, API_URL, useEvervaultContext) {
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
          <EvervaultContext.Provider value={this.state.evervault}>
            <WrappedComponent />
          </EvervaultContext.Provider>
        );
      }
      return(
        <WrappedComponent evervault={this.state.evervault} />
      )
    }
  }
}
