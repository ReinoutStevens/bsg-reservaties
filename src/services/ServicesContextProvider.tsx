import React from 'react';
import EventServices from './EventServices';
import ServicesContext from './ServicesContext';
import withFirebase, { WithFirebase } from '../core/Session/withFirebase';
import UserServices from './UserServices';

export type ServicesContextProviderProps = WithFirebase;

class ServicesContextProvider extends React.Component<ServicesContextProviderProps> {
  private events: EventServices;
  private users: UserServices;

  constructor(props: ServicesContextProviderProps) {
    super(props)
    this.events = new EventServices(props.firebase);
    this.users = new UserServices(props.firebase);
  }
  render() {
    const { children } = this.props;
    return (
      <ServicesContext.Provider
        value={{
          events: this.events,
          users: this.users,
        }}
      >
        {children}
      </ServicesContext.Provider>
    );
  }

}
export default withFirebase(ServicesContextProvider);
