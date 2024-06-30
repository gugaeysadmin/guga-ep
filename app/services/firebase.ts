import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { CACHE_SIZE_UNLIMITED, getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

import { firebaseConfig  } from '../config';


const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app,{
    //cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    localCache: persistentLocalCache({tabManager: persistentMultipleTabManager(), cacheSizeBytes: CACHE_SIZE_UNLIMITED}),
})

//export const db = getFirestore(app);

