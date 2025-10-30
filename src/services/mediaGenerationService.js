// Service for media generation integrations
// Supports multiple providers: Vertex AI Imagen 3, DALL-E 3, Stability AI
import { geminiService } from './geminiService';

// Configuración de API - agregar a .env
const IMAGE_API_PROVIDER = import.meta.env.VITE_IMAGE_API_PROVIDER || 'openai'; // 'vertex-ai', 'openai', 'stability'
const VERTEX_AI_PROJECT_ID = import.meta.env.VITE_VERTEX_AI_PROJECT_ID;
const VERTEX_AI_LOCATION = import.meta.env.VITE_VERTEX_AI_LOCATION || 'us-central1';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;

export const mediaGenerationService = {
  /**
   * Generate AI Influencer visual using configured image provider
   * @param {string} influencerDescription - Detailed description of the AI influencer
   * @param {Object} brandResearch - Brand research data for context (optional)
   * @returns {Promise<Object>} - Generated image data
   */
  async generateInfluencerVisual(influencerDescription, brandResearch = null) {
    try {
      console.log(`🖼️ Generating influencer visual with ${IMAGE_API_PROVIDER}...`);
      console.log('Description:', influencerDescription);
      if (brandResearch) {
        console.log('Brand Context:', {
          location: brandResearch.target_location,
          demographics: brandResearch.target_demographics,
          language: brandResearch.language
        });
      }

      // Paso 1: Usar Gemini para optimizar el prompt con contexto de marca
      const optimizedPrompt = await this.optimizeImagePromptWithGemini(influencerDescription, brandResearch);
      console.log('✨ Optimized prompt:', optimizedPrompt);

      // Paso 2: Generar imagen según el provider configurado
      let imageResult;

      switch (IMAGE_API_PROVIDER) {
        case 'vertex-ai':
          imageResult = await this.generateWithVertexAI(optimizedPrompt);
          break;

        case 'openai':
          imageResult = await this.generateWithOpenAI(optimizedPrompt);
          break;

        case 'stability':
          imageResult = await this.generateWithStability(optimizedPrompt);
          break;

        default:
          throw new Error(`Provider no configurado: ${IMAGE_API_PROVIDER}. Configure VITE_IMAGE_API_PROVIDER en .env con: 'openai', 'vertex-ai', o 'stability'`);
      }

      return {
        success: true,
        imageUrl: imageResult.url,
        prompt: optimizedPrompt,
        originalDescription: influencerDescription,
        service: IMAGE_API_PROVIDER,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating influencer visual:', error);
      throw new Error(`Failed to generate influencer visual with ${IMAGE_API_PROVIDER}`);
    }
  },

  /**
   * Usar Gemini para optimizar el prompt de imagen con contexto de Brand Research
   * @param {string} description - Character description from script
   * @param {Object} brandResearch - Brand research data with demographics, location, language, etc.
   */
  async optimizeImagePromptWithGemini(description, brandResearch = null) {
    try {
      // Build brand context from Brand Research
      let brandContext = '';
      if (brandResearch) {
        const location = brandResearch.target_location || 'Latin America';
        const demographics = brandResearch.target_demographics || 'General audience';
        const language = brandResearch.language || 'Spanish';
        const category = brandResearch.category || 'e-commerce';

        brandContext = `
Brand Context:
- Target Location: ${location}
- Target Demographics: ${demographics}
- Language: ${language}
- Category: ${category}

Use this context to inform the influencer's appearance, style, and cultural background.
The influencer should authentically represent the target demographic and location.
`;
      }

      const optimizationPrompt = `You are a prompt engineer.

${brandContext}

AI Influencer Description:
"${description}"

Use the AI influencer description to write a prompt for an AI text to image model. Optimize for photorealism & advertising use cases keeping a very authentic and natural touch (iPhone photo, UGC style).

The prompt must only describe the influencer. They must not be interacting with the product.

Use web search to get the most recent prompt recommendations for the latest models like Imagen4, GPT image-1 or Flux. Avoid prompt advice made for Stable Diffusion or Midjourney.

EXAMPLE OUTPUT FORMAT:
"A candid, authentic UGC-style photo of a 23-year-old woman of Brazilian and Japanese descent. Her long, iridescent silver-lavender hair is styled in soft, natural waves that catch the light. She has warm, almond-shaped eyes and a serene, confident expression. She is in a minimalist room with soft, diffused morning light filtering in from a nearby window. She is wearing a simple, structured white crop top and flowing silk cargo pants, accessorized with unique, sculptural silver jewelry. The image feels like a spontaneous, unfiltered moment captured on a high-end smartphone, with realistic skin texture and a natural, relaxed pose."

Only return your best prompt. Nothing else.`;

      // Llamar a Gemini para optimizar el prompt
      const optimized = await geminiService.generateContent(optimizationPrompt);
      return optimized.trim();
    } catch (error) {
      console.warn('Failed to optimize prompt with Gemini, using original:', error);
      return this.buildInfluencerImagePrompt(description);
    }
  },

  /**
   * Generar con Vertex AI Imagen 3
   */
  async generateWithVertexAI(prompt) {
    if (!VERTEX_AI_PROJECT_ID) {
      throw new Error('VITE_VERTEX_AI_PROJECT_ID not configured');
    }

    // TODO: Implementar llamada real a Vertex AI
    // Requiere autenticación con Google Cloud
    console.log('📡 Calling Vertex AI Imagen 3...');

    const endpoint = `https://${VERTEX_AI_LOCATION}-aiplatform.googleapis.com/v1/projects/${VERTEX_AI_PROJECT_ID}/locations/${VERTEX_AI_LOCATION}/publishers/google/models/imagen-3.0-generate-001:predict`;

    // Simular por ahora
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      url: `https://via.placeholder.com/1080x1920.png?text=Imagen+3+Generated`,
      provider: 'vertex-ai'
    };
  },

  /**
   * Generar con OpenAI DALL-E 3
   */
  async generateWithOpenAI(prompt) {
    if (!OPENAI_API_KEY) {
      throw new Error('VITE_OPENAI_API_KEY not configured');
    }

    console.log('📡 Calling DALL-E 3...');
    console.log('Prompt length:', prompt.length, 'characters');

    // DALL-E 3 tiene límite de 4000 caracteres
    const truncatedPrompt = prompt.length > 4000 ? prompt.substring(0, 4000) : prompt;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: truncatedPrompt,
        n: 1,
        size: '1024x1792', // Vertical format similar to 9:16
        quality: 'hd',
        style: 'natural' // Para look más realista
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('DALL-E 3 Error Response:', errorData);

      // Mensajes específicos según el tipo de error
      const errorMessage = errorData.error?.message || 'Unknown error';

      if (response.status === 429 || errorMessage.includes('rate limit')) {
        throw new Error('⚠️ Has alcanzado el límite de tasa de OpenAI. Espera unos minutos e intenta nuevamente.');
      }

      if (errorMessage.includes('billing') || errorMessage.includes('quota') || errorMessage.includes('insufficient')) {
        throw new Error('💳 Has alcanzado el límite de créditos de OpenAI. Recarga tus créditos en: https://platform.openai.com/account/billing');
      }

      if (response.status === 401) {
        throw new Error('🔑 API Key de OpenAI inválida o expirada. Verifica tu VITE_OPENAI_API_KEY en .env');
      }

      throw new Error(`DALL-E 3 error: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('✅ DALL-E 3 image generated successfully');
    return {
      url: data.data[0].url,
      provider: 'openai'
    };
  },

  /**
   * Generar con Stability AI
   */
  async generateWithStability(prompt) {
    if (!STABILITY_API_KEY) {
      throw new Error('VITE_STABILITY_API_KEY not configured');
    }

    console.log('📡 Calling Stability AI...');

    const response = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
        'Accept': 'image/*'
      },
      body: JSON.stringify({
        prompt: prompt,
        aspect_ratio: '9:16',
        output_format: 'png'
      })
    });

    if (!response.ok) {
      throw new Error(`Stability AI error: ${response.status}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return {
      url: url,
      provider: 'stability'
    };
  },

  /**
   * Generate video frame using Veo 3.1
   * @param {string} frameDescription - Detailed cinematographic description
   * @param {Object} options - Additional options (duration, influencerImage, etc.)
   * @returns {Promise<Object>} - Generated video data
   */
  async generateVideoFrame(frameDescription, options = {}) {
    try {
      console.log('🎥 Generating video frame with Veo 3.1...');
      console.log('Frame description:', frameDescription);
      console.log('Options:', options);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Construir prompt optimizado para Veo 3.1
      const prompt = this.buildVideoFramePrompt(frameDescription, options);

      // TODO: Llamada real a Veo 3.1 API
      // const response = await fetch('VEO_3.1_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${VEO_API_KEY}`
      //   },
      //   body: JSON.stringify({
      //     prompt: prompt,
      //     duration: options.duration || 10,
      //     resolution: '1080x1920',
      //     fps: 30,
      //     style: 'ugc-smartphone',
      //     seed: options.seed
      //   })
      // });

      return {
        success: true,
        videoUrl: 'https://placeholder.com/video.mp4', // Placeholder
        thumbnailUrl: 'https://placeholder.com/thumbnail.jpg',
        prompt: prompt,
        duration: options.duration || 10,
        service: 'veo-3.1',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating video frame:', error);
      throw new Error('Failed to generate video frame with Veo 3.1');
    }
  },

  /**
   * Build optimized prompt for Nano Banana image generation
   */
  buildInfluencerImagePrompt(description) {
    // Extraer elementos clave de la descripción
    const prompt = `A candid, authentic UGC-style photo of a ${description}.
    The photo should feel like a spontaneous, unfiltered moment captured on a high-end smartphone,
    with realistic skin texture and a natural, relaxed pose.
    Shot with natural lighting, slight depth of field, 9:16 vertical format for social media.
    Ultra-realistic, Instagram influencer aesthetic, professional but authentic.`;

    return prompt;
  },

  /**
   * Build optimized prompt for Veo 3.1 video generation
   */
  buildVideoFramePrompt(frameDescription, options) {
    const influencerContext = options.influencerImage
      ? '\n\nContinuity with influencer appearance: maintain consistency with provided reference image.'
      : '';

    const prompt = `${frameDescription}

Style: Ultra-realistic UGC video content, filmed on smartphone in vertical 9:16 format.
Camera: Handheld with subtle shake for authenticity, natural movements.
Lighting: Soft, natural lighting that feels real and unfiltered.
Quality: High-end smartphone footage quality, not overly produced.
Duration: ${options.duration || '5-10'} seconds.
${influencerContext}`;

    return prompt;
  },

  /**
   * Compile all frames into a final video
   * @param {Array} frames - Array of generated video frames
   * @returns {Promise<Object>} - Compiled video data
   */
  async compileVideo(frames) {
    try {
      console.log('🎬 Compiling final video from frames...');

      // Simular delay de compilación
      await new Promise(resolve => setTimeout(resolve, 4000));

      // TODO: Implementar lógica de compilación
      // Puede usar FFmpeg o un servicio de video editing

      return {
        success: true,
        videoUrl: 'https://placeholder.com/final-video.mp4',
        duration: frames.reduce((acc, f) => acc + (f.duration || 10), 0),
        frames: frames.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error compiling video:', error);
      throw new Error('Failed to compile final video');
    }
  },

  /**
   * Get generation status
   * @param {string} jobId - Generation job ID
   * @returns {Promise<Object>} - Job status
   */
  async getGenerationStatus(jobId, service) {
    try {
      // TODO: Implementar polling de status real
      console.log(`⏳ Checking status for job ${jobId} on ${service}...`);

      return {
        jobId,
        service,
        status: 'completed', // 'pending', 'processing', 'completed', 'failed'
        progress: 100,
        estimatedTimeRemaining: 0
      };
    } catch (error) {
      console.error('Error checking generation status:', error);
      throw new Error('Failed to check generation status');
    }
  }
};
