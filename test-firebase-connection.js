import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDGm2rzHfdavPreUxw41MmmXD-BYkZgQYU",
  authDomain: "creador-de-contenido-f413.firebaseapp.com",
  projectId: "creador-de-contenido-f413",
  storageBucket: "creador-de-contenido-f413.firebasestorage.app",
  messagingSenderId: "818178361401",
  appId: "1:818178361401:web:d381a6222df9707db665e8",
  measurementId: "G-BHT1J9SGSJ"
};

async function testFirebaseConnection() {
  console.log('🔍 Testing Firebase connection...\n');

  try {
    // Initialize Firebase
    console.log('📋 Step 1: Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
    console.log(`   Project ID: ${firebaseConfig.projectId}\n`);

    // Initialize Firestore with specific database
    console.log('📋 Step 2: Connecting to Firestore database "basededatos-contenidos"...');
    const db = getFirestore(app, 'basededatos-contenidos');
    console.log('✅ Firestore instance created for database: basededatos-contenidos\n');

    // Try to list collections (this will verify read access)
    console.log('📋 Step 3: Testing Firestore access...');
    console.log('   Attempting to read from "ideas" collection...');

    const ideasRef = collection(db, 'ideas');
    const ideasSnapshot = await getDocs(ideasRef);

    console.log(`✅ Successfully connected to Firestore!`);
    console.log(`   Found ${ideasSnapshot.size} document(s) in "ideas" collection\n`);

    // Try scripts collection
    console.log('   Attempting to read from "scripts" collection...');
    const scriptsRef = collection(db, 'scripts');
    const scriptsSnapshot = await getDocs(scriptsRef);

    console.log(`✅ Successfully accessed "scripts" collection`);
    console.log(`   Found ${scriptsSnapshot.size} document(s) in "scripts" collection\n`);

    console.log('🎉 FIREBASE CONNECTION TEST PASSED!');
    console.log('\n📊 Summary:');
    console.log(`   - Firebase initialized: ✅`);
    console.log(`   - Firestore connected: ✅`);
    console.log(`   - Database URL: https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);
    console.log(`   - Ideas count: ${ideasSnapshot.size}`);
    console.log(`   - Scripts count: ${scriptsSnapshot.size}`);

  } catch (error) {
    console.error('❌ FIREBASE CONNECTION TEST FAILED!');
    console.error('\n Error details:');
    console.error(`   Code: ${error.code}`);
    console.error(`   Message: ${error.message}`);

    if (error.code === 'permission-denied') {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check Firestore Security Rules in Firebase Console');
      console.error('   2. Ensure the database is created and accessible');
      console.error('   3. Verify authentication settings if required');
    }
  }
}

testFirebaseConnection();
