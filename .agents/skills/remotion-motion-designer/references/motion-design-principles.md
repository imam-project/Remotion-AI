# Motion design principles for Remotion

This reference is a practical checklist, not a rigid formula. The creative brief and reference material take priority.

## A simple movement arc

For a typical entrance:
1. **Prepare**: establish the element or create a small anticipation.
2. **Move**: perform the main movement with intentional acceleration/deceleration.
3. **Settle**: reduce residual motion without unnecessary bounce.
4. **Hold**: give the viewer enough time to read or understand.

For an impact:
1. Anticipation or compression.
2. Fast action.
3. Contact/flash or strongest visual event.
4. Secondary response: recoil, debris, ripple, or shake.
5. Settle and recovery.

Not every animation needs all stages.

## Choosing interpolation

- Use `interpolate()` when the animation should follow a predictable timeline.
- Use `spring()` when a physical response is useful, such as a card settling into place.
- Use `Easing` to shape acceleration and deceleration.
- Clamp output when an element must stop at a final value.
- Keep overshoot intentional and controlled.

## Camera-like movement

A camera move is usually a coordinated transformation of a scene container:
- Dolly in/out: change scale and position subtly; preserve a stable focal point.
- Pan: translate the scene while maintaining composition.
- Orbit: requires coordinated position/scale/parallax cues; a flat 2D transform alone does not create true 3D.
- Parallax: separate foreground, subject, and background into layers with different movement rates.
- Handheld: use restrained, deterministic movement; avoid arbitrary jitter.

## Typography

- Prioritize reading order, line length, contrast, and spacing.
- Animate position, opacity, scale, masks, or tracking with a clear purpose.
- Keep important text on screen long enough to read.
- Check the composition at its actual output size, not only in a large preview.

## Particles and visual effects

- Use seeded, deterministic particle positions.
- Keep particle count proportional to the visual importance of the event.
- Use motion blur, glow, grain, and shake sparingly.
- Prefer a few well-staged elements over many competing effects.
- Test filters and SVG effects in preview and render; browser preview performance may differ from final rendering.

## Frame-based timing

For a composition with `fps` frames per second:

`frame = seconds * fps`

Use the composition's actual fps. Avoid hard-coding a 30 fps conversion if the composition may change.
