import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDXtPv5g2ljj3Oggak3wnQDjjenD5ksYPA",
  authDomain: "jix-accessories.firebaseapp.com",
  projectId: "jix-accessories",
  storageBucket: "jix-accessories.firebasestorage.app",
  messagingSenderId: "91175439898",
  appId: "1:91175439898:web:355a4b2dfa200fa7620ba3"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export default app