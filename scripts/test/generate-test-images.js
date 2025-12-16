const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

// Test cards
const testCards = [
  {
    "Concept": "Joy",
    "Imagery Idea 1": "A simple, playful sun with a smiling face, radiating warm yellow rays",
    "Imagery Idea 2": "Colorful balloons floating upwards against a light blue sky"
  },
  {
    "Concept": "Gratitude",
    "Imagery Idea 1": "A heart-shaped wreath made of various leaves and flowers",
    "Imagery Idea 2": "Open hands gently holding a glowing light"
  },
  {
    "Concept": "Mindfulness",
    "Imagery Idea 1": "A single leaf floating peacefully on calm water",
    "Imagery Idea 2": "A person sitting in lotus position with a clear mind symbol above their head"
  }
];

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../../public/test-images');
const IMAGE_STYLES = {
  style: "Minimalist, playful, hand-drawn style with soft colors and clean lines. White background. Simple, clear composition with ample negative space. No text. High contrast for good visibility when printed.",
  size: "1024x1024",
  quality: "standard"
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Initialize OpenAI client
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateTestImages() {
  console.log('Starting test image generation...\n');
  
  for (const card of testCards) {
    const concept = card.Concept;
    const prompt = `${card['Imagery Idea 1']}. ${IMAGE_STYLES.style}`;
    const outputPath = path.join(OUTPUT_DIR, `${concept.toLowerCase()}.png`);
    
    console.log(`🖌️  Generating: ${concept}`);
    console.log(`   Prompt: ${prompt.substring(0, 80)}...`);
    
    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: IMAGE_STYLES.size,
        quality: IMAGE_STYLES.quality,
        response_format: "b64_json"
      });

      const imageData = response.data[0].b64_json;
      const imageBuffer = Buffer.from(imageData, 'base64');
      
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`✅ Saved: ${outputPath}\n`);
      
    } catch (error) {
      console.error(`❌ Error generating ${concept}:`, error.message);
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 Test image generation complete!');
  console.log(`Check the ${OUTPUT_DIR} directory for the generated images.`);
}

// Run the test
generateTestImages().catch(console.error);
