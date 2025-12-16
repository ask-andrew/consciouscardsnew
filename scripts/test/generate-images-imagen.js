const fs = require('fs');
const path = require('path');
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
require('dotenv').config();

// Configuration
const PROJECT_ID = 'conscious-cards';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.5-flash-image';
const OUTPUT_DIR = path.join(__dirname, '../../public/images/cards');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Initialize the client
const client = new PredictionServiceClient({
  apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
  projectId: PROJECT_ID,
  keyFilename: path.join(__dirname, '../../google-credentials.json')
});

// Sample cards to test with
const testCards = [
  {
    "Concept": "Joy",
    "Imagery Idea 1": "A simple, playful sun with a smiling face, radiating warm yellow rays",
    "Theme": "Flow"
  },
  {
    "Concept": "Gratitude",
    "Imagery Idea 1": "A hand holding a glowing heart, with small sparkling lights floating upward",
    "Theme": "Gratitude"
  },
  {
    "Concept": "Mindfulness",
    "Imagery Idea 1": "A still pond reflecting a clear blue sky with a single leaf floating on the surface",
    "Theme": "Mindfulness"
  }
];

// Theme color mapping
const themeColorMap = {
  "Growth": "glowing fresh green and lime",
  "Self": "glowing deep purple and teal",
  "Flow": "glowing bright yellow and magenta",
  "Relationships": "glowing warm orange and soft pink",
  "Gratitude": "glowing gold and warm yellow",
  "Mindfulness": "glowing light blue and clear white"
};

// Generate prompt for a card
function generatePrompt(card) {
  const themeColor = themeColorMap[card.Theme] || "glowing white and cyan";
  const imagery = card['Imagery Idea 1'] || card['Imagery Idea 2'] || "a magical scene";
  
  return `A playful, whimsical illustration style, combining glowing chalk lines on textured paper with soft watercolor washes.

The main subject is a simple, expressive stick figure made entirely of ${themeColor} light.

The figure is interacting in a dreamlike scene depicted here: ${imagery}.

The environment around the figure is oversized and metaphorical, rendered in loose watercolor and colored pencil. The lighting is magical, emitting softly from the glowing stick figure itself. The overall mood is hopeful, imaginative, and clean. Minimalist composition with plenty of negative space.`;
}

async function generateImage(prompt, outputPath) {
  const instance = {
    prompt: prompt,
    sampleCount: 1,
    aspectRatio: "1:1"
  };

  const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}`;
  
  try {
    console.log(`Generating image for: ${outputPath}`);
    const [response] = await client.predict({
      endpoint,
      instances: [{ prompt: prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1"
      }
    });
    
    if (response.predictions && response.predictions.length > 0) {
      const prediction = response.predictions[0];
      if (prediction.bytesBase64Encoded) {
        const imageData = prediction.bytesBase64Encoded;
        const imageBuffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync(`${outputPath}.png`, imageBuffer);
        console.log(`✅ Image saved to: ${outputPath}.png`);
        
        // Save the prompt for reference
        fs.writeFileSync(
          `${outputPath}_prompt.txt`, 
          prompt
        );
        
        return true;
      }
    }
    
    console.error('No image data in response');
    return false;
  } catch (error) {
    console.error('Error generating image:', error.message);
    if (error.details) {
      console.error('Error details:', error.details);
    }
    return false;
  }
}

async function generateTestImages() {
  console.log('🚀 Starting image generation with Imagen...\n');
  
  for (const card of testCards) {
    const prompt = generatePrompt(card);
    const outputPath = path.join(OUTPUT_DIR, card.Concept.toLowerCase());
    
    console.log(`\n--- Processing: ${card.Concept} ---`);
    console.log(`Theme: ${card.Theme}`);
    console.log(`Prompt: ${prompt.substring(0, 100)}...`);
    
    await generateImage(prompt, outputPath);
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 Image generation complete!');
  console.log(`Check the ${OUTPUT_DIR} directory for the generated images.`);
}

// Run the generation
generateTestImages().catch(console.error);
