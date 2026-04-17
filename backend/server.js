const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function generateId() {
  return 'vs-' + Math.random().toString(36).substring(2, 9);
}

// Advanced content generation engine
function generateAutomationContent(input) {
  const {
    productName = 'Product',
    productDescription = '',
    targetAudience = '',
    keyBenefits = '',
    painPoints = '',
    offerType = '',
    callToAction = ''
  } = input;

  const benefitsList = keyBenefits.split(',').map(b => b.trim()).filter(Boolean);
  const painsList = painPoints.split(',').map(p => p.trim()).filter(Boolean);
  const audience = targetAudience || 'busy professionals';

  // Scene 1-3 scripts for 3 concepts
  const concepts = [
    {
      id: 1,
      title: "Pain Pattern Interrupt",
      hook: `Stop wasting money on products that don't work.`,
      script1: `Tired of ${painsList[0] || 'bad skin'}?`,
      script2: `You've tried everything. Nothing works. Your ${audience.split(' ')[0]} friends are glowing... but you're still stuck.`,
      script3: `This changes everything. ${productName} delivers real results in just 14 days.`
    },
    {
      id: 2,
      title: "Transformation Story",
      hook: `From dull to radiant in 2 weeks`,
      script1: `I used to hide my face in photos...`,
      script2: `Then I found ${productName}. The difference is insane.`,
      script3: `No filters. Just real results.`
    },
    {
      id: 3,
      title: "Secret Hack",
      hook: `The one trick dermatologists don't want you to know`,
      script1: `This ingredient combination is blowing up on TikTok`,
      script2: `${productName} combines ${benefitsList[0] || 'powerful antioxidants'} with ${benefitsList[1] || 'hydration technology'}`,
      script3: `The results speak for themselves.`
    }
  ];

  const fullScripts = concepts.map((concept, index) => ({
    concept: concept.title,
    scene1: {
      time: "0-3s",
      text: concept.hook || `Wait... this actually works?`,
      voiceover: `Hey. Stop scrolling. What if I told you ${productName} could completely change how you look in just 14 days?`
    },
    scene2: {
      time: "3-15s",
      text: `The ${painsList[0] || 'struggle'} is real`,
      voiceover: `You've spent hundreds on creams that do nothing. Your skin looks tired. You're losing confidence. But it doesn't have to be this way.`
    },
    scene3: {
      time: "15-20s",
      text: `Get it before it's gone`,
      voiceover: `${callToAction || 'Tap the link'}. ${offerType ? offerType + '.' : ''} First 100 people get a special bonus.`
    }
  }));

  const aiPrompts = [
    {
      scene: "Hook",
      prompt: `Cinematic close-up of frustrated person looking in mirror, dramatic lighting, text overlay "${concepts[0].hook}", hyper realistic, 9:16 aspect ratio, trending on tiktok`
    },
    {
      scene: "Problem",
      prompt: `Split screen before and after ${productName} transformation. Sad face on left, glowing confident face on right. Smooth transition. Text: "Tired of ${painsList[0] || 'bad results'}?"`
    },
    {
      scene: "Solution",
      prompt: `Product shot of ${productName} with beautiful bokeh background, sparkling particles, luxury feel, text "${callToAction || 'Shop Now'}", 9:16 vertical video`
    }
  ];

  const hooks = [
    `Stop scrolling if you have ${painsList[0] || 'skin issues'}...`,
    `The ${productName} hack doctors don't want you to know`,
    `This ${audience} secret changed my life`,
    `I wish I knew about ${productName} sooner`,
    `POV: Your skin after using ${productName} for 14 days`,
    `Never buy skincare again after this`,
    `This changed my skin in 2 weeks (not clickbait)`,
    `The only product that actually works`,
    `If you have ${painsList[0]}, watch this`,
    `They don't want you to see this transformation`
  ];

  const editingPlan = `1. Import 3 clips into CapCut\n2. Add zoom effects on scene 1 (0-3s)\n3. Overlay big bold text with stroke on each scene\n4. Use trending TikTok sound: "Original Audio - Viral Shift"\n5. Add subtitle animations with pop-in effect\n6. End with strong CTA button overlay\n7. Export at 1080x1920`;

  const automationJson = {
    product: productName,
    generatedAt: new Date().toISOString(),
    videos: [
      {
        concept: "Pain Pattern Interrupt",
        duration: "20",
        script: fullScripts[0],
        prompts: aiPrompts,
        caption: `Tired of ${painsList[0]}? ${productName} delivers REAL results. ${callToAction} 👇`,
        cta: callToAction,
        hooks: hooks.slice(0, 4)
      },
      {
        concept: "Transformation Story",
        duration: "20",
        script: fullScripts[1],
        prompts: aiPrompts,
        caption: `Before vs After using ${productName} for 14 days 😱 ${callToAction}`,
        cta: callToAction,
        hooks: hooks.slice(3, 7)
      }
    ],
    workflow: {
      n8n_nodes: 12,
      trigger: "Google Sheets - New Row",
      llm: "Claude 3.5 Sonnet or GPT-4o",
      video_generator: "Runway Gen-3 or Pika 1.5",
      storage: "Google Drive",
      editor: "CapCut Auto API or Descript"
    },
    totalEstimatedTime: "47 minutes per video"
  };

  return {
    concepts: concepts,
    scripts: fullScripts,
    visuals: [
      "Scene 1: Extreme close-up of skin concern + pattern interrupt text",
      "Scene 2: Split screen transformation with pain points listed",
      "Scene 3: Clean product shot + strong CTA with urgency"
    ],
    prompts: aiPrompts,
    editingPlan: editingPlan,
    hooks: hooks,
    captions: [
      `The ${productName} before & after that has everyone talking 👀 ${callToAction}`,
      `This is what ${benefitsList[0] || 'real results'} actually looks like...`,
      `Stop wasting money. Start using THIS instead.`
    ],
    funnel: {
      platform: "TikTok",
      ctaLink: "https://yourlink.com/offer",
      retargeting: "Instagram & YouTube ads to warm audience",
      emailSequence: "3 emails: Problem → Agitation → Solution"
    },
    automationJson: automationJson,
    workflowSteps: [
      "1. New row in Google Sheets triggers webhook",
      "2. Format all fields into structured variables",
      "3. Send complete prompt to LLM (Claude/GPT)",
      "4. Parse JSON response with scripts, prompts, captions",
      "5. Loop through scenes and call RunwayML / Pika Labs API",
      "6. Save generated MP4s to Google Drive folder",
      "7. Trigger automated CapCut template with clips + captions",
      "8. Generate final video + write caption file",
      "9. Post to TikTok via API or notify user",
      "10. Log everything and move to next row"
    ]
  };
}

// API Routes
app.post('/api/generate', (req, res) => {
  try {
    const input = req.body;
    const result = generateAutomationContent(input);
    res.json({
      success: true,
      data: result,
      message: "Automation package generated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', backend: 'ViralShift Automation Engine', version: '2.0' });
});

app.listen(PORT, () => {
  console.log(`🚀 ViralShift Backend running on http://localhost:${PORT}`);
  console.log(`POST to /api/generate with your product data`);
});

module.exports = app;
