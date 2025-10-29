import { firebaseService } from './firebaseService';

// Storage service now uses ONLY Firebase - no localStorage fallback
// Firebase must be properly configured for the app to work

export const storageService = {
  /**
   * Check if Firebase is configured and ready
   */
  isFirebaseEnabled() {
    return firebaseService.isConfigured();
  },

  /**
   * BRANDS - Multiple brands support
   */
  async createBrand(brandData) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const brand = await firebaseService.createBrand(brandData);
      console.log('✅ Brand created in Firebase');
      return brand;
    } catch (error) {
      console.error('❌ Error creating brand in Firebase:', error);
      throw error;
    }
  },

  async getAllBrands() {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const brands = await firebaseService.getAllBrands();
      return brands;
    } catch (error) {
      console.error('❌ Error getting brands from Firebase:', error);
      throw error;
    }
  },

  async getBrand(brandId) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const brand = await firebaseService.getBrand(brandId);
      return brand;
    } catch (error) {
      console.error('❌ Error getting brand from Firebase:', error);
      throw error;
    }
  },

  async updateBrand(brandId, updates) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.updateBrand(brandId, updates);
      console.log(`✅ Brand ${brandId} updated in Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Error updating brand in Firebase:', error);
      throw error;
    }
  },

  async deleteBrand(brandId) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.deleteBrand(brandId);
      console.log(`✅ Brand ${brandId} deleted from Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting brand from Firebase:', error);
      throw error;
    }
  },

  /**
   * Brand Analysis (linked to brandId)
   */
  async saveBrandAnalysis(brandId, analysisData) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.saveBrandAnalysis(brandId, analysisData);
      console.log('✅ Brand analysis saved to Firebase');
      return true;
    } catch (error) {
      console.error('❌ Error saving brand analysis to Firebase:', error);
      throw error;
    }
  },

  async getBrandAnalysis(brandId) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const analysis = await firebaseService.getBrandAnalysis(brandId);
      return analysis;
    } catch (error) {
      console.error('❌ Error getting brand analysis from Firebase:', error);
      throw error;
    }
  },

  /**
   * IDEAS - Uses Firebase ONLY
   */
  async saveIdeas(ideas) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      // If it's an array, save multiple ideas
      if (Array.isArray(ideas)) {
        await firebaseService.addMultipleIdeas(ideas);
        console.log(`✅ ${ideas.length} ideas saved to Firebase`);
      } else {
        await firebaseService.addIdea(ideas);
        console.log('✅ Idea saved to Firebase');
      }
      return true;
    } catch (error) {
      console.error('❌ Error saving ideas to Firebase:', error);
      throw error;
    }
  },

  async getIdeas(brandId = null) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const ideas = await firebaseService.getIdeas(brandId);
      return ideas || [];
    } catch (error) {
      console.error('❌ Error getting ideas from Firebase:', error);
      throw error;
    }
  },

  async updateIdea(ideaId, updates) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.updateIdea(ideaId, updates);
      console.log(`✅ Idea ${ideaId} updated in Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Error updating idea in Firebase:', error);
      throw error;
    }
  },

  async deleteIdea(ideaId) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.deleteIdea(ideaId);
      console.log(`✅ Idea ${ideaId} deleted from Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting idea from Firebase:', error);
      throw error;
    }
  },

  /**
   * SCRIPTS - Uses Firebase ONLY
   */
  async saveScript(script) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.addScript(script);
      console.log('✅ Script saved to Firebase');
      return true;
    } catch (error) {
      console.error('❌ Error saving script to Firebase:', error);
      throw error;
    }
  },

  async getScripts(brandId = null) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const scripts = await firebaseService.getScripts(brandId);
      return scripts || [];
    } catch (error) {
      console.error('❌ Error getting scripts from Firebase:', error);
      throw error;
    }
  },

  async getScript(scriptId) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const script = await firebaseService.getScript(scriptId);
      return script;
    } catch (error) {
      console.error('❌ Error getting script from Firebase:', error);
      throw error;
    }
  },

  async updateScript(scriptId, updates) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.updateScript(scriptId, updates);
      console.log(`✅ Script ${scriptId} updated in Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Error updating script in Firebase:', error);
      throw error;
    }
  },

  async deleteScript(scriptId) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.deleteScript(scriptId);
      console.log(`✅ Script ${scriptId} deleted from Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting script from Firebase:', error);
      throw error;
    }
  },

  /**
   * GENERATED MEDIA - Uses Firebase ONLY
   */
  async saveGeneratedMedia(scriptId, shotIndex, mediaData) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      await firebaseService.saveGeneratedMedia(scriptId, shotIndex, mediaData);
      console.log(`✅ Generated media saved to Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Error saving generated media to Firebase:', error);
      throw error;
    }
  },

  async getGeneratedMediaForScript(scriptId) {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      const media = await firebaseService.getGeneratedMediaForScript(scriptId);
      return media || [];
    } catch (error) {
      console.error('❌ Error getting generated media from Firebase:', error);
      throw error;
    }
  },

  /**
   * Clear all data (for testing purposes)
   */
  async clearAllData() {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured. Please check your environment variables.');
    }

    try {
      // Get and delete all data
      const ideas = await this.getIdeas();
      const scripts = await this.getScripts();

      for (const idea of ideas) {
        await this.deleteIdea(idea.id);
      }

      for (const script of scripts) {
        await this.deleteScript(script.id);
      }

      await firebaseService.deleteBrandData();
      await firebaseService.deleteBrandAnalysis();

      console.log('✅ All data cleared from Firebase');
      return true;
    } catch (error) {
      console.error('❌ Error clearing data from Firebase:', error);
      throw error;
    }
  }
};

export default storageService;
