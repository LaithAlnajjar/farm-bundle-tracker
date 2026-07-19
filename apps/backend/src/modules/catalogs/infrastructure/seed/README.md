# Standard catalog seed provenance

The canonical manifest targets **Stardew Valley 1.6.15** and contains only the
standard Community Center: six rooms, 30 bundles, and 129 possible slots. The
four Vault payments are represented as slots for the `gold` currency item so
they can use the same progress model as item donations.

Facts were reviewed on 2026-07-19 against:

- [Stardew Valley Wiki — Bundles](https://stardewvalleywiki.com/Bundles): room
  and bundle order, rewards, all standard requirements, quantities, minimum
  qualities, N-of-M rules, and season/availability notes.
- [Stardew Valley Wiki — raw bundle data format](https://stardewvalleywiki.com/Modding:Bundles):
  cross-check for the game data semantics of quantity, minimum quality, and
  required item count. Its embedded raw snapshot is older, so current rewards
  are taken from the current Bundles page.
- [Stardew Valley Wiki — Version History](https://stardewvalleywiki.com/Version_History):
  current PC version and the 1.6 bundle reward changes (River Fish now grants
  Deluxe Bait; Night Fishing now grants a Glow Ring).

The manifest paraphrases only factual availability details. It contains no
game artwork, sprites, dialogue, or narrative text.

`availability.seasons` is the normal outdoor growing, foraging, or catching
window intended for the board's season filter. A short `details` value records
the primary source and important alternate sources. The season filter does not
pretend that random Traveling Cart stock, saved items, Magic Bait, the
Greenhouse, or late-game locations make every item available year-round.

Structural changes are append-only releases. Removing or renaming a room,
bundle, item, or slot, or changing quantities, qualities, or required-slot
rules requires an explicit database migration or a new catalog version slug.
The seed command intentionally refuses that drift. Names, rewards,
availability metadata, categories, and display order are seed-owned and may be
updated in place without changing generated database IDs.
