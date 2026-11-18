# Spellmaster gameplay: Word Journey winding-path reward mechanic (concept v1)

**Date:** 18 November 2026  
**Status:** Agreed design concept for later gameplay, not yet implemented or validated.

## The idea
A character travels a visually engaging crooked/winding path, following **the learner's saved visual spelling chunks, in their exact order**, to collect small rewards when a spelling is completed independently.

The character's route creates a spatial narrative of the spelling: each successive path waypoint corresponds to a correctly spelled chunk (not to an inferred phoneme, syllable or word meaning). Waypoints can zigzag across the screen, up and down, or around the scenery, but their **sequence** is fixed to the correct word. Animate each waypoint as the learner's chosen segment is revealed for *review or celebration*, not while the learner is doing an unassisted spelling test.

Example using the word **foreign**:
- If the learner saved **for | eign**, the character visits a waypoint for **for** and then one for **eign**.
- If the learner instead saved **for | e | ign**, there are three ordered waypoints.
- These are learner-chosen **visual mnemonic groupings only**. Do not claim they are the natural spoken syllables or teach "eign" as a sound.
- Every waypoint shows **correct letters** only. The completed route spells **foreign** exactly.

## Gameplay loop
1. The teacher teaches the word using approved, sound-first Structured Literacy content; an optional visual divider feature may save learner-specific positions.
2. Learner attempts whole-word independent spelling **without displaying target letters, chunks or a map of the answer**.
3. When correct, the character traverses the route one waypoint per saved visual chunk, collecting proportionate coins/tokens along the way. The animation can quietly reinforce the *spelling chunks* without asking the child to read instructions.
4. If incorrect, do not send the character down an apparently "wrong" spelling route or remove earned coins. Give diagnostic teaching feedback, then optionally display the **correct** route as a guided support activity before another unassisted attempt.
5. On a due delayed recall, use a small, familiar path challenge **after** retrieval to reinforce what remained known. The Word Vault remains a separate story state; successful delayed unaided recall may have greater celebratory weight than immediate correctness.
6. Support a short "Skip animation" control; no gameplay timer or required repeated animations.

## Adaptation and presentation
- **Route generation input:** `word_id`, correct `spelling`, verified teacher default `orthographic_chunks`, learner-selected `positions` if present, `appearance_theme`, `reward_tier`.
- Derive ordered chunks by slicing the **correct spelling** at validated boundary positions; ignore stale or invalid saved positions and fall back to approved default grouping.
- Use a deterministic route for a learner/word/grouping version so the same mnemonic route can reappear on later visits, but update if the learner deliberately saves a different split.
- Use varied coordinates, alternating left/right or a safe serpentine path; avoid distracting motion, letter overlap and too many camera movements.
- Support reduced motion, screen readers, keyboard/touch interaction and an age-respectful minimal animation option.
- Avoid showing a chunk label *before* the independent spell, because that would leak the answer and invalidate progress measurement.
- The same narrator can briefly acknowledge the completed word, but do not overpraise easy/repeated correct answers.

## Scientific and measurement boundaries
- This is an **unproven mnemonic/gameplay hypothesis**; do not claim path-following improves spelling, and do not change verified syllabification or phoneme mapping based on the route.
- Track uptake, skipped animations, route preference, and delayed **independent** word accuracy.
- In a future consented study, separate the effects of learner-selected dividers from those of seeing a path, collecting rewards, and additional exposure time. Match total exposure/time between arms so one more elaborate animation is not mistaken for a better teaching method.
- Store only a safe path seed/configuration derived from the learner's word grouping—not personal identifying information or raw speech.
- Co-design and test with dyslexic learners; aim for interest, not distraction or pressure.

**Release criterion:** Accurate letter reconstruction, no target leakage during unaided recall, no shame on error, motion/accessibility checks, and evidence collection distinct from claims of educational efficacy.
