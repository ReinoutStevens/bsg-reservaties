import React from 'react';
import Firebase from './Firebase';
import FirebaseContext from './FirebaseContext';

export interface WithFirebase {
  firebase: Firebase;
}
function withFirebase<T extends WithFirebase = WithFirebase>(Component: React.ComponentType<T>):
  React.ComponentType<Omit<T, keyof WithFirebase>> {
  return class extends React.Component<Omit<T, keyof WithFirebase>> {
    render() {
      return (
        <FirebaseContext.Consumer>
          {({ firebase }) => {
            return <Component firebase={firebase} {...this.props as T} />
          }}
        </FirebaseContext.Consumer>
      );
    }
  }
}

export default withFirebase;
