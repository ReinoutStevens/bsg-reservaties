import React from 'react';
import Firebase from './Firebase';
import FirebaseContext from './FirebaseContext';

export interface WithFirebase {
  firebase: Firebase;
  currentUser: firebase.User | null;
}
function withFirebase<T extends WithFirebase = WithFirebase>(Component: React.ComponentType<T>):
  React.ComponentType<Omit<T, keyof WithFirebase>> {
  return class extends React.Component<Omit<T, keyof WithFirebase>> {
    render() {
      return (
        <FirebaseContext.Consumer>
          {({ firebase, currentUser }) => {
            return (
              <Component
                firebase={firebase}
                currentUser={currentUser}
                {...this.props as T}
              />
            );
          }}
        </FirebaseContext.Consumer>
      );
    }
  }
}

export default withFirebase;
