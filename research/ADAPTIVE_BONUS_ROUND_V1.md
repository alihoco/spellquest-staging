# Spellmaster Adaptive Bonus Round — Pilot v1
Date: 18 November 2026
Status: Experimental stage-game feature, not a validated learning intervention.

## Purpose
Reinforce just-taught words through a quick **independent spelling recap** before a learner ends or continues a short adventure. Encourage recalling learner-chosen visual chunks mentally, but never display those chunks or the full word during a recall question.

## Adaptive entry
- **3 words** when at least two recently learned words required support or repeat attempts.
- **5 words** for typical learner progress when the last five include at least one supported/difficult word but not two among the first three.
- **10 words** when the learner is progressing fluently through first-try words. This is a ceiling of the current ten-word pilot, not a scientific dosage claim.
- The bonus triggers from successfully completed words *after* an initial word challenge, without consuming new-word slots. Words deliberately parked without success are excluded and remain eligible for later teaching.
- A learner may decline the bonus without punishment. Do not compel another session or punish a tired learner.

## Teaching loop
1. The narrator invites a voluntary 'Memory Challenge'.
2. Each word is spoken aloud; the learner spells independently using their normal input. Correct spelling, chosen dividers, letter banks and memory cues are entirely absent from the answer interface.
3. Between questions, give brief, non-shaming feedback. No full teaching lecture repeated. If incorrect, schedule relevant future practice rather than treating a recap error as failure.
4. A final score shows `correct / total`. A perfect round earns a proportional **immediate** bonus of **25 coins, 100 bonus points and **one avatar cosmetic item selected by the learner****. Partial rounds earn 2 coins and 10 bonus points per independently recalled spelling. Each perfect round grants one choice from a small set of unowned cosmetics (e.g. hat, glasses, trainers, coat, trousers, dress or hair); coin/point awards are idempotent by round ID. Already owned items are excluded.
5. All results are marked `same_session_recall`, **not** delayed mastery. Genuine retained learning still needs review on another day. Cosmetic rewards must not be interpreted as certification of spelling ability.
6. Allow the learner to finish or continue learning without pressure. Reward event IDs must be idempotent to prevent duplicates.
7. No real-money currency, loot boxes, public leaderboard, penalty for errors, loss of earlier coins or loss of existing achievements.

## Storage and implementation
- Browser-level `bonus-round.js` derives the adaptive selection and scores words; `year6.html` handles an audio-first recap and separates bonus events from due-delayed review.
- Local-only `learner_id` namespace holds coin balance, bonus-point total, selected avatar-item inventory and capped bonus history. Deleting a local tester profile removes its bonus records.
- These are temporary staging economy records, not a secure cloud account, an avatar shop or an actual avatar dressing room or outfit-rendering asset. No real cross-device entitlement exists yet.
- Narrator clips are served from `server.js`; voice playback needs manual device QA as do all staging audio flows.

## Quality and research checks
- Audio should announce bonus entry, each word, short feedback and finish. Verify on desktop/tablet/mobile, including replay and sound-off fallback.
- No word shown before the child submits; never preload teacher-suggested or learner-chosen split visuals in the answer.
- 3/5/10 are usability hypotheses. Measure practice fatigue, voluntary completion, accuracy and day 1/7/28 **independent** retention. Do not assume bonus round improves retention without a time-matched comparison.
- Child anxiety and reward proportionality require educator/child-development review.


## Learner-selected bonus cosmetic update

After a perfect same-session bonus round, the player chooses their own **free** avatar cosmetic from a small list. No predetermined hat is granted. Choice is saved in the learner's local inventory; unclaimed rewards can be selected from the home view later. The avatar's appearance is not yet visually equipped—this is an item-choice prototype. Future rewards must be age-respectful and avoid gender assumptions. All items are cosmetic only and do not affect spelling mastery.
