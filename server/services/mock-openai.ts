export class MockOpenAI {
  constructor(config: any) {}

  chat = {
    completions: {
      create: async () => ({
        choices: [{
          message: {
            content: "This is a development environment. Please provide your API keys for full functionality."
          }
        }]
      })
    }
  };
} 