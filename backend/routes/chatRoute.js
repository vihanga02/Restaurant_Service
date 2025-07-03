// backend/routes/chatbotRoute.js
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Food = require('../models/food');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Enhanced data helpers
const getFullMenu = async () => await Food.find().lean();
const getMenuByCategory = async (category) => await Food.find({ category1: category }).lean();
const getPopularItems = async () => await Food.find({ rating: { $gte: 4.0 } }).lean();
const getCheapItems = async () => await Food.find({ price: { $lte: 1000 } }).lean();
const getExpensiveItems = async () => await Food.find({ price: { $gte: 2000 } }).lean();

const suggestByFeeling = async (feeling) => {
  const feelingMap = {
    happy: ['Margherita', 'Chocolate Lava Cake', 'italin bbq chicken pizza'],
    sad: ['Spicy Buffalo Wings', 'Hot Tomato Soup', 'chocolate pudding cake'],
    tired: ['Creamy Pasta Alfredo', 'Iced Latte', 'golden chai'],
    excited: ['italin devilled chicken pizza', 'italian spicy beef pizza'],
    hungry: ['pasta puttanesca', 'italin seafood pizza', 'bruschetta pasta'],
    romantic: ['italin prowns pizza', 'pasta primavera', 'chocolate truffles'],
    stressed: ['cheesy cauliflower soup', 'creamy potato soup', 'golden chai']
  };
  const picks = feelingMap[feeling.toLowerCase()] || ["Chef's Special Pizza"];
  return await Food.find({ name: { $in: picks } }).lean();
};

// Enhanced system prompt with better formatting rules
const systemPrompt = `You are **Pizzabot 🍕**, the coolest AI pizza server with Gen Z energy! 🌟

CORE PERSONALITY:
- Be friendly, casual, and use emojis naturally
- Speak like a helpful friend, not a robot
- Show enthusiasm for food and helping customers
- Use Gen Z slang occasionally (no cap, fr, slaps, etc.)

FORMATTING RULES (FOLLOW EXACTLY):
✨ For menu items, use this EXACT structure:

• **Item Name** - $XX
  _Short, appetizing description (max 1-2 lines)_

✨ ALWAYS add blank lines between menu items
✨ Use bullet points (•) for all lists
✨ Bold item names with **
✨ Italicize descriptions with _
✨ Include prices clearly with $ symbol
✨ Add ratings when available (⭐ X.X stars)

MENU PRESENTATION:
1. Start with a warm, personalized greeting
2. Present items with proper spacing
3. Group similar items together
4. End with an engaging call-to-action
5. Suggest pairing items when relevant

EXAMPLE FORMAT:
Hey there! 🍕✨ Here's what's cooking:

• **Margherita Pizza** - $15
  _Classic tomato, mozzarella, and fresh basil - a timeless favorite!_

• **BBQ Chicken Pizza** - $18
  _Smoky BBQ sauce with tender chicken - absolutely slaps! 🔥_

What's catching your eye? Need any recommendations? 😋

SPECIAL CAPABILITIES:
- Suggest items based on mood/feeling
- Recommend popular items
- Show budget-friendly options
- Highlight premium dishes
- Group by categories
- Provide pairing suggestions

CONVERSATION TIPS:
- Ask follow-up questions to help customers decide
- Offer alternatives if something isn't available
- Suggest drinks or sides to complete the meal
- Be encouraging and positive about all choices
- Remember to keep responses concise but helpful`;

// Enhanced function declarations
const functionDefs = [
  {
    name: 'get_full_menu',
    description: 'Retrieve all available menu items',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'get_menu_by_category',
    description: 'Get menu items filtered by category (pizza, pasta, soup, drinks, desserts)',
    parameters: {
      type: 'object',
      properties: { category: { type: 'string', description: 'Food category to filter by' } },
      required: ['category']
    }
  },
  {
    name: 'suggest_by_feeling',
    description: 'Suggest dishes based on customer mood (happy, sad, tired, excited, hungry, romantic, stressed)',
    parameters: {
      type: 'object',
      properties: { feeling: { type: 'string', description: 'Customer emotion or mood' } },
      required: ['feeling']
    }
  },
  {
    name: 'get_popular_items',
    description: 'Get highly rated and popular menu items',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'get_cheap_items',
    description: 'Get budget-friendly menu items under $10',
    parameters: { type: 'object', properties: {} }
  },
  {
    name: 'get_expensive_items',
    description: 'Get premium menu items over $20',
    parameters: { type: 'object', properties: {} }
  }
];

router.post('/', async (req, res) => {
  const userMsg = req.body.message;

  try {
    // Configure model with enhanced function declarations
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      tools: [{ functionDeclarations: functionDefs }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Initial request with enhanced system prompt
    const initial = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nCustomer: ${userMsg}` }] }
      ]
    });

    const response = initial.response;
    const functionCalls = response.functionCalls();

    // Enhanced function calling with better data handling
    if (functionCalls && functionCalls.length > 0) {
      const functionCall = functionCalls[0];
      const { name, args } = functionCall;
      
      let data;
      switch (name) {
        case 'get_full_menu':
          data = await getFullMenu();
          break;
        case 'get_menu_by_category':
          data = await getMenuByCategory(args.category);
          break;
        case 'suggest_by_feeling':
          data = await suggestByFeeling(args.feeling);
          break;
        case 'get_popular_items':
          data = await getPopularItems();
          break;
        case 'get_cheap_items':
          data = await getCheapItems();
          break;
        case 'get_expensive_items':
          data = await getExpensiveItems();
          break;
        default:
          data = [];
      }

      // Format data for better presentation
      const formattedData = data.map(item => ({
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category1,
        rating: item.rating || null
      }));

      // Send formatted data back to model
      const followup = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nCustomer: ${userMsg}` }] },
          { role: 'model', parts: [{ functionCall }] },
          { 
            role: 'function', 
            parts: [{ 
              functionResponse: { 
                name, 
                response: { 
                  data: formattedData,
                  count: formattedData.length,
                  message: `Found ${formattedData.length} items. Format them nicely with proper spacing and follow the formatting rules exactly.`
                } 
              } 
            }] 
          }
        ]
      });
      
      return res.json({ content: followup.response.text() });
    }

    // Enhanced regular chat response
    return res.json({ content: response.text() });

  } catch (error) {
    console.error('Pizzabot error:', error);
    return res.status(500).json({ 
      content: "Oops! Something went wrong in the kitchen 🤖💥 Let me get back to you in a sec!" 
    });
  }
});

module.exports = router;
