import React from 'react';
import ServicesContext, { ServicesContextProps } from './ServicesContext';

export interface WithServices {
  services: ServicesContextProps;
}
function withServices<T extends WithServices = WithServices>(Component: React.ComponentType<T>):
  React.ComponentType<Omit<T, keyof WithServices>> {
  return class extends React.Component<Omit<T, keyof WithServices>> {
    render() {
      return (
        <ServicesContext.Consumer>
          {(services) => {
            if (!services) {
              throw new Error('Expected Services to be defined');
            }
            return <Component services={services} {...this.props as T} />
          }}
        </ServicesContext.Consumer>
      );
    }
  }
}

export default withServices;
