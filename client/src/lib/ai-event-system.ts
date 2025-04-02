import { create } from 'zustand';

// Types for AI actions
export type AIActionType = 'navigate' | 'fill_form' | 'show_guide' | 'trigger_feature' | 'general' | 'start_tour';

export interface AIAction {
  type: AIActionType;
  payload: {
    route?: string;
    formData?: Record<string, any>;
    guideSection?: string;
    feature?: string;
    section?: string;
    focusContent?: string;
    formId?: string;
    autoFocus?: boolean;
    [key: string]: any;
  };
}

export interface AppSuggestion {
  text: string;
  path?: string;
  description?: string;
  action?: AIAction;
}

export interface AIResponse {
  response: string;
  actions?: AIAction[];
  suggestions?: AppSuggestion[];
  category?: string;
  sentiment?: string;
  confidence?: number;
  followUpQuestions?: string[];
  // Legacy field - will be ignored
  suggestedActions?: AppSuggestion[];
}

// State and actions for AI event management
interface AIEventState {
  isProcessing: boolean;
  lastResponse: AIResponse | null;
  pendingActions: AIAction[];
  suggestedActions: AppSuggestion[];
  followUpQuestions: string[];
  currentCategory: string;
  
  // Actions
  setProcessing: (isProcessing: boolean) => void;
  setResponse: (response: AIResponse) => void;
  clearResponse: () => void;
  addPendingAction: (action: AIAction) => void;
  removePendingAction: (index: number) => void;
  executeNextAction: () => AIAction | null;
  clearActions: () => void;
}

// Create the store with Zustand
export const useAIEventStore = create<AIEventState>((set, get) => ({
  isProcessing: false,
  lastResponse: null,
  pendingActions: [],
  suggestedActions: [],
  followUpQuestions: [],
  currentCategory: 'general',
  
  setProcessing: (isProcessing) => set({ isProcessing }),
  
  setResponse: (response) => {
    set({
      lastResponse: response,
      pendingActions: response.actions || [],
      // Map suggestions from backend if available
      suggestedActions: response.suggestions || [],
      followUpQuestions: Array.isArray(response.followUpQuestions) 
        ? response.followUpQuestions 
        : [],
      currentCategory: response.category || 'general',
      isProcessing: false
    });
  },
  
  clearResponse: () => set({
    lastResponse: null,
    pendingActions: [],
    suggestedActions: [],
    followUpQuestions: [],
    isProcessing: false
  }),
  
  addPendingAction: (action) => {
    const pendingActions = [...get().pendingActions, action];
    set({ pendingActions });
  },
  
  removePendingAction: (index) => {
    const pendingActions = [...get().pendingActions];
    pendingActions.splice(index, 1);
    set({ pendingActions });
  },
  
  executeNextAction: () => {
    const { pendingActions } = get();
    if (pendingActions.length === 0) return null;
    
    const nextAction = pendingActions[0];
    const updatedActions = pendingActions.slice(1);
    set({ pendingActions: updatedActions });
    
    return nextAction;
  },
  
  clearActions: () => set({ pendingActions: [] })
}));

// Hook for managing AI contexts
export function useAIContext(pageContext: {
  currentPage: string;
  currentSection?: string;
  availableActions: string[];
}) {
  // Build the context object that will be sent to the AI service
  return {
    currentPage: pageContext.currentPage,
    currentSection: pageContext.currentSection,
    availableActions: pageContext.availableActions,
    userIntent: undefined, // Will be inferred by the AI service
    previousInteractions: [], // Would be populated from conversation history
    userProfile: {
      interests: [],
      skills: [],
      goals: [],
      emotionalState: undefined
    }
  };
}

// Handler functions for different AI action types
export const AIActionHandlers = {
  navigate: (action: AIAction, navigate: (path: string) => void) => {
    if (action.payload.route) {
      navigate(action.payload.route);
      return true;
    }
    return false;
  },
  
  fill_form: (action: AIAction) => {
    if (action.payload.formId && action.payload.formData) {
      // Find the form element
      const formElement = document.getElementById(action.payload.formId) as HTMLFormElement;
      if (!formElement) return false;
      
      // Populate form fields
      Object.entries(action.payload.formData).forEach(([fieldName, value]) => {
        const field = formElement.elements.namedItem(fieldName) as HTMLInputElement;
        if (field) {
          field.value = value as string;
          // Trigger change event to update React state if needed
          const event = new Event('input', { bubbles: true });
          field.dispatchEvent(event);
        }
      });
      
      // Focus the form if requested
      if (action.payload.autoFocus) {
        formElement.focus();
      }
      
      return true;
    }
    return false;
  },
  
  show_guide: (action: AIAction) => {
    // Implementation would depend on how guides are shown in the UI
    if (action.payload.guideSection) {
      // Example: scroll to the guide section
      const element = document.getElementById(action.payload.guideSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
    }
    return false;
  },
  
  trigger_feature: (action: AIAction) => {
    // Implementation would depend on available features
    if (action.payload.feature) {
      // This would need to be customized based on application features
      const eventDetail = { feature: action.payload.feature, ...action.payload };
      const event = new CustomEvent('ai:trigger-feature', { detail: eventDetail });
      document.dispatchEvent(event);
      return true;
    }
    return false;
  },
  
  start_tour: (action: AIAction) => {
    // Start an onboarding tour
    if (action.payload.tourId) {
      const event = new CustomEvent('ai:trigger-tour', {
        detail: { tourId: action.payload.tourId }
      });
      document.dispatchEvent(event);
      return true;
    }
    return false;
  }
};

// Process all pending AI actions
export function processPendingActions(navigate: (path: string) => void) {
  const aiEventStore = useAIEventStore.getState();
  let actionProcessed = false;
  
  while (aiEventStore.pendingActions.length > 0) {
    const action = aiEventStore.executeNextAction();
    if (!action) break;
    
    let handled = false;
    
    switch (action.type) {
      case 'navigate':
        handled = AIActionHandlers.navigate(action, navigate);
        break;
      case 'fill_form':
        handled = AIActionHandlers.fill_form(action);
        break;
      case 'show_guide':
        handled = AIActionHandlers.show_guide(action);
        break;
      case 'trigger_feature':
        handled = AIActionHandlers.trigger_feature(action);
        break;
      case 'start_tour':
        handled = AIActionHandlers.start_tour(action);
        break;
      case 'general':
        // General actions don't require specific handling
        handled = true;
        break;
    }
    
    if (handled) {
      actionProcessed = true;
    }
  }
  
  return actionProcessed;
}