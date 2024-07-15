// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAXI0JxY1vkpJ1ZJJsyw2h5xHycbolEx9U',
  authDomain: 'xv2024-2a994.firebaseapp.com',
  projectId: 'xv2024-2a994',
  storageBucket: 'xv2024-2a994.appspot.com',
  messagingSenderId: '9243515483',
  appId: '1:9243515483:web:8503586c8e23b9a41bbd7e',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
