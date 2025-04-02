// Test file for OpenAI integration

const { generateResponse, analyzeSentiment, extractStructuredData } = require('../openai');

// Function to test the OpenAI integration
async function testOpenAIIntegration() {
  console.log('Testing OpenAI integration...');
  
  try {
    // Test generateResponse
    console.log('\n--- Testing generateResponse ---');
    const response = await generateResponse(
      'Tell me about the best practices for budgeting.',
      'You are a financial advisor. Provide concise, practical advice.',
      [],
      0.7,
      false
    );
    console.log('Response generated successfully:', response.substring(0, 100) + '...');

    // Test analyzeSentiment
    console.log('\n--- Testing analyzeSentiment ---');
    const sentiment = await analyzeSentiment('I absolutely love this app! It has been so helpful.');
    console.log('Sentiment analysis result:', sentiment);

    // Test extractStructuredData
    console.log('\n--- Testing extractStructuredData ---');
    const data = await extractStructuredData(
      'My name is John Smith, I am 32 years old, and I live in New York City.',
      {
        name: 'string',
        age: 'number',
        location: 'string'
      }
    );
    console.log('Structured data extraction result:', data);

    console.log('\nAll OpenAI integration tests completed successfully!');
  } catch (error) {
    console.error('Error during OpenAI integration test:', error);
  }
}

// Check if OpenAI API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key not configured. Please set the OPENAI_API_KEY environment variable.');
  process.exit(1);
}

// Run the test
testOpenAIIntegration();