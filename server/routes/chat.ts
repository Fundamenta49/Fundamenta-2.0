import { Router } from "express";
import { orchestrateAIResponse } from "../ai";

const router = Router();

router.post("/orchestrator", async (req, res) => {
  try {
    const { message, context = "/", previousMessages = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await orchestrateAIResponse(message, {
      currentPage: context.currentPage || "home",
      currentSection: context.currentSection || "general",
      availableActions: context.availableActions || []
    }, previousMessages);

    res.json({ 
      success: true,
      ...response
    });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to process chat message",
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
});

export default router;