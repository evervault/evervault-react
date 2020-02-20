import React from 'react';
import evervault from '@evervault/sdk'

export default function withEvervault(WrappedComponent, APP_ID, AUTH_URL, API_URL) {
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
      return(
        <WrappedComponent evervault={this.state.evervault} />
      )
    }
  }
}