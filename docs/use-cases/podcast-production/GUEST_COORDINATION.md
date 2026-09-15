# Guest Coordination: Scripts and Interview Prep

This document explains how to prepare, script, and coordinate guest interviews for podcast episodes.

---

## When to Use Guests

Not every episode requires a guest, but guest interviews add:

- ✅ Expert credibility (lawyers, law enforcement, domain specialists)
- ✅ Diverse perspectives (victims, advocates, opposing viewpoints)
- ✅ Narrative variety (conversation breaks up narration)
- ✅ Audience engagement (guest stories resonate with listeners)
- ✅ Follow-up opportunities (guests can address listener questions)

**Consider NOT using guests when:**

- ❌ The story is self-contained and complete
- ❌ Production timeline is tight
- ❌ Scheduling conflicts make coordination difficult
- ❌ The episode works better as pure narration

---

## Guest Script Structure

A guest script differs from a main podcast script:

**Main Script:**
- Produced narration, fully written and rehearsed
- Precise timing and segment structure
- Host maintains narrative control

**Guest Script:**
- Conversational cues and questions
- Pause points for guest responses
- Flexible pacing for natural dialogue
- Ad-lib notes to encourage elaboration
- Q&A windows for guest contributions

---

## Guest Script Template

### Basic Format

```markdown
# Guest Script: [Episode Title]

**Guest Name:** [Name]  
**Guest Role:** [Title/Expertise]  
**Expected Runtime:** 8-12 minutes  
**Format:** [Single-part / Two-part]

---

## Background Context

[1-2 paragraphs of context for the guest to understand the episode focus]

---

## Part 1: Introduction and Setup

**HOST:** Welcome back to [Series Name]. I'm [your name], and today we're exploring [episode theme].

With me is [Guest Name], who [brief credentials]. [Guest Name], thanks for joining us.

**GUEST:** [PAUSE FOR RESPONSE]

**HOST:** Let me set the stage. [Provide context about case/topic].

**GUEST:** [PAUSE FOR RESPONSE]

---

## Part 2: Deep Dive

**HOST:** Let's talk about [specific claim or question].

[Explain background or context]

_[Ad-lib note: Encourage the guest to share a specific example from their experience]_

**GUEST:** [PAUSE FOR RESPONSE]

**HOST:** That's interesting because [reference their point, connect to series themes].

**GUEST:** [PAUSE FOR RESPONSE]

---

## Key Questions

If conversation lags, use these as prompts:

1. "Can you give us an example of [topic] from your work?"
2. "How does [case detail] compare to other cases you've seen?"
3. "What surprised you most about [aspect]?"
4. "What should listeners understand about [complex topic]?"

---

## Closing

**HOST:** [Guest Name], if someone wants to learn more about [topic], where should they start?

**GUEST:** [PAUSE FOR RESPONSE]

**HOST:** Thank you for joining us. Listeners, find more information in the show notes.

[END]
```

---

## Guest Preparation

### Step 1: Identify Guest Opportunities

From your episode configuration, list potential guest types:

```
Guest Opportunities (from EPISODE_CONFIG.json):
- Law enforcement official familiar with union politics
- Defense attorney specializing in addiction/sentencing
- Public health expert on opioid crisis
- DEA agent on controlled substance smuggling
- Medical professional on tapentadol addiction potential
```

### Step 2: Create Guest Profile

For each guest, document:

```json
{
  "guestName": "Dr. Jane Smith",
  "guestRole": "Criminal Justice Expert",
  "organization": "University of [State] School of Law",
  "expertise": ["federal sentencing", "disparities in criminal justice"],
  "recentWork": "Published study on addiction-based sentencing mitigation (2024)",
  "contactInfo": "jane.smith@university.edu",
  "bookingStatus": "pending",
  "interviewDate": null,
  "segmentInEpisode": "part-2-expert-commentary"
}
```

### Step 3: Send Pre-Interview Packet

Create a guest preparation package with:

1. **Episode Summary** (1 page)
   - Title, subject, key questions
   - Why their expertise matters

2. **Background Context** (1-2 pages)
   - Case overview or topic summary
   - Key facts and timeline
   - Why this matters to your audience

3. **Guest Script** (conversation guide, not a script to memorize)
   - Conversational flow
   - Key questions they'll be asked
   - Pause points where they'll speak

4. **Guest Checklist** (preparation checklist)
   - Technical setup instructions
   - Recording format and quality requirements
   - Practice tips

### Step 4: Pre-Interview Briefing

Before recording, confirm with the guest:

- [ ] They've reviewed the episode context
- [ ] They understand the 2-3 key questions
- [ ] They have specific examples prepared
- [ ] Technical setup is ready (microphone, quiet room)
- [ ] They know expected recording time
- [ ] They understand the series tone and audience

---

## Guest Script Examples

### Example 1: Expert Commentary (Criminal Justice)

```markdown
# Guest Script: Episode 1 — Federal Sentencing

**Guest:** Dr. Michael Chen, Federal Sentencing Reform Advocate  
**Duration:** 8-10 minutes  
**Topic:** How addiction becomes sentencing mitigation

---

## Part 1: Establishing Expertise (2 min)

**HOST:** We're talking today with Dr. Michael Chen, who has spent 15 years studying federal sentencing disparities. Dr. Chen, you've testified before Congress on this very issue—addiction and how courts use it to reduce sentences for federal crimes. Why did you want to talk about this case specifically?

**DR. CHEN:** [PAUSE]

_[Ad-lib note: Encourage a specific example from his research or testimony]_

**HOST:** That's really important context, because what we're seeing in Joanne Segovia's case is [case detail].

**DR. CHEN:** [PAUSE]

---

## Part 2: Analyzing the Case (4-5 min)

**HOST:** Let's look at the numbers. Segovia smuggled over 17,000 opioid pills and received zero jail time. How does that compare to what you see in typical federal drug distribution cases?

_[Guest should provide comparison statistics or examples]_

**DR. CHEN:** [PAUSE]

**HOST:** So the factor that made a difference here was the addiction narrative—the argument that Segovia herself was addicted to tapentadol. How common is this defense, and how successful is it?

_[Encourage specific statistics or precedent cases]_

**DR. CHEN:** [PAUSE]

**HOST:** What does that tell us about the justice system?

**DR. CHEN:** [PAUSE]

---

## Part 3: Broader Context (2-3 min)

**HOST:** If someone listening has a family member facing drug charges, what should they know about sentencing disparities based on your research?

_[Encourage practical advice]_

**DR. CHEN:** [PAUSE]

**HOST:** Dr. Chen, thank you for helping us understand this better.

[END]
```

### Example 2: Direct Experience (Law Enforcement)

```markdown
# Guest Script: Episode 3 — Building Inspection Corruption

**Guest:** Former SF Building Inspector John Martinez  
**Duration:** 6-8 minutes  
**Topic:** How corruption operates in permitting systems

---

## Part 1: Building Trust (2 min)

**HOST:** For this episode, we're talking with someone who spent 20 years in San Francisco building inspection. John Martinez, you worked in the same department where Rodolfo Pada operated for 14 years. You didn't work directly with him, but you saw the system from inside. What was your first reaction when you heard about his scheme?

**JOHN:** [PAUSE]

_[Ad-lib: Invite a personal anecdote about noticing something off]_

---

## Part 2: How It Happened (3-4 min)

**HOST:** Walk us through how one inspector could accept bribes for 14 years without getting caught. What would have to break down?

_[Look for: Lack of auditing, weak supervision, political protection, etc.]_

**JOHN:** [PAUSE]

**HOST:** Did you ever suspect corruption in your department?

_[Encourage specific stories or patterns he noticed]_

**JOHN:** [PAUSE]

---

## Part 3: The Real Impact (1-2 min)

**HOST:** Buildings passed inspection with his forged permits. What does that mean for San Francisco residents?

_[Safety risks, structural issues, liability]_

**JOHN:** [PAUSE]

**HOST:** John, thank you for sharing this.

[END]
```

---

## Guest Preparation Checklist

Create `guest-materials/checklist-[guest-name].md` for each guest:

```markdown
# Guest Preparation Checklist: [Guest Name]

## Before Recording

### Review Materials
- [ ] Read episode brief (2-3 pages)
- [ ] Review guest script (conversational guide)
- [ ] Understand episode focus and themes
- [ ] Prepare 2-3 specific examples from your expertise area

### Technical Setup
- [ ] Test audio equipment (microphone, headphones)
- [ ] Test internet connection (if remote)
- [ ] Close unnecessary applications
- [ ] Have water available
- [ ] Minimize background noise
- [ ] Use a quiet room (not a bathroom, kitchen, or high-traffic area)

### Content Preparation
- [ ] Write down 2-3 key statistics or examples you want to mention
- [ ] Prepare any anecdotes you plan to share
- [ ] Note any recent projects or publications relevant to the topic
- [ ] Think about how your expertise connects to this case/topic

### Logistics
- [ ] Confirm recording date/time
- [ ] Know who to contact if technical issues arise
- [ ] Understand what recording format will be used (Zoom, phone, in-person)
- [ ] Clarify how long you'll be recording

## During Recording

### Pacing
- [ ] Speak clearly at a moderate pace (not too fast)
- [ ] Allow time between your response and the next question
- [ ] Take natural pauses for the host's follow-ups
- [ ] Don't rush—good content is worth the extra time

### Quality
- [ ] Stay focused on the topic
- [ ] Provide specific examples (not generalizations)
- [ ] Explain technical terms in plain language
- [ ] Share personal insights when relevant
- [ ] If you're unsure, say "I'd need to fact-check that" (better than guessing)

### Engagement
- [ ] Show enthusiasm for the topic
- [ ] Respond to the host's questions directly
- [ ] Feel free to add relevant context
- [ ] Engage with the series' key questions

## Post-Recording

- [ ] Confirm when the episode will air
- [ ] Ask if you should promote on your social media
- [ ] Request episode link when it's published
- [ ] Review any show notes that mention your name/credentials

---

**Series:** [Series Name]  
**Episode:** [Episode Title]  
**Host:** [Your Name]  
**Recording Date:** [Date]  
**Runtime:** [Expected Duration]

---

_This guest appearance is part of [Series Name], an investigative [genre] podcast._
```

---

## Multi-Guest Episodes

Some episodes feature multiple guests:

```markdown
# Episode 4: The Investigation from Multiple Angles

**Format:** Three guests, each contributing 5-7 minutes

**Guest 1 (0:00-6:00):** Law enforcement perspective  
- Detective Sarah Williams  
- Federal corruption task force

**Guest 2 (6:00-12:00):** Legal analysis  
- Attorney Marcus Johnson  
- Federal sentencing expert

**Guest 3 (12:00-18:00):** Victim impact  
- Housing advocate Teresa Lopez  
- Impacted by housing project delays

**Closing (18:00-20:00):** Host synthesis and takeaways
```

**Key for Multi-Guest Episodes:**

- Introduce each guest separately
- Transition clearly between guests
- Have 1-2 minute bridges for host commentary
- Ensure each guest's segment has a clear arc (setup → main content → closing)
- Total recording time: 20-25 minutes (typically edited to 14-18)

---

## Remote vs. In-Person Recording

### Remote Recording (Zoom, Skype, Phone)

**Advantages:**
- Easier scheduling (no travel required)
- Guest can remain in comfortable environment
- Recording software captures both sides automatically

**Setup:**
```markdown
# Remote Recording Setup

1. **Schedule Zoom meeting** with guest
2. **Use Zoom's built-in recording** (cloud recording to your account)
3. **Have guest use wired headphones** (prevents echo)
4. **Test audio 5 minutes before** start time
5. **Have phone backup** in case internet fails
6. **Save recording immediately** after session ends
```

### In-Person Recording

**Advantages:**
- Best audio quality
- More natural conversation flow
- Easier to read body language and cues

**Setup:**
```markdown
# In-Person Recording Setup

1. **Book quiet location** (studio, quiet office, home)
2. **Bring 2 microphones** (one for each speaker)
3. **Use audio recorder or interface** (Zoom H5, Scarlett 2i2, etc.)
4. **Test sound levels** 10 minutes before
5. **Record in WAV format** (highest quality)
6. **Backup to two locations** after recording
```

---

## Fact-Checking Guest Contributions

After recording, verify any specific claims guests made:

```markdown
# Guest Fact-Check: [Guest Name]

## Claims Made During Interview

- [ ] "Claim 1" — Guest said this during [timestamp]
  - Verification: [Source and verification status]
  
- [ ] "Claim 2" — Guest said this during [timestamp]
  - Verification: [Source and verification status]

## Verification Status
- All claims verified: YES / NO
- Requires additional clarification: [Any claims to follow up on]
- Guest clarification: [Any needed follow-ups from the guest]
```

---

## Interview Transcript & Show Notes

Save guest interview transcripts in `source-materials/`:

```
source-materials/
└── guest-interviews/
    ├── dr-chen-transcript.md
    ├── john-martinez-transcript.md
    └── teresa-lopez-transcript.md
```

Use transcripts to:
1. Create show notes with timestamps
2. Pull quotes for social media
3. Verify guest claims
4. Track key discussion points

---

## Next Steps

1. **Identify potential guests** for your episode
2. **Create guest profiles** with contact info
3. **Generate guest script** using the conversational structure above
4. **Send pre-interview packet** with context and preparation materials
5. **Conduct pre-interview briefing** to confirm readiness
6. **Record interview** using appropriate setup
7. **Transcribe and verify** claims from interview
8. **Integrate into main script** with proper attribution

---

**Completed guest coordination?** Return to [Episode Development](./EPISODE_DEVELOPMENT.md) to continue production workflow.
