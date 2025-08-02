// Make.com Scoring Logic
// Add this as a JavaScript module in your Make.com scenario

function scoreMedicareJourney(journeyResponse) {
  const scoring = {
    "Ready to get this handled and feel confident about my choice": {
      score: 70,
      category: "warm_lead",
      priority: "high",
      followUpDays: 1,
      tags: ["ready_to_decide", "confident", "high_intent"]
    },
    
    "Comparing plans and weighing my options": {
      score: 40,
      category: "nurture_lead", 
      priority: "medium",
      followUpDays: 3,
      tags: ["comparing_plans", "research_phase", "medium_intent"]
    },
    
    "Just starting to look into it": {
      score: 15,
      category: "cold_lead",
      priority: "low",
      followUpDays: 7,
      tags: ["beginner", "early_stage", "educational_content"]
    },
    
    "I already have someone helping me—just curious": {
      score: 1,
      category: "cold_lead",
      priority: "very_low",
      followUpDays: 14,
      tags: ["has_advisor", "just_curious", "low_conversion"]
    },
    
    "I've got a quick question": {
      score: 5,
      category: "cold_lead",
      priority: "low", 
      followUpDays: 5,
      tags: ["has_question", "consultation_needed", "quick_help"]
    },
    
    "Not Really Sure": {
      score: 3,
      category: "cold_lead",
      priority: "very_low",
      followUpDays: 10,
      tags: ["unclear_intent", "qualification_needed", "discovery_call"]
    }
  };

  const result = scoring[journeyResponse] || {
    score: 1,
    category: "unscored_lead",
    priority: "very_low",
    followUpDays: 14,
    tags: ["unscored", "manual_review"]
  };

  return {
    ...result,
    journeyResponse: journeyResponse,
    scoredAt: new Date().toISOString()
  };
}

// Export the scored data - Use this in Make.com
// Replace {{medicareJourney}} with the actual webhook field
const leadScore = scoreMedicareJourney(medicareJourney);
console.log("Lead Score:", leadScore);

// Return the scored lead data
return leadScore;
