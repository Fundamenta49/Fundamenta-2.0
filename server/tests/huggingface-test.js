// Test file for HuggingFace integration

const { 
  textClassifier, 
  entityRecognizer, 
  textSummarizer,
  getContentCategory,
  analyzeUserEmotion
} = require('../huggingface');

// Function to test the HuggingFace integration
async function testHuggingFaceIntegration() {
  console.log('Testing HuggingFace integration...');
  
  try {
    // Test sentiment analysis
    console.log('\n--- Testing sentiment analysis ---');
    const sentiment = await textClassifier.analyzeSentiment('I absolutely love this app! It has been so helpful.');
    console.log('Sentiment analysis result:', sentiment);

    // Test emotion classification
    console.log('\n--- Testing emotion classification ---');
    const emotion = await textClassifier.classifyEmotion('I\'m feeling quite anxious about the upcoming presentation.');
    console.log('Emotion classification result:', emotion);

    // Test entity recognition
    console.log('\n--- Testing entity recognition ---');
    const entities = await entityRecognizer.extractEntities('Google was founded by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University.');
    console.log('Entity recognition result:', entities);

    // Test text summarization
    console.log('\n--- Testing text summarization ---');
    const text = 'Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.';
    const summary = await textSummarizer.summarize(text, 50);
    console.log('Text summarization result:', summary);

    // Test content category detection
    console.log('\n--- Testing content category detection ---');
    const category = await getContentCategory('How can I improve my credit score and save for retirement?');
    console.log('Content category detection result:', category);

    // Test user emotion analysis
    console.log('\n--- Testing user emotion analysis ---');
    const emotionAnalysis = await analyzeUserEmotion('I\'m really excited about starting my new job next week!');
    console.log('User emotion analysis result:', emotionAnalysis);

    console.log('\nAll HuggingFace integration tests completed successfully!');
  } catch (error) {
    console.error('Error during HuggingFace integration test:', error);
  }
}

// Check if HuggingFace API key is configured
if (!process.env.HUGGINGFACE_API_KEY) {
  console.error('HuggingFace API key not configured. Please set the HUGGINGFACE_API_KEY environment variable.');
  process.exit(1);
}

// Run the test
testHuggingFaceIntegration();