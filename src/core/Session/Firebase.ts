import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAapSOfqtY7sbJ3K4M6ThArErrKQvqZFDE",
  authDomain: "bsg-reservaties.firebaseapp.com",
  databaseURL: "https://bsg-reservaties.firebaseio.com",
  projectId: "bsg-reservaties",
  storageBucket: "",
  messagingSenderId: "94895921934",
  appId: "1:94895921934:web:ae5be6e1f73f76f9"
};


interface NewUserInput {
  email: string;
  displayName: string;
}

interface UserData {
  isAdmin: boolean;
}

interface CompleteSignInInput {
  email: string;
}

interface SignInInput {
  email: string;
  password: string;
}

type AuthChangeListener = (user: firebase.User | null) => void;

firebase.initializeApp(firebaseConfig);

class Firebase {
  private auth: firebase.auth.Auth;
  private functions: firebase.functions.Functions;
  private user: firebase.User | null;
  readonly db: firebase.firestore.Firestore;

  private userData: UserData | null;

  private onAuthChangeListeners: AuthChangeListener[];

  constructor() {
    this.auth = firebase.auth();
    this.functions = firebase.functions();
    this.db = firebase.firestore();
    this.user = null;
    this.onAuthChangeListeners = [];
    this.userData = null;
    this.auth.onAuthStateChanged(async (user) => {
      this.user = user;
      if (this.user) {
        const userDoc = await this.db.collection('users').doc(this.user.uid).get();
        if (!userDoc.exists) {
          this.userData = null;
        } else {
          this.userData = userDoc.data() as UserData;
        }
      }
      this.onAuthChangeListeners.forEach((cb) => cb(user));
    })
  }

  currentUser(): firebase.User | null {
    return this.user;
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  isAdmin(): boolean {
    return !!(this.userData && this.userData.isAdmin);
  }

  addAuthChangeListener(cb: AuthChangeListener) {
    this.onAuthChangeListeners.push(cb);
  }

  removeAuthChangeListener(cb: AuthChangeListener) {
    this.onAuthChangeListeners = this.onAuthChangeListeners.filter((listener) => listener !== cb);
  }

  async createUser(input: NewUserInput) {
    const { displayName, email } = input;
    const createUserFn = this.functions.httpsCallable('/api/v1/createUser');
    await createUserFn({ email: email, displayName: displayName });
  }

  async signIn(input: SignInInput): Promise<void> {
    const { email, password } = input;
    await this.auth.signInWithEmailAndPassword(email, password);
    return;
  }

  signOut(): Promise<void> {
    return this.auth.signOut()
  }

  passwordReset(email: string): Promise<void> {
    return this.auth.sendPasswordResetEmail(email, {
      url: 'http://localhost:3000/signin',
      handleCodeInApp: false,
    });
  }

  async completeSignIn({ email }: CompleteSignInInput) {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.

      // The client SDK will parse the code from the link for you.
      await firebase.auth().signInWithEmailLink(email, window.location.href);
    } else {
      throw new Error('Unexpected window location');
    }
  }
}
export default Firebase;
