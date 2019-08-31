import React from 'react';
import Firebase from './Firebase';

export interface FirebaseContextProps {
  firebase: Firebase | null;
  currentUser: firebase.User | null;
}

const FirebaseContext = React.createContext<FirebaseContextProps>({
  firebase: null,
  currentUser: null,
});

export default FirebaseContext;
