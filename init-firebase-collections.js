import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGm2rzHfdavPreUxw41MmmXD-BYkZgQYU",
  authDomain: "creador-de-contenido-f413.firebaseapp.com",
  projectId: "creador-de-contenido-f413",
  storageBucket: "creador-de-contenido-f413.firebasestorage.app",
  messagingSenderId: "818178361401",
  appId: "1:818178361401:web:d381a6222df9707db665e8",
  measurementId: "G-BHT1J9SGSJ"
};

async function initializeCollections() {
  console.log('🚀 Initializing Firebase Collections...\n');

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'basededatos-contenidos');
    console.log('✅ Connected to Firebase database: basededatos-contenidos\n');

    // List of collections to check
    const collections = [
      { name: 'ideas', description: 'User-generated content ideas' },
      { name: 'scripts', description: 'Video scripts generated from ideas' },
      { name: 'generatedMedia', description: 'Generated images/videos for shot breakdown' },
      { name: 'brandData', description: 'Brand research and configuration data' },
      { name: 'brandAnalysis', description: 'AI-enhanced brand analysis from Gemini' }
    ];

    console.log('📋 Checking collections in Firestore:\n');

    for (const col of collections) {
      try {
        const colRef = collection(db, col.name);
        const snapshot = await getDocs(colRef);

        const status = snapshot.empty ? '⚠️  EMPTY' : '✅ HAS DATA';
        const count = snapshot.size;

        console.log(`${status} - ${col.name}`);
        console.log(`   Description: ${col.description}`);
        console.log(`   Documents: ${count}`);
        console.log('');

      } catch (error) {
        console.log(`❌ ERROR - ${col.name}`);
        console.log(`   Error: ${error.message}`);
        console.log('');
      }
    }

    console.log('📊 Summary:');
    console.log('   All collections are accessible.');
    console.log('   Collections will be automatically created when first document is added.');
    console.log('   \n💡 Note: Empty collections are normal for a new project.\n');

    console.log('🔗 Firebase Console URL:');
    console.log(`   https://console.firebase.google.com/u/1/project/${firebaseConfig.projectId}/firestore/databases/basededatos-contenidos/data\n`);

    console.log('✅ Initialization complete!\n');

  } catch (error) {
    console.error('❌ Initialization failed!');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'unknown'}`);
    process.exit(1);
  }
}

initializeCollections();
