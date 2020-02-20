import React from 'react';
import evervault from '@evervault/sdk'

export default function withEvervault(WrappedComponent, MACHINE_NAME, DOMAIN) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        evervault: evervault(MACHINE_NAME, DOMAIN = 'https://auth.evervault.com')
      }
    }
    
    render() {
      return(
        <WrappedComponent evervault={this.state.evervault} />
      )
    }
  }
}