import firebase from 'firebase/app';
import 'firebase/auth';

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
}

interface CompleteSignInInput {
  email: string;
}

interface SignInInput {
  email: string;
  password: string;
}

class Firebase {
  private auth: firebase.auth.Auth;
  private user: firebase.auth.UserCredential | null;

  constructor() {
    firebase.initializeApp(firebaseConfig);
    this.auth = firebase.auth();
    this.user = null;
  }

  async createUser(input: NewUserInput) {
    await this.auth.sendSignInLinkToEmail(input.email, {
      url: 'http://localhost:3000/signup',
      handleCodeInApp: true,
    });
  }

  async signIn(input: SignInInput): Promise<void> {
    const { email, password } = input;
    this.user = await this.auth.signInWithEmailAndPassword(email, password);
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
