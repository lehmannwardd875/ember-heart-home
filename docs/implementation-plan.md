# implementation-plan.md

## 🧱 Step-by-Step Build Sequence

### Phase 1 — MVP (Trust, Story, Reflection)

1. **Project Setup**
   - Create workspace in **Lovable** for front-end structure.
   - Configure **Supabase or Airtable** for user, reflection, and match data.
   - Integrate **Persona / Onfido** API for ID + video verification.
   - Add optional LinkedIn verification (via domain or API).

2. **Verification-First Onboarding**
   - Collect: name, age, profession, alma mater (optional), selfie, short intro video.
   - Include calming copy: “Trust begins when we show up as ourselves.”
   - Flow: welcome → verify → confirm → soft success animation (warm glow).
   - Store verification token in backend (Persona ID only, not media).

3. **Narrative Profile Builder**
   - Inputs: profession, education, life focus line, reflection section, taste cards.
   - Enable preview mode — “Your story, beautifully told.”
   - Add optional hand-drawn dividers + quote styling.
   - Save data to Supabase table `profiles`.

4. **Guided Reflection Mode**
   - Short prompts: “What kind of connection would feel nourishing today?”
   - Timer-free, journal-style interface.
   - Option to mark reflection “private” or “share excerpt.”
   - Save to table `reflections` with user ID and tone tags.

5. **Curated Daily Matches**
   - Simple matching engine (shared tone + lifestyle).
   - Deliver 1–2 intros per day, reset at midnight local time.
   - Display shared reflections on match intro card.
   - Limit: 1 active chat at a time per user.

6. **Private Chat (Verified Only)**
   - UI: soft copper + sage, rounded corners, no timestamps by default.
   - Animation: fade-in, no ping or sound.
   - Optional “AI Trust Monitor” (Ember passive scan for scams).

7. **Optional Upsells**
   - **Profile Makeover ($49)**: integrates form for coach submission.
   - **Connection Coach Session:** video call scheduler link (Calendly or SavvyCal).

8. **Testing & QA**
   - Run 3-user test every two weeks.
   - Validate flows: onboarding → verify → build profile → reflect → match → chat.
   - Document confusions, adjust microcopy and pacing.

---

## 🕰 Timeline with Checkpoints

| Phase | Duration | Deliverables |
|-------|-----------|--------------|
| Week 1–2 | Project setup + verification onboarding |
| Week 3–4 | Narrative profile builder + reflection mode |
| Week 5–6 | Daily match + chat flow prototype |
| Week 7 | Integrate Ember (tone-based matching + scam detection) |
| Week 8 | QA + first user cohort soft launch |

---

## 👥 Team Roles & Rituals

**Roles**
- **Founder / Product Lead:** defines emotional tone, oversees user testing.
- **No-Code Builder:** constructs Lovable front-end + API connections.
- **Designer:** owns visual calm and brand warmth.
- **AI Engineer:** configures “Ember” sentiment and matching model.
- **Trust & Safety Lead:** handles verification flow + moderation.
- **Community Coach (Phase 2):** leads HearthCircle discussions.

**Rituals**
- **Monday Sync (15 min):** focus on user comfort and clarity.
- **Friday Reflection (30 min):** emotional audit — “Did this week’s build feel human?”
- **Bi-weekly 3-user test:** record feedback, iterate microcopy.
- **Monthly Brand Pulse:** confirm product still feels like “home.”

---

## 🔗 Optional Integrations & Stretch Goals

| Feature | Integration | Purpose |
|----------|--------------|----------|
| Email onboarding | Resend API | Warm welcome flow |
| Video intro upload | Mux or Cloudflare Stream | Smooth, secure media storage |
| Tone analysis | OpenAI API (lightweight) | Reflection sentiment |
| Coaching upsell | SavvyCal / Calendly | Session scheduling |
| Payment | Stripe | Secure one-time upsell payments |
| Community chat (V2) | Supabase Realtime / Pusher | Group interaction backend |

---

## ⚙️ Infrastructure Notes

- **Supabase schema:** users, profiles, reflections, matches, messages.
- **Security:** encryption at rest, API key protection, limited admin access.
- **Performance:** preload daily matches at midnight to prevent load spikes.
- **Monitoring:** track latency + emotional tone misreads (flag false positives).

---

## 💬 Launch Ritual
- Invite-only beta of 50 users (divorced/widowed professionals).
- Include emotional onboarding session: “Welcome Home to Hearth.”
- Conduct first 1:1 interviews after 7 days for emotional feedback.

---

## 🌤 Closing Note
Hearth isn’t just built for efficiency — it’s crafted for **emotional pacing**.  
Every screen and sentence must remind users:  
**“You’re safe here. You belong here. You have time.”**
