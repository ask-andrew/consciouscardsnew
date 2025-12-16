const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Theme color mapping based on PRD
const themeColorMap = {
  "Growth": "glowing fresh green and lime",
  "Self": "glowing deep purple and teal",
  "Flow": "glowing bright yellow and magenta",
  "Relationships": "glowing warm orange and soft pink",
  "Gratitude": "glowing gold and warm yellow",
  "Mindfulness": "glowing light blue and clear white"
};

// Prompt template
const PROMPT_TEMPLATE = `A playful, whimsical illustration style, combining glowing chalk lines on textured paper with soft watercolor washes.

The main subject is a simple, expressive stick figure made entirely of {theme_color_string} light.

The figure is interacting in a dreamlike scene depicted here: {imagery_description}.

The environment around the figure is oversized and metaphorical, rendered in loose watercolor and colored pencil. The lighting is magical, emitting softly from the glowing stick figure itself. The overall mood is hopeful, imaginative, and clean. Minimalist composition with plenty of negative space.`;

// Configuration
const OUTPUT_DIR = path.join(__dirname, '../../public/images/cards');
const IMAGE_SIZE = "1024x1024";
const MODEL_NAME = "gemini-2.5-flash"; // Using the specified model

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Initialize Google's Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Function to generate a prompt for a card
function generatePrompt(card) {
  const themeColor = themeColorMap[card.Theme] || "glowing white and cyan";
  const imagery = card['Imagery Idea 1'] || card['Imagery Idea 2'] || "a magical scene";
  
  return PROMPT_TEMPLATE
    .replace('{theme_color_string}', themeColor)
    .replace('{imagery_description}', imagery);
}

async function generateCardImage(card, outputPath) {
  const prompt = generatePrompt(card);
  console.log(`🖌️  Generating: ${card.Concept}`);
  console.log(`   Theme: ${card.Theme || 'Default'}`);
  console.log(`   Prompt: ${prompt.substring(0, 100)}...`);

  try {
    const model = genAI.getGenerativeModel({ 
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Save the prompt and response for reference
    const metadata = {
      concept: card.Concept,
      theme: card.Theme,
      prompt: prompt,
      generatedText: text,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      `${outputPath}.json`, 
      JSON.stringify(metadata, null, 2)
    );
    
    console.log(`✅ Generated: ${outputPath}.json`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${card.Concept}:`, error.message);
    return false;
  }
}

async function generateAllCards() {
  console.log('🚀 Starting card image generation...\n');
  
  // Load your card data
  const cardsData = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../../consciouscards.new.json'), 
    'utf8'
  ));
  
  // Filter out any cards without necessary data
  const validCards = cardsData.filter(card => 
    card.Concept && (card['Imagery Idea 1'] || card['Imagery Idea 2'])
  );
  
  console.log(`📋 Found ${validCards.length} valid cards to process\n`);
  
  // Process each card
  for (const [index, card] of validCards.entries()) {
    const outputPath = path.join(OUTPUT_DIR, card.Concept.toLowerCase().replace(/\s+/g, '-'));
    
    console.log(`\n--- Processing ${index + 1}/${validCards.length} ---`);
    await generateCardImage(card, outputPath);
    
    // Add a small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 All cards processed!');
  console.log(`Check the ${OUTPUT_DIR} directory for the generated files.`);
}

// Set the API key from the provided key
process.env.GOOGLE_AI_API_KEY = "AIzaSyC-TU7N0PUJxFRCaPTcJp71acCqjPtBufk";

// Run the generation
generateAllCards().catch(console.error);
