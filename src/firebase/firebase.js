import { initializeApp } from "firebase/app";

import { 
  getAuth 
} from "firebase/auth";

import { 
  getFirestore 
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAmkP7pjm89ZgSaAl0Ek040lUq4oG-o3V0",
  authDomain: "agency-crm-79a67.firebaseapp.com",
  projectId: "agency-crm-79a67",
  storageBucket: "agency-crm-79a67.firebasestorage.app",
  messagingSenderId: "779414888852",
  appId: "1:779414888852:web:e13ea5466308731a2a2f81"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);