
// templates.js - A collection of pre-defined script templates.

export const unboxingTemplate = {
    name: 'Unboxing Template',
    concept: 'A user unboxes a product with excitement.',
    beats: [
        {
            subject: 'A person holding a branded box, looking curious and excited.',
            shot: 'selfie-mode',
            movement: 'handheld camera with slight natural shake',
            details: ['The box is from Sociocompras.com', 'The person shakes the box gently']
        },
        {
            subject: 'The person opens the box, and their face lights up with joy.',
            shot: 'medium shot',
            movement: 'slow dolly-in',
            details: ['A bright light emanates from inside the box (optional)', 'Genuine smile and wide eyes']
        },
        {
            subject: 'A close-up of the product inside the box, looking pristine.',
            shot: 'close-up shot',
            movement: 'static camera',
            details: ['The product is perfectly nestled in the packaging', 'Shows key features of the product']
        },
        {
            subject: 'The person takes the product out and shows it to the camera with a testimonial.',
            shot: 'selfie-mode',
            movement: 'handheld camera',
            details: ['Person says \"I got this for a great price on Sociocompras!\"', 'Authentic, happy reaction']
        }
    ]
};

export const productDemoTemplate = {
    name: 'Product Demo Template',
    concept: 'A user demonstrates how a product solves a common problem.',
    beats: [
        {
            subject: 'A person looking frustrated with a common problem (e.g., a tangled cable, a difficult-to-open jar).',
            shot: 'medium shot',
            movement: 'static camera',
            details: ['Exaggerated sigh or frown', 'The environment is relatable (e.g., a messy desk)']
        },
        {
            subject: 'The person introduces the product from Sociocompras as the solution.',
            shot: 'selfie-mode',
            movement: 'handheld camera',
            details: ['The person holds up the product with a hopeful expression', 'Says \"I found the perfect solution on Sociocompras!\"']
        },
        {
            subject: 'A close-up of the product in action, easily solving the problem.',
            shot: 'extreme close-up',
            movement: 'slow pan',
            details: ['Shows the product's innovative mechanism', 'The action is smooth and satisfying']
        },
        {
            subject: 'The person shows the successful result with a thumbs-up and a smile.',
            shot: 'medium shot',
            movement: 'handheld camera',
            details: ['The problem is clearly solved', 'The person looks relieved and happy']
        }
    ]
};

export const TEMPLATES = [unboxingTemplate, productDemoTemplate];
