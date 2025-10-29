import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// Initialize Firebase
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  // Connect to specific Firestore database: basededatos-contenidos
  db = getFirestore(app, 'basededatos-contenidos');
  console.log('✅ Firebase initialized successfully');
  console.log('✅ Connected to Firestore database: basededatos-contenidos');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.log('⚠️ Fallback to localStorage mode');
}

export const firebaseService = {
  /**
   * Check if Firebase is properly configured
   */
  isConfigured() {
    return firebaseConfig.apiKey && firebaseConfig.apiKey !== "TU_API_KEY" && db !== undefined;
  },

  /**
   * IDEAS CRUD Operations
   */
  async addIdea(ideaData) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured. Please update firebaseConfig.');
    }

    try {
      const docRef = await addDoc(collection(db, 'ideas'), {
        ...ideaData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...ideaData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error adding idea to Firebase:', error);
      throw error;
    }
  },

  async addMultipleIdeas(ideas) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const addedIdeas = [];

      for (const idea of ideas) {
        const docRef = await addDoc(collection(db, 'ideas'), {
          ...idea,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        addedIdeas.push({
          id: docRef.id,
          ...idea,
          timestamp: new Date().toISOString()
        });
      }

      return addedIdeas;
    } catch (error) {
      console.error('Error adding multiple ideas:', error);
      throw error;
    }
  },

  async getIdeas(brandId = null) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const ideas = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter by brandId if provided
        if (!brandId || data.brandId === brandId) {
          ideas.push({
            id: doc.id,
            ...data,
            timestamp: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
          });
        }
      });

      return ideas;
    } catch (error) {
      console.error('Error getting ideas:', error);
      throw error;
    }
  },

  async updateIdea(ideaId, updates) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const ideaRef = doc(db, 'ideas', ideaId);
      await updateDoc(ideaRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { id: ideaId, ...updates };
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  },

  async updateIdeaRanking(ideaId, ranking) {
    return this.updateIdea(ideaId, { ranking });
  },

  async deleteIdea(ideaId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      await deleteDoc(doc(db, 'ideas', ideaId));
      return true;
    } catch (error) {
      console.error('Error deleting idea:', error);
      throw error;
    }
  },

  /**
   * SCRIPTS CRUD Operations
   */
  async addScript(scriptData) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const docRef = await addDoc(collection(db, 'scripts'), {
        ...scriptData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...scriptData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error adding script to Firebase:', error);
      throw error;
    }
  },

  async getScripts(brandId = null) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const q = query(collection(db, 'scripts'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const scripts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Filter by brandId if provided
        if (!brandId || data.brandId === brandId) {
          scripts.push({
            id: doc.id,
            ...data,
            timestamp: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
          });
        }
      });

      return scripts;
    } catch (error) {
      console.error('Error getting scripts:', error);
      throw error;
    }
  },

  async getScript(scriptId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const docRef = doc(db, 'scripts', scriptId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting script:', error);
      throw error;
    }
  },

  async updateScript(scriptId, updates) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const scriptRef = doc(db, 'scripts', scriptId);
      await updateDoc(scriptRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { id: scriptId, ...updates };
    } catch (error) {
      console.error('Error updating script:', error);
      throw error;
    }
  },

  async deleteScript(scriptId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      await deleteDoc(doc(db, 'scripts', scriptId));
      return true;
    } catch (error) {
      console.error('Error deleting script:', error);
      throw error;
    }
  },

  /**
   * GENERATED MEDIA Operations (for Shot Breakdown)
   */
  async saveGeneratedMedia(scriptId, shotIndex, mediaData) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const docRef = await addDoc(collection(db, 'generatedMedia'), {
        scriptId,
        shotIndex,
        ...mediaData,
        createdAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        scriptId,
        shotIndex,
        ...mediaData
      };
    } catch (error) {
      console.error('Error saving generated media:', error);
      throw error;
    }
  },

  async getGeneratedMediaForScript(scriptId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const q = query(
        collection(db, 'generatedMedia'),
        orderBy('shotIndex', 'asc')
      );
      const querySnapshot = await getDocs(q);

      const media = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.scriptId === scriptId) {
          media.push({
            id: doc.id,
            ...data
          });
        }
      });

      return media;
    } catch (error) {
      console.error('Error getting generated media:', error);
      throw error;
    }
  },

  /**
   * BRANDS Operations - Multiple brands support
   */
  async createBrand(brandData) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const docRef = await addDoc(collection(db, 'brands'), {
        ...brandData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...brandData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  },

  async getAllBrands() {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const q = query(collection(db, 'brands'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const brands = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        brands.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : new Date().toISOString()
        });
      });

      return brands;
    } catch (error) {
      console.error('Error getting brands:', error);
      throw error;
    }
  },

  async getBrand(brandId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const docRef = doc(db, 'brands', brandId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting brand:', error);
      throw error;
    }
  },

  async updateBrand(brandId, updates) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const brandRef = doc(db, 'brands', brandId);
      await updateDoc(brandRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { id: brandId, ...updates };
    } catch (error) {
      console.error('Error updating brand:', error);
      throw error;
    }
  },

  async deleteBrand(brandId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      await deleteDoc(doc(db, 'brands', brandId));
      return true;
    } catch (error) {
      console.error('Error deleting brand:', error);
      throw error;
    }
  },

  /**
   * BRAND ANALYSIS Operations (Enhanced Research from Gemini AI)
   * Now linked to brandId
   */
  async saveBrandAnalysis(brandId, analysisData) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      // Save analysis linked to brand
      const docRef = await addDoc(collection(db, 'brandAnalysis'), {
        brandId,
        ...analysisData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        brandId,
        ...analysisData
      };
    } catch (error) {
      console.error('Error saving brand analysis:', error);
      throw error;
    }
  },

  async getBrandAnalysis(brandId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const q = query(
        collection(db, 'brandAnalysis'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      // Find analysis for this brand
      let analysis = null;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.brandId === brandId && !analysis) {
          analysis = {
            id: doc.id,
            ...data
          };
        }
      });

      return analysis;
    } catch (error) {
      console.error('Error getting brand analysis:', error);
      throw error;
    }
  },

  async deleteBrandAnalysis(brandId) {
    if (!this.isConfigured()) {
      throw new Error('Firebase not configured.');
    }

    try {
      const analysis = await this.getBrandAnalysis(brandId);

      if (analysis) {
        await deleteDoc(doc(db, 'brandAnalysis', analysis.id));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting brand analysis:', error);
      throw error;
    }
  }
};

export default firebaseService;
