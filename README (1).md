# Authentication System — Firebase Integration

This folder contains the **real, production-ready** auth logic to pair with
the `auth-system-demo.jsx` UI component. The demo component uses a mock
in-memory backend so it works standalone in a portfolio preview with no setup;
these files replace that mock with actual Firebase Authentication.

## Files

| File | Purpose |
|---|---|
| `firebaseConfig.js` | Initializes Firebase, exports `auth` + Google/Apple providers |
| `AuthContext.jsx` | React Context exposing `useAuth()` — sign in, sign up, OAuth, reset, sign out |
| `ProtectedRoute.jsx` | Route guard for react-router-dom v6 |
| `.env.example` | Template for your Firebase keys |

## Setup steps

1. **Create a Firebase project** at console.firebase.google.com.
2. **Register a Web app** under Project settings → General → Your apps, and
   copy the config values into a `.env` file (use `.env.example` as the template).
3. **Enable sign-in providers** under Authentication → Sign-in method:
   Email/Password, Google, and Apple.
4. **Apple Sign-In** additionally requires an Apple Developer account to
   create a Services ID and a Sign in with Apple key — Firebase's Apple
   provider setup screen links directly to the right Apple Developer pages.
5. **Install the SDK**: `npm install firebase`
6. **Wrap your app**:

```jsx
// main.jsx
import { AuthProvider } from './AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

7. **Use it anywhere**:

```jsx
import { useAuth } from './AuthContext';

function LoginPage() {
  const { signIn, signInWithGoogle, signInWithApple } = useAuth();
  // call these from your form handlers / button onClick —
  // they map directly to the handlers already built in auth-system-demo.jsx
}
```

## Connecting it to the demo UI

In `auth-system-demo.jsx`, replace the mock functions (`handleSignIn`,
`handleSignUp`, `handleOAuth`, `handleReset`) with calls to `useAuth()`:

```jsx
const { signIn, signUp, signInWithGoogle, signInWithApple, resetPassword } = useAuth();

// inside handleSignIn:
await signIn(form.email, form.password, rememberMe);

// inside handleOAuth('google'):
await signInWithGoogle();
```

Wrap each call in the existing try/catch + loading state pattern already in
the component — only the data source changes, the UI and error handling stay
the same.

## Security notes

- Never expose your Firebase **service account** keys client-side — only the
  web config values above, which are safe to ship in a frontend bundle.
- The password-reset flow intentionally shows the same success message
  whether or not the email exists, to avoid leaking which addresses are
  registered.
- Set Firestore/Realtime Database security rules separately if you store any
  user data beyond what Firebase Auth manages — Auth alone doesn't protect
  your database.
