
// soraFramework.js - Defines the building blocks for Sora 2 UGC prompts.

export const SHOT_TYPES = {
    WIDE: 'wide shot',
    MEDIUM: 'medium shot',
    CLOSE_UP: 'close-up shot',
    EXTREME_CLOSE_UP: 'extreme close-up',
    SELFIE: 'selfie-mode',
};

export const CAMERA_MOVEMENTS = {
    STATIC: 'static camera',
    HANDHELD: 'handheld camera with slight natural shake',
    DOLLY_IN: 'slow dolly-in',
    DOLLY_OUT: 'slow dolly-out',
    ORBIT: 'orbit move around the subject',
    TRACKING: 'side-tracking shot',
    PAN: 'slow pan',
    TILT: 'tilt up/down',
};

export const ENVIRONMENTS = {
    KITCHEN: 'bright modern kitchen',
    LIVING_ROOM: 'cozy living room with warm light',
    BEDROOM: 'clean, minimalist bedroom',
    OUTDOORS_PARK: 'sunny park with green grass',
    OFFICE: 'home office setup',
};

export const LIGHTING = {
    NATURAL: 'natural morning light streaming through a window',
    GOLDEN_HOUR: 'warm golden hour light',
    SOFT: 'soft, diffused lighting',
    NIGHT: 'ambient night lighting from streetlights',
    BACKLIGHT: 'backlit subject creating a silhouette effect',
};

export const KEY_VISUALS_UGC = [
    'authentic TikTok vibe',
    'slightly shaky handheld camera',
    'unscripted feel',
    'natural speech patterns with brief pauses',
    'slight camera adjustment as if repositioning phone',
    'subtle lens flare',
    'focus on expressive face',
    'genuine surprise/excitement',
    'unfiltered authenticity',
];

export const FINAL_RESULT_STYLES = {
    REALISTIC: 'ultra-realistic, hyper-detailed',
    CINEMATIC: 'cinematic, sharp focus',
    UGC: 'conversational UGC style, authentic, as if filmed on a phone',
};

export const TRANSITIONS = [
    '[cut]',
    'then',
    'suddenly',
    'finally',
    'as',
    'while',
];
