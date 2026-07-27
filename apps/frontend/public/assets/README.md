# Sprites

Everything in here is served as a static file — nothing is imported by the
bundler. See `docs/architecture/frontend.md` for which component reads which
directory.

| Directory  | Size  | What it holds                                       |
| ---------- | ----- | --------------------------------------------------- |
| `items/`   | 16×16 | One sprite per catalog slug, read by `ItemSprite`    |
| `icons/`   | 16×16 | UI glyphs matching the `IconName` union              |
| `rooms/`   | 16×16 | Junimo Note bundle pouches, one tone per room        |
| `avatars/` | 64×64 | Villager portraits handed out by `avatarForUser`     |

## Where the art came from

The item, icon, room and avatar sprites are Stardew Valley artwork, © ConcernedApe,
downloaded from the [Stardew Valley Wiki](https://stardewvalleywiki.com) and
scaled back down to native resolution. They are used here only as placeholder
art in a personal, non-commercial fan project, and this project is not
affiliated with or endorsed by ConcernedApe. Swap them out before shipping this
anywhere commercial.

Two exceptions are original work, because the game has no equivalent sprite:
`icons/check.png` and `icons/pin.png`.

`tex-cork.png` is the cork-board background texture used by the `cork` utility
in `index.css`.

## Refreshing

```sh
python3 tools/sprites/sync_sprites.py   # everything from the wiki
python3 tools/sprites/draw_glyphs.py    # the two hand-drawn glyphs
```

`sync_sprites.py` reads item names out of the backend catalog seed, so a new
catalog item picks up its sprite on the next run. Anything it cannot find on
the wiki is reported on stderr and needs a title override in that script.
