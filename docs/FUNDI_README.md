# Fundi AI Assistant - Goals and Current State

This document outlines the vision, goals, and current implementation status of Fundi, the integrated AI assistant for the Fundamenta application.

## Vision

Fundi aims to be an orchestrative, knowledgeable, and supportive assistant for the user. The goal is for Fundi to feel intuitive, understand user needs proactively, and seamlessly integrate the user into all parts of the application without the experience feeling overwhelming or pushy. Fundi should adapt to the user's personality and preferences over time.

## Core Goals & Desired Capabilities

1.  **Deep Application Orchestration:**
    *   Navigate the user seamlessly to any relevant section, page, or feature within the application.
    *   Trigger specific application actions beyond simple navigation (e.g., initiating a process, displaying specific data visualizations).
2.  **Intelligent Form Assistance:**
    *   Proactively offer to populate forms based on context or user request.
    *   Extract necessary information from conversation history or user input.
    *   Fill forms accurately and efficiently.
3.  **Nuanced and Adaptive Personality:**
    *   Maintain a comforting, supportive, and encouraging tone.
    *   Adapt its communication style (formality, vocabulary, tone) based on learned user preferences and interaction history.
    *   Recognize user sentiment and respond appropriately.
4.  **Contextual Awareness & Proactivity:**
    *   Understand the user's current context within the application (page, section, task, goals).
    *   Proactively offer relevant suggestions, guidance, or next steps based on context and user goals.
    *   Anticipate user needs without being intrusive.
5.  **Seamless Integration:**
    *   Act as a central, consistent point of interaction for AI features across all modules.
    *   Provide a smooth user experience when transitioning between chat interaction and application features.

## Current Implementation & Limitations (As of [Current Date/Version])

While the foundation exists, the current implementation has limitations compared to the full vision:

*   **Navigation/Actions:**
    *   Basic navigation exists, primarily through custom client-side events (`ai:open-section`).
    *   Lacks a standardized, extensible action schema and robust client-side handler for diverse actions (beyond section navigation).
*   **Form Population:**
    *   Mentioned as a capability in system prompts, and backend tools (`extractStructuredData`) exist.
    *   Client-side logic to receive and apply form data from AI actions is likely missing or incomplete.
*   **Personality Adaptation:**
    *   Relies on basic heuristics (`getPreferredStyle`, `getInterests` in `ai.ts`) and static, category-based system prompts.
    *   Lacks deep user modeling, storage of preferences, and dynamic prompt generation needed for true nuance and adaptation.
*   **Context Awareness:**
    *   Context sent to the AI is currently limited (e.g., `currentPage`, `category`).
    *   Needs richer context (application state, user goals) for deeper understanding and better suggestions.
*   **Proactivity:**
    *   Fundi currently appears to be primarily reactive to user input.
    *   Lacks mechanisms for proactive assistance based on user behavior or goals.
*   **Orchestration (`ai-service.ts`):**
    *   The core orchestration logic needs review and enhancement to make more intelligent, goal-aware decisions about using available tools (OpenAI, HuggingFace, internal data, external APIs).
*   **Model Integration (HuggingFace):**
    *   While available, the specific role and effectiveness of Hugging Face models in the current workflow require further investigation/enhancement.

## Next Steps / Areas for Improvement

*   Implement standardized action schema and client-side handler.
*   Enhance context gathering from the client.
*   Develop user modeling (database persistence for preferences/goals).
*   Implement dynamic, personalized system prompt generation.
*   Refine orchestration logic in `ai-service.ts`.
*   Build client-side form-filling capabilities triggered by AI.
*   Investigate and implement proactive assistance mechanisms.
*   Ensure consistent visual representation of Fundi. 