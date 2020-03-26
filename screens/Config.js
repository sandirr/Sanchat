import Firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyA547PCJOjsca51EIAnc18fzPIOFzfx53Y',
  authDomain: 'sanchat-d07d5.firebaseapp.com',
  databaseURL: 'https://sanchat-d07d5.firebaseio.com',
  projectId: 'sanchat-d07d5',
  storageBucket: 'sanchat-d07d5.appspot.com',
  messagingSenderId: '903081227903',
  appId: '1:903081227903:web:ede3f6e17c1f9e9925314a',
};

const appConfig = Firebase.initializeApp(firebaseConfig);
export const db = appConfig.database();
export const auth = Firebase.auth();
