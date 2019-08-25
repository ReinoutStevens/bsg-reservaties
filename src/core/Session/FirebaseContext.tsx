import React from 'react';
import Firebase from './Firebase';

export interface FirebaseContextProps {
  firebase: Firebase | null;
}

const FirebaseContext = React.createContext<FirebaseContextProps>({ firebase: null });

export default FirebaseContext;
