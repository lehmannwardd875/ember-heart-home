# masterplan.md

## 🕊 30-Second Elevator Pitch
**Hearth** is a verified, emotionally intelligent dating platform for adults aged 45–65 who are ready to love again — safely, confidently, and at their own pace.  
It feels like a handwritten letter left by the fireplace: warm, grounded, and full of quiet hope.  
This isn’t another dating app. It’s a **home for hearts with history.**

---

## 💔 Problem & 🌟 Mission
**Problem:**  
Most dating apps are built for youth, speed, and surface — leaving mature adults feeling unseen, unsafe, and exhausted by swiping.  

**Mission:**  
Create an emotionally literate space where divorced or widowed professionals can rediscover love with **dignity, authenticity, and safety.**  
Every pixel should feel like a soft invitation to reconnect with hope.

---

## 🎯 Target Audience
- Divorced or widowed professionals (45–65)  
- Educated, emotionally mature adults seeking real companionship  
- Users who want emotional safety and intelligent matchmaking  
- Those tired of gamified, appearance-driven dating culture  

---

## 💫 Core Features
- **Verification-First Onboarding** — Persona / Onfido + optional LinkedIn check  
- **Narrative Profile Builder** — story-based design for authentic self-expression  
- **Guided Reflection Mode** — daily journaling prompts for emotional presence  
- **Curated Daily Matches** — one or two meaningful intros per day  
- **Private Chat Room** — calm, softly lit, verified-only space  
- **Optional Upsells** — Profile Makeover + Connection Coaching  
- **Phase 2: HearthCircle** — verified community events and discussions  

---

## ⚙️ High-Level Tech Stack
| Layer | Tool | Why |
|-------|------|-----|
| **Frontend** | Lovable (no-code) | Allows expressive, emotion-driven UI without complex dev overhead |
| **Backend** | Supabase or Airtable | Simple, secure data storage for profiles, reflections, and matches |
| **Verification** | Persona / Onfido + LinkedIn API | Builds immediate trust |
| **AI Layer** | “Ember” sentiment & tone model | Recommends connections, flags scams, and maintains emotional integrity |
| **Auth** | Email / Google OAuth | Familiar and secure |
| **Hosting** | Lovable Cloud / Vercel | Privacy-first, fast deployment |

---

## 🧩 Conceptual Data Model (in words)
**Entities:**
- **User:** name, age, profession, verification status, bio, taste cards, reflection entries  
- **Reflection:** user-written entry with timestamp, tone tags (private/shared)  
- **Match:** one-to-one link based on tone alignment + shared values  
- **Chat:** message stream between verified matches  
- **Circle:** (Phase 2) small, verified community discussion space  

**Relationships:**
- A *User* has many *Reflections*  
- Each *Match* connects two *Users*  
- *Chats* belong to a single *Match*  
- *Reflections* may appear in *Match Intros*  
- *Circles* have many *Users* (Phase 2)  

---

## 🎨 UI Design Principles (from Krug + Lovable Design Tips)
- **Don’t make me think:** one clear emotional action per screen  
- **Whitespace = warmth:** generous spacing, ivory backgrounds  
- **Typography:** soft-serif for titles (romance), humanist sans for readability  
- **Tone:** modern romanticism — gentle, intelligent, sincere  
- **Motion:** slow fade-ins, breathing animations, handwritten quotes  
- **Intent:** every detail reinforces safety, trust, and belonging  

---

## 🔐 Security & Compliance
- Full GDPR & CCPA compliance  
- End-to-end encrypted chat  
- Verification data handled by Persona/Onfido (not stored by Hearth)  
- AI tone analysis anonymized  
- No third-party data sales  
- Optional “Invisible Mode” for privacy and pacing  

---

## 🗺 Phased Roadmap
### **MVP (3 Months)**
- Verification-first onboarding  
- Narrative profile builder  
- Guided reflection journaling  
- 1–2 curated daily matches  
- Private verified chat  

### **V1 (6 Months)**
- AI “Ember” sentiment matching  
- Optional upsells (Profile Makeover, Connection Coach)  
- Reflection tone alignment in matching  
- Basic HearthCircle (small pilot groups)  

### **V2 (12+ Months)**
- Full HearthCircle community spaces  
- AI companion chat (“Ember” conversational mode)  
- Event & experience matching  
- Mobile app release (iOS + Android)  

---

## ⚠️ Risks & Mitigations
| Risk | Mitigation |
|------|-------------|
| Users hesitate to verify | Make verification feel like a trust ritual, not bureaucracy |
| AI tone mismatch | Keep AI advisory, not deterministic |
| Emotional fatigue | Encourage pacing and rest; Ember suggests “slow days” |
| Confusion with “dating apps” | Emphasize story, maturity, and reflection over swiping |

---

## 🌱 Future Expansion Ideas
- **Hearth Journal:** AI-assisted personal growth reflections  
- **Couples Mode:** private shared journaling for matches who connect deeply  
- **Offline Hearth Events:** verified in-person dinners, retreats, and workshops  
- **Partnerships:** Calm, Insight Timer, or Relationship Hero for guided support  

---

## 🪞 Closing Thought
**Hearth** is where trust meets tenderness.  
It’s not about algorithms or attraction mechanics — it’s about rediscovering what love feels like when it’s slow, sincere, and emotionally safe.  
A quiet revolution in modern dating: *a home for hearts with history.*
