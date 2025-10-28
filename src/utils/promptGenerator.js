
import {
    SHOT_TYPES,
    CAMERA_MOVEMENTS,
    ENVIRONMENTS,
    LIGHTING,
    KEY_VISUALS_UGC,
    FINAL_RESULT_STYLES,
    TRANSITIONS
} from './soraFramework.js';

// Helper function to pick a random item from an array
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates a Sora 2 script based on a simple concept.
 * @param {string} concept - The user's high-level concept (e.g., 'A woman is excited about her new shoes').
 * @returns {string} A full, multi-shot prompt for Sora 2.
 */
export const generateScript = (concept) => {
    if (!concept) return 'Please provide a concept first.';

    // 1. Define Narrative Beats (simplified for this version)
    const beats = [
        {
            // HOOK: Introduce the subject and product
            subject: concept,
            shot: SHOT_TYPES.SELFIE,
            movement: CAMERA_MOVEMENTS.HANDHELD,
            environment: ENVIRONMENTS.LIVING_ROOM,
            lighting: LIGHTING.NATURAL,
            details: ['eyes wide with genuine surprise', pickRandom(KEY_VISUALS_UGC)]
        },
        {
            // ACTION: Show the product in more detail
            subject: 'A close-up on the product details',
            shot: SHOT_TYPES.CLOSE_UP,
            movement: CAMERA_MOVEMENTS.STATIC,
            environment: 'soft focus on background elements',
            lighting: LIGHTING.SOFT,
            details: ['shows the texture and quality', pickRandom(KEY_VISUALS_UGC)]
        },
        {
            // REACTION: Show the final, authentic reaction
            subject: 'The person gives an authentic, joyful reaction',
            shot: SHOT_TYPES.MEDIUM,
            movement: CAMERA_MOVEMENTS.DOLLY_OUT,
            environment: ENVIRONMENTS.LIVING_ROOM,
            lighting: LIGHTING.NATURAL,
            details: ['a happy dance or a hand over mouth in disbelief', pickRandom(KEY_VISUALS_UGC)]
        }
    ];

    // 2. Generate prompt for each beat
    const shotPrompts = beats.map(beat => {
        return `${beat.shot}, ${beat.movement}. ${beat.subject}. The scene is set in a ${beat.environment} with ${beat.lighting}. Key details include ${beat.details.join(', ')}.`;
    });

    // 3. Combine shots with transitions and add final style
    const fullScript = `
${shotPrompts[0]}

${pickRandom(TRANSITIONS)}

${shotPrompts[1]}

${pickRandom(TRANSITIONS)}

${shotPrompts[2]}

Finally, the overall result should be ${FINAL_RESULT_STYLES.UGC} and ${FINAL_RESULT_STYLES.REALISTIC}.
    `;

    return fullScript.trim().replace(/\s+/g, ' '); // Clean up whitespace
};
