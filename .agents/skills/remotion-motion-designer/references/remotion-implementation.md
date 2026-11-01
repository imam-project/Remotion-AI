# Remotion implementation notes

## First inspect the project

Check:
- `package.json` and lockfile to identify package manager, scripts, and installed Remotion version.
- Composition registration (commonly `src/Root.tsx`).
- Entry point and existing folder structure.
- `public/` assets and exact filenames.
- Existing conventions for styling, fonts, and components.

Do not scaffold a new project if the user already has a working one.

## Common frame-driven pattern

```tsx
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

export const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 18],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const translateY = interpolate(
    frame,
    [0, 18],
    [36, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080b12",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          color: "white",
          fontSize: 88,
          fontWeight: 700,
        }}
      >
        Hello Motion
      </div>
    </AbsoluteFill>
  );
};
```

This is an illustrative component. Adapt imports, types, and composition registration to the installed Remotion version and project setup.

## Sequence and local frames

When using `<Sequence>`, remember that child components generally receive a frame relative to the sequence start. Confirm the intended frame coordinate system before combining local and global timing.

## One timing source of truth

- Keep VO clip offsets, word-caption onsets, visual cues, scene holds/exits, and SFX cues in one named timeline manifest or data table.
- Have the composition and any separate SFX-generation script consume that same timing data. Avoid maintaining duplicate frame lists by hand, which can drift out of sync after a timing change.
- Derive frame positions and total duration from the composition fps and the approved timeline. Recheck that each entrance, internal action, hold, and exit fits its scene before previewing.

## Audio

- Check that the audio file exists in `public/`.
- Use `staticFile("audio/name.mp3")` for a file at `public/audio/name.mp3`.
- Confirm trim, volume, delay, and fade behavior in preview and final render.
- Keep audio licensing and user-provided assets in mind.

## Preview and render

Inspect `package.json` first. Common commands may include:
- `npm run dev` for a project-defined preview script.
- `npx remotion studio` for the Remotion Studio command where supported.
- `npx remotion render <composition-id> <output-file>` for rendering.

Do not assume the composition ID is `Main`; read the project registration. Do not assume a command is available without checking installed dependencies and scripts.
