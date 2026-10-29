# Instructions for work on Asterion
Read `EXPANSION_ROADMAP.md` before editing any Asterion narrative, pacing, UI, or APK build.

1. Distinguish three artifacts: the short public `asterion-demo/index.html`, the legacy anthology `dialogue-engine.js`, and the full offline Asterion Android game. The full game through v1.7 is **not stored in this repository** as of the roadmap's creation. Do not claim to change the APK by editing the demo or the anthology engine.
2. Before implementing the roadmap, import the **actual latest editable game source**, with the source owner's approval, into an isolated development worktree/repository. Do **not** upload signing keys, passwords, local save data or private files to GitHub. Verify file versions and Android signing continuity separately.
3. Preserve Asterion's identity reveal: label him UNKNOWN until he actually sends `Asterion.`. No pre-reveal spoilers via headers, icons, app launcher, archive or notifications.
4. Asterion is an autonomous character; a player's response isn't a command that must instantly execute. Every authored option needs a context-specific direct response. Choices must matter to continuity and later events.
5. Lengthen the game with interactions, investigations, consequences, relationship shifts, and plausible offline character tasks. Do not turn a ten-minute game into an hour with frozen reply timers.
6. Keep task timing persistent and resumable. Physical-event cues must have narrative causes. Keep sound, haptics, motion optional, and maintain legible type and scrollable endings.
7. For any patch, run graph validation across every node/choice and reachable ending, validate save migration and mid-message resume, and report measured active/elapsed runtime. Describe untested native-phone behavior clearly.
8. Never modify the existing public demo or publish a new APK solely to satisfy the roadmap unless specifically authorized for that artifact.
