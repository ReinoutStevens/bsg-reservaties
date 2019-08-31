import React from 'react';
import Firebase from './Firebase';
import FirebaseContext from './FirebaseContext';

export interface FirebaseContextProviderProps {

}

export interface FirebaseContextProviderState {
  user: firebase.User | null;
}

class FirebaseContextProvider extends React.Component<FirebaseContextProviderProps, FirebaseContextProviderState> {
  private firebase: Firebase;

  constructor(props: {}) {
    super(props);
    this.firebase = new Firebase();
    this.state = {
      user: this.firebase.currentUser(),
    }
    this.firebase.addAuthChangeListener(this.setCurrentUser);
  }

  render() {
    const { user } = this.state;
    const { children } = this.props;
    return (
      <FirebaseContext.Provider value={{ firebase: this.firebase, currentUser: user }}>
        {children}
      </FirebaseContext.Provider>
    );
  }

  private setCurrentUser = (user: firebase.User | null) => {
    this.setState({ user: user });
  }

}
export default FirebaseContextProvider;
