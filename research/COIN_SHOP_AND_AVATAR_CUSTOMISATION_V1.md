# Spellmaster Coin Shop, Avatar Customisation and Adventure Upgrades — v1

**Created:** 18 November 2026  
**Status:** Future gameplay design specification; not implemented, not validated with learners.

## Vision
Every learner has a private shop where coins earned through genuine learning progress can be exchanged for optional cosmetic avatar and adventure customisations. The coin shop adds agency, long-term motivation and a playful destination for achievements. It must **never** influence the accuracy of spelling scores, access to high-quality teaching or the ability to learn.

## Shop departments
1. **Avatar appearance:** Clothes, hats, shoes, hairstyles, colours, glasses, accessories, expressive poses and age-respectful styles. No identity-sensitive inferences.
2. **World customisation:** Personal backgrounds, landscapes, path tiles, camps, vault rooms, home bases, colour schemes and ambient effects, with reduced-motion/audio toggles.
3. **Adventure tools:** Decorative backpacks, treasure maps, lanterns, shields, magic keys, magnifying glasses and story gadgets. They must not buy phonics hints or easier mastery scores.
4. **Companions:** Friendly pets/creatures, optional non-combat characters and collectibles.
5. **Optional minigames:** Self-contained, age-respectful, accessible and ideally linked to independently recalled spellings, but no gameplay purchase may lock the normal learning journey.
6. **Personal milestones:** Display cases, trophies, banners and room decorations derived from genuine delayed learning; these achievements remain permanently earned even if coins are spent.

## Economy rules
- **No real-money transactions, premium currency, advertising, loot boxes, chance-based purchases or paid shortcuts.**
- Currency is earned through well-defined and proportionate learning actions. Reward durable independent retention more than supported immediate production; award small participation/progress recognition without pretending it is mastery.
- Coins are spendable; **mastery and Word Vault achievement history are not.** Spending never reduces learner progress or loses words.
- No negative coin balances, penalties for incorrect spellings, coin theft, timed purchase pressure, forced streaks, gambling loops, countdown offers or irreversible mistakes.
- Shop inventory and cosmetics should be obtainable through reasonable voluntary practice, not excessive daily screen time. Do not design for compulsive engagement.
- Let the learner preview an item and undo or equip a different owned item without spending again.
- Make purchases explicit, clear and reversible by a simple refund/undo policy, especially for children. Parent controls may disable shop completely.
- Avoid peer rankings, visible wealth comparisons, social gifting or manipulative scarcity.
- Different ages can see distinct theme styles while their purchased content persists as they mature; learner overrides remain available.

## Technical data model
- **Coin ledger (server-authoritative in production):** append-only `transaction_id`, `learner_id`, `event_id`, `amount`, `type` (earn/spend/refund/admin_adjustment), `created_at`; idempotent rewards prevent double crediting.
- **Items:** stable `item_id`, type, theme tags, age-appropriate presentation, accessible label, price, visual asset reference, availability and optional dependencies.
- **Inventory:** learner/item ownership, purchase timestamp; unique per learner and item.
- **Equipped avatar/world:** slot and owned item ID; validate entitlements and safe combinations.
- **Mastery:** never calculated from balance, cosmetics, shop purchases or animation completion.
- The existing pseudonymous profiles and local Word Vault are experimental; do not expose a pretend secure shop economy without authenticated learner isolation.

## UX concept
A friendly 'My Shop' or 'Explorer's Workshop' link on the home base. The child sees their coin balance, their character and a small selection of achievable upgrades. Category tiles and previews are large and easy to use on tablet, desktop and mobile. All instructions can be narrated. The teacher remains available but does not repeatedly interrupt the learning experience with shopping prompts.

A shopper may change the avatar's look and scenery while keeping its personal Word Journey paths intact. When a spelling is correct, path coins are collected after the independent response and added to the balance. After delayed independent recall, a larger milestone may be celebrated proportionately.

## Teaching/psychological constraints
- The shop is downstream of the teaching loop: **Observe → Identify → Explain → Equip → Retry → Revisit → Adapt**.
- The teacher should not use phrases such as 'you failed, so no coins'; an incorrect attempt becomes a helpful recovery quest without a financial punishment.
- Rewards should reflect genuine achievement. Do not reward every click or manipulate the learner into more exposure.
- A learner opting out of the shop must still receive a fully featured, accessible lesson.

## Validation plan
- Measure optional shop usage, spending patterns, ease of navigation, voluntary return and learner enjoyment.
- Check whether presence of cosmetic rewards changes delayed unaided spelling, distractibility, practice duration, fatigue or anxiety. Avoid inferring effectiveness from engagement alone.
- Ethically and methodologically reviewed comparison with comparable content/time would be necessary to make claims about learning benefits.
- Review with child development and dyslexia specialists, including accessibility and age-taste testing.
- Apply privacy safeguards and guardian controls; all child data processing requires the appropriate legal/privacy assessment.

**Release gate:** No real currency; no influence on mastery; secure profile ownership; high privacy defaults; accessible shop; clear purchase undo; ethical learning and engagement review.
