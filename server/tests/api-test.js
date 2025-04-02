import axios from 'axios';
import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize API clients
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function testAPI(name, testFn) {
  console.log(`\nTesting ${name} API...`);
  try {
    await testFn();
    console.log(`✓ ${name} API working`);
    return true;
  } catch (error) {
    console.error(`❌ ${name} API Failed:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

async function testAPIs() {
  console.log('Starting API configuration tests...\n');
  let results = [];

  // Test OpenAI
  results.push(await testAPI('OpenAI', async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: "Hello, this is a test message." }],
      max_tokens: 5
    });
    if (!response.choices?.[0]?.message?.content) throw new Error('No valid response received');
  }));

  // Test Hugging Face
  results.push(await testAPI('Hugging Face', async () => {
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: 'Hello, this is a test message.',
      parameters: { max_length: 5 }
    });
    if (!response) throw new Error('No response received');
  }));

  // Test YouTube
  results.push(await testAPI('YouTube', async () => {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=${process.env.YOUTUBE_API_KEY}&maxResults=1`
    );
    if (!response.data?.items) throw new Error('Invalid response format');
  }));

  // Test FRED
  results.push(await testAPI('FRED', async () => {
    const response = await axios.get(
      `https://api.stlouisfed.org/fred/series/observations?series_id=GDP&api_key=${process.env.FRED_API_KEY}&file_type=json`
    );
    if (!response.data) throw new Error('No data received');
  }));

  // Test Nutritionix
  results.push(await testAPI('Nutritionix', async () => {
    const response = await axios.get(
      `https://trackapi.nutritionix.com/v2/search/instant?query=apple`,
      {
        headers: {
          'x-app-id': process.env.NUTRITIONIX_APP_ID,
          'x-app-key': process.env.NUTRITIONIX_API_KEY
        }
      }
    );
    if (!response.data) throw new Error('No data received');
  }));

  // Test Spoonacular
  results.push(await testAPI('Spoonacular', async () => {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=pasta&number=1`
    );
    if (!response.data?.results) throw new Error('Invalid response format');
  }));

  // Test USDA
  results.push(await testAPI('USDA', async () => {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.USDA_API_KEY}&query=apple&pageSize=1`
    );
    if (!response.data?.foods) throw new Error('Invalid response format');
  }));

  // Test Adzuna
  results.push(await testAPI('Adzuna', async () => {
    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${process.env.ADZUNA_APP_ID}&app_key=${process.env.ADZUNA_API_KEY}&results_per_page=1&what=software%20developer`
    );
    if (!response.data?.results) throw new Error('Invalid response format');
  }));

  // Summary
  console.log('\n=== Test Summary ===');
  const successful = results.filter(r => r).length;
  const failed = results.length - successful;
  console.log(`✓ ${successful} APIs working`);
  console.log(`❌ ${failed} APIs failed`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

// Run the tests
testAPIs(); 