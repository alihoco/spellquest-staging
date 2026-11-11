# Spellmaster Voice-First Teacher Contract v1.0

**Status:** Core instructional and safety specification; implementation/testing in progress, not a production-ready speech assessment.
**Purpose:** No learner needs to read interface instructions to complete a spelling lesson. Written spelling itself is displayed only when pedagogically appropriate.
**References:** [Teaching Method](SPELLQUEST_TEACHING_METHOD_V1.md), [Psychological Safety](PSYCHOLOGICAL_SAFETY_AND_FEEDBACK_V1.md), [Word Record](WORD_RECORD_SPEC.json).

## Instructional invariants
1. **Single start gesture:** One user tap initiates the narrated welcome and unlocks audio. Do not assume browser autoplay works before user interaction.
2. **Every stage is explained aloud:** Before each *new kind of task*, the narrator briefly says what happens and what response is expected. Instructions, success, feedback and next steps all use the same chosen natural voice, without silent TTS/browser fallback.
3. **Read no interface text by default:** Display large, simple controls and optional subtitles. Spoken instructions take priority. Written word/letters/graphemes appear during EXPLAIN and BUILD because seeing written spellings is essential to the instructional objective, not because reading instructions is required.
4. **Natural speech, verified linguistic content:** The teacher models the whole spoken word in context before isolating educator-approved syllables/phonemes. The spelling groups and spoken syllables are distinct data. Do not generate a presumed phoneme from a written chunk.
5. **Pace is responsive:** No rushing through phonemes. Pause for the learner's response; maintain short transitions with an explicit speaking/listening state. Offer replay, "more time", "continue", and pause. Never advance in silence due to network failure.
6. **Spoken input is optional:** With explicit microphone permission, a child can repeat whole words or phonemes. Stop listening while narrator audio plays; suppress echo. Do not record audio permanently by default; be transparent if a third-party recognition provider processes it.
7. **Separate detection, recognition and pronunciation evaluation:** (a) detect that speech occurred; (b) recognise a likely whole word; (c) assess phoneme articulation. Only (a) can safely support simple hands-free flow in early prototyping, and even this must tolerate noise. (b) requires confidence/retry and cannot determine whether pronunciation was accurate. (c) is disabled until specialist-validated against age-diverse speech, dialects, dyslexia-related variability and noise.
8. **Never shame on uncertain recognition:** If uncertain, replay the approved whole word and invite another attempt, or continue without speaking. Never say "You said it wrong" on ASR mismatch alone.
9. **Follow research-backed core:** Explicit sound-to-grapheme mapping, orthography, morphology, guided building, independent production, specific corrective feedback and delayed recall. Alternative Davis-inspired methods are opt-in/research-gated; no fixed learning-style labels.
10. **Reward truthful retention:** Supported answers are not mastery. No public comparisons, no gratuitous praise, no arbitrary failure states.
11. **Accessibility:** Manual controls always work when audio input fails or is denied. Subtitles available by request, but not necessary to proceed. Learner chooses audio pace and input method without affecting spelling level.
12. **Quality gates:** No public teaching launch until exact audio files and segment timings are listened to and approved; test on actual iOS Safari, Android Chrome and desktop browsers with adult and child speakers.

## Teacher conversation pattern

1. **Welcome** (after start): 'Welcome back. We'll practise a few words together. First I'll say a word. You can say it back if you'd like, then try spelling it. I can help at any time.'
2. **Whole word modelling:** Speak the word, optionally in one context sentence; allow repeat with no grading.
3. **Initial independent spelling:** Offer full alphabet tapping or keyboard and speak next action; hold response long enough for user input.
4. **If correct:** Give accurate, proportionate acknowledgement; schedule review; explain transition.
5. **If incorrect:** Give neutral supportive feedback ('Let's look at the tricky part'), model the whole word and an educator-verified sound/spelling correspondence.
6. **Supported building:** Offer relevant verified letter/grapheme tiles if needed; differentiate assisted from independent.
7. **Independent attempt:** Hide cues, speak whole word and explain how to respond.
8. **Review later:** Bring old and new words together, with honest recognition of delayed independent recall.

## Stateful audio contract

The frontend/voice engine must expose these states: `idle`, `teacher_speaking`, `learner_turn`, `checking`, `explaining`, `waiting_for_input`, `paused`, `audio_unavailable`.

- Every automatic transition **ends with a spoken instruction or a visible/touch-accessible action**.
- When speech playback fails, it enters `audio_unavailable` with an accessible retry action; **never silently changes to another accent**.
- A gesture-unlocked audio session may play narration sequentially, but browser audio activation policies must be tested, not assumed.
- Teacher playback and microphone capture must never overlap.
- Words, phonemes, graphemes and lesson phrases use separately approved audio clip IDs. Preload/caching is allowed, but never wait indefinitely; notify user if buffering.
- **Timing suggestions are design hypotheses:** natural speech, brief 0.3–0.8 second step transitions, 1.5–3 second optional response space (or longer chosen by learner), no fixed automatic cut-off in spelling entry. Critically, learner response time is not a spelling performance measure.
- Silence detection can end a spoken response only with a cautious, user-controlled timeout and manual continue fallback.
- User settings include narrator, preferred pace, optional microphone, speech-processing disclosure and no forced speech scoring.

## Speech recognition gates

| Capability | Prototype support | Release gate |
|---|---|---|
| Speech activity detection | Optional, local if supported | Noise/echo and timing test; no false-failure language |
| Whole-word speech-to-text | Experimental only | Device/browser/privacy and child-accent evaluation; uncertainty state |
| Phoneme-level correction | **Not approved** | Qualified speech-language and phonics review, labelled evaluation dataset, validation of error/false-positive rates by age/accent and independent study |
| Teaching the correct sound | Approved source audio only | Specialist reviewed recording and alignment |
| Child voice storage | Off by default | Explicit legal review and consent before any recording |

## Release acceptance criteria
- Start once → narrated welcome reliably completes → first spoken task begins.
- No child must read text to discover the next step.
- Each error state gives spoken, specific constructive next steps.
- Word is heard as a whole before any smaller linguistic unit.
- Any phonetic highlight is educator-annotated and synchronised to reviewed sound audio.
- Learner determines response duration; hands-free never removes manual escape.
- Audio failures and speech-recognition uncertainty do not make the child fail.
- The selected narrator remains consistent.
- Intervention and reward tracking are separate from microphone recognition.
- Personalisation is based on observed learning retention, not demographic or fixed learning-style proxies.

## Evidence / limitations
- IDA Structured Literacy: https://dyslexiaida.org/structured-literacy-effective-instruction-for-students-with-dyslexia-and-related-reading-difficulties/
- National Center on Improving Literacy, 2024: https://improvingliteracy.org/resource/features-of-structured-literacy-instruction/
- Children's automated speech analysis systematic review (2018), 32 studies: https://pubmed.ncbi.nlm.nih.gov/29996691/
- Web Speech API implementation and privacy: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API

Audio-first is a considered accessibility design. No claim is made that it alone is scientifically superior to an equally well-taught multimodal lesson.
