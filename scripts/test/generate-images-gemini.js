const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Test cards
const testCards = [
  {
    "Concept": "Joy",
    "Imagery Idea 1": "A simple, playful sun with a smiling face, radiating warm yellow rays",
    "Imagery Idea 2": "Colorful balloons floating upwards against a light blue sky"
  }
];

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../../public/test-images');
const IMAGE_STYLES = {
  style: "Minimalist, playful, hand-drawn style with soft colors and clean lines. White background. Simple, clear composition with ample negative space. No text. High contrast for good visibility when printed."
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Initialize Google's Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function generateImages() {
  console.log('Starting image generation...\n');
  
  // Get the generative model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  for (const card of testCards) {
    const concept = card.Concept;
    const prompt = `Create a playful, simple, and inviting image of: ${card['Imagery Idea 1']}. ${IMAGE_STYLES.style}`;
    const outputPath = path.join(OUTPUT_DIR, `${concept.toLowerCase()}.txt`);
    
    console.log(`🖌️  Generating: ${concept}`);
    console.log(`   Prompt: ${prompt}`);
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Generated response:', text);
      
      // Save the response to a text file
      fs.writeFileSync(outputPath, `Prompt: ${prompt}\n\nResponse: ${text}`);
      console.log(`✅ Response saved to: ${outputPath}\n`);
      
    } catch (error) {
      console.error(`❌ Error generating ${concept}:`, error.message);
      console.error('Error details:', error);
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 Generation complete!');
  console.log(`Check the ${OUTPUT_DIR} directory for the generated files.`);
}

// Run the generation
generateImages().catch(console.error);
