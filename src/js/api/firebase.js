import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDbtSp2aC81j76BHf3Kg8U14NoDLrmQqts",
    authDomain: "qcodeai-c61dc.firebaseapp.com",
    databaseURL: "https://qcodeai-c61dc-default-rtdb.firebaseio.com",
    projectId: "qcodeai-c61dc",
    storageBucket: "qcodeai-c61dc.firebasestorage.app",
    messagingSenderId: "740190474262",
    appId: "1:740190474262:web:b27a450eea9ba241a02537",
    measurementId: "G-Y1FTB8HNKL"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export {app, db,auth};