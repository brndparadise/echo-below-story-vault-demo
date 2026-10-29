# Asterion: Long-Form Conversation Expansion
**Echo Below Studio™ | Beneath the Myth: Story I | Design target based on the full v1.7 APK source**

## Objective
The current game feels rushed despite its branching graph. Build a substantial, emotionally responsive, offline, single-character conversation game. Asterion must feel like a person acting inside an evolving labyrinth, not a scripted message dispenser. **Do not solve short runtime by simply adding timer delays.**

## Verified baseline (full v1.7 editable source, not GitHub's shorter public demo)
- 7 acts, 107 authored nodes, 8 ending outcomes.
- ~3,828 words of scene dialogue across all nodes (excluding options, reactions, epilogues). A representative traversal has ~54 nodes, ~195 incoming scene messages, ~2,118 scene-dialogue words; another route may vary.
- 153 authored choice-specific replies in `assets/reactions.js`.
- `assets/game.js` uses 0.64–7.8 sec per-message delays plus one specific ~2.5 sec silence. It does **not** model longer independent tasks/absences.
- `assets/story.js` holds authored graph, state and ending selection. `assets/labyrinth.js` handles 23 physical cues.
- GitHub currently contains `asterion-demo/index.html` (short promotional demo) plus an older anthology `dialogue-engine.js`. **Neither is the full v1.7 APK source. Do not overwrite the demo, apply patches to it as if it were v1.7, or claim the full game was updated via this repository until the full source is imported.**

## Product-level targets
- Aim initially for **60–90 minutes of meaningful first-run narrative**, assessed with actual player testing. Split active reading/choosing time from optional real-world wait time.
- Narrative length must come from discoveries, consequences, choices, time spent investigating, and changing relationships. No repetitive filler.
- Asterion remains **UNKNOWN** until he voluntarily reveals his name in a delivered message. Never reveal via headers, icon labels, chapter cards, notifications, file names visible to players, etc.
- Keep the player a correspondent, not Asterion's puppeteer: he may refuse directions, reconsider judgments, make his own choices, and report things that happened off-channel.
- Continue the existing mythology reimagining, names (Melas, Ion, Ariadne, Theseus, Daedalus), evidence/cup, prison mechanics, and eight endings unless story changes are specifically approved.
- Preserve accessible message size, compact header/footer, cinematic environment cues that reflect actual story events, and comfortable 44px+ tap targets.

## Narrative expansion map
**Act I — The First Knock:** establish the channel; test the two-knock convention; discover a repeatable way to communicate through stone; investigate guard steps and the chain before name reveal; make initial risk consequences visible.
**Act II — Names and Reflection:** well reflection, shame versus identity, memory of mother, careful examination of seven cuts; give player optional lines of inquiry and Asterion space to refuse a question.
**Act III — Seven Names:** investigate the names rather than instantly accepting answers; distinguish Ion's mark from the older six; recover evidence that changes what Asterion believes happened to Melas.
**Act IV — The Builder:** environment puzzle involving stone, bell timing, and the mechanism; player can advise but not physically manipulate the world; a failed attempt changes the later route instead of causing automatic success.
**Act V — The Red Thread:** negotiate with Ariadne, let Asterion test trust and boundaries; choose between restoring the thread, checking the tributes, or tracking a secondary route; track who Asterion promised to help.
**Act VI — The Stranger:** a gradual Theseus exchange, suspense between messages, credible reactions to fear; nonviolent options must be earned by evidence, not a single miraculous line.
**Act VII — The Last Door:** time pressure with meaningful tradeoffs; decisions from earlier investigations alter who can help, which routes are available, and how endings read. Do not introduce fake choices after the player's last meaningful decision.

## Timing model
1. **Composition delays** for an ordinary message scale with actual text length, sentence complexity, previous turn, and emotional effort. Keep quick acknowledgments quick.
2. **Activity windows** exist only when the story requires a physical task: traveling, searching, hiding, finding a route, waiting for footsteps, or changing a mechanism. Use authored foreground beats, not indefinite or artificial loading.
3. **Optional away-time**: Asterion can disconnect for an in-world reason and reconnect. Player should have a clear `He is away / Return later` state, a transparent non-spoiler way to skip downtime, and persistence through app backgrounding. Never force hours of idle time or use deceptive timers.
4. **Agency**: Asterion sends context-appropriate updates without player prompts after some tasks. He can take a different action if the player gave reckless advice.
5. **Resume**: returning to app shows the main screen, never accidentally erases progress. Scheduled messages and task windows survive restarts without duplicate delivery.

## Decision and memory specification
- Keep current `trust`, `warmth`, `clarity`, `courage`, flags/facts and ending conditions backward compatible.
- Add explicit persistent state for physical location, open question, active task, planned route, known evidence, NPC safety, relationship state, response due time, and whether the message was delivered.
- Different offered replies must receive semantically matching answers. Check resulting action for continuity. Never say he did an action the player told him not to do without acknowledging his reason.
- Important decisions affect later testimony, availability of assistance, or the epilogue, and are mentioned again in character.

## Immediate implementation milestones
**Phase 0 / audit and source import**: Bring full v1.7 assets/source into a development branch or a separate private repo (keep signing keystore out of GitHub). Preserve the existing public promotional demo untouched. Automated graph validation of scene links, save compatibility, playable end routes, and timing.
**Phase 1 / first-act prototype**: Expand opening through the name revelation with 3–5 meaningful new decision clusters; test one 15–20 minute opening route. Include at least two independent physical tasks that can conclude without a player choice; don't stall the whole app.
**Phase 2 / middle acts**: Add investigations with mutually exclusive clues and payoffs to the red-thread/Theseus/final-door scenes. Evaluate runtime with normal reading speed on a physical device.
**Phase 3 / ending fidelity and release readiness**: Test eight endings, record exact outcome conditions, verify small-screen scrolling, reduced motion, offline behavior, resume, and accessibility.

## Acceptance gates
- No dead scenes, broken links, skipped answer, duplicated dialogue, identity leak, accidental irreversible save reset or unscrollable ending.
- Every physical event cue (stone, knocks, chain, bell, moving walls, water) appears only in an appropriate scene. Motion and sound are optional and respectful of reduced motion.
- Track honest playtime: **active minutes** and **elapsed minutes** separately over several representative paths. Do not call waiting 'gameplay hours'.
- Same Android package/signing identity for compatible updates; increment versionCode. **Do not commit the signing keystore or passwords to public repositories.**
- No live AI required; game is authored and playable offline.

## Implementation notes for future agents
- Inspect the actual full source in the worktree before editing; the current online `asterion-demo/index.html` is deliberately short.
- Maintain a scene/choice graph changelog and a migration table whenever indexes change; old `pendingReply` saves must survive.
- Add tests for the exact question chosen and its immediate response, plus returning from background mid-reply.
- First validate each new beat narratively, then implement effects; effects without narrative meaning are rejected.
- Make one cohesive update at a time. Do not silently rewrite existing dialogue or make the game less readable.

_Last audited from v1.7 full source; future phases are a plan, not claims of completed implementation._
