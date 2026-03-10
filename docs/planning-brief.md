# TaoMusic Planning Brief

You are acting as a disciplined software engineer, product-minded architect, and practical AI systems designer.

Your task is **NOT** to jump straight into coding.
Your task is to produce a **serious, buildable development plan** for a project called **TaoMusic**.

The output should help a first-time builder create a technically credible MVP in a few days of focused vibe coding, while still leaving room for future expansion.

---

## 1. Project Definition

**Project name:** TaoMusic

**Concept:**  
TaoMusic is a lightweight AI-assisted web tool that connects human activities and contextual signals to music discovery and creative inspiration.

The product is not meant to be a full music platform or streaming service.  
It is a small, elegant, inspiration-oriented tool: users provide a few contextual signals, and the system returns music suggestions plus a short, evocative “serendipity line.”

The product should feel like an **AI music muse**, not just a recommender.

---

## 2. Core User Experience

### User inputs
The user can provide some combination of:

- **Activity**: coding, reading, cooking, thinking, walking, late-night work, etc.
- **Album color**: blue, red, black, white, gold, etc.
- **Country/region of music**: France, Japan, Brazil, US, etc.
- **Mood**: calm, energetic, melancholic, dreamy, focused, etc.
- **Genre**: classical, jazz, ambient, indie, electronic, folk, etc.
- **Lyrical themes**: love, solitude, memory, adventure, longing, etc.

### System output
The system should return:

1. **1–3 music suggestions**  
   - song title  
   - artist  
   - optionally album / genre / country if useful

2. **A short “serendipity line”**  
   A poetic, compact sentence connecting the music to the user’s situation.

Example:

- Input: late-night reading, blue, calm, France
- Output: *Clair de Lune — Debussy*  
- Serendipity line:  
  *“A quiet blue piano drifting through the margins of a long night.”*

### Product goal
The goal is **not only recommendation, but inspiration**.  
The output should feel:
- lightweight
- surprising but relevant
- aesthetically coherent
- shareable
- emotionally resonant

---

## 3. Product Constraints

This project must be designed as a realistic MVP.

### Must-have constraints
- Web-based
- Lightweight and fast
- No user accounts
- Session-based only
- Deployable on Vercel or Netlify
- Response time target: under ~5 seconds
- No heavy computations
- No large-scale training pipeline
- No database required for MVP unless truly justified

### Data/API constraints
Use **free or low-friction APIs/tools where practical**, such as:
- Spotify API or Last.fm for music discovery / metadata
- OpenAI or Groq for serendipity line generation / text processing
- Optional image source: Unsplash or similar lightweight source if visuals are included

### UX constraints
- Simple input form
- Card-style output
- Responsive layout
- Clear generate / reroll / surprise actions
- Output should be non-repetitive and visually clean

---

## 4. Important Product Ideas

Consider these as possible MVP or near-MVP enhancements:

- **Random surprise button**  
  Inject one unexpected element, such as a random country/region, to create serendipity.

- **Optional visual layer**  
  A simple color-based background, gradient, or lightweight image matching the generated mood/line.

- **Shareable output**  
  One-click share / copy formatted result for social posting.

These are useful sell points, but the MVP should remain technically manageable.

---

## 5. Core Planning Challenge

The most important technical question is:

**How should TaoMusic model the relationship between human context and musical attributes?**

Please reason carefully about the chain:

**user context → music query/retrieval → ranking/filtering → serendipity generation**

Discuss this explicitly.

In particular, think about the relationship between:

### Context-side attributes
- activity
- mood
- time of day / vibe
- color
- cognitive state (focus / creative / relaxed)
- lyrical theme preference

### Music-side attributes
- genre
- country/region
- tempo / energy
- instrumentation
- lyrical themes
- album aesthetics / artwork color
- artist / metadata tags

Explain how these might be connected in a practical MVP.

---

## 6. Technical Directions to Compare

Do **not** assume a single obvious approach.
Compare multiple technical approaches and explain trade-offs.

At minimum, discuss:

### A. Rule-based mapping
Example:
- coding → ambient / instrumental / low-vocal-distraction
- calm + blue → softer / nocturnal / reflective music

### B. Tag-based filtering + scoring
Example:
- weighted matching on genre, mood, country, theme, color

### C. Retrieval + LLM generation
Example:
- retrieve candidate songs from Spotify/Last.fm, then use AI only for explanation and serendipity line

### D. Embedding-based similarity (future idea)
Example:
- embed contextual inputs and songs into shared semantic space

### E. Hybrid approach
Example:
- deterministic filtering and scoring for retrieval
- generative model only for “serendipity line” and short explanation

For each approach, discuss:
- why it might work
- why it might fail
- whether it is suitable for MVP
- maintainability
- explainability
- speed / cost

---

## 7. Required Architectural Thinking

Please design the plan so that the MVP stays **simple, explainable, and buildable in a few days**.

Suggested high-level shape:

- **Frontend**: React.js (preferred) or Vue.js
- **Backend**: Node.js/Express or Python/Flask/FastAPI
- **Flow**:
  1. user submits form
  2. frontend sends request to backend
  3. backend queries music source
  4. backend performs filtering/ranking
  5. backend calls AI model for serendipity line
  6. frontend renders results

But do not blindly accept this shape if a simpler or better approach exists.  
If you recommend a different stack, explain why.

---

## 8. What You Should Deliver

Produce a **detailed development plan in markdown**.

Your response must include the following sections:

### 1. Product Understanding
Restate the project in clear engineering terms.

### 2. MVP Scope
Define what belongs in version 1 and what should be explicitly deferred.

### 3. Recommended Technical Approach
Choose a practical architecture and justify it.

### 4. File / Folder Structure
Propose a clean project structure for both frontend and backend.

### 5. Data Model / Domain Model
Describe what core entities and fields are needed.

Examples:
- input payload
- recommendation result
- music candidate
- serendipity output

### 6. Recommendation Logic
Describe how recommendations should be retrieved, filtered, ranked, and diversified.

Please explicitly address:
- exact match vs similar fallback
- diversity / non-repetition
- how to handle sparse or conflicting input
- how to prevent repetitive outputs

### 7. AI Prompt Design
Suggest prompt patterns for:
- serendipity line generation
- fallback generation when metadata is weak
- keeping output short, poetic, and not cheesy

### 8. Frontend Plan
Describe:
- main pages/components
- state flow
- form behavior
- loading / error states
- output card behavior
- reroll/surprise/share interactions

### 9. Backend Plan
Describe:
- API routes
- service responsibilities
- API integrations
- caching / rate-limit handling
- validation / sanitization

### 10. Key Code Snippets or Pseudocode
Show pseudocode for:
- frontend form submit flow
- backend recommendation endpoint
- recommendation/ranking function
- serendipity line generation call

### 11. Implementation Sequence
Suggest the order of building:
- mock-first or UI-first or backend-first
- recommended milestones over a few days

### 12. Risks and Challenges
Discuss:
- API rate limits
- inconsistent metadata
- poor creative text quality
- latency
- deployment issues
- edge cases

For each, suggest practical mitigation.

### 13. Phased Plan
End with:
- **Phase 1**: minimal buildable MVP
- **Phase 2**: delightful enhancements
- **Phase 3**: smarter future directions

---

## 9. Important Behavioral Instructions

When answering:

- Be practical, not idealistic.
- Prioritize buildability over overengineering.
- Prefer transparent logic over black-box AI.
- Treat AI generation as an enhancement layer, not the foundation of retrieval.
- Be explicit about trade-offs.
- Do not assume perfect metadata from external APIs.
- Do not propose anything that is unrealistic for a solo first-time builder in a few days.

If something is uncertain, say so and propose the simplest robust option.

---

## 10. Output Style

- Use markdown
- Use section headings clearly
- Use pseudocode where helpful
- Be concrete and implementation-oriented
- Keep the plan serious enough for a real engineering kickoff