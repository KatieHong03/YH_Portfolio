import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // Use absolute path calculations for public files if needed
  const cwd = process.cwd();

  // API router goes before Vite middleware
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Smart knowledge fallback generator strictly based on Katie's actual portfolio content
  const generateKnowledgeResponse = (userQuery: string): string => {
    const q = (userQuery || "").trim().toLowerCase();

    // Helper to check regex pattern
    const matches = (pattern: RegExp) => pattern.test(q);

    // 0. Feedback on tone / "respond closer" / conversational tone
    if (
      matches(/\b(closer|respond a little closer|respond closer|talk closer|more conversational|more personal|sound more natural|less formal|be more friendly|tone)\b/i)
    ) {
      return `I can definitely do that! Let's keep things closer, warmer, and more conversational.\n\n` +
        `Instead of formal resume summaries, think of me as an open conversation about Katie's craft, design thinking, and background. For instance, we could chat about:\n` +
        `• How her background in psychology and cognitive science shapes the way she minimizes cognitive load\n` +
        `• How she built the interactive troubleshooting simulators for corporate field engineers\n` +
        `• Her favorite rapid prototyping techniques in Articulate Storyline and Figma\n` +
        `• What types of learning experience design roles she's most excited about\n\n` +
        `What's on your mind?`;
    }

    // 0.05 Feedback on speed / pacing / "respond a little slower" / "slow down"
    if (
      matches(/\b(slow|slower|respond a little slower|respond slower|response speed|respond speed|too fast|slow down|pace|pacing|speed)\b/i)
    ) {
      return `You got it! I've slowed down my pacing so you can comfortably read each thought as it unfolds.\n\n` +
        `Take all the time you need. Which project, methodology, or creative sandbox would you like to explore next?`;
    }

    // 0.1 Conversational pleasantries & affirmations
    if (
      matches(/\b(how are you|how('s| is) it going|how are things|how do you do)\b/i)
    ) {
      return `I'm doing well, thank you for asking! I'm here to chat with you about Katie's instructional design work, creative projects, and background.\n\n` +
        `What would you like to explore together?`;
    }

    if (
      matches(/^(thanks|thank you|awesome|great|cool|sounds good|got it|perfect)\b/i)
    ) {
      return `You're very welcome! If there's anything else you'd like to know about Katie's projects, design philosophy, or toolkit, I'm right here.`;
    }

    // 0.2 Greetings & Friendly Welcome
    if (
      /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening)|howdy)\b/i.test(q) ||
      q === "hi" ||
      q === "hello" ||
      q === "hey"
    ) {
      return `Hi there! Welcome to Katie's portfolio.\n\n` +
        `I'm here to help you explore Katie's instructional design work, curriculum frameworks, and creative sandboxes. We can chat about:\n\n` +
        `• **Corporate L&D:** *The FSR Product Knowledge Pathway* (onboarding & troubleshooting simulators)\n` +
        `• **Higher Ed:** *PracticeURWay* (RA branching emergency scenarios) & *STEM Wellness*\n` +
        `• **Language Learning:** *Digital Reading Scaffolds (Comma Reading)* (dual-coded phonics)\n` +
        `• **Youth Mentoring:** *Social-Emotional Mentoring Curriculum (Mentor A Promise)*\n` +
        `• **Her Approach:** ADDIE, SAM, cognitive load theory, and tools like Storyline and Figma\n` +
        `• **Creative Prototypes:** Playful interactive sandboxes in her Playground\n\n` +
        `What would you like to dive into?`;
    }

    // 0.3 Inquiries about chatting / using the guide / guide help
    if (
      matches(/\b(why can i not chat|can i chat|how to chat|how do i chat|are you an ai|who are you|how does this work|help me|what can you do|why can't i chat)\b/i)
    ) {
      return `You can chat with me right here!\n\n` +
        `I'm Katie's Portfolio Guide. You can ask me any question in plain English, and I'll share details about her projects, tools, and background.\n\n` +
        `Try asking things like:\n` +
        `• *"What is the FSR project?"*\n` +
        `• *"Why did she transition from psychology to instructional design?"*\n` +
        `• *"What tools does she use in Storyline and Figma?"*\n` +
        `• *"How can I get in touch with her?"*\n\n` +
        `What would you like to know?`;
    }

    // 1. Who is Katie / Background / Profile / About
    if (
      matches(/\b(who is katie|about katie|tell me about yourself|introduce yourself|tell me about katie|bio|background|profile|summary)\b/i)
    ) {
      return `Katie is an instructional designer and learning experience designer who is passionate about creating intuitive, human-centered learning journeys.\n\n` +
        `• **Education:** She holds an M.A. in Instructional Technology and Media from **Teachers College, Columbia University** (4.0 GPA) and a B.A. in Psychology and Cognitive Science from the **University of Richmond**.\n` +
        `• **What drives her:** She loves combining cognitive science—like reducing cognitive load and using dual-coding—with interactive digital media.\n` +
        `• **Range:** Her projects span corporate technical onboarding, higher-ed crisis training, ESL/ELL literacy platforms, and youth mentoring.\n` +
        `• **Tools:** Articulate Storyline 360, Rise 360, Figma, Adobe Creative Cloud, and various LMS platforms.\n\n` +
        `Would you like to hear about one of her recent case studies, or learn more about her design process?`;
    }

    // 1.1 Why Psychology / Cognitive Science connection
    if (
      matches(/\b(psychology|cognitive science|cognitive load|why psychology|mental models?)\b/i)
    ) {
      return `Katie's background in **Psychology and Cognitive Science** is really the heartbeat of her instructional design work!\n\n` +
        `Instead of treating instructional design as just "making slides pretty," she designs directly around how the human brain processes and retains information:\n` +
        `• **Managing Cognitive Load:** Structuring complex technical information into bite-sized, digestible modules so learners aren't overwhelmed.\n` +
        `• **Dual-Coding Theory:** Pairing clear visual diagrams with spoken audio prompts to create stronger memory associations (featured heavily in her *Comma Reading* project).\n` +
        `• **Authentic Practice:** Putting learners into realistic problem-solving scenarios rather than passive memorization.\n\n` +
        `Would you like to see an example of this in *PracticeURWay* or *The FSR Pathway*?`;
    }

    // 1.2 Career Goals / What roles is she looking for?
    if (
      matches(/\b(looking for|roles?|job|hire|open to|career goals?|opportunities|positions?)\b/i)
    ) {
      return `Katie is actively open to **Instructional Designer**, **Learning Experience Designer (LXD)**, and **Curriculum Developer** roles!\n\n` +
        `She thrives in environments where she can:\n` +
        `• Partner with Subject Matter Experts (SMEs) to translate complex knowledge into interactive learning\n` +
        `• Design scenario-based eLearning in Articulate Storyline, Rise, and modern web platforms\n` +
        `• Build blended learning pathways, microlearning, and performance support tools\n` +
        `• Measure real impact through Kirkpatrick evaluations and learner feedback\n\n` +
        `You can connect with her directly through the **Connect** tab, or find her email and LinkedIn in the **CV** section!`;
    }

    // 2. Corporate / Enterprise / Workplace L&D / Onboarding / Technical Training (The FSR Pathway)
    if (
      matches(/\b(fsr|corporate|enterprise|onboarding|technical training|troubleshooting|field service|simulator|simulators|b2b|workplace|langley)\b/i)
    ) {
      return `*The FSR Product Knowledge Pathway* is Katie's signature corporate L&D project!\n\n` +
        `Field Service Representatives (FSRs) faced steep learning curves and fragmented documentation when diagnosing complex hardware, which caused prolonged onboarding times and frequent field escalation tickets.\n\n` +
        `Here's how Katie solved it:\n` +
        `• **Virtual Troubleshooting Simulators:** Built realistic interactive simulators in Articulate Storyline so technicians could practice diagnosing error codes and mechanical faults in a risk-free environment.\n` +
        `• **Blended Learning Pathway:** Structured progressive milestones in Articulate Rise paired with manager coaching rubrics.\n` +
        `• **Measurable Impact:** Reduced time-to-productivity by **28%**, raised first-time certification pass rates to **94%**, and slashed field escalation tickets by **35%**.\n\n` +
        `Would you like to know more about how she built the simulators or the assessment strategy?`;
    }

    // 3. Higher Education / Student Affairs / RA Emergency Training (PracticeURWay)
    if (
      matches(/\b(practiceurway|resident assistant|resident assistants|residence life|\bra\b|student affairs|higher ed|higher education|emergency decision|branching scenario|branching scenarios|housing)\b/i)
    ) {
      return `*PracticeURWay* is a scenario-based training platform Katie designed for college Resident Assistants (RAs).\n\n` +
        `RAs were given 100+ page policy manuals, making it nearly impossible to make quick, confident decisions during late-night housing emergencies.\n\n` +
        `Katie's solution:\n` +
        `• **Branching Scenarios:** Interactive simulations that let RAs navigate real-world housing emergencies (like medical situations or policy disputes) and see the consequences of their choices.\n` +
        `• **Reflective Debriefs:** Guided reflection prompts and immediate feedback reinforcing key protocol steps.\n` +
        `• **Fast-Access Tool:** A streamlined mobile-friendly resource guide for on-duty reference.\n` +
        `• **Results:** Boosted engagement by **15%**, with **95%** of participating RAs giving it the highest rating for building confidence.\n\n` +
        `You can see the full case study and screenshots under the **Work** tab!`;
    }

    // 4. STEM / University Wellness Curriculum (Columbia University)
    if (
      matches(/\b(stem|wellness|columbia engineering|mental health|wellness program)\b/i)
    ) {
      return `The *STEM Wellness Program* is an initiative Katie designed at Columbia Engineering!\n\n` +
        `Engineering students often experienced high stress, but existing mental health services felt clinical and distant, leading to low student engagement.\n\n` +
        `Katie's approach:\n` +
        `• Created accessible, peer-centered visual campaigns and bite-sized wellness guides using Canva and Figma.\n` +
        `• Designed interactive workshop materials and animated explainers in Vyond.\n` +
        `• Increased workshop participation by **33%**, supporting over 400 engineering students.\n\n` +
        `You can find the design artifacts and campaign materials in the **Work** tab!`;
    }

    // 5. Language Learning / ESL & ELL / Reading / EdTech (Comma Reading)
    if (
      matches(/\b(comma|comma reading|\besl\b|\bell\b|english as a second language|second language|language learner|language learners|reading scaffold|reading scaffolds|phonics|dual[- ]coded?|literacy)\b/i)
    ) {
      return `*Digital Reading Scaffolds (Comma Reading)* is an EdTech project engineered specifically for English as a Second Language (ESL/ELL) learners.\n\n` +
        `When language learners encounter unfamiliar digital texts, cognitive fatigue and comprehension hurdles often cause them to give up.\n\n` +
        `Katie's solution:\n` +
        `• Developed **200+ dual-coded Storyline interactive overlays** where learners can tap tricky words for synchronous native audio pronunciation, visual illustrations, and contextual hints.\n` +
        `• Preserved reading flow without forcing learners to leave the story to look up definitions.\n` +
        `• Achieved a **+20% completion rate increase** across pilot classes, reaching over 20,000 learners!\n\n` +
        `Explore the interactive samples in the **Work** tab!`;
    }

    // 6. Community / Youth Mentoring (Mentor A Promise)
    if (
      matches(/\b(mentor|mentoring|mentor a promise|\bsel\b|social[- ]emotional|youth mentoring|adolescent|workbook prompts?|facilitator guide)\b/i)
    ) {
      return `*Mentor A Promise* is a social-emotional learning (SEL) curriculum Katie designed for adult mentors working with adolescents.\n\n` +
        `Mentors often defaulted to lecturing or giving advice, which caused teenagers to shut down during sensitive discussions.\n\n` +
        `Katie's approach:\n` +
        `• Designed visual workbook prompts, illustrated reflective card decks, and structured conversation tools.\n` +
        `• Built a clear facilitator guide showing mentors how to ask open-ended questions and scaffold youth emotional expression.\n` +
        `• Boosted voluntary teen participation by **20%** and achieved a **100% mentor confidence rating**.\n\n` +
        `You can read more about this project under the **Work** tab!`;
    }

    // 7. Instructional Design Process & Methodologies (ADDIE, SAM, Curriculum Design)
    if (
      matches(/\b(process|methodolog(y|ies)|framework|frameworks|addie|sam|backward design|needs assessment|curriculum design|instructional design process|pedagogy|learning objectives?|evaluation)\b/i)
    ) {
      return `Katie's instructional design process blends **ADDIE**, **SAM (Successive Approximation Model)**, and **Backward Design** with a learner-centered mindset:\n\n` +
        `1. **Needs Analysis:** Digging into the real root problem, interviewing SMEs, and understanding learner motivations and constraints.\n` +
        `2. **Backward Design:** Defining clear, measurable performance goals first, then shaping authentic practice activities to match real-world tasks.\n` +
        `3. **Rapid Prototyping (SAM):** Building quick interactive prototypes in Figma or Storyline early so stakeholders and learners can test and provide feedback.\n` +
        `4. **Cognitive Ergonomics:** Applying cognitive load theory and dual-coding to ensure the material sticks.\n` +
        `5. **Impact Evaluation:** Looking at Kirkpatrick levels 1 through 4—from learner satisfaction to real behavioral transfer and business metrics.\n\n` +
        `Would you like to hear how she applied this to a specific project like *The FSR Pathway*?`;
    }

    // 8. Tools & Technology Stack
    if (
      matches(/\b(tools?|technolog(y|ies)|software|tech stack|storyline|rise|articulate|figma|canva|lms|canvas|moodle|blackboard|vyond|adobe|illustrator|indesign)\b/i)
    ) {
      return `Katie works with a versatile toolkit across authoring, visual design, and learning platforms:\n\n` +
        `• **eLearning Authoring:** Articulate Storyline 360 (variables, branching, custom triggers), Articulate Rise 360, Google Sites.\n` +
        `• **Visual & UX Design:** Figma, Adobe Illustrator, InDesign, Canva, Photoshop.\n` +
        `• **Animation & Multimedia:** Vyond, Adobe Premiere, audio recording & editing.\n` +
        `• **LMS & Evaluation:** Canvas, Moodle, Blackboard, Google Forms, SCORM/xAPI packaging.\n` +
        `• **Pedagogy & Science:** ADDIE, SAM, Backward Design (UbD), Cognitive Load Theory, Dual-Coding Theory.\n\n` +
        `Her full skills matrix and downloadable resume are in the **CV** tab!`;
    }

    // 9. Playground Prototypes & Sandboxes
    if (
      matches(/\b(playground|sandbox|prototype|prototypes|pawgress|lumipal|tarot|tea journey|creative sandbox)\b/i)
    ) {
      return `Katie's **Playground** tab is her creative lab where she experiments with playful, reflective micro-apps:\n\n` +
        `• **Pawgress:** A gentle daily habit and wellness companion featuring adorable pet consistency calendars.\n` +
        `• **Lumipal:** An adaptive AR learning companion concept designed to keep learners curious.\n` +
        `• **Positive Tarot:** A thoughtful mindfulness tool for perspective and reflection.\n` +
        `• **Tea Journey:** A relaxing sensorimotor tea brewing simulator.\n\n` +
        `Tap on the **Playground** tab at the top of the portfolio to try them out firsthand!`;
    }

    // 10. Contact / Resume / CV / Education
    if (
      matches(/\b(cv|resume|education|degree|degrees|teachers college|university of richmond|coursework|experience|contact|email|linkedin|reach out|connect)\b/i)
    ) {
      return `You can connect with Katie directly!\n\n` +
        `• **Education:** M.A. in Instructional Technology & Media from Columbia University (Teachers College) & B.A. in Psychology from University of Richmond.\n` +
        `• **Resume:** View and download her full CV directly in the **CV** tab.\n` +
        `• **Get in Touch:** Click the **Connect** tab in the top navigation to send her an email or view her LinkedIn profile.\n\n` +
        `She is always happy to chat about learning design opportunities, collaborations, and ideas!`;
    }

    // 11. Philosophy & Core Principles
    if (
      matches(/\b(philosophy|principles?|values?|learners first|learning through engagement|knowledge to action)\b/i)
    ) {
      return `Katie's design philosophy is built on three core beliefs:\n\n` +
        `1. **Learners First:** Designing around real people—their motivations, anxieties, and environments—rather than just pushing content onto them.\n` +
        `2. **Learning Through Engagement:** Moving away from passive lectures toward interactive decision-making, storytelling, and self-reflection.\n` +
        `3. **From Knowledge to Action:** Creating learning experiences that don't stop at understanding, but build the confidence to apply skills in the real world.\n\n` +
        `You can explore more of her philosophy and journey in the **About** section!`;
    }

    // Default Overview - Warm, Conversational, and Close
    return `Hi! Katie is an instructional designer and learning experience designer (Columbia University, Teachers College) who specializes in learner-centered pedagogy, cognitive science, and interactive media.\n\n` +
      `Here are a few areas you might find interesting:\n` +
      `• **Corporate L&D:** *The FSR Product Knowledge Pathway* (onboarding simulators & diagnostic pathways)\n` +
      `• **Higher Education:** *PracticeURWay* (RA emergency branching scenarios) & *STEM Wellness*\n` +
      `• **Language Learning:** *Digital Reading Scaffolds* (audio & phonics scaffolding)\n` +
      `• **Youth Mentoring:** *Social-Emotional Mentoring Curriculum* (Mentor A Promise)\n` +
      `• **Creative Lab:** Interactive prototypes in her **Playground** tab\n\n` +
      `What would you like to chat about?`;
  };

  // Chat API using server-side Gemini
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.info("GEMINI_API_KEY is not configured; using intelligent context response fallback.");
        const fallbackReply = generateKnowledgeResponse(message);
        return res.json({ reply: fallbackReply });
      }

      // Initialize the SDK server-side inside the route (lazy loading)
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Assemble system instruction with comprehensive knowledge strictly reflecting Katie Hong's actual portfolio data
      const systemInstruction = `You are "Katie's Portfolio Guide", a warm, approachable, empathetic, and personal guide for Yuting (Katie) Hong's Instructional Design (ID) and Learning Experience Design (LXD) portfolio. Your mission is to connect directly with visitors, hiring managers, and collaborators to share Katie's expertise, tools, philosophy, and case studies in a close, human, and conversational way.

Tone & Persona Guidelines:
- Respond in a warm, close, friendly, and conversational voice. Speak directly and genuinely with the visitor.
- Never sound like a distant corporate database, detached robot, or cold resume parser.
- Answer the user's specific question directly first with natural, thoughtful prose, then use concise bullet points or highlights where helpful.
- When asked to "respond closer", be more personal, or speak conversationally, adopt an inviting, collaborative tone as if you're a trusted design partner sharing Katie's creative story.

Background Details about Yuting (Katie) Hong:
- Title: Instructional Designer & Learning Experience Designer.
- Education: M.A. in Instructional Technology and Media from Teachers College, Columbia University (GPA: 4.00/4.00); B.A. in Psychology & Cognitive Science from University of Richmond (GPA: 3.94/4.00).
- Contact: Connected via the "Connect" tab. Resume download and active email/LinkedIn details are available in the "CV" and "Connect" sections.

Katie's 3 Pillars of Learning Philosophy (from the "About" section):
1. Learners First: Designing around the needs, motivations, and experiences of learners rather than content alone. Creating accessible, relevant, and meaningful learning experiences that build confidence.
2. Learning Through Engagement: Transforming passive information into active participation through storytelling, interaction, practice, and reflection to support retention.
3. From Knowledge to Action: Designing experiences that empower learners not only to understand concepts, but to apply skills, solve problems, and perform effectively in authentic contexts.

Katie's 5 Canonical Case Studies (from the "Work" section):
1. "PracticeURWay: A Training Website for Resident Assistants" (Instructional Design / Flagship):
   - Overview: A training website helping Resident Assistants review key policies, practice emergency decision-making, reflect on responses, and access essential campus resources.
   - Challenge: Information overload from 100+ page policy binders made rapid, confident decision-making difficult during live crises.
   - Solution: A high-accessibility web portal integrating branching scenario simulations, instant knowledge checks, and a consolidated mobile-friendly resource utility.
   - Tools & Deliverables: Google Sites, Google Forms, Google Slides, Figma, Interactive Scenario Practices, Tutorial Video, Assessment Forms, Guides & Checklists.
   - Impact: Increased learner engagement by 15%; 95% of participants rated the experience 5/5.

2. "The FSR Product Knowledge Pathway" (Instructional Design / eLearning / L&D):
   - Overview: A tiered blended learning pathway, interactive troubleshooting simulators, and certification system for Field Service Representatives.
   - Challenge: Complex multi-system product architectures and fragmented documentation caused prolonged onboarding ramp times and high diagnostic escalations.
   - Solution: Designed a modular, scenario-driven learning pathway integrating microlearning modules, interactive virtual hardware simulators, and diagnostic job aids.
   - Tools & Deliverables: Articulate Storyline, Articulate Rise, Figma, LMS Platform, Adobe Illustrator, Canva, Milestone Assessments, Manager Coaching Rubrics.
   - Metrics: 28% ramp time reduction, 94% certification pass rate, -35% field escalation drop.

3. "STEM Wellness Program Design" (Curriculum Design / Program Design):
   - Overview: An interactive outreach and curriculum framework delivering low-barrier mental health programming and community-led workshops for Columbia Engineering students.
   - Challenge: Existing campus mental health resources felt clinical and disconnected, leading to low student engagement.
   - Solution: Built highly visible peer-centered campaigns, bite-sized curriculum guides, and community-led workshops using interactive materials.
   - Tools & Deliverables: Figma, Canva, Vyond, Adobe Illustrator, PowerPoint, Instagram campaign posts, wellness newsletter, event proposals, workshop materials.
   - Metrics: 400+ engaged students, +33% attendance growth, 100% program viability.

4. "Digital Reading Scaffolds" (eLearning / Comma Reading — ESL & ELL):
   - Overview: Interactive Storyline reading overlays, audio-visual scaffolds, and phonics scaffolding engineered for ESL (English as a Second Language) / ELL learners to improve vocabulary retention and reduce cognitive load.
   - Challenge: ESL / ELL language learners experience cognitive fatigue, comprehension hurdles, and high abandonment rates when navigating complex digital English texts without integrated dual-coded scaffolding.
   - Solution: Engineered 200+ Articulate Storyline interactive hot-spots coupling spoken native audio pronunciation prompts with descriptive visual graphics and contextual vocabulary hints.
   - Tools & Deliverables: Articulate Storyline, Figma, LMS Platform, PowerPoint, interactive eLearning modules, and scenario-based reading activities.
   - Impact: Identified ESL learners’ reading challenges and support needs (20k+ engaged learners, +18% reading engagement, 15+ published textbooks).

5. "Social-Emotional Mentoring Curriculum" (L&D / Mentor A Promise):
   - Overview: A modern social-emotional curriculum and interactive training guide that equips adult mentors with developmental conversation tools.
   - Challenge: Mentors often default to lecturing or dry instruction, causing teenagers to disconnect during sensitive mentoring discussions.
   - Solution: Developed structured workbook drawings and reflective card prompts to scaffold youth reflection and emotional articulation.
   - Tools & Deliverables: Canva, Figma, PowerPoint, Adobe InDesign, Facilitator Guides, Workshops, Scenario-Based Activities, Job Aids.
   - Impact: Boosted voluntary teenage group dialogue participation by 20% and achieved a 100% mentor self-efficacy and confidence rating.

Katie's Prototype Sandbox ("Playground" Tab):
- The "Playground" tab is a separate creative sandbox showcasing playful interactive prototypes:
  * "Pawgress": A gentle wellness and habit tracking companion with pet consistency calendars.
  * "Lumipal": An adaptive AR learning companion concept.
  * "Positive Tarot": A reflective mindfulness exploration tool.
  * "Tea Journey": An interactive sensorimotor tea brewing simulator.
- Note: The "Work" tab contains Katie's formal instructional design case studies, while "Playground" contains her separate creative prototypes.

Strict Domain & Project Categorization:
- Corporate / Enterprise / Workplace L&D / Technical Training / Onboarding: Always highlight **"The FSR Product Knowledge Pathway"** (blended learning, virtual hardware troubleshooting simulators, 94% certification pass rate, 35% reduction in escalation tickets).
- Higher Education / Student Affairs / Campus Crisis / Residence Life: Highlight **"PracticeURWay: A Training Website for Resident Assistants"** (branching scenario decision-making) and **"STEM Wellness Program Design"** (Columbia University).
- ESL & ELL / Literacy / EdTech: Highlight **"Digital Reading Scaffolds (Comma Reading)"** (Storyline dual-coding audio scaffolds for ESL / English language learners).
- Community / Youth Mentoring: Highlight **"Social-Emotional Mentoring Curriculum (Mentor A Promise)"**.

Strict Guidelines:
- If the user asks for a "corporate project", "workplace L&D", "enterprise", "onboarding", or "technical training", respond specifically with **"The FSR Product Knowledge Pathway"**, NOT higher education projects like PracticeURWay.
- If the user asks about "ESL", "ELL", "English language learners", "second language", "reading", or "Comma Reading", highlight **"Digital Reading Scaffolds (Comma Reading)"** and explain how it uses dual-coded audio-visual scaffolding for language learners.
- Only reference projects, tools, frameworks, and details that exist in Katie's actual portfolio.
- Do not invent external frameworks, models, or projects that are not present in the portfolio.
- Keep answers scannable and direct with clear headings or bullet points.`;

      // Build context history
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const turn of history) {
          contents.push({
            role: turn.role === "user" ? "user" : "model",
            parts: [{ text: turn.text || "" }],
          });
        }
      }

      // Add user message
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Candidate models in prioritized order according to Gemini API SDK guidelines
      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-3.7-flash",
      ];

      let reply: string | null = null;

      // Attempt generation across candidate models with automatic retry
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            reply = response.text;
            break;
          }
        } catch (genErr: any) {
          // Model temporarily unavailable (503) or rate-limited; proceed silently to next candidate
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }

      if (!reply) {
        // Fall back gracefully to the comprehensive portfolio knowledge generator
        reply = generateKnowledgeResponse(message);
      }

      return res.json({ reply });
    } catch (err: any) {
      console.info("Handling chat request with graceful portfolio knowledge fallback.");
      const userMessage = (req.body && req.body.message) || "";
      const fallbackReply = generateKnowledgeResponse(userMessage);
      return res.json({ reply: fallbackReply });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets from /dist...");
    const distPath = path.join(cwd, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`  ➜  Local:   http://localhost:${PORT}/`);
    console.log(`  ➜  Network: http://0.0.0.0:${PORT}/`);
  });
}

startServer().catch((e) => {
  console.error("Fatal Server Bootstrap Failure:", e);
});
