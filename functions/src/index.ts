import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as generator from 'generate-password';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';

admin.initializeApp();
// const cors = require('cors')({ origin: true });
const app = express();
const main = express();

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


function ensureUserIsAuthorized(id: admin.auth.DecodedIdToken): Promise<void> {
  return new Promise((resolve, reject) => {
    const userData = admin.database().ref(`/users/${id}`);
    userData.on('value', (snapshot) => {
      if (!snapshot) {
        reject();
        return;
      }
      if (snapshot.val().admin) {
        resolve();
      } else {
        reject();
      }
    })
  })
}

app.get('/createUser', async (req, res) => {
  const user = (req as AuthRequest).user;
  try {
    await ensureUserIsAuthorized(user);
    const data = req.body;
    const { email, displayName } = data as { email: string, displayName: string };

    await admin.auth().createUser({
      email: email,
      password: generator.generate({
        length: 10,
        uppercase: false,
      }),
      displayName: displayName,
      disabled: false,
    })
    res.status(200).json('ok');
  } catch (e) {
    res.status(500).end();
  }
});

main.use('/api/v1', app);

export const webApi = functions.https.onRequest(main);
