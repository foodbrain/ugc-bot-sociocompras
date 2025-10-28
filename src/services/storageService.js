import { firebaseService } from './firebaseService';

const STORAGE_KEYS = {
  BRAND_DATA: 'ugc_bot_brand_data',
  IDEAS: 'ugc_bot_ideas',
  SCRIPTS: 'ugc_bot_scripts',
  ENHANCED_RESEARCH: 'ugc_bot_enhanced_research',
  USE_FIREBASE: 'ugc_bot_use_firebase'
};

// Check if we should use Firebase
const shouldUseFirebase = () => {
  try {
    const useFirebase = localStorage.getItem(STORAGE_KEYS.USE_FIREBASE);
    return useFirebase === 'true' && firebaseService.isConfigured();
  } catch {
    return false;
  }
};

export const storageService = {
  /**
   * Enable/Disable Firebase
   */
  setFirebaseEnabled(enabled) {
    try {
      localStorage.setItem(STORAGE_KEYS.USE_FIREBASE, enabled.toString());
      return true;
    } catch (error) {
      console.error('Error setting Firebase preference:', error);
      return false;
    }
  },

  isFirebaseEnabled() {
    return shouldUseFirebase();
  },

  /**
   * Brand Data - Always uses localStorage
   */
  saveBrandData(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.BRAND_DATA, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving brand data:', error);
      return false;
    }
  },

  getBrandData() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRAND_DATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting brand data:', error);
      return null;
    }
  },

  /**
   * Enhanced Research - Always uses localStorage
   */
  saveEnhancedResearch(data) {
    try {
      localStorage.setItem(STORAGE_KEYS.ENHANCED_RESEARCH, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving enhanced research:', error);
      return false;
    }
  },

  getEnhancedResearch() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ENHANCED_RESEARCH);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting enhanced research:', error);
      return null;
    }
  },

  /**
   * IDEAS - Uses Firebase or localStorage
   */
  async getIdeas() {
    if (shouldUseFirebase()) {
      try {
        return await firebaseService.getIdeas();
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.getIdeasLocal();
      }
    }
    return this.getIdeasLocal();
  },

  getIdeasLocal() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.IDEAS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting ideas from localStorage:', error);
      return [];
    }
  },

  async saveIdeas(ideas) {
    if (shouldUseFirebase()) {
      // Con Firebase, las ideas ya están sincronizadas individualmente
      // No necesitamos hacer nada aquí
      return true;
    }
    return this.saveIdeasLocal(ideas);
  },

  saveIdeasLocal(ideas) {
    try {
      localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
      return true;
    } catch (error) {
      console.error('Error saving ideas to localStorage:', error);
      return false;
    }
  },

  async addIdea(idea) {
    if (shouldUseFirebase()) {
      try {
        return await firebaseService.addIdea({
          ...idea,
          ranking: idea.ranking || 0
        });
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.addIdeaLocal(idea);
      }
    }
    return this.addIdeaLocal(idea);
  },

  addIdeaLocal(idea) {
    try {
      const ideas = this.getIdeasLocal();
      const ideaWithId = {
        ...idea,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ranking: idea.ranking || 0
      };
      ideas.push(ideaWithId);
      this.saveIdeasLocal(ideas);
      return ideaWithId;
    } catch (error) {
      console.error('Error adding idea to localStorage:', error);
      return null;
    }
  },

  async addMultipleIdeas(newIdeas) {
    if (shouldUseFirebase()) {
      try {
        return await firebaseService.addMultipleIdeas(newIdeas);
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.addMultipleIdeasLocal(newIdeas);
      }
    }
    return this.addMultipleIdeasLocal(newIdeas);
  },

  addMultipleIdeasLocal(newIdeas) {
    try {
      const existingIdeas = this.getIdeasLocal();
      const ideasWithMetadata = newIdeas.map(idea => ({
        ...idea,
        id: idea.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ranking: idea.ranking || 0,
        enabled: idea.enabled !== undefined ? idea.enabled : true
      }));
      const allIdeas = [...existingIdeas, ...ideasWithMetadata];
      this.saveIdeasLocal(allIdeas);
      return ideasWithMetadata;
    } catch (error) {
      console.error('Error adding multiple ideas to localStorage:', error);
      return [];
    }
  },

  async deleteIdea(ideaId) {
    if (shouldUseFirebase()) {
      try {
        await firebaseService.deleteIdea(ideaId);
        return true;
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.deleteIdeaLocal(ideaId);
      }
    }
    return this.deleteIdeaLocal(ideaId);
  },

  deleteIdeaLocal(ideaId) {
    try {
      const ideas = this.getIdeasLocal().filter(idea => idea.id !== ideaId);
      this.saveIdeasLocal(ideas);
      return true;
    } catch (error) {
      console.error('Error deleting idea from localStorage:', error);
      return false;
    }
  },

  async updateIdeaRanking(ideaId, ranking) {
    if (shouldUseFirebase()) {
      try {
        await firebaseService.updateIdeaRanking(ideaId, ranking);
        return true;
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.updateIdeaRankingLocal(ideaId, ranking);
      }
    }
    return this.updateIdeaRankingLocal(ideaId, ranking);
  },

  updateIdeaRankingLocal(ideaId, ranking) {
    try {
      const ideas = this.getIdeasLocal();
      const updatedIdeas = ideas.map(idea =>
        idea.id === ideaId ? { ...idea, ranking } : idea
      );
      this.saveIdeasLocal(updatedIdeas);
      return true;
    } catch (error) {
      console.error('Error updating idea ranking in localStorage:', error);
      return false;
    }
  },

  /**
   * SCRIPTS - Uses Firebase or localStorage
   */
  async getScripts() {
    if (shouldUseFirebase()) {
      try {
        return await firebaseService.getScripts();
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.getScriptsLocal();
      }
    }
    return this.getScriptsLocal();
  },

  getScriptsLocal() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCRIPTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting scripts from localStorage:', error);
      return [];
    }
  },

  async saveScripts(scripts) {
    if (shouldUseFirebase()) {
      // Con Firebase, los scripts ya están sincronizados
      return true;
    }
    return this.saveScriptsLocal(scripts);
  },

  saveScriptsLocal(scripts) {
    try {
      localStorage.setItem(STORAGE_KEYS.SCRIPTS, JSON.stringify(scripts));
      return true;
    } catch (error) {
      console.error('Error saving scripts to localStorage:', error);
      return false;
    }
  },

  async addScript(script) {
    if (shouldUseFirebase()) {
      try {
        return await firebaseService.addScript({
          ...script,
          ranking: script.ranking || 0
        });
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.addScriptLocal(script);
      }
    }
    return this.addScriptLocal(script);
  },

  addScriptLocal(script) {
    try {
      const scripts = this.getScriptsLocal();
      const scriptWithId = {
        ...script,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ranking: script.ranking || 0
      };
      scripts.push(scriptWithId);
      this.saveScriptsLocal(scripts);
      return scriptWithId;
    } catch (error) {
      console.error('Error adding script to localStorage:', error);
      return null;
    }
  },

  async addMultipleScripts(newScripts) {
    if (shouldUseFirebase()) {
      try {
        const addedScripts = [];
        for (const script of newScripts) {
          const added = await firebaseService.addScript(script);
          addedScripts.push(added);
        }
        return addedScripts;
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.addMultipleScriptsLocal(newScripts);
      }
    }
    return this.addMultipleScriptsLocal(newScripts);
  },

  addMultipleScriptsLocal(newScripts) {
    try {
      const existingScripts = this.getScriptsLocal();
      const scriptsWithMetadata = newScripts.map(script => ({
        ...script,
        id: script.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ranking: script.ranking || 0
      }));
      const allScripts = [...existingScripts, ...scriptsWithMetadata];
      this.saveScriptsLocal(allScripts);
      return scriptsWithMetadata;
    } catch (error) {
      console.error('Error adding multiple scripts to localStorage:', error);
      return [];
    }
  },

  async deleteScript(scriptId) {
    if (shouldUseFirebase()) {
      try {
        await firebaseService.deleteScript(scriptId);
        return true;
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.deleteScriptLocal(scriptId);
      }
    }
    return this.deleteScriptLocal(scriptId);
  },

  deleteScriptLocal(scriptId) {
    try {
      const scripts = this.getScriptsLocal().filter(script => script.id !== scriptId);
      this.saveScriptsLocal(scripts);
      return true;
    } catch (error) {
      console.error('Error deleting script from localStorage:', error);
      return false;
    }
  },

  async updateScriptRanking(scriptId, ranking) {
    if (shouldUseFirebase()) {
      try {
        await firebaseService.updateScript(scriptId, { ranking });
        return true;
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error);
        return this.updateScriptRankingLocal(scriptId, ranking);
      }
    }
    return this.updateScriptRankingLocal(scriptId, ranking);
  },

  updateScriptRankingLocal(scriptId, ranking) {
    try {
      const scripts = this.getScriptsLocal();
      const updatedScripts = scripts.map(script =>
        script.id === scriptId ? { ...script, ranking } : script
      );
      this.saveScriptsLocal(scripts);
      return true;
    } catch (error) {
      console.error('Error updating script ranking in localStorage:', error);
      return false;
    }
  },

  /**
   * Clear all data
   */
  clearAllData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },

  /**
   * Migration: Move data from localStorage to Firebase
   */
  async migrateToFirebase() {
    if (!firebaseService.isConfigured()) {
      throw new Error('Firebase not configured');
    }

    try {
      console.log('🔄 Starting migration to Firebase...');

      // Migrate Ideas
      const localIdeas = this.getIdeasLocal();
      if (localIdeas.length > 0) {
        console.log(`📝 Migrating ${localIdeas.length} ideas...`);
        await firebaseService.addMultipleIdeas(localIdeas);
      }

      // Migrate Scripts
      const localScripts = this.getScriptsLocal();
      if (localScripts.length > 0) {
        console.log(`📜 Migrating ${localScripts.length} scripts...`);
        for (const script of localScripts) {
          await firebaseService.addScript(script);
        }
      }

      // Enable Firebase
      this.setFirebaseEnabled(true);

      console.log('✅ Migration completed successfully!');
      return {
        success: true,
        migratedIdeas: localIdeas.length,
        migratedScripts: localScripts.length
      };
    } catch (error) {
      console.error('❌ Migration error:', error);
      throw error;
    }
  }
};
