import { useMemo, useState } from "react";

type ProductInput = {
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits: string[];
  painPoints: string[];
  offerType: string;
  cta: string;
  productImages: string;
  optionalClips: string;
};

type Scene = {
  timestamp: string;
  visual: string;
  script: string;
  onScreenText: string;
  audio: string;
};

type VideoConcept = {
  id: number;
  title: string;
  angle: string;
  hook: string;
  scenes: Scene[];
};

type GeneratedOutput = {
  concepts: VideoConcept[];
  hooks: string[];
  captions: { primary: string; alt1: string; alt2: string };
  visualPlan: VisualPlanItem[];
  aiPrompts: AIPromptItem[];
  editingPlan: EditingPlan;
  funnel: FunnelStrategy;
  automationJson: AutomationJSON;
  workflow: Workflow;
};

type VisualPlanItem = {
  concept: string;
  scenes: { time: string; shot: string; text: string; broll: string }[];
};

type AIPromptItem = {
  concept: number;
  scene: number;
  prompt: string;
};

type EditingPlan = {
  app: string;
  timeline: string;
  cuts: string[];
  captions: { style: string; animation: string; position: string };
  effects: string[];
  audio: string;
  export: string;
};

type FunnelStrategy = {
  tiktok: string;
  landing: string;
  email: string;
  retargeting: string;
};

type AutomationJSON = {
  version: string;
  product: {
    name: string;
    description: string;
    audience: string;
    benefits: string[];
    pains: string[];
    offer: string;
    cta: string;
  };
  output: {
    concepts: {
      id: number;
      title: string;
      angle: string;
      hook: string;
      script_full: string;
      scenes: Scene[];
    }[];
    hooks: string[];
    captions: { primary: string; alt1: string; alt2: string };
    ai_video_prompts: AIPromptItem[];
    editing: EditingPlan;
  };
  metadata: {
    generated_at: string;
    format: string;
    duration_target: string;
  };
};

type WorkflowNode = {
  step: number;
  name: string;
  action: string;
};

type Workflow = {
  trigger: string;
  nodes: WorkflowNode[];
};

const EXAMPLES: Record<string, ProductInput> = {
  skincare: {
    productName: "GlowBeam LED Mask",
    productDescription: "At-home red light therapy mask that reduces wrinkles and acne in 10 minutes a day. FDA-cleared, dermatologist recommended.",
    targetAudience: "Women 28-45 who spend on skincare but hate expensive spa treatments",
    keyBenefits: ["Visible glow in 7 days", "Reduces fine lines", "Clears hormonal acne", "10 min/day at home"],
    painPoints: ["Wasting $200+/month on serums that don't work", "No time for spa appointments", "Filter-dependent selfies", "Harsh chemicals irritating skin"],
    offerType: "30-day risk-free trial + free shipping",
    cta: "Tap Shop Now",
    productImages: "Product on vanity, before/after skin, woman wearing mask",
    optionalClips: "Time-lapse of 7 days, dermatologist clip"
  },
  fitness: {
    productName: "HydraFuel",
    productDescription: "Zero-sugar electrolyte powder that hydrates 3x faster than water. Designed for busy professionals and gym goers.",
    targetAudience: "Men and women 25-40, into fitness, always tired, drink coffee all day",
    keyBenefits: ["3x faster hydration", "No crash, no sugar", "Mental clarity", "Tastes amazing"],
    painPoints: ["3pm energy crash", "Brain fog in meetings", "Water doesn't cut it", "Sugary sports drinks"],
    offerType: "Buy 1 Get 1 Free - Today Only",
    cta: "Get Yours",
    productImages: "Stick pack, mixing in water, gym bottle",
    optionalClips: "Gym sweat clip, office desk"
  },
  digital: {
    productName: "Notion Creator OS",
    productDescription: "Pre-built Notion system to plan, write, and schedule 30 days of TikTok content in 2 hours. For creators who want to post daily.",
    targetAudience: "Faceless creators, UGC creators, side hustlers trying to grow on TikTok",
    keyBenefits: ["30 days planned in 2 hours", "Never run out of ideas", "Viral hook database included", "Auto-scheduling templates"],
    painPoints: ["Staring at blank page", "Inconsistent posting", "No time to batch content", "Algorithm hates them"],
    offerType: "$27 one-time (normally $97)",
    cta: "Download Instantly",
    productImages: "Dashboard screenshot, phone mockup",
    optionalClips: "Screen recording"
  }
};

function generateOutput(input: ProductInput): GeneratedOutput {
  const { productName, productDescription, targetAudience, keyBenefits, painPoints, offerType, cta } = input;
  
  const audienceCallout = targetAudience.split(" ")[0] || "You";
  const mainPain = painPoints[0] || "wasting time and money";
  const mainBenefit = keyBenefits[0] || "results fast";
  const secondaryBenefit = keyBenefits[1] || keyBenefits[0] || "it just works";
  const thirdBenefit = keyBenefits[2] || "so easy";
  const isWomen = targetAudience.toLowerCase().includes("women");
  const productShort = productName.split(" ")[0] || productName;
  
  // CONCEPT 1: The Pain Flip
  const concept1: VideoConcept = {
    id: 1,
    title: "The Pain Flip",
    angle: "Call out the exact pain, flip to solution",
    hook: "POV: you're " + mainPain.toLowerCase(),
    scenes: [
      {
        timestamp: "0-3s",
        visual: "Close-up, frustrated face, messy bathroom counter with products",
        script: "If you're " + mainPain.toLowerCase() + ", stop scrolling.",
        onScreenText: "STOP DOING THIS",
        audio: "Trending 'oh no' audio or original voice, urgent tone"
      },
      {
        timestamp: "3-15s",
        visual: "Quick cuts: wasted money, tired face, then product reveal",
        script: "I was spending hundreds on " + productShort.toLowerCase() + " stuff that didn't work. Found this - " + productDescription.split(".")[0].toLowerCase() + ". " + (isWomen ? "My friend" : "My buddy") + " made me try it. " + secondaryBenefit + " in like a week.",
        onScreenText: mainBenefit.toUpperCase() + " / " + secondaryBenefit.toUpperCase(),
        audio: "Voiceover, conversational, then product demo sounds"
      },
      {
        timestamp: "15-20s",
        visual: "Product in hand, smiling, showing results",
        script: "It's literally " + thirdBenefit.toLowerCase() + ". " + offerType + ". " + cta + " before it's gone. Comment '" + productShort.toUpperCase() + "' and I'll send link.",
        onScreenText: offerType + " [link below]",
        audio: "Upbeat outro, clear CTA"
      }
    ]
  };

  // CONCEPT 2: The Secret Reveal
  const concept2: VideoConcept = {
    id: 2,
    title: "The Secret Reveal",
    angle: "What they don't want you to know",
    hook: "They don't want you to know this",
    scenes: [
      {
        timestamp: "0-3s",
        visual: "Finger over lips 'shh', quick zoom",
        script: "Your " + audienceCallout.toLowerCase() + " skincare brand doesn't want you to know this.",
        onScreenText: "SECRET",
        audio: "Whisper trend audio"
      },
      {
        timestamp: "3-15s",
        visual: "Show product, then split screen before/after or demo",
        script: productName + " does " + mainBenefit.toLowerCase() + " without the " + mainPain.split(" ").slice(0, 3).join(" ") + ". It's why " + (targetAudience.includes("dermatologist") ? "derms" : "influencers") + " are switching. Takes " + (keyBenefits.find(function(b) { return b.includes("min") || b.includes("hour"); }) || "10 minutes") + ".",
        onScreenText: "WHY NO ONE TALKS ABOUT THIS",
        audio: "Confessional tone, building curiosity"
      },
      {
        timestamp: "15-20s",
        visual: "Unboxing or using product, link sticker",
        script: "I linked it below. " + (offerType ? offerType.split(" - ")[0] + "." : "") + " Try it, or keep " + mainPain.toLowerCase() + ". Your call. Follow for more real reviews.",
        onScreenText: "LINK IN BIO / FOLLOW",
        audio: "Casual, non-salesy close"
      }
    ]
  };

  // CONCEPT 3: The 3-Second Transformation
  const dayBenefit = keyBenefits.find(function(b) { return b.includes("day") || b.includes("week"); });
  const concept3: VideoConcept = {
    id: 3,
    title: "3-Second Test",
    angle: "Show, don't tell - transformation first",
    hook: "Watch this",
    scenes: [
      {
        timestamp: "0-3s",
        visual: "Before shot, timer appears",
        script: "3 seconds. Watch.",
        onScreenText: "3...2...1...",
        audio: "Countdown beep, trending sound"
      },
      {
        timestamp: "3-15s",
        visual: "Fast transformation, product usage, results",
        script: "That's " + productName + ". No filter. " + keyBenefits.slice(0, 2).join(", ") + ". I use it " + (dayBenefit ? dayBenefit.toLowerCase() : "daily") + " and " + (mainPain.includes("money") ? "stopped wasting money" : "actually see a difference") + ".",
        onScreenText: productName.toUpperCase(),
        audio: "Satisfying transition sound"
      },
      {
        timestamp: "15-20s",
        visual: "Hold product to camera, point down",
        script: (offerType.includes("Free") ? "They have a deal on right now." : "Worth every penny.") + " " + cta + ". Comment if you want my routine.",
        onScreenText: cta.toUpperCase() + " [arrow down]",
        audio: "Clear, friendly"
      }
    ]
  };

  const concepts = [concept1, concept2, concept3];

  const hooks = [
    "POV: you're " + mainPain.toLowerCase(),
    "Stop doing this if you're " + audienceCallout.toLowerCase(),
    "They don't want you to know about " + productName,
    "I wish someone told me this sooner",
    "This replaced $200 of my routine",
    "Unpopular opinion: " + mainPain + " is a scam",
    "3 seconds to " + mainBenefit.toLowerCase(),
    "Don't buy " + productShort + " until you watch this",
    "The reason your " + mainPain.split(" ").slice(-2).join(" ") + " isn't working",
    "I tested " + productName + " for 7 days"
  ];

  const captions = {
    primary: concept1.hook + ". " + productDescription + " " + mainBenefit + ", " + secondaryBenefit + ". " + offerType + " [link below]\n\n" + cta + " - link in bio\n\n#" + productName.replace(/\s+/g, "") + " #" + audienceCallout.toLowerCase() + "tok #lifehack",
    alt1: "not gatekeeping this anymore. " + keyBenefits.join(" / ") + "\n\ncomment \"" + productShort + "\" for link",
    alt2: "your sign to stop " + mainPain.toLowerCase() + ". link below"
  };

  const visualPlan: VisualPlanItem[] = concepts.map(function(c) {
    return {
      concept: c.title,
      scenes: c.scenes.map(function(s) {
        return {
          time: s.timestamp,
          shot: s.visual,
          text: s.onScreenText,
          broll: s.timestamp === "3-15s" ? "product demo, lifestyle, UGC style" : "talking head"
        };
      })
    };
  });

  const aiPrompts: AIPromptItem[] = [];
  concepts.forEach(function(c) {
    c.scenes.forEach(function(s, i) {
      let promptStyle = "Pattern interrupt, fast zoom";
      if (s.timestamp.includes("3-15")) {
        promptStyle = "Product demonstration";
      } else if (s.timestamp.includes("15-20")) {
        promptStyle = "Clean product shot, smiling creator";
      }
      aiPrompts.push({
        concept: c.id,
        scene: i + 1,
        prompt: s.visual + ". " + productName + " context. UGC style, iPhone 15, natural lighting, 9:16 vertical, TikTok aesthetic, authentic not commercial. " + promptStyle + ". --ar 9:16 --style raw"
      });
    });
  });

  const editingPlan: EditingPlan = {
    app: "CapCut Desktop or Mobile",
    timeline: "19-21 seconds total",
    cuts: [
      "0:00-0:02.5 - Hook, 110% speed, 1.2x zoom in at 1s",
      "0:02.5-0:14 - Problem/value, jump cuts every 1.5s, add captions word-by-word",
      "0:14-0:20 - CTA, slow to 95%, steady shot"
    ],
    captions: {
      style: "Bold, white with black outline, 2-3 words max per screen",
      animation: "Pop in, 0.1s",
      position: "Center or lower third"
    },
    effects: ["Auto velocity on hook", "Green screen for product text overlay", "Subtle shake on 'stop scrolling'"],
    audio: "Trending sound at 15% volume under voiceover, or original audio",
    export: "1080x1920, 30fps, 8-12MB"
  };

  const numBenefit = keyBenefits.find(function(b) { return /\d/.test(b); });
  const funnel: FunnelStrategy = {
    tiktok: "Post 3 concepts in 24h, test hooks. Best performer gets $20/day Spark Ad",
    landing: "1-page, mobile-first. Above fold: video + headline '" + mainBenefit + " in " + (numBenefit || "days") + "'. Below: 3 benefits, social proof, " + offerType,
    email: "If digital: deliver + 3-day nurture. If physical: abandoned cart at 1h, 24h",
    retargeting: "Viewers 3s+ -> testimonial video. Clickers -> offer stack video"
  };

  const automationJson: AutomationJSON = {
    version: "1.0",
    product: {
      name: productName,
      description: productDescription,
      audience: targetAudience,
      benefits: keyBenefits,
      pains: painPoints,
      offer: offerType,
      cta: cta
    },
    output: {
      concepts: concepts.map(function(c) {
        return {
          id: c.id,
          title: c.title,
          angle: c.angle,
          hook: c.hook,
          script_full: c.scenes.map(function(s) { return s.script; }).join(" "),
          scenes: c.scenes
        };
      }),
      hooks: hooks,
      captions: captions,
      ai_video_prompts: aiPrompts,
      editing: editingPlan
    },
    metadata: {
      generated_at: new Date().toISOString(),
      format: "tiktok_9x16",
      duration_target: "19-21s"
    }
  };

  const workflow: Workflow = {
    trigger: "Google Sheets 'New Row' or Manual",
    nodes: [
      { step: 1, name: "Input", action: "Watch Google Sheet columns: product_name, description, audience, benefits (comma), pains (comma), offer, cta, images" },
      { step: 2, name: "Set Variables", action: "Map sheet data to workflow variables" },
      { step: 3, name: "LLM Call", action: "POST to LLM with master prompt + variables. Model: GPT-4o or Claude 3.5. Temperature 0.8" },
      { step: 4, name: "Parse JSON", action: "Extract scripts, scenes, prompts, captions from LLM response" },
      { step: 5, name: "Loop Scenes", action: "For each of 9 scenes (3 concepts x 3 scenes)" },
      { step: 6, name: "Generate Video", action: "POST prompt to Runway Gen-3 or Pika. Duration 4s, 9:16" },
      { step: 7, name: "Wait & Download", action: "Poll API, download mp4 to Drive: /{product_name}/concept_{n}/scene_{n}.mp4" },
      { step: 8, name: "Save Assets", action: "Write script.txt, captions.txt, prompts.json to same folder" },
      { step: 9, name: "Notify", action: "Slack/Discord: 'Videos ready for " + productName + " - edit in CapCut'" },
      { step: 10, name: "Scale", action: "Process next row. Batch 5 products/day = 15 videos" }
    ]
  };

  return { concepts, hooks, captions, visualPlan, aiPrompts, editingPlan, funnel, automationJson, workflow };
}

type TabId = "concepts" | "scripts" | "visual" | "prompts" | "editing" | "hooks" | "captions" | "funnel" | "json" | "workflow";

const TAB_CONFIG: { id: TabId; label: string; icon: string }[] = [
  { id: "concepts", label: "1. Concepts", icon: "C" },
  { id: "scripts", label: "2. Scripts", icon: "S" },
  { id: "visual", label: "3. Visual", icon: "V" },
  { id: "prompts", label: "4. AI Prompts", icon: "P" },
  { id: "editing", label: "5. Editing", icon: "E" },
  { id: "hooks", label: "6. Hooks", icon: "H" },
  { id: "captions", label: "7. Captions", icon: "T" },
  { id: "funnel", label: "8. Funnel", icon: "F" },
  { id: "json", label: "9. JSON", icon: "J" },
  { id: "workflow", label: "10. Workflow", icon: "W" }
];

export default function App() {
  const [input, setInput] = useState<ProductInput>(EXAMPLES.skincare);
  const [activeExample, setActiveExample] = useState("skincare");
  const [generated, setGenerated] = useState<GeneratedOutput | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("concepts");
  const [copied, setCopied] = useState<string | null>(null);

  const output = useMemo(function() {
    return generated || generateOutput(input);
  }, [generated, input]);

  const updateField = function<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setInput(function(prev) {
      return { ...prev, [key]: value };
    });
    setGenerated(null);
  };

  const updateArray = function(key: "keyBenefits" | "painPoints", index: number, value: string) {
    const arr = [...input[key]];
    arr[index] = value;
    updateField(key, arr);
  };

  const addArrayItem = function(key: "keyBenefits" | "painPoints") {
    updateField(key, [...input[key], ""]);
  };

  const copy = async function(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(function() {
        setCopied(null);
      }, 1500);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const loadExample = function(key: string) {
    setInput(EXAMPLES[key]);
    setActiveExample(key);
    setGenerated(null);
  };

  const handleGenerate = function() {
    setGenerated(generateOutput(input));
    setActiveTab("concepts");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white font-bold text-sm">
              VS
            </div>
            <div>
              <div className="text-base font-semibold tracking-tight">ViralShift AI</div>
              <div className="text-xs text-zinc-500 -mt-0.5">Short-Form Video Automation</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              TikTok / Reels / Shorts
            </span>
            <button 
              onClick={handleGenerate} 
              className="rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
            >
              Generate
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[420px_1fr] xl:grid-cols-[480px_1fr]">
        {/* INPUT PANEL */}
        <section className="border-r border-zinc-800 bg-zinc-900/30 lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:overflow-y-auto">
          <div className="p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Product Input</h2>
              <div className="flex gap-1.5">
                {Object.keys(EXAMPLES).map(function(key) {
                  return (
                    <button
                      key={key}
                      onClick={function() { loadExample(key); }}
                      className={"rounded-md px-2.5 py-1 text-xs capitalize transition " + (activeExample === key ? "bg-violet-500 text-white" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200")}
                    >
                      {key}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Product Name</label>
                <input
                  value={input.productName}
                  onChange={function(e) { updateField("productName", e.target.value); }}
                  placeholder="GlowBeam LED Mask"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Product Description */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Product Description</label>
                <textarea
                  value={input.productDescription}
                  onChange={function(e) { updateField("productDescription", e.target.value); }}
                  placeholder="What it is and what it does in one sentence"
                  rows={2}
                  className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Target Audience</label>
                <input
                  value={input.targetAudience}
                  onChange={function(e) { updateField("targetAudience", e.target.value); }}
                  placeholder="Women 28-45 who..."
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Key Benefits</label>
                <div className="space-y-2">
                  {input.keyBenefits.map(function(b, i) {
                    return (
                      <input
                        key={i}
                        value={b}
                        onChange={function(e) { updateArray("keyBenefits", i, e.target.value); }}
                        placeholder={"Benefit " + (i + 1)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500"
                      />
                    );
                  })}
                </div>
                <button onClick={function() { addArrayItem("keyBenefits"); }} className="mt-2 text-xs text-zinc-500 hover:text-violet-400">+ Add benefit</button>
              </div>

              {/* Pains */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Pain Points</label>
                <div className="space-y-2">
                  {input.painPoints.map(function(p, i) {
                    return (
                      <input
                        key={i}
                        value={p}
                        onChange={function(e) { updateArray("painPoints", i, e.target.value); }}
                        placeholder={"Pain " + (i + 1)}
                        className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500"
                      />
                    );
                  })}
                </div>
                <button onClick={function() { addArrayItem("painPoints"); }} className="mt-2 text-xs text-zinc-500 hover:text-violet-400">+ Add pain</button>
              </div>

              {/* Offer Type */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Offer Type</label>
                <input
                  value={input.offerType}
                  onChange={function(e) { updateField("offerType", e.target.value); }}
                  placeholder="30-day trial + free shipping"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>

              {/* CTA */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Call To Action</label>
                <input
                  value={input.cta}
                  onChange={function(e) { updateField("cta", e.target.value); }}
                  placeholder="Tap Shop Now"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-zinc-700 bg-zinc-800/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-300">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18"></path></svg>
                3-Scene Structure
              </div>
              <div className="space-y-1.5 text-xs text-zinc-500">
                <div className="flex gap-2"><span className="text-zinc-600 font-mono">0-3s</span> <span>Hook: pattern interrupt</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 font-mono">3-15s</span> <span>Problem + value + proof</span></div>
                <div className="flex gap-2"><span className="text-zinc-600 font-mono">15-20s</span> <span>Solution + dual CTA</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* OUTPUT PANEL */}
        <section className="min-h-screen bg-zinc-950">
          {/* Tabs */}
          <div className="sticky top-[57px] z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
            <div className="flex items-center gap-1 overflow-x-auto px-4 py-2.5" style={{ scrollbarWidth: "none" }}>
              {TAB_CONFIG.map(function(tab) {
                return (
                  <button
                    key={tab.id}
                    onClick={function() { setActiveTab(tab.id); }}
                    className={"flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition " + (activeTab === tab.id ? "bg-violet-500 text-white" : "text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300")}
                  >
                    <span className="w-4 h-4 flex items-center justify-center rounded bg-zinc-700/50 text-[10px]">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 sm:p-6 lg:p-8">
            {/* SECTION 1: CONCEPTS */}
            {activeTab === "concepts" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 1: VIDEO CONCEPTS</h1>
                  <p className="mt-1 text-sm text-zinc-500">3 proven angles, each built for retention</p>
                </div>

                {output.concepts.map(function(concept) {
                  return (
                    <div key={concept.id} className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
                      <div className="border-b border-zinc-800 bg-zinc-800/50 px-5 py-3.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-zinc-500">CONCEPT {concept.id}</span>
                              <span className="rounded-md bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">{concept.angle}</span>
                            </div>
                            <h3 className="mt-1.5 text-lg font-semibold">{concept.title}</h3>
                            <p className="text-sm text-zinc-500">Hook: &quot;{concept.hook}&quot;</p>
                          </div>
                          <button
                            onClick={function() { copy(concept.scenes.map(function(s) { return s.script; }).join(" "), "concept-" + concept.id); }}
                            className="text-xs text-zinc-500 hover:text-white"
                          >
                            {copied === "concept-" + concept.id ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-zinc-800/50">
                        {concept.scenes.map(function(scene, i) {
                          const sceneLabel = i === 0 ? "HOOK" : (i === 1 ? "VALUE" : "CTA");
                          return (
                            <div key={i} className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-[100px_1fr_180px]">
                              <div>
                                <div className="text-xs font-mono text-zinc-500">{scene.timestamp}</div>
                                <div className="mt-1 text-xs uppercase tracking-wide text-zinc-600">{sceneLabel}</div>
                              </div>
                              <div>
                                <p className="text-sm leading-snug text-zinc-200">&quot;{scene.script}&quot;</p>
                                <p className="mt-2 text-xs text-zinc-500">{scene.visual}</p>
                              </div>
                              <div className="hidden sm:block">
                                <div className="rounded-lg bg-black/50 px-3 py-2 font-mono text-xs text-emerald-400">
                                  {scene.onScreenText}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SECTION 2: SCRIPTS */}
            {activeTab === "scripts" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 2: FULL SCRIPTS (SCENE-BASED)</h1>
                  <p className="mt-1 text-sm text-zinc-500">Word-for-word, ready to record</p>
                </div>
                {output.concepts.map(function(c) {
                  return (
                    <div key={c.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-base font-semibold">Video {c.id}: {c.title}</h3>
                        <button onClick={function() { copy(c.scenes.map(function(s) { return "[" + s.timestamp + "] " + s.script; }).join("\n\n"), "script-" + c.id); }} className="text-xs text-zinc-500 hover:text-white">
                          {copied === "script-" + c.id ? "Copied!" : "Copy script"}
                        </button>
                      </div>
                      <div className="space-y-3 font-mono text-sm leading-relaxed">
                        {c.scenes.map(function(s, i) {
                          return (
                            <div key={i}>
                              <span className="text-zinc-600">[{s.timestamp}]</span> <span className="text-zinc-200">{s.script}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SECTION 3: VISUAL */}
            {activeTab === "visual" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 3: VISUAL BUILD PLAN</h1>
                  <p className="mt-1 text-sm text-zinc-500">Scene-by-scene shot list</p>
                </div>
                {output.visualPlan.map(function(v, i) {
                  return (
                    <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <h3 className="mb-3 text-base font-semibold">{v.concept}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="text-left text-xs uppercase tracking-wide text-zinc-500">
                            <tr className="border-b border-zinc-800">
                              <th className="pb-2 pr-4">Time</th>
                              <th className="pb-2 pr-4">Shot</th>
                              <th className="pb-2 pr-4">On-Screen Text</th>
                              <th className="pb-2">B-Roll</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/50">
                            {v.scenes.map(function(s, j) {
                              return (
                                <tr key={j}>
                                  <td className="py-2.5 pr-4 font-mono text-zinc-500">{s.time}</td>
                                  <td className="py-2.5 pr-4 text-zinc-300">{s.shot}</td>
                                  <td className="py-2.5 pr-4"><span className="rounded bg-zinc-800 px-2 py-1 font-mono text-xs text-emerald-400">{s.text}</span></td>
                                  <td className="py-2.5 text-zinc-500">{s.broll}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SECTION 4: PROMPTS */}
            {activeTab === "prompts" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 4: AI VIDEO PROMPTS</h1>
                  <p className="mt-1 text-sm text-zinc-500">Runway, Pika, Luma ready</p>
                </div>
                <div className="grid gap-3">
                  {output.aiPrompts.map(function(p, i) {
                    return (
                      <div key={i} className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-mono text-zinc-500">CONCEPT {p.concept} - SCENE {p.scene}</span>
                          <button onClick={function() { copy(p.prompt, "prompt-" + i); }} className="opacity-0 transition group-hover:opacity-100 text-xs text-zinc-500 hover:text-white">
                            {copied === "prompt-" + i ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <p className="text-sm leading-snug text-zinc-300">{p.prompt}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 5: EDITING */}
            {activeTab === "editing" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 5: EDITING PLAN</h1>
                  <p className="mt-1 text-sm text-zinc-500">CapCut-ready instructions</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Timeline</h4>
                      <p className="text-sm">{output.editingPlan.timeline}</p>
                      <div className="mt-4 space-y-2">
                        {output.editingPlan.cuts.map(function(cut, i) {
                          return <div key={i} className="text-sm text-zinc-400">* {cut}</div>;
                        })}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Captions</h4>
                      <p className="text-sm text-zinc-300">{output.editingPlan.captions.style}</p>
                      <p className="mt-1 text-xs text-zinc-500">Animation: {output.editingPlan.captions.animation}</p>
                      
                      <h4 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">Effects</h4>
                      <div className="space-y-1">
                        {output.editingPlan.effects.map(function(e, i) {
                          return <div key={i} className="text-sm text-zinc-400">* {e}</div>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 border-t border-zinc-800 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Export: {output.editingPlan.export}</span>
                      <button onClick={function() { copy(JSON.stringify(output.editingPlan, null, 2), "editing"); }} className="text-xs text-zinc-500 hover:text-white">
                        {copied === "editing" ? "Copied!" : "Copy plan"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: HOOKS */}
            {activeTab === "hooks" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 6: HOOKS</h1>
                  <p className="mt-1 text-sm text-zinc-500">10 pattern-interrupt variations</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {output.hooks.map(function(hook, i) {
                    const num = String(i + 1).padStart(2, "0");
                    return (
                      <div key={i} className="group flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-700">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-zinc-600">{num}</span>
                          <span className="text-sm">{hook}</span>
                        </div>
                        <button onClick={function() { copy(hook, "hook-" + i); }} className="opacity-0 transition group-hover:opacity-100 text-xs text-zinc-500 hover:text-white">
                          {copied === "hook-" + i ? "OK" : "Copy"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 7: CAPTIONS */}
            {activeTab === "captions" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 7: CAPTION + CTA</h1>
                </div>
                {Object.entries(output.captions).map(function(entry) {
                  const key = entry[0];
                  const caption = entry[1];
                  return (
                    <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-medium uppercase tracking-wide text-zinc-500">{key}</h3>
                        <button onClick={function() { copy(caption, "caption-" + key); }} className="text-xs text-zinc-500 hover:text-white">
                          {copied === "caption-" + key ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{caption}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SECTION 8: FUNNEL */}
            {activeTab === "funnel" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 8: FUNNEL STRATEGY</h1>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(output.funnel).map(function(entry) {
                    const key = entry[0];
                    const value = entry[1];
                    return (
                      <div key={key} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
                        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">{key}</h3>
                        <p className="text-sm leading-snug text-zinc-300">{value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECTION 9: JSON */}
            {activeTab === "json" && (
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight">SECTION 9: AUTOMATION JSON OUTPUT</h1>
                    <p className="mt-1 text-sm text-zinc-500">Plug into n8n, Zapier, or custom workflow</p>
                  </div>
                  <button onClick={function() { copy(JSON.stringify(output.automationJson, null, 2), "json"); }} className="rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-600">
                    {copied === "json" ? "Copied!" : "Copy JSON"}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-black p-5 text-xs leading-relaxed">
                  <code className="font-mono text-zinc-300">{JSON.stringify(output.automationJson, null, 2)}</code>
                </pre>
              </div>
            )}

            {/* SECTION 10: WORKFLOW */}
            {activeTab === "workflow" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">SECTION 10: WORKFLOW EXECUTION PLAN</h1>
                  <p className="mt-1 text-sm text-zinc-500">n8n implementation, step-by-step</p>
                </div>
                
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500 text-white font-bold text-sm">
                      n8n
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">n8n Workflow Structure</h3>
                      <p className="text-xs text-zinc-500">Trigger - Format - AI - Generate - Store - Notify</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {output.workflow.nodes.map(function(node) {
                      return (
                        <div key={node.step} className="group relative flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-mono text-zinc-400 group-hover:border-violet-500 group-hover:text-violet-400 transition">
                              {node.step}
                            </div>
                            {node.step < 10 && <div className="mt-1 h-full w-px bg-zinc-800"></div>}
                          </div>
                          <div className="pb-6">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium">{node.name}</h4>
                              <span className="text-xs text-zinc-600">Step {node.step}</span>
                            </div>
                            <p className="mt-1 text-sm leading-snug text-zinc-400">{node.action}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 rounded-xl bg-black/50 p-4">
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Scaling Logic</h4>
                    <p className="text-sm text-zinc-400">Process multiple products automatically. Batch generate videos. Scale daily content production with minimal human input. Each product = 3 videos x 3 scenes = 9 AI generations. Run overnight.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Input Source</div>
                    <div className="mt-1.5 text-sm text-zinc-300">Google Sheets with columns for all product fields</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">AI Processing</div>
                    <div className="mt-1.5 text-sm text-zinc-300">LLM with master prompt, temperature 0.8</div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <div className="text-xs uppercase tracking-wide text-zinc-500">Output</div>
                    <div className="mt-1.5 text-sm text-zinc-300">Drive folder per product with videos + scripts</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
