import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  bg: "#0B0D14",
  panel: "#151923",
  panel2: "#1D2330",
  white: "#F6F4EE",
  muted: "#929AAA",
  line: "#343C4C",
  lime: "#C7F36B",
  coral: "#FF806A",
  cyan: "#7ED9D2",
};

const clamp = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    easing: Easing.out(Easing.cubic),
    ...clamp,
  });

const Word: React.FC<{
  children: React.ReactNode;
  start: number;
  frame: number;
  accent?: string;
}> = ({ children, start, frame, accent }) => {
  const p = ease(frame, start, start + 18);
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        paddingBottom: 8,
      }}
    >
      <span
        style={{
          display: "inline-block",
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [46, 0])}px)`,
          color: accent ?? C.white,
        }}
      >
        {children}
      </span>
    </span>
  );
};

const Tag: React.FC<{
  frame: number;
  start: number;
  x: number;
  y: number;
  label: string;
  color: string;
  drift: number;
}> = ({ frame, start, x, y, label, color, drift }) => {
  const { fps } = useVideoConfig();
  const floatIn = ease(frame, start + 12, start + 34);
  const p = spring({ frame: frame - (start + 12), fps, config: { damping: 17, stiffness: 145, mass: 0.8 } });
  const bob = Math.sin((frame - start) / 16 + drift) * 5 * floatIn;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "19px 25px",
        borderRadius: 999,
        background: C.panel2,
        border: `1px solid ${color}55`,
        color,
        fontSize: 24,
        fontWeight: 650,
        letterSpacing: 0.2,
        boxShadow: `0 16px 48px #0007, 0 0 30px ${color}18`,
        opacity: floatIn,
        transform: `translate(${interpolate(p, [0, 1], [drift * 70, 0])}px, ${interpolate(p, [0, 1], [38, 0]) + bob}px) scale(${interpolate(p, [0, 1], [0.88, 1])})`,
      }}
    >
      <span style={{ display: "inline-block", width: 11, height: 11, borderRadius: "50%", background: color, marginRight: 12, verticalAlign: 2 }} />
      {label}
    </div>
  );
};

export const MotionPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineOpacity = interpolate(frame, [0, 16, 306, 340], [0, 1, 1, 0], clamp);
  const capsuleP = spring({ frame: frame - 50, fps, config: { damping: 15, stiffness: 120, mass: 0.9 } });
  const cardP = spring({ frame: frame - 101, fps, config: { damping: 19, stiffness: 118, mass: 1 } });
  const cardExit = interpolate(frame, [300, 326], [1, 0], clamp);
  const curve = ease(frame, 118, 171);
  const emphasisA = interpolate(frame, [171, 194, 207, 225], [0.35, 1, 0.35, 0.35], clamp);
  const emphasisB = interpolate(frame, [195, 218, 232, 252], [0.35, 0.35, 1, 1], clamp);
  const playhead = interpolate(frame, [122, 237], [96, 790], { easing: Easing.inOut(Easing.cubic), ...clamp });
  const markP = spring({ frame: frame - 322, fps, config: { damping: 18, stiffness: 135, mass: 0.9 } });
  const lockOpacity = ease(frame, 322, 346);

  const gridLines = Array.from({ length: 6 }, (_, i) => i);
  const bars = Array.from({ length: 25 }, (_, i) => i);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        color: C.white,
        fontFamily: "Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        overflow: "hidden",
      }}
    >
      <Audio src={staticFile("audio/motion-pulse-ui.wav")} volume={0.82} />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 53% 44%, #222941 0%, #0B0D14 52%, #080A10 100%)",
          opacity: 0.88,
        }}
      />

      <div style={{ position: "absolute", left: 72, top: 112, color: C.muted, fontSize: 20, letterSpacing: 4, fontWeight: 650, opacity: ease(frame, 0, 24) }}>
        MOTION STUDY <span style={{ color: C.lime, marginLeft: 12 }}> / 01</span>
      </div>
      <div style={{ position: "absolute", right: 72, top: 112, color: "#687183", fontSize: 19, letterSpacing: 2, opacity: ease(frame, 0, 24) }}>
        00:12
      </div>

      {/* Word-by-word headline reveal */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 330,
          fontSize: 91,
          lineHeight: 1.1,
          fontWeight: 730,
          letterSpacing: -4.5,
          opacity: headlineOpacity,
        }}
      >
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <Word frame={frame} start={2}>Motion</Word>
          <Word frame={frame} start={9}>has</Word>
        </div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 3 }}>
          <Word frame={frame} start={18}>a</Word>
          <Word frame={frame} start={25} accent={C.lime}>pulse.</Word>
        </div>
      </div>

      {/* Capsule assembled from a dot and a stretching track */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 694,
          width: interpolate(capsuleP, [0, 1], [12, 440]),
          height: 76,
          borderRadius: 999,
          background: C.panel2,
          border: "1px solid #424B5D",
          boxShadow: "0 18px 55px #0008, 0 0 45px #C7F36B13",
          opacity: ease(frame, 50, 62) * interpolate(frame, [287, 310], [1, 0], clamp),
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
          gap: 17,
          overflow: "hidden",
        }}
      >
        <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.lime, boxShadow: `0 0 25px ${C.lime}88`, flex: "0 0 auto" }} />
        <span style={{ whiteSpace: "nowrap", color: C.white, fontSize: 23, fontWeight: 650, letterSpacing: 1.4, opacity: ease(frame, 60, 75) }}>MOTION CONTROL</span>
        <span style={{ marginLeft: "auto", marginRight: 21, color: C.muted, fontSize: 19, whiteSpace: "nowrap", opacity: ease(frame, 66, 82) }}>01 — 03</span>
      </div>

      {/* Primary motion card */}
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 872,
          width: 972,
          height: 510,
          borderRadius: 40,
          background: "linear-gradient(145deg, #1A202C, #11151E 78%)",
          border: "1px solid #30394A",
          boxShadow: "0 42px 120px #0009, inset 0 1px #FFFFFF0A",
          opacity: ease(frame, 101, 119) * cardExit,
          transform: `translateY(${interpolate(cardP, [0, 1], [110, 0])}px) scale(${interpolate(cardP, [0, 1], [0.93, 1])})`,
        }}
      >
        <div style={{ position: "absolute", left: 42, top: 38, color: C.muted, fontSize: 18, letterSpacing: 2.5, fontWeight: 650 }}>CURVE EDITOR</div>
        <div style={{ position: "absolute", right: 42, top: 36, color: "#6F7888", fontSize: 18 }}>F 000 — 100</div>
        <div style={{ position: "absolute", left: 42, top: 83, fontSize: 38, fontWeight: 680, letterSpacing: -1.5 }}>Movement profile</div>

        <div style={{ position: "absolute", left: 42, right: 42, top: 154, height: 224, borderRadius: 24, background: "#0C1018", border: "1px solid #262E3C", overflow: "hidden" }}>
          {gridLines.map((i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: `${(i + 1) * 14.3}%`, borderTop: "1px solid #252C39" }} />
          ))}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", borderLeft: "1px solid #252C39" }} />
          <svg width="100%" height="100%" viewBox="0 0 860 224" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="curveGlow" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor={C.cyan} />
                <stop offset="1" stopColor={C.lime} />
              </linearGradient>
            </defs>
            <path d="M 22 194 C 196 194, 230 179, 326 135 S 513 51, 838 30" fill="none" stroke="#C7F36B22" strokeWidth="18" strokeLinecap="round" />
            <path d="M 22 194 C 196 194, 230 179, 326 135 S 513 51, 838 30" fill="none" stroke="url(#curveGlow)" strokeWidth="5" strokeLinecap="round" strokeDasharray="880" strokeDashoffset={880 * (1 - curve)} />
          </svg>
          <div style={{ position: "absolute", top: 20, bottom: 20, left: playhead, width: 2, background: "#F6F4EE66", boxShadow: "0 0 18px #C7F36B44" }} />
          <div style={{ position: "absolute", left: playhead - 8, top: 116, width: 17, height: 17, borderRadius: "50%", background: C.lime, border: "3px solid #11151E", boxShadow: `0 0 22px ${C.lime}AA` }} />
        </div>

        <div style={{ position: "absolute", left: 42, right: 42, bottom: 38, display: "flex", gap: 14 }}>
          {[
            { name: "WEIGHT", color: C.coral, opacity: emphasisA },
            { name: "TIMING", color: C.lime, opacity: emphasisB },
            { name: "FLOW", color: C.cyan, opacity: interpolate(frame, [225, 244], [0.35, 0.85], clamp) },
          ].map((item) => (
            <div key={item.name} style={{ flex: 1, padding: "15px 18px", borderRadius: 17, border: `1px solid ${item.color}44`, background: `${item.color}0D`, color: item.color, opacity: item.opacity, fontSize: 17, letterSpacing: 2, fontWeight: 700, textAlign: "center", textShadow: `0 0 ${item.opacity * 20}px ${item.color}88` }}>
              {item.name}
            </div>
          ))}
        </div>
      </div>

      {/* A playhead with independently drifting tags */}
      <Tag frame={frame} start={239} x={80} y={1473} label="EASE OUT" color={C.cyan} drift={-1} />
      <Tag frame={frame} start={247} x={470} y={1546} label="SETTLE" color={C.lime} drift={1.1} />
      <Tag frame={frame} start={255} x={320} y={1404} label="OVERLAP" color={C.coral} drift={-0.7} />

      {/* Final mark: the interface resolves into a small graphic signature */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          top: 788,
          height: 180,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: lockOpacity,
          transform: `translateY(${interpolate(markP, [0, 1], [54, 0])}px) scale(${interpolate(markP, [0, 1], [0.9, 1])})`,
        }}
      >
        <div style={{ width: 62, height: 62, borderRadius: 22, background: C.lime, transform: `rotate(${interpolate(markP, [0, 1], [-14, 0])}deg)`, boxShadow: `0 0 48px ${C.lime}55` }} />
        <div style={{ fontSize: 54, fontWeight: 720, letterSpacing: -2.6, lineHeight: 1.05 }}>Designed to flow</div>
      </div>

      <div style={{ position: "absolute", left: 72, bottom: 112, right: 72, height: 1, background: "#343C4C", opacity: ease(frame, 280, 310) }} />
      <div style={{ position: "absolute", left: 72, bottom: 68, color: C.muted, fontSize: 17, letterSpacing: 3, opacity: ease(frame, 280, 310) }}>EXPERIMENT 01</div>
      <div style={{ position: "absolute", right: 72, bottom: 68, color: C.muted, fontSize: 17, letterSpacing: 2, opacity: ease(frame, 280, 310) }}>WEIGHT · TIMING · FLOW</div>

      {/* fine grain made from fixed, sparse vector specks */}
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.09 }}>
        {bars.map((i) => (
          <circle key={i} cx={(i * 173 + 41) % 1080} cy={(i * 317 + 109) % 1920} r={i % 4 === 0 ? 2 : 1} fill="#F6F4EE" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
