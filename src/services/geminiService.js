import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const geminiService = {
  async enhanceBrandResearch(brandData) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `
Eres un experto en investigación de mercado, branding y marketing digital especializado en UGC (User Generated Content).

Analiza la siguiente información de marca:

=== INFORMACIÓN BÁSICA ===
Nombre de la Marca: ${brandData.brand_name || 'No especificado'}
Website/Dominio: ${brandData.brand_domain || 'No especificado'}
Categoría: ${brandData.category || 'No especificada'}

=== PROPUESTA DE VALOR Y AUDIENCIA ===
Propuesta de Valor Única (UVP): ${brandData.uvp}
Audiencia Objetivo: ${brandData.audience}

=== PAIN POINTS ===
Puntos de Dolor y Soluciones: ${brandData.pain_points}

=== CONTEXTO COMPETITIVO ===
Competidores: ${brandData.competitors || 'No especificados'}
Tono de Voz: ${brandData.brand_voice || 'No especificado'}
Objetivos de Marketing: ${brandData.marketing_goals || 'No especificados'}

Por favor, proporciona un análisis completo con:
1. **Análisis de Propuesta de Valor**: Evalúa la fuerza de la UVP, diferenciadores clave y cómo se posiciona vs competencia
2. **Insights de Audiencia**: Perfil psicográfico, comportamientos, motivaciones y canales preferidos
3. **Recomendaciones para Pain Points**: Estrategias específicas para comunicar las soluciones
4. **Posicionamiento de Marca**: Posición ideal en el mercado y mensajes clave
5. **Oportunidades de Contenido UGC**: 5-7 ideas específicas de contenido UGC que resonarían con la audiencia

Proporciona la respuesta en formato JSON con las siguientes claves:
{
  "valueAnalysis": "Análisis detallado de 2-3 párrafos...",
  "audienceInsights": "Insights profundos de 2-3 párrafos...",
  "painPointRecommendations": "Recomendaciones estratégicas de 2-3 párrafos...",
  "brandPositioning": "Posicionamiento sugerido de 2-3 párrafos...",
  "ugcOpportunities": ["Idea 1 específica y accionable", "Idea 2...", "Idea 3...", "Idea 4...", "Idea 5..."]
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }

      return {
        valueAnalysis: text,
        audienceInsights: '',
        painPointRecommendations: '',
        brandPositioning: '',
        ugcOpportunities: []
      };
    } catch (error) {
      console.error('Error enhancing brand research:', error);
      throw new Error('Failed to enhance brand research with AI');
    }
  },

  async generateIdeas(brandData, count = 5, useViralResearch = false, ideaType = null) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const brandContext = brandData ? `
Contexto de la marca:
- Nombre: ${brandData.brand_name || 'No especificado'}
- Website: ${brandData.brand_domain || 'No especificado'}
- Categoría: ${brandData.category || 'No especificada'}
- Propuesta de Valor: ${brandData.uvp}
- Audiencia: ${brandData.audience}
- Puntos de Dolor: ${brandData.pain_points}
- Tono de Voz: ${brandData.brand_voice || 'Auténtico y cercano'}
- Competidores: ${brandData.competitors || 'No especificados'}
` : 'Genera ideas generales de contenido UGC.';

      // Calcular fecha de hace 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateString = thirtyDaysAgo.toISOString().split('T')[0];

      // Contexto dinámico según el tipo de idea
      let ugcOrGeneralContext;
      if (ideaType === 'UGC') {
        ugcOrGeneralContext = `
        
🎬 TIPO DE IDEA: UGC CON AI INFLUENCER

Eres un creative director especializado en videos UGC para marcas D2C (Direct-to-Consumer).

🔍 **PASO 1: INVESTIGACIÓN DEL BRAND FIT**
Basándote en el contexto de marca proporcionado, INVESTIGA mentalmente:
- ¿Qué tipo de influencer resuena con esta audiencia? (edad, demografía, estilo de vida)
- ¿Qué valores y estética visual conectan con la categoría del producto?
- ¿Qué personalidad y tono de voz harían la recomendación más creíble?
- ¿Qué referentes de influencers reales en esta categoría existen? (lifestyle, beauty, tech, wellness, etc.)

📝 **PASO 2: CREAR AL AI INFLUENCER - DESCRIPCIÓN EXTREMADAMENTE DETALLADA**

Crea una descripción rica y cinematográfica del AI influencer (similar al ejemplo de "Aura" para fragancia). Incluye:

**Apariencia Física Detallada:**
- Edad específica (ej: 23 años, early 30s)
- Herencia étnica específica (ej: brasileña y japonesa, afroamericana, europea, latinx)
- Cabello: color específico, textura, estilo característico (ej: "silver-lavender iridiscente en ondas suaves", "rizos naturales color castaño chocolate", "bob sleek negro azabache")
- Rasgos faciales distintivos (ej: "ojos almendrados cálidos", "pecas naturales", "sonrisa contagiosa")
- Características únicas que la hacen memorable

**Sentido de Moda y Estética:**
- Estilo específico con ejemplos concretos (ej: "minimalista avant-garde con streetwear elevado")
- Piezas de ropa características (ej: "crop tops cromados estructurados, pantalones cargo de seda, blazers oversized deconstruidos")
- Accesorios signature (ej: "joyería escultural de plata", "gafas vintage oversized")
- Paleta de colores y texturas preferidas

**Personalidad y Valores:**
- Traits de personalidad específicos (ej: "confianza serena con curiosidad juguetona")
- Qué la hace relatable y aspiracional simultáneamente
- Valores que championa (ej: "lujo mindful", "autenticidad digital", "wellness holístico")
- Cómo se comunica con sus seguidores (tono, lenguaje, temas)

**Brand Fit Perfecto:**
- Por qué esta persona es LA embajadora ideal para ESTE producto específico
- Cómo su lifestyle se alinea con la propuesta de valor
- Qué credibilidad aporta a la categoría

📹 **PASO 3: VIDEO CONCEPT DE 3 FRAMES - DESCRIPCIÓN CINEMATOGRÁFICA**

Para cada frame, sé EXTREMADAMENTE específico como si fueras un director de fotografía:

**FRAME 1: Face Cam Introduction (5-10 segundos)**

Describe detalladamente:
- **Setting:** Ubicación exacta, elementos de fondo específicos, decoración, atmósfera (ej: "dormitorio minimalista chic con luz de mañana difusa, tonos neutrales, una pieza de arte abstracto en la pared")
- **Shot Type:** Ángulo exacto, distancia, movimiento de cámara (ej: "close-up selfie-style", "medium shot levemente angulado", "handheld con ligero movimiento")
- **Lighting:** Tipo y calidad de luz específica (ej: "soft morning light difusa", "golden hour natural", "window light with backlit glow")
- **Influencer Details:** Makeup look, expresión facial, posición del producto, gestos (ej: "makeup fresco y dewy, sonrisa suave conocedora, sostiene el producto elegantemente cerca del rostro")
- **Lo que dice/comunica:** Tema específico, tono de voz, palabras clave (ej: "habla sobre encontrar un scent que se sienta como 'segunda piel' o 'esencia del amanecer'")
- **Product Presence:** Cómo se muestra el producto, ángulo, luz reflejada

**FRAME 2: Using the Product (5-10 segundos)**

Describe detalladamente:
- **Setting & Transition:** Misma ubicación o cambio sutil
- **Shot Type:** Movimiento específico (ej: "slow-motion lateral shot", "overhead view", "dynamic close-up")
- **Action Específica:** Cada movimiento detallado paso a paso (ej: "lleva el producto al cuello, spritza gracefully, la cámara captura la fina niebla, cierra los ojos saboreando, toca pulse points en muñeca")
- **Lighting & Mood:** Cómo la luz interactúa con la acción
- **Product as Hero:** Cómo el producto es el protagonista de esta toma
- **Emotional Beat:** Qué emoción se transmite (placer, transformación, satisfacción)

**FRAME 3: Product in Appealing Setting (5-10 segundos)**

Describe detalladamente:
- **Setting Exact:** Ubicación específica (ej: "vanity estilizado", "mesita de noche", "mármol de cocina", "estante flotante")
- **Shot Composition:** Tipo de shot exacto (ej: "static, aesthetically pleasing shot", "slow rotating shot", "overhead flat-lay")
- **Surrounding Props:** Lista exacta de objetos con detalles (ej: "bandeja de espejo, vaso con una rama de lavanda, cristal de amatista crudo, vela sin encender en holder cromado")
- **Lighting & Reflections:** Cómo la luz crea mood (ej: "reflecciones artísticas y sombras en superficie cromada, look like art piece")
- **Color Palette:** Paleta de colores del shot completo
- **Lifestyle Association:** Qué lifestyle o aspiración transmite este shot
- **Camera Movement:** Static o movimiento sutil

🎯 **REGLAS DE ORO:**
- Cada frame debe leer como una descripción de storyboard cinematográfico
- NO menciones text overlay o texto en pantalla
- El producto es visible y protagónico en los 3 frames
- La descripción debe ser tan visual que un director de DP pueda ejecutarla
- Total video: 15-30 segundos optimizado para vertical 9:16
- Estilo: UGC auténtico pero altamente estético

💡 **INSPIRACIÓN DE FORMATO:**
Tu descripción del AI influencer debe ser tan rica como: "Meet Aura, a 23-year-old digital artist and model of Brazilian and Japanese descent, known for her ethereal and futuristic aesthetic. With her striking, ever-so-slightly iridescent silver-lavender hair..."

Tus frames deben tener este nivel de detalle cinematográfico: "A close-up, selfie-style shot of Aura. Her makeup is fresh and dewy, enhancing her natural features. She holds the sleek, chrome bottle elegantly in one hand, near her face..."
`;
      } else {
        ugcOrGeneralContext = `

🎬 TIPO DE IDEA: GENERAL / VIRAL (Protocolo UGC-Bot para Sociocompras)

Eres un director creativo y estratega de marketing de contenidos especializado en UGC auténtico y viral. Sigues el **Protocolo UGC-Bot Gemini** que integra investigación de marca, análisis de tendencias y framework de 5 componentes para Sora 2.

📋 **PROTOCOLO DE INVESTIGACIÓN DE MARCA APLICADO**

Basándote en el contexto de marca proporcionado, considera:

1. **Propuesta de Valor Única (PVU)**:
   - ¿Qué diferenciador clave tiene esta marca?
   - ¿Qué problema principal resuelve?
   - ¿Por qué el cliente debería elegir esto vs competencia?

2. **Audiencia Objetivo Profunda**:
   - Demografía: ${brandData ? brandData.audience : 'edad, género, ubicación'}
   - Psicografía: Intereses, valores, estilo de vida
   - Comportamiento: ¿Cómo compran? ¿Qué redes usan? ¿Qué contenido consumen?

3. **Mapeo de Puntos de Dolor y Soluciones**:
   Identifica el pain point específico que cada idea debe resolver y cómo el producto lo soluciona.

4. **Tono y Personalidad**:
   - Tono: Auténtico, útil, comunitario, energético
   - Personalidad: El "amigo inteligente" que ayuda a tomar mejores decisiones
   - Keywords: Valor, ahorro, descubrimiento, social, comunidad

🎥 **FRAMEWORK DE IDEACIÓN DIARIA**

Genera ideas conectando:
- **Tendencias actuales** (audios, hashtags, formatos populares)
- **Conversaciones de la audiencia** (¿De qué hablan hoy?)
- **Ángulos creativos** que conecten tendencias con productos/soluciones

📐 **ESTRUCTURA NARRATIVA UGC (Para cada idea)**

Cada concepto debe seguir esta estructura de 15 segundos:

1. **Hook (0-3s)**: Captación inmediata de atención
   - Ejemplos: "No puedo creer lo que acabo de encontrar...", "Nadie está hablando de esto...", "Wait for it..."

2. **Problema (3-6s)**: Presentar punto de dolor relevante
   - Conectar con frustración o necesidad real de la audiencia

3. **Solución (6-12s)**: Introducir el producto/servicio como solución
   - Mostrar beneficio claro y diferenciador

4. **CTA (12-15s)**: Call to action claro
   - "Descarga la app", "Únete al grupo", "Link en bio"

🎬 **FORMATOS DE VIDEO POR PLATAFORMA**

Elige el formato más apropiado según el concepto:

**Para TikTok:**
- Rápido, audios en tendencia, humor, retos, transformaciones
- Duración: 7-15 segundos óptimo

**Para Instagram Reels:**
- Estético, tutoriales, storytelling visual, transiciones creativas
- Duración: 15-30 segundos

**Para YouTube Shorts:**
- Educativo, hacks, listas, contenido directo
- Duración: 15-60 segundos

📹 **FORMATOS ESPECÍFICOS** (Elige el más apropiado):

- **Antes y Después**: Transformación clara gracias al producto
- **Comparativa**: Producto vs alternativa antigua (sin nombrar competencia)
- **Problema/Solución**: Problema común + solución brillante
- **POV (Point of View)**: Escenario relatable desde perspectiva del usuario
- **Testimonio/Caso de Éxito**: Cliente feliz explicando su éxito
- **Hack/Tip Secreto**: Uso no convencional o truco
- **Unboxing/First Impressions**: Reacción genuina al recibir producto
- **GRWM (Get Ready With Me)**: Producto placement natural en rutina
- **Day in the Life**: Storytelling genuino con momento wow
- **Behind-the-Scenes**: Auténtico sin edición perfecta

🎯 **FRAMEWORK DE 5 COMPONENTES PARA SORA 2**

Aunque generas IDEAS (no scripts completos aún), ten en mente que cada concepto debe ser filmable siguiendo:

1. **SUBJECT + ACTION**: Protagonista, acción, detalles
2. **SHOT TYPE**: Plano y movimiento de cámara (medium shot, close-up, dolly-in, etc.)
3. **ENVIRONMENT**: Ubicación, luz, atmósfera (natural lighting, golden hour, cozy modern setting)
4. **KEY VISUALS**: Elementos clave, imperfecciones auténticas (slight camera shake, genuine expression, logo visible)
5. **FINAL RESULT**: Calidad técnica (ultra-realistic, UGC authentic style, phone camera feel)

✨ **PALABRAS CLAVE DE AUTENTICIDAD**:
- handheld, selfie-mode, slight camera shake, natural lighting, unscripted
- genuine reaction, conversational, real moment, TikTok vibe, relatable

🎯 **OBJETIVO FINAL**:
Cada idea debe sentirse auténtica, no como un anuncio. Debe ser algo que la audiencia objetivo vería de un amigo y pensaría "¡Yo también quiero probar eso!"
`;
      }

      const viralResearchContext = useViralResearch ? `

📊 INVESTIGACIÓN DE TENDENCIAS VIRALES (Últimos 30 días desde ${dateString}):

Analiza y considera las siguientes tendencias virales actuales en TikTok e Instagram Reels:

1. **Formatos que están funcionando**:
   - Videos de "Get Ready With Me" (GRWM) con producto placement natural
   - "Before & After" transformations auténticos
   - "POV" (Point of View) narrativos y relacionables
   - "Day in the life" con storytelling genuino
   - "Duets" y "Stitches" respondiendo a trending topics
   - "Mini vlogs" de 15-30 segundos con momento "wow"

2. **Hooks virales recientes**:
   - "Nobody is talking about..."
   - "This changed my [vida/rutina/problema]..."
   - "Wait for it..." con build-up emocional
   - "I tried [tendencia] and here's what happened"
   - "As a [rol/profesión], here's what I wish people knew..."

3. **Elementos técnicos que aumentan viralidad**:
   - Primeros 0.3 segundos con movimiento o contraste visual fuerte
   - Texto on-screen con keywords relevantes
   - Música trending actual (verifica TikTok Creative Center)
   - Duración ideal: 7-21 segundos para máximo retention
   - Ratio 9:16 vertical optimizado para mobile

4. **Temáticas virales actuales**:
   - "Mindful consumption" y productos sostenibles
   - Hacks y tips que resuelven pain points específicos
   - Behind-the-scenes auténticos sin edición perfecta
   - User testimonials reales con resultados medibles
   - "Plot twist" o reveals sorprendentes

🎯 INSTRUCCIÓN: Usa estas tendencias virales como inspiración para crear ideas que:
- Se sientan auténticas y actuales (no forzadas)
- Adapten formatos virales al contexto de la marca
- Incorporen hooks y estructuras que están probadas en el mercado AHORA
- Mencionen explícitamente qué tendencia viral están usando y por qué funcionará
` : '';

      const prompt = `
Eres un experto en marketing de contenido y video marketing para TikTok e Instagram Reels, con acceso a las últimas tendencias virales.

${brandContext}
${ugcOrGeneralContext}
${viralResearchContext}

Genera ${count} ideas ${useViralResearch ? 'basadas en las TENDENCIAS VIRALES actuales de los últimos 30 días' : 'creativas y virales'} para videos que:
1. Sean auténticas y genuinas (no se sientan como ads)
2. Generen engagement y comentarios
3. Resuelvan problemas de la audiencia
4. Sean fáciles de producir con un smartphone
5. Tengan ALTO potencial viral ${useViralResearch ? 'usando formatos y hooks que están funcionando AHORA' : ''}
${useViralResearch ? '6. Especifiquen qué tendencia viral utilizan y por qué es relevante' : ''}
${ideaType === 'UGC' ? '7. INCLUYAN la descripción del AI influencer y los 3 frames del video' : ''}

Proporciona las ideas en formato JSON como un array de objetos:
[
  {
    "title": "Título corto y llamativo",
    "description": "Descripción breve de la idea${useViralResearch ? ' + mención de la tendencia viral que usa' : ''}",
    "hook": "El gancho para los primeros 3 segundos",
    "viralPotential": "alto/medio/bajo"${useViralResearch ? ',\n    "viralTrend": "Nombre de la tendencia viral que utiliza (ej: GRWM, Before/After, POV, etc.)"' : ''}${ideaType === 'UGC' ? `,
    "type": "UGC",
    "aiInfluencer": "PÁRRAFO EXTENSO Y RICO describiendo al AI influencer. Sigue el formato: Meet [Nombre], a [edad]-year-old [profesión/rol] of [herencia étnica], known for [su estética característica]. With [descripción detallada física], [rasgos distintivos], she/he embodies [tipo de belleza/presencia]. Her/His fashion sense is [descripción detallada de estilo] - think [3+ ejemplos específicos de ropa], always accessorized with [accesorios específicos]. [Nombre] personality is [traits específicos]; her/his followers are drawn to [qué los atrae]. She/He champions [valores/lifestyle], making her/him the perfect ambassador for [tipo de producto/marca].",
    "frame1": "DESCRIPCIÓN CINEMATOGRÁFICA DETALLADA del Frame 1. Incluye: Setting [ubicación exacta, decoración, atmósfera]. Shot [tipo de toma, ángulo, movimiento]. Lighting [tipo de luz específica]. Influencer [makeup, expresión, posición del producto, gestos]. Dialogue/Theme [qué dice/comunica específicamente]. Product [cómo se muestra, visibilidad, luz reflejada]. Mínimo 3-4 oraciones descriptivas.",
    "frame2": "DESCRIPCIÓN CINEMATOGRÁFICA DETALLADA del Frame 2. Incluye: Setting [ubicación, transición desde Frame 1]. Shot [tipo de toma con movimiento específico]. Action [cada paso de la demostración/uso del producto, detallado]. Lighting [cómo interactúa con la acción]. Product as Hero [cómo protagoniza esta toma]. Emotional Beat [emoción transmitida]. Mínimo 3-4 oraciones descriptivas.",
    "frame3": "DESCRIPCIÓN CINEMATOGRÁFICA DETALLADA del Frame 3. Incluye: Setting [ubicación específica del product shot]. Composition [tipo de shot exacto]. Props [lista detallada de objetos alrededor con descripciones]. Lighting [efectos de luz, reflejos, sombras]. Color Palette [paleta de colores completa]. Lifestyle Association [qué aspiración transmite]. Camera [movimiento o static]. Mínimo 3-4 oraciones descriptivas."` : ''}
  }
]

${ideaType === 'UGC' ? `
⚠️ IMPORTANTE PARA TIPO UGC:
- aiInfluencer debe ser un PÁRRAFO COMPLETO de 100+ palabras estilo Meet Aura
- Cada frame debe tener 60-100+ palabras con TODOS los elementos cinematográficos detallados
- Usa lenguaje visual rico y específico como si fueras un director de fotografía escribiendo un storyboard` : ''}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }

      return text.split('\n').filter(line => line.trim()).slice(0, count).map((idea, index) => ({
        title: `Idea ${index + 1}`,
        description: idea,
        hook: 'Hook generado',
        viralPotential: 'medio'
      }));
    } catch (error) {
      console.error('Error generating ideas:', error);
      throw new Error('Failed to generate ideas with AI');
    }
  },

  async generateScript(concept, brandData, ideaData = null) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const brandContext = brandData ? `
Información de la marca:
- Nombre: ${brandData.brand_name || 'La marca'}
- Website: ${brandData.brand_domain || 'No especificado'}
- Categoría: ${brandData.category || 'No especificada'}
- Propuesta de Valor: ${brandData.uvp || 'No especificada'}
- Audiencia: ${brandData.audience || 'Audiencia general'}
- Puntos de Dolor: ${brandData.pain_points || 'No especificados'}
- Tono de Voz: ${brandData.brand_voice || 'Auténtico y conversacional'}
` : '';

      // Verificar si es una idea de tipo UGC con frames
      const isUGCType = ideaData && ideaData.type === 'UGC' && ideaData.frame1;

      let prompt;

      if (isUGCType) {
        // Prompt especializado para UGC con 3 frames y AI influencer
        prompt = `
Eres un experto en crear prompts para Sora 2 (text-to-video AI) optimizados para contenido UGC auténtico con AI influencers.

${brandContext}

Concepto del video: ${concept}

=== AI INFLUENCER ===
${ideaData.aiInfluencer || 'Influencer auténtico y relatable'}

=== ESTRUCTURA DEL VIDEO (3 FRAMES) ===

FRAME 1 (5-10 segundos): ${ideaData.frame1}
FRAME 2 (5-10 segundos): ${ideaData.frame2}
FRAME 3 (5-10 segundos): ${ideaData.frame3}

🎬 TU TAREA:
Crea un prompt DETALLADO para Sora 2 que genere este video UGC con AI influencer siguiendo EXACTAMENTE la estructura de 3 frames.

Para cada FRAME, especifica:

1. **DESCRIPCIÓN VISUAL DETALLADA**:
   - Apariencia del influencer (si aplica): edad, etnicidad, cabello, outfit, expresión
   - Encuadre: selfie-mode, close-up, medium shot, wide shot
   - Localización específica: living room con luz natural, cocina moderna, outdoor en parque, etc.
   - Iluminación: natural window light, golden hour, soft diffused lighting, bright daylight
   - Producto: posición, tamaño, cómo se muestra o usa

2. **ACCIÓN Y MOVIMIENTO**:
   - Qué hace el influencer (si aplica): gestos, expresiones faciales, movimientos
   - Movimiento de cámara: handheld shake auténtico, static, leve pan, zoom in/out
   - Interacción con el producto

3. **ESTILO UGC**:
   - Ultra-realistic, smartphone footage quality
   - Ligeramente shaky camera (auténtico, no perfecto)
   - Sin filtros, aspecto natural y raw
   - Vertical 9:16 para TikTok/Instagram Reels

4. **TRANSICIONES**:
   - Entre frames usa cortes naturales: [quick cut], [smash cut], [transition]

REGLAS IMPORTANTES:
- NO incluir text overlay ni texto en pantalla
- El producto DEBE ser visible en los 3 frames
- Duración total: 15-30 segundos
- Mantener continuidad visual entre frames
- El influencer debe verse consistente en Frame 1 y 2

Formato de salida:
Genera el prompt como texto continuo y fluido, separando los 3 frames con [CUT TO:] y describiendo cada escena en detalle cinematográfico para Sora 2.
`;
      } else {
        // Prompt original para ideas no-UGC
        prompt = `
Eres un experto en crear prompts para Sora 2 (text-to-video AI) optimizados para contenido UGC auténtico.

${brandContext}

Concepto del video: ${concept}

Crea un script detallado para Sora 2 que incluya:

1. ESTRUCTURA DE 3 ACTOS:
   - HOOK (3 segundos): Captación de atención inmediata
   - ACTION: Demostración del producto/concepto
   - REACTION: Reacción auténtica y call-to-action

2. ESPECIFICACIONES TÉCNICAS para cada toma:
   - Tipo de toma (selfie-mode, close-up, medium shot, wide shot)
   - Movimiento de cámara (handheld shake, static, dolly, pan)
   - Ambiente/localización (living room, kitchen, outdoor, etc.)
   - Iluminación (natural light, golden hour, soft lighting)
   - Detalles visuales UGC (shaky camera, unscripted feel, authentic reactions)

3. ESTILO FINAL:
   - Ultra-realistic, conversational UGC style
   - Como si fuera filmado en un smartphone
   - Auténtico y sin filtros

Genera el prompt completo optimizado para Sora 2 en formato de texto continuo, separando cada toma con transiciones naturales ([cut], then, suddenly, finally).
`;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script with AI');
    }
  }
};