import React from 'react';
import EventServices from './EventServices';
import ServicesContext from './ServicesContext';
import withFirebase, { WithFirebase } from '../core/Session/withFirebase';

export type ServicesContextProviderProps = WithFirebase;

class ServicesContextProvider extends React.Component<ServicesContextProviderProps> {

  render() {
    const { firebase, children } = this.props;
    return (
      <ServicesContext.Provider value={{ events: new EventServices(firebase) }}>
        {children}
      </ServicesContext.Provider>
    );
  }

}
export default withFirebase(ServicesContextProvider);
