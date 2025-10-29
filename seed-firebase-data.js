import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

async function seedFirebaseData() {
  console.log('🌱 Seeding Firebase with initial data...\n');

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app, 'basededatos-contenidos');
    console.log('✅ Connected to Firebase database: basededatos-contenidos\n');

    // 1. Create sample idea
    console.log('📝 Creating sample idea...');
    const ideaData = {
      title: "Tutorial rápido de producto - Hook viral",
      description: "Video corto mostrando cómo usar el producto de forma inesperada que resuelve un problema común",
      hook: "Nadie me dijo que podía hacer ESTO con este producto...",
      type: null,
      viralPotential: "alto",
      ranking: 0,
      enabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const ideaRef = await addDoc(collection(db, 'ideas'), ideaData);
    console.log(`✅ Created idea with ID: ${ideaRef.id}\n`);

    // 2. Create sample script
    console.log('📝 Creating sample script...');
    const scriptData = {
      ideaId: ideaRef.id,
      ideaTitle: ideaData.title,
      concept: "Video UGC mostrando unboxing y primera reacción del producto",
      content: "A young person excitedly opens a package in natural lighting. Medium shot, handheld camera with slight shake. They pull out the product, genuine surprise on their face. Cut to close-up of the product in their hands, showcasing details. Ultra-realistic, authentic UGC style, vertical 9:16 format.",
      generatedWithAI: true,
      ranking: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const scriptRef = await addDoc(collection(db, 'scripts'), scriptData);
    console.log(`✅ Created script with ID: ${scriptRef.id}\n`);

    // 3. Create sample brand data
    console.log('📝 Creating sample brand data...');
    const brandData = {
      brand_name: "Demo Brand",
      brand_domain: "https://demobrand.com",
      category: "E-commerce / Retail",
      uvp: "Productos únicos con entrega rápida y excelente atención al cliente",
      audience: "Millennials y Gen Z interesados en productos innovadores y sostenibles",
      pain_points: "Dificultad para encontrar productos únicos, falta de confianza en compras online, tiempos de entrega largos",
      competitors: "Amazon, Mercado Libre",
      brand_voice: "Auténtico, cercano y entusiasta",
      marketing_goals: "Aumentar awareness y engagement en redes sociales, generar contenido viral UGC",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const brandRef = await addDoc(collection(db, 'brandData'), brandData);
    console.log(`✅ Created brand data with ID: ${brandRef.id}\n`);

    // 4. Create sample brand analysis
    console.log('📝 Creating sample brand analysis...');
    const analysisData = {
      valueAnalysis: "La propuesta de valor se centra en la combinación de productos únicos con servicio excepcional. El diferenciador clave está en la curación de productos innovadores y sostenibles, apelando a consumidores conscientes. La promesa de entrega rápida añade conveniencia, un factor crítico para las generaciones más jóvenes.",
      audienceInsights: "La audiencia objetivo (Millennials y Gen Z) valora la autenticidad, la sostenibilidad y las experiencias más que las posesiones. Son nativos digitales que confían en recomendaciones de peers y contenido UGC auténtico. Prefieren marcas con propósito y transparencia en sus operaciones.",
      painPointRecommendations: "Para abordar la falta de confianza, se recomienda mostrar testimonios reales y procesos transparentes. El contenido UGC que muestre unboxings, primeras impresiones y uso real del producto puede reducir la fricción de compra. Destacar casos de éxito con tiempos de entrega puede convertir un pain point en ventaja competitiva.",
      brandPositioning: "Posicionar la marca como 'el discovery platform para productos únicos y sostenibles con la conveniencia de entrega rápida'. Enfatizar la curación experta y el compromiso con marcas sostenibles. El tono auténtico y cercano debe reflejarse en todo el contenido, especialmente en UGC.",
      ugcOpportunities: [
        "Unboxing experiences destacando la calidad del packaging y primer impacto",
        "Before/After transformations usando los productos",
        "Day in the life integrando productos de forma natural",
        "Product comparison con alternativas mainstream",
        "Behind-the-scenes del proceso de curación y selección"
      ],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const analysisRef = await addDoc(collection(db, 'brandAnalysis'), analysisData);
    console.log(`✅ Created brand analysis with ID: ${analysisRef.id}\n`);

    // 5. Create sample generated media
    console.log('📝 Creating sample generated media...');
    const mediaData = {
      scriptId: scriptRef.id,
      shotIndex: 0,
      description: "Opening shot: Person holding product with excited expression",
      generatedWith: "Sora 2",
      prompt: "Young person in natural lighting, medium shot, holding product with genuine excitement, UGC style",
      createdAt: serverTimestamp()
    };

    const mediaRef = await addDoc(collection(db, 'generatedMedia'), mediaData);
    console.log(`✅ Created generated media with ID: ${mediaRef.id}\n`);

    console.log('🎉 SUCCESS! All collections have been created with sample data.\n');
    console.log('📊 Summary:');
    console.log('   ✅ ideas: 1 document');
    console.log('   ✅ scripts: 1 document');
    console.log('   ✅ brandData: 1 document');
    console.log('   ✅ brandAnalysis: 1 document');
    console.log('   ✅ generatedMedia: 1 document\n');

    console.log('🔗 View in Firebase Console:');
    console.log(`   https://console.firebase.google.com/u/1/project/${firebaseConfig.projectId}/firestore/databases/basededatos-contenidos/data\n`);

    console.log('💡 You can now refresh the Firebase Console to see all collections!\n');

  } catch (error) {
    console.error('❌ Seeding failed!');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code || 'unknown'}`);
    process.exit(1);
  }
}

seedFirebaseData();
