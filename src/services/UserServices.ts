import firebase from 'firebase/app';
import Firebase from '../core/Session/Firebase';


export interface User {
  uid: string;
  email: string;
  displayName: string;
}

class UserServices {
  private db: firebase.firestore.Firestore;

  constructor(firebase: Firebase) {
    this.db = firebase.db;
  }

  async getAllUsers() {
    const usersSnapshot = await this.db.collection('users').get();
    const users: User[] = []
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      users.push({
        uid: doc.id,
        email: userData.email,
        displayName: userData.displayName,
      });
    })
    return users;
  }

}

export default UserServices;
