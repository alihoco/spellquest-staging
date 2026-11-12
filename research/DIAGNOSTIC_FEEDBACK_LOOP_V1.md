# Spellmaster diagnostic feedback loop — foundational teaching requirement v1

**Status:** Core product acceptance standard, 12 November 2026. This is a teaching-design requirement, not a claim that every inference is clinically validated.

## Non-negotiable sequence

**Observe → Identify → Explain → Equip → Retry → Revisit → Adapt.**

1. **Observe:** Capture the learner's actual attempt and context: target word, assisted versus independent entry, prior exposure, and relevant history. Do not use speech-recognition uncertainty to infer spelling skill.
2. **Identify:** Compare with the **correct orthography**, identify one supported difficulty (e.g., omitted doubled consonant, reversed letter order, missing letter, morphology), or explicitly mark uncertainty. An edit-distance mismatch is not proof of a cognitive cause.
3. **Explain:** Tell the learner about the specific correct pattern in concise, age-respectful, voice-first language. Avoid blame, negative judgments, faux certainty and reciting the whole lesson.
4. **Equip:** Offer one *reviewed* memory tool or meaningful support appropriate to that mistake (correct grapheme highlight, accurate morphology, familiar word family, meaningful sentence, optional Meaning & Making). Do not invent phoneme break-downs, etymology or fixed learning-style labels.
5. **Retry:** Hide the model at **independent recall**, but do not repeatedly announce the obvious. Provide manual accessible spelling entry. Never count shown letters, recognition choices or scaffolded assembly as unaided mastery.
6. **Revisit:** Schedule short delayed recall with older words interleaved. A first-try correct word needs little teaching, but is not proven mastered; recurrent missed words need a different strategy or rest.
7. **Adapt:** Use evidence of *delayed independent spelling* and learner comfort to adjust the future mix, teaching strategy and dosage; never infer a definitive learning style from one error or short-term result.

## Escalation by response
- **Known first attempt:** acknowledge proportionately, collect as provisional, schedule later recall; offer new content.
- **First error with recognised pattern:** specific correction and short accurate instruction.
- **Uncertain first error:** show the correctly spelled word, focus on a region and ask the learner to notice; avoid attributing motive or phonology.
- **Second attempt unsuccessful:** one short **different** targeted prompt or verified alternative activity, rather than replaying the complete presentation.
- **Further difficulty:** optional different format (meaning/visual manipulation) or recovery quest later. No punishment, forced streak or lost earned progress.
- **Long-term retrieval success:** acknowledge more strongly only after robust delayed independent checks.

## Quality gates for each word
- Confirm exact pattern detection includes common plausible attempts and does not confuse multiple simultaneous errors.
- Human-review specific correction scripts and any audio; support regional accent variation.
- If a correction needs phonological or morphological claims, require qualified linguistic/structured-literacy review.
- All user-facing narration should be concise, warm and free of gratuitous congratulations.
- Include tests proving an observed mistake leads to its matching advice; unknown patterns get a cautious fallback; consecutive failures do not loop identical lectures.
- Record word, error category and assistance level without unnecessary raw child-input retention, respecting parental consent and privacy.
- Measure *later unaided spelling* as the principal outcome, rather than same-session memorisation or enthusiasm alone.

## Implementation status
- Staging has an initial *rule-based* error-category matcher (`spelling-feedback.js`) and short voice clips. Not all possible mistakes can be diagnosed, and heuristic letter-position advice is not itself a teaching explanation.
- The headless teaching core offers review scheduling and separate assisted/independent grades, but is **not yet fully wired** to live staging and does not constitute a validated individualised tutoring system.
- The A/B/C Meaning & Making study is a research protocol, **not** deployed proof of a better teaching method.

This feedback loop should be a release criterion for every new word and every new gameplay mechanic. New art, rewards or dialogue must not displace it.
