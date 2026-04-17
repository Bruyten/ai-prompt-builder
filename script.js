// ViralShift AI - Short-Form Video Automation Engine
// Pure JavaScript - No frameworks required

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  var form = document.getElementById('productForm');
  var tabs = document.getElementById('tabs');
  var placeholder = document.getElementById('placeholder');
  var contentArea = document.getElementById('contentArea');
  var copyBtn = document.getElementById('copyBtn');
  var templateBtns = document.querySelectorAll('.btn-template');

  // State
  var currentTab = 'concepts';
  var generatedContent = null;

  // Template Data
  var templates = {
    skincare: {
      productName: 'GlowSkin Vitamin C Serum',
      productDescription: 'A powerful 20% Vitamin C serum that brightens skin, reduces dark spots, and provides antioxidant protection. Formulated with hyaluronic acid for deep hydration.',
      targetAudience: 'Women 25-45 concerned about aging, dark spots, and dull skin',
      keyBenefits: 'Brightens skin in 2 weeks, Reduces dark spots, Deep hydration, Natural ingredients, Dermatologist tested',
      painPoints: 'Dull tired skin, Expensive spa treatments, Products that do not work, Complicated routines',
      offerType: '40% off + Free shipping',
      callToAction: 'Get your glow back today',
      productImages: ''
    },
    fitness: {
      productName: 'FlexBand Pro Resistance Set',
      productDescription: 'Complete 5-band resistance training set with door anchor and carrying bag. Perfect for home workouts, travel fitness, and rehabilitation exercises.',
      targetAudience: 'Busy professionals 25-50 who want to workout at home',
      keyBenefits: 'Full body workout anywhere, 5 resistance levels, Compact and portable, Gym-quality results at home, No expensive equipment needed',
      painPoints: 'No time for gym, Expensive memberships, Bulky equipment, Inconsistent workouts',
      offerType: 'Buy 1 Get 1 50% off',
      callToAction: 'Start your home fitness journey',
      productImages: ''
    },
    digital: {
      productName: 'Lightroom Mobile Presets Pack',
      productDescription: '50 professional Lightroom presets optimized for Instagram. Includes warm tones, moody vibes, clean minimal, and vibrant lifestyle collections.',
      targetAudience: 'Content creators and influencers 18-35 wanting cohesive Instagram feeds',
      keyBenefits: 'One-tap editing, Professional results, Works on phone, Cohesive feed aesthetic, Unlimited use',
      painPoints: 'Hours spent editing, Inconsistent photo style, Complicated editing software, Expensive photographers',
      offerType: 'Instant download + Free updates',
      callToAction: 'Transform your feed in seconds',
      productImages: ''
    }
  };

  // Event Listeners
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    generateContent();
  });

  tabs.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab')) {
      currentTab = e.target.dataset.tab;
      updateActiveTabs();
      renderContent();
    }
  });

  templateBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var templateName = btn.dataset.template;
      loadTemplate(templateName);
    });
  });

  copyBtn.addEventListener('click', function() {
    copyCurrentSection();
  });

  // Backend toggle listener
  const backendToggle = document.getElementById('useBackend');
  if (backendToggle) {
    backendToggle.addEventListener('change', function() {
      if (this.checked) {
        updateBackendStatus('connected');
      } else {
        const statusEl = document.getElementById('backendStatus');
        if (statusEl) {
          statusEl.textContent = 'Local Generation Mode';
          statusEl.style.color = '#a5b4fc';
        }
      }
    });
  }

  // Functions
  function loadTemplate(name) {
    var template = templates[name];
    if (!template) return;

    document.getElementById('productName').value = template.productName;
    document.getElementById('productDescription').value = template.productDescription;
    document.getElementById('targetAudience').value = template.targetAudience;
    document.getElementById('keyBenefits').value = template.keyBenefits;
    document.getElementById('painPoints').value = template.painPoints;
    document.getElementById('offerType').value = template.offerType;
    document.getElementById('callToAction').value = template.callToAction;
    document.getElementById('productImages').value = template.productImages;
  }

  function updateActiveTabs() {
    var tabButtons = tabs.querySelectorAll('.tab');
    tabButtons.forEach(function(tab) {
      tab.classList.remove('active');
      if (tab.dataset.tab === currentTab) {
        tab.classList.add('active');
      }
    });
  }

  async function generateContent() {
    var input = {
      productName: document.getElementById('productName').value || 'GlowSkin Vitamin C Serum',
      productDescription: document.getElementById('productDescription').value || 'Powerful serum that brightens and hydrates skin',
      targetAudience: document.getElementById('targetAudience').value,
      keyBenefits: document.getElementById('keyBenefits').value.split(',').map(function(s) { return s.trim(); }).filter(Boolean),
      painPoints: document.getElementById('painPoints').value.split(',').map(function(s) { return s.trim(); }).filter(Boolean),
      offerType: document.getElementById('offerType').value,
      callToAction: document.getElementById('callToAction').value,
      productImages: document.getElementById('productImages').value.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
    };

    const useBackendToggle = document.getElementById('useBackend');
    const isUsingBackend = useBackendToggle && useBackendToggle.checked;

    if (isUsingBackend) {
      try {
        updateBackendStatus('connecting');
        
        const response = await fetch('http://localhost:3001/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input)
        });

        if (!response.ok) throw new Error('Backend not responding');

        const backendResult = await response.json();
        
        if (backendResult.success) {
          generatedContent = {
            input: input,
            concepts: backendResult.data.concepts || generateConcepts(input),
            scripts: backendResult.data.scripts || generateScripts(input),
            visuals: backendResult.data.visuals || generateVisuals(input),
            prompts: backendResult.data.prompts || generateAIPrompts(input),
            editing: backendResult.data.editingPlan || generateEditingPlan(input),
            hooks: backendResult.data.hooks || generateHooks(input),
            captions: backendResult.data.captions || generateCaptions(input),
            funnel: backendResult.data.funnel || generateFunnel(input),
            workflow: backendResult.data.workflowSteps || generateWorkflow(input),
            automationJson: backendResult.data.automationJson
          };
          updateBackendStatus('connected');
        } else {
          throw new Error(backendResult.error || 'Generation failed');
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to local generation:', err.message);
        updateBackendStatus('offline');
        generatedContent = generateLocalContent(input);
      }
    } else {
      generatedContent = generateLocalContent(input);
    }

    // Show content area
    placeholder.style.display = 'none';
    contentArea.style.display = 'block';
    copyBtn.style.display = 'flex';

    renderContent();
  }

  function generateLocalContent(input) {
    return {
      input: input,
      concepts: generateConcepts(input),
      scripts: generateScripts(input),
      visuals: generateVisuals(input),
      prompts: generateAIPrompts(input),
      editing: generateEditingPlan(input),
      hooks: generateHooks(input),
      captions: generateCaptions(input),
      funnel: generateFunnel(input),
      workflow: generateWorkflow(input)
    };
  }

  function updateBackendStatus(state) {
    const statusEl = document.getElementById('backendStatus');
    if (!statusEl) return;
    
    if (state === 'connecting') {
      statusEl.textContent = 'Connecting to backend...';
      statusEl.style.color = '#eab308';
    } else if (state === 'connected') {
      statusEl.textContent = 'Backend Connected ✓';
      statusEl.style.color = '#22c55e';
    } else {
      statusEl.textContent = 'Backend Offline (using local)';
      statusEl.style.color = '#f87171';
    }
  }

  function generateConcepts(input) {
    return [
      {
        title: 'The Problem-Solution Story',
        angle: 'Emotional pain point to transformation',
        description: 'Opens with the frustration of ' + input.painPoints[0] + ', shows the struggle, then reveals ' + input.productName + ' as the solution with real results.'
      },
      {
        title: 'The "I Wish I Knew" Format',
        angle: 'Secret discovery / insider knowledge',
        description: 'Position ' + input.productName + ' as the thing nobody talks about. Create FOMO and exclusivity around the benefits.'
      },
      {
        title: 'Before/After Transformation',
        angle: 'Visual proof of results',
        description: 'Show the stark contrast between life before and after ' + input.productName + '. Focus on the emotional and practical transformation.'
      }
    ];
  }

  function generateScripts(input) {
    var benefit1 = input.keyBenefits[0] || 'amazing results';
    var benefit2 = input.keyBenefits[1] || 'incredible benefits';
    var pain1 = input.painPoints[0] || 'this problem';
    var pain2 = input.painPoints[1] || 'struggling';

    return [
      {
        title: 'Video 1: Problem-Solution',
        scenes: [
          {
            name: 'Hook',
            timing: '0-3s',
            script: 'Stop scrolling if you are tired of ' + pain1 + '...'
          },
          {
            name: 'Problem + Value',
            timing: '3-15s',
            script: 'I spent months dealing with ' + pain1 + ' and ' + pain2 + '. Nothing worked. Then I found ' + input.productName + '. Within days I noticed ' + benefit1 + '. The secret? ' + input.productDescription.split('.')[0] + '.'
          },
          {
            name: 'Solution + CTA',
            timing: '15-20s',
            script: 'Now I get ' + benefit2 + ' without the hassle. ' + input.offerType + ' right now. ' + input.callToAction + ' - link in bio. Drop a comment if you have tried this!'
          }
        ]
      },
      {
        title: 'Video 2: Secret Discovery',
        scenes: [
          {
            name: 'Hook',
            timing: '0-3s',
            script: 'Nobody is talking about this for ' + pain1 + '...'
          },
          {
            name: 'Problem + Value',
            timing: '3-15s',
            script: 'While everyone wastes money on stuff that does not work, ' + input.productName + ' quietly delivers ' + benefit1 + '. I was skeptical too, but look at these results. ' + benefit2 + ' is just the beginning.'
          },
          {
            name: 'Solution + CTA',
            timing: '15-20s',
            script: 'This is your sign to try it. ' + input.offerType + ' - but it will not last. ' + input.callToAction + '. Follow for more tips like this!'
          }
        ]
      },
      {
        title: 'Video 3: Transformation',
        scenes: [
          {
            name: 'Hook',
            timing: '0-3s',
            script: 'POV: You finally found the solution to ' + pain1 + '...'
          },
          {
            name: 'Problem + Value',
            timing: '3-15s',
            script: 'Before ' + input.productName + ': constant ' + pain1 + ', wasted money, frustration. After: ' + benefit1 + ', ' + benefit2 + ', confidence. The transformation is real and it only takes minutes.'
          },
          {
            name: 'Solution + CTA',
            timing: '15-20s',
            script: 'Your future self will thank you. Get ' + input.offerType + ' today. ' + input.callToAction + ' - link in bio. Save this for later!'
          }
        ]
      }
    ];
  }

  function generateVisuals(input) {
    return [
      {
        scene: 'Scene 1: Hook (0-3s)',
        instructions: [
          'Quick zoom into frustrated face or problem visual',
          'Text overlay with hook appearing word by word',
          'High contrast, attention-grabbing colors',
          'Movement: zoom, shake, or glitch effect'
        ]
      },
      {
        scene: 'Scene 2: Problem + Value (3-15s)',
        instructions: [
          'Split screen or transition from problem to solution',
          'Show ' + input.productName + ' product clearly',
          'B-roll of using the product',
          'Text overlays highlighting key benefits',
          'Warm, aspirational lighting for transformation'
        ]
      },
      {
        scene: 'Scene 3: CTA (15-20s)',
        instructions: [
          'Product hero shot with offer text',
          'Pointing gesture or arrow to link',
          'Urgency elements (limited time banner)',
          'End screen with logo and CTA'
        ]
      }
    ];
  }

  function generateAIPrompts(input) {
    var prompts = [];
    var styles = ['cinematic', 'bright and modern', 'warm and inviting'];
    var scenes = ['frustrated person looking at camera, dramatic lighting', 'hands holding ' + input.productName + ', product showcase, clean background', 'happy satisfied customer, transformation complete, bright lighting'];

    for (var v = 1; v <= 3; v++) {
      for (var s = 0; s < 3; s++) {
        prompts.push({
          video: v,
          scene: s + 1,
          prompt: scenes[s] + ', ' + styles[s] + ' style, social media vertical video, 9:16 aspect ratio, high quality, trending on TikTok, ' + input.targetAudience.split(' ')[0] + ' demographic'
        });
      }
    }
    return prompts;
  }

  function generateEditingPlan(input) {
    return {
      software: 'CapCut (Mobile or Desktop)',
      steps: [
        {
          name: 'Import & Arrange',
          details: 'Import all 3 scene clips. Arrange in timeline: Scene 1 (3s), Scene 2 (12s), Scene 3 (5s). Total: 20 seconds.'
        },
        {
          name: 'Text & Captions',
          details: 'Add auto-captions. Style: Bold, white with black outline. Position: Center-bottom. Animation: Pop-in word by word.'
        },
        {
          name: 'Transitions',
          details: 'Scene 1 to 2: Quick zoom transition. Scene 2 to 3: Smooth fade or swipe. Keep transitions under 0.3s.'
        },
        {
          name: 'Effects',
          details: 'Hook: Add slight shake or glitch. Value section: Subtle zoom on product. CTA: Add urgency pulse effect on offer text.'
        },
        {
          name: 'Audio',
          details: 'Add trending audio or voiceover. Music: Upbeat, trending sound. Volume: Music at 20%, voice at 100%.'
        },
        {
          name: 'Color & Polish',
          details: 'Apply consistent color grade. Increase contrast slightly. Add subtle vignette. Ensure 9:16 aspect ratio.'
        }
      ]
    };
  }

  function generateHooks(input) {
    var pain = input.painPoints[0] || 'this problem';
    var benefit = input.keyBenefits[0] || 'results';

    return [
      'Stop scrolling if you struggle with ' + pain + '...',
      'I wish someone told me this about ' + pain + ' sooner...',
      'POV: You finally found the solution to ' + pain,
      'This is the only thing that worked for my ' + pain,
      'Nobody is talking about this for ' + pain + '...',
      'Wait until you see what ' + benefit + ' looks like...',
      'I was today years old when I discovered this...',
      'The ' + pain + ' hack that actually works...',
      'If you are still dealing with ' + pain + ', watch this',
      'This changed everything about how I handle ' + pain
    ];
  }

  function generateCaptions(input) {
    return [
      {
        caption: 'Finally found something that actually works for ' + (input.painPoints[0] || 'this') + '... ' + input.offerType + ' right now!',
        cta: input.callToAction + ' (link in bio)',
        hashtags: '#' + input.productName.replace(/\s+/g, '') + ' #viral #fyp #transformation'
      },
      {
        caption: 'POV: You stopped wasting money on things that do not work. ' + input.productName + ' hits different.',
        cta: 'Tap the link to try it yourself!',
        hashtags: '#gamechanger #musthave #tiktokmademebuyit #fyp'
      },
      {
        caption: 'I was skeptical too... then I tried ' + input.productName + '. Now I tell everyone about it.',
        cta: input.offerType + ' - ' + input.callToAction,
        hashtags: '#honest review #results #beforeandafter #viral'
      }
    ];
  }

  function generateFunnel(input) {
    return [
      {
        stage: 'Awareness (TikTok/Reels)',
        icon: '1',
        content: 'Hook viewers with problem-focused content. Use trending sounds. Post 2-3 videos daily. Target: ' + input.targetAudience
      },
      {
        stage: 'Interest (Bio Link)',
        icon: '2',
        content: 'Linktree or direct product page. Clear value proposition. Show offer: ' + input.offerType + '. Social proof and reviews visible.'
      },
      {
        stage: 'Desire (Landing Page)',
        icon: '3',
        content: 'Detailed benefits of ' + input.productName + '. Before/after testimonials. FAQ section. Risk reversal (guarantee).'
      },
      {
        stage: 'Action (Checkout)',
        icon: '4',
        content: 'Simple checkout process. Upsell complementary products. Order bump opportunity. ' + input.callToAction
      },
      {
        stage: 'Retention (Follow-up)',
        icon: '5',
        content: 'Email sequence with tips. Request UGC/reviews. Referral program. Retarget non-buyers with new content.'
      }
    ];
  }

  function generateWorkflow(input) {
    return [
      {
        title: 'Input Source',
        content: 'Set up Google Sheet with columns: product_name, description, audience, benefits, pain_points, offer, cta, images. Each row = one product to generate content for.'
      },
      {
        title: 'Trigger Setup',
        content: 'In n8n: Add Google Sheets trigger node. Set to watch for new rows. Alternative: Manual trigger for batch processing.'
      },
      {
        title: 'Data Formatting',
        content: 'Add Set node to map fields: product_name, description, audience, benefits (split by comma), pain_points (split by comma), offer, cta, images.'
      },
      {
        title: 'AI Processing',
        content: 'Add HTTP Request node to LLM API (OpenAI/Claude). Send master prompt with injected variables. Parse response for scripts, prompts, captions.'
      },
      {
        title: 'JSON Parsing',
        content: 'Add JSON Parse node. Extract: video_concepts[], scripts[], ai_prompts[], captions[], editing_plan. Store in workflow variables.'
      },
      {
        title: 'Video Generation Loop',
        content: 'Add Loop node for each ai_prompt. Send to Runway/Pika API. Generate 3-5 second clips. Wait for completion. Download generated videos.'
      },
      {
        title: 'File Storage',
        content: 'Create folder structure: /[product_name]/video_1/, video_2/, video_3/. Save scene clips as scene1.mp4, scene2.mp4, scene3.mp4. Save scripts as script.txt.'
      },
      {
        title: 'Assembly Stage',
        content: 'Option A: Manual - Export to CapCut. Option B: Automated - Use Creatomate API to combine clips, add captions, apply effects.'
      },
      {
        title: 'Output Delivery',
        content: 'Final deliverables: 3 edited videos (MP4), captions.txt with hashtags, thumbnail images. Upload to Google Drive or send via webhook.'
      },
      {
        title: 'Scaling System',
        content: 'Run workflow on schedule (daily). Process multiple products in batch. Track performance metrics. A/B test different hooks. Scale winning content formats.'
      }
    ];
  }

  function renderContent() {
    if (!generatedContent) return;

    var html = '';

    switch (currentTab) {
      case 'concepts':
        html = renderConcepts();
        break;
      case 'scripts':
        html = renderScripts();
        break;
      case 'visuals':
        html = renderVisuals();
        break;
      case 'prompts':
        html = renderPrompts();
        break;
      case 'editing':
        html = renderEditing();
        break;
      case 'hooks':
        html = renderHooks();
        break;
      case 'captions':
        html = renderCaptions();
        break;
      case 'funnel':
        html = renderFunnel();
        break;
      case 'json':
        html = renderJSON();
        break;
      case 'workflow':
        html = renderWorkflow();
        break;
    }

    contentArea.innerHTML = html;
  }

  function renderConcepts() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#128161;</span> Video Concepts (3 Variations)</h3>';

    generatedContent.concepts.forEach(function(concept, i) {
      html += '<div class="concept-card">';
      html += '<div class="concept-header">';
      html += '<span class="concept-number">' + (i + 1) + '</span>';
      html += '<span class="concept-title">' + concept.title + '</span>';
      html += '</div>';
      html += '<p class="concept-angle"><strong>Angle:</strong> ' + concept.angle + '</p>';
      html += '<p class="concept-description">' + concept.description + '</p>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderScripts() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#128221;</span> Full Scripts (Scene-Based)</h3>';

    generatedContent.scripts.forEach(function(video, i) {
      html += '<div class="concept-card">';
      html += '<div class="concept-header">';
      html += '<span class="concept-number">' + (i + 1) + '</span>';
      html += '<span class="concept-title">' + video.title + '</span>';
      html += '</div>';

      video.scenes.forEach(function(scene) {
        html += '<div class="scene-card">';
        html += '<div class="scene-header">';
        html += '<span class="scene-label">' + scene.name + '</span>';
        html += '<span class="scene-timing">' + scene.timing + '</span>';
        html += '</div>';
        html += '<p class="scene-content">' + scene.script + '</p>';
        html += '</div>';
      });

      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderVisuals() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#127916;</span> Visual Build Plan</h3>';

    generatedContent.visuals.forEach(function(visual) {
      html += '<div class="concept-card">';
      html += '<h4 style="color: var(--accent-fuchsia); margin-bottom: 0.75rem;">' + visual.scene + '</h4>';

      visual.instructions.forEach(function(instruction) {
        html += '<div class="instruction-block">';
        html += '<p class="instruction-text">' + instruction + '</p>';
        html += '</div>';
      });

      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderPrompts() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#129302;</span> AI Video Generation Prompts</h3>';
    html += '<p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.85rem;">Copy these prompts into Runway, Pika, or similar AI video generators.</p>';

    generatedContent.prompts.forEach(function(prompt) {
      html += '<div class="scene-card">';
      html += '<div class="scene-header">';
      html += '<span class="scene-label">Video ' + prompt.video + ' - Scene ' + prompt.scene + '</span>';
      html += '</div>';
      html += '<p class="scene-content" style="font-family: monospace; font-size: 0.8rem;">' + prompt.prompt + '</p>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderEditing() {
    var plan = generatedContent.editing;
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#9986;</span> Editing Plan (' + plan.software + ')</h3>';

    plan.steps.forEach(function(step, i) {
      html += '<div class="concept-card">';
      html += '<div class="concept-header">';
      html += '<span class="concept-number">' + (i + 1) + '</span>';
      html += '<span class="concept-title">' + step.name + '</span>';
      html += '</div>';
      html += '<p class="concept-description">' + step.details + '</p>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderHooks() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#127907;</span> Hook Variations (10)</h3>';

    generatedContent.hooks.forEach(function(hook, i) {
      html += '<div class="hook-item">';
      html += '<span class="hook-number">' + (i + 1) + '</span>';
      html += '<span class="hook-text">' + hook + '</span>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderCaptions() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#128172;</span> Captions + CTAs</h3>';

    generatedContent.captions.forEach(function(cap, i) {
      html += '<div class="caption-card">';
      html += '<p class="caption-text">' + cap.caption + '</p>';
      html += '<p class="caption-cta">' + cap.cta + '</p>';
      html += '<p style="color: var(--text-muted); font-size: 0.75rem; margin-top: 0.5rem;">' + cap.hashtags + '</p>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderFunnel() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#128200;</span> Funnel Strategy</h3>';

    generatedContent.funnel.forEach(function(stage) {
      html += '<div class="funnel-stage">';
      html += '<div class="funnel-header">';
      html += '<span class="funnel-icon">' + stage.icon + '</span>';
      html += '<span class="funnel-title">' + stage.stage + '</span>';
      html += '</div>';
      html += '<p class="funnel-content">' + stage.content + '</p>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function renderJSON() {
    var jsonOutput = {
      product: generatedContent.input,
      video_concepts: generatedContent.concepts,
      scripts: generatedContent.scripts,
      ai_video_prompts: generatedContent.prompts,
      captions: generatedContent.captions,
      hooks: generatedContent.hooks,
      funnel_strategy: generatedContent.funnel,
      editing_plan: generatedContent.editing,
      workflow_steps: generatedContent.workflow
    };

    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#128190;</span> Automation JSON Output</h3>';
    html += '<p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.85rem;">Copy this JSON for n8n, Zapier, or custom integrations.</p>';
    html += '<pre class="json-output">' + JSON.stringify(jsonOutput, null, 2) + '</pre>';
    html += '</div>';
    return html;
  }

  function renderWorkflow() {
    var html = '<div class="content-section">';
    html += '<h3 class="section-title"><span class="icon">&#9881;</span> n8n Workflow Execution Plan</h3>';
    html += '<p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.85rem;">Step-by-step automation workflow for scaling content production.</p>';

    generatedContent.workflow.forEach(function(step, i) {
      html += '<div class="workflow-step">';
      html += '<div class="step-header">';
      html += '<span class="step-number">' + (i + 1) + '</span>';
      html += '<span class="step-title">' + step.title + '</span>';
      html += '</div>';
      html += '<p class="step-content">' + step.content + '</p>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function copyCurrentSection() {
    var textToCopy = '';

    if (currentTab === 'json') {
      var jsonOutput = {
        product: generatedContent.input,
        video_concepts: generatedContent.concepts,
        scripts: generatedContent.scripts,
        ai_video_prompts: generatedContent.prompts,
        captions: generatedContent.captions,
        hooks: generatedContent.hooks,
        funnel_strategy: generatedContent.funnel,
        editing_plan: generatedContent.editing,
        workflow_steps: generatedContent.workflow
      };
      textToCopy = JSON.stringify(jsonOutput, null, 2);
    } else {
      textToCopy = contentArea.innerText;
    }

    navigator.clipboard.writeText(textToCopy).then(function() {
      copyBtn.innerHTML = '<span>&#10003;</span> Copied!';
      copyBtn.classList.add('copied');

      setTimeout(function() {
        copyBtn.innerHTML = '<span>&#128203;</span> Copy Section';
        copyBtn.classList.remove('copied');
      }, 2000);
    });
  }
});
