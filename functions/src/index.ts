import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as generator from 'generate-password';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

admin.initializeApp();
const app = express();

export interface AuthRequest extends express.Request {
  user: admin.auth.DecodedIdToken;
}

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const validateFirebaseIdToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
    !(req.cookies && req.cookies.__session)) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if (req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    console.log('ID Token correctly decoded', decodedIdToken);
    (req as AuthRequest).user = decodedIdToken;
    next();
    return;
  } catch (error) {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};

app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(validateFirebaseIdToken);


async function ensureUserIsAuthorized(id: admin.auth.DecodedIdToken): Promise<void> {
  const userDoc = admin.firestore().collection(`users`).doc(id.uid);
  const userSnapshot = await userDoc.get();
  if (!userSnapshot.exists) {
    throw new Error('No user data found');
  }
  const user = userSnapshot.data();
  if (!user || !user.isAdmin) {
    throw new Error('Unauthorized');
  };
}

app.post('/createUser', async (req, res) => {
  const user = (req as AuthRequest).user;
  try {
    await ensureUserIsAuthorized(user);
    const { data } = req.body;
    const { email, displayName } = data as { email: string, displayName: string };
    if (!email || !displayName) {
      throw new Error('missing data');
    }
    const createdUser = await admin.auth().createUser({
      email: email,
      password: generator.generate({
        length: 10,
        uppercase: false,
      }),
      displayName: displayName,
      disabled: false,
    });
    await admin.firestore().collection('users').doc(user.uid).set({
      isAdmin: false,
      displayName: createdUser.displayName,
      email: createdUser.email,
    })
    res.status(200).json({ data: 'ok' });
  } catch (e) {
    (console).error(e);
    res.status(500).end();
  }
});


export const webApi = functions.https.onRequest(app);
