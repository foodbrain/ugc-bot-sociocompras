import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const API_KEY = process.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModels() {
  console.log('🔍 Probando diferentes modelos...\n');

  const modelsToTest = [
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-2.0-flash-exp',
  ];

  for (const modelName of modelsToTest) {
    try {
      console.log(`📝 Probando: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent('Say hello in one word');
      const response = await result.response;
      const text = response.text();

      console.log(`✅ ${modelName}: FUNCIONA`);
      console.log(`   Respuesta: "${text}"\n`);

      // Si este modelo funciona, usarlo
      return modelName;
    } catch (error) {
      console.log(`❌ ${modelName}: FALLÓ`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log('❌ Ningún modelo funcionó');
}

testModels()
  .then(workingModel => {
    if (workingModel) {
      console.log(`\n🎉 Modelo que funciona: ${workingModel}`);
      console.log(`\nActualiza geminiService.js para usar este modelo.`);
    }
  })
  .catch(error => {
    console.error('Error general:', error);
  });
