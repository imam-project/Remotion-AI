import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const C = {
  paper: "#FAFAFC",
  ink: "#16171B",
  muted: "#7E828C",
  line: "#E5E6EB",
  purple: "#6741D9",
  purpleLight: "#A889FF",
  blue: "#3478F6",
  cyan: "#42B9C5",
  lime: "#55C873",
  orange: "#F4A340",
  dark: "#15161B",
};

const CLAMP = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { easing: Easing.out(Easing.cubic), ...CLAMP });
const between = (frame: number, from: number, to: number, fade = 10) =>
  ease(frame, from, from + fade) * (1 - ease(frame, to - fade, to));

const VO = [
  { file: "voice-01.mp3", from: 0, duration: 95 },
  { file: "voice-02.mp3", from: 107, duration: 73 },
  { file: "voice-03.mp3", from: 192, duration: 122 },
  { file: "voice-04.mp3", from: 328, duration: 129 },
  { file: "voice-05.mp3", from: 471, duration: 116 },
  { file: "voice-06.mp3", from: 601, duration: 125 },
];

type CaptionWord = { text: string; color?: string; frame: number };
type CaptionLine = CaptionWord[];

const AppleCaption: React.FC<{
  frame: number;
  fps: number;
  from: number;
  to: number;
  lines: CaptionLine[];
  size?: number;
  holdToEnd?: boolean;
}> = ({ frame, fps, from, to, lines, size = 72, holdToEnd = false }) => {
  const fadeOut = holdToEnd ? 1 : 1 - ease(frame, to - 10, to);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 338, textAlign: "center", zIndex: 10, opacity: ease(frame, from, from + 6) * fadeOut }}>
      {lines.map((line, lineIndex) => {
        return (
          <div key={`${lineIndex}-${line[0]?.frame}`} style={{ display: "flex", justifyContent: "center", gap: 17, minHeight: size * 1.2, overflow: "visible" }}>
            {line.map((word, wordIndex) => {
              const wordSpring = spring({ frame: frame - word.frame, fps, config: { damping: 18, stiffness: 158, mass: 0.72 } });
              const reveal = ease(frame, word.frame, word.frame + 7);
              const blur = interpolate(reveal, [0, 1], [6, 0]);
              return (
                <span key={`${word.text}-${wordIndex}`} style={{
                  display: "inline-block",
                  color: word.color ?? C.ink,
                  fontSize: size,
                  lineHeight: 1.08,
                  letterSpacing: -3.5,
                  fontWeight: 720,
                  opacity: reveal,
                  filter: `blur(${blur}px)`,
                  transform: `translateY(${interpolate(wordSpring, [0, 1], [25, 0])}px) scale(${interpolate(wordSpring, [0, 1], [0.94, 1])})`,
                }}>{word.text}</span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const PopPill: React.FC<{
  frame: number;
  fps: number;
  from: number;
  label: string;
  color: string;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ frame, fps, from, label, color, icon, style }) => {
  const p = spring({ frame: frame - from, fps, config: { damping: 15, stiffness: 170, mass: 0.66 } });
  const opacity = ease(frame, from, from + 7);
  return (
    <div style={{
      position: "absolute", display: "flex", alignItems: "center", gap: 15,
      borderRadius: 999, padding: "17px 25px", background: color,
      color: "#FFFFFF", fontSize: 24, fontWeight: 650, letterSpacing: -0.3,
      boxShadow: "0 12px 28px #20243B24, inset 0 1px #FFFFFF40",
      opacity, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px) scale(${interpolate(p, [0, 1], [0.82, 1])})`,
      ...style,
    }}>
      {icon && <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, fontSize: 23 }}>{icon}</span>}
      {label}
    </div>
  );
};

const AeIcon: React.FC<{ frame: number; fps: number; from: number; to?: number; x: number; y: number; size?: number }> = ({ frame, fps, from, to = 660, x, y, size = 126 }) => {
  const p = spring({ frame: frame - from, fps, config: { damping: 15, stiffness: 155, mass: 0.7 } });
  const opacity = between(frame, from, to, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, textAlign: "center", opacity, transform: `translateY(${interpolate(p, [0, 1], [35, 0])}px) scale(${interpolate(p, [0, 1], [0.72, 1])})` }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.25, display: "grid", placeItems: "center", color: "#E9DEFF", fontSize: size * 0.48, fontWeight: 560, letterSpacing: -3, background: "linear-gradient(145deg, #351791, #7045E8 62%, #9A71FF)", border: "1px solid #FFFFFF80", boxShadow: "0 16px 34px #4A2AA533, inset 0 1px #FFFFFF55" }}>Ae</div>
      <div style={{ marginTop: 12, fontSize: 22, fontWeight: 620, color: C.ink }}>After Effects</div>
    </div>
  );
};

const RemotionIcon: React.FC<{ frame: number; fps: number; from: number; to?: number; x: number; y: number; size?: number }> = ({ frame, fps, from, to = 660, x, y, size = 126 }) => {
  const p = spring({ frame: frame - from, fps, config: { damping: 15, stiffness: 155, mass: 0.7 } });
  const opacity = between(frame, from, to, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, textAlign: "center", opacity, transform: `translateY(${interpolate(p, [0, 1], [35, 0])}px) scale(${interpolate(p, [0, 1], [0.72, 1])})` }}>
      <div style={{ width: size, height: size, borderRadius: size * 0.25, display: "grid", placeItems: "center", color: "white", fontSize: size * 0.51, fontWeight: 750, letterSpacing: -4, background: "linear-gradient(145deg, #262938, #12141B)", border: "1px solid #FFFFFFA0", boxShadow: "0 16px 34px #17192333, inset 0 1px #FFFFFF55" }}>R</div>
      <div style={{ marginTop: 12, fontSize: 22, fontWeight: 620, color: C.ink }}>Remotion</div>
    </div>
  );
};

const TimelineCard: React.FC<{ frame: number; fps: number; from: number; to: number; graph?: boolean; compact?: boolean }> = ({ frame, fps, from, to, graph = false, compact = false }) => {
  const p = spring({ frame: frame - from, fps, config: { damping: 18, stiffness: 135, mass: 0.84 } });
  const opacity = between(frame, from, to, 12);
  const height = compact ? 300 : 420;
  const rowTops = compact ? [99, 137, 175, 213] : [107, 164, 221, 278, 335];
  const colors = [C.purpleLight, C.blue, C.cyan, C.lime, "#B7BBC4"];
  const playX = interpolate(frame, [from, to - 20], [145, compact ? 670 : 775], { easing: Easing.inOut(Easing.cubic), ...CLAMP });
  const curveProgress = ease(frame, from + 8, from + 51);
  return (
    <div style={{ position: "absolute", left: compact ? 130 : 78, right: compact ? 130 : 78, top: compact ? 815 : 765, height, borderRadius: 26, background: C.dark, color: "#F6F6F8", border: "1px solid #343743", boxShadow: "0 24px 60px #24273326", overflow: "hidden", opacity, transform: `translateY(${interpolate(p, [0, 1], [55, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})` }}>
      <div style={{ position: "absolute", left: 25, right: 25, top: 21, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#B5B7C0", fontSize: 14, letterSpacing: 1.8, fontWeight: 650 }}>
        <span style={{ fontSize: 21 }}>{graph ? "AFTER EFFECTS · GRAPH EDITOR" : "AFTER EFFECTS · TIMELINE"}</span><span style={{ fontSize: 19 }}>{graph ? "SPEED GRAPH" : "COMPOSITION"}</span>
      </div>
      {graph ? (
        <div style={{ position: "absolute", left: 24, right: 24, top: 66, bottom: 24, borderRadius: 18, background: "#0D0E13", border: "1px solid #292C36", overflow: "hidden" }}>
          {Array.from({ length: 6 }, (_, i) => <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${(i + 1) * 14}%`, borderTop: "1px solid #292B35" }} />)}
          {Array.from({ length: 8 }, (_, i) => <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: `${(i + 1) * 11}%`, borderLeft: "1px solid #252832" }} />)}
          <svg width="100%" height="100%" viewBox="0 0 860 300" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
            <path d="M 28 253 C 206 253 244 245 349 181 S 541 65 826 32" fill="none" stroke={`${C.purpleLight}26`} strokeWidth="23" strokeLinecap="round" />
            <path d="M 28 253 C 206 253 244 245 349 181 S 541 65 826 32" fill="none" stroke={C.purpleLight} strokeWidth="5" strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - curveProgress)} />
            <g opacity={ease(frame, from + 27, from + 40)}>
              <line x1="240" y1="243" x2="349" y2="181" stroke={C.cyan} strokeDasharray="5 6" strokeWidth="2" />
              <line x1="349" y1="181" x2="522" y2="74" stroke={C.cyan} strokeDasharray="5 6" strokeWidth="2" />
              <circle cx="240" cy="243" r="8" fill="white" stroke={C.purpleLight} strokeWidth="4" />
              <circle cx="349" cy="181" r="8" fill="white" stroke={C.purpleLight} strokeWidth="4" />
              <circle cx="522" cy="74" r="8" fill="white" stroke={C.purpleLight} strokeWidth="4" />
            </g>
          </svg>
          <div style={{ position: "absolute", left: playX - (compact ? 130 : 78), top: 10, bottom: 10, borderLeft: `2px solid ${C.orange}`, boxShadow: `0 0 15px ${C.orange}66` }} />
        </div>
      ) : (
        <>
          <div style={{ position: "absolute", left: 28, right: 28, top: 58, height: 1, background: "#3A3D47" }} />
          {Array.from({ length: 9 }, (_, i) => <div key={`grid${i}`} style={{ position: "absolute", left: 145 + i * 78, top: 58, bottom: 17, borderLeft: "1px solid #292C35" }} />)}
          {rowTops.map((y, i) => (
            <React.Fragment key={y}>
              <div style={{ position: "absolute", left: 25, top: y, color: "#C4C6CD", fontSize: compact ? 18 : 20, letterSpacing: 1.1 }}>{["TITLE", "SHAPE", "CURVE", "GLOW", "CAMERA"][i]}</div>
              <div style={{ position: "absolute", left: 145, top: y - 6, width: `${[360, 555, 408, 510, 635][i]}px`, maxWidth: "69%", height: compact ? 15 : 22, borderRadius: 7, background: `${colors[i]}34`, border: `1px solid ${colors[i]}A0`, boxShadow: `inset 0 0 14px ${colors[i]}24` }} />
              {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 155 + k * 130 + i * 5, top: y + 1, width: 9, height: 9, background: colors[i], transform: "rotate(45deg)", opacity: 0.82 }} />)}
            </React.Fragment>
          ))}
          <div style={{ position: "absolute", left: playX, top: 48, bottom: 13, borderLeft: `2px solid ${C.orange}`, boxShadow: `0 0 14px ${C.orange}88` }} />
          <div style={{ position: "absolute", left: playX - 6, top: 51, width: 12, height: 12, background: C.orange, transform: "rotate(45deg)" }} />
        </>
      )}
    </div>
  );
};

const CodePill: React.FC<{ frame: number; fps: number; from: number; to: number }> = ({ frame, fps, from, to }) => {
  const p = spring({ frame: frame - from, fps, config: { damping: 16, stiffness: 150, mass: 0.8 } });
  const opacity = between(frame, from, to, 12);
  const lines = [
    ["const motion =", C.purple],
    ["spring({ frame, fps })", C.blue],
    ["damping: 18", C.orange],
    ["stiffness: 150", C.lime],
  ] as const;
  return (
    <div style={{ position: "absolute", left: 155, right: 155, top: 965, height: 230, borderRadius: 28, background: "#FFFFFF", border: `1px solid ${C.line}`, boxShadow: "0 23px 60px #30324018", opacity, transform: `translateY(${interpolate(p, [0, 1], [38, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})` }}>
      <div style={{ position: "absolute", left: 25, right: 25, top: 17, display: "flex", alignItems: "center", gap: 9, color: C.muted, fontSize: 20, letterSpacing: 1.1, fontWeight: 650 }}>
        <i style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF7268" }} /><i style={{ width: 9, height: 9, borderRadius: "50%", background: "#F9C84A" }} /><i style={{ width: 9, height: 9, borderRadius: "50%", background: "#60CA7D" }} /><span style={{ marginLeft: 6 }}>REMOTION / MOTION.TSX</span>
      </div>
      <div style={{ position: "absolute", left: 34, top: 56, fontFamily: "'SFMono-Regular', Consolas, monospace", fontSize: 24, lineHeight: 1.42 }}>
        {lines.map((item, i) => <div key={i} style={{ opacity: ease(frame, from + 3 + i * 3, from + 9 + i * 3), transform: `translateX(${interpolate(ease(frame, from + 3 + i * 3, from + 9 + i * 3), [0, 1], [8, 0])}px)` }}><span style={{ color: item[1], fontWeight: 650 }}>{item[0]}</span></div>)}
      </div>
      <div style={{ position: "absolute", right: 22, bottom: 14, borderRadius: 999, padding: "8px 13px", background: `${C.lime}1C`, color: "#278746", fontSize: 18, fontWeight: 700, letterSpacing: 1.1 }}>LIVE PREVIEW <span style={{ marginLeft: 7 }}>●</span></div>
    </div>
  );
};

const CollaborationCard: React.FC<{ frame: number; fps: number; from: number; to: number }> = ({ frame, fps, from, to }) => {
  const opacity = between(frame, from, to, 12);
  const p = spring({ frame: frame - from, fps, config: { damping: 17, stiffness: 138, mass: 0.82 } });
  const agentIn = ease(frame, from + 48, from + 56);
  const reply = ease(frame, from + 74, from + 111);
  return (
    <div style={{ position: "absolute", left: 85, right: 85, top: 768, height: 405, borderRadius: 30, background: "#FFFFFF", border: `1px solid ${C.line}`, boxShadow: "0 24px 64px #30324018", opacity, transform: `translateY(${interpolate(p, [0, 1], [45, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})` }}>
      <div style={{ position: "absolute", left: 28, top: 24, color: C.muted, fontSize: 18, fontWeight: 700, letterSpacing: 1.8 }}>IDEA TO MOTION</div>
      <div style={{ position: "absolute", left: 28, top: 80, width: 320, height: 103, borderRadius: 24, padding: "20px 22px", boxSizing: "border-box", background: "#F3F4F7", color: C.ink, fontSize: 18, lineHeight: 1.35 }}>
        “Buat transisi kurva yang<br />terasa halus dan responsif.”
        <div style={{ position: "absolute", right: 15, bottom: 11, color: C.muted, fontSize: 18, fontWeight: 700, letterSpacing: 1.2 }}>PROMPT</div>
      </div>
      <div style={{ position: "absolute", left: 28, top: 198, width: 320, height: 148, borderRadius: 23, padding: 18, boxSizing: "border-box", background: "#F9F7FF", border: `1px solid ${C.purple}20`, opacity: agentIn, transform: `translateY(${interpolate(agentIn, [0, 1], [22, 0])}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.purple, fontSize: 19, fontWeight: 750, letterSpacing: 1.5 }}><span style={{ color: C.orange }}>✦</span> AI AGENT</div>
        {[230, 188, 254].map((width, i) => <div key={i} style={{ marginTop: 15, height: 7, width: `${interpolate(reply, [0, 1], [15, width])}px`, borderRadius: 7, background: [C.purpleLight, C.blue, C.cyan][i], opacity: 0.8 }} />)}
      </div>
      <div style={{ position: "absolute", right: 28, top: 80, width: 455, height: 266, borderRadius: 25, background: "linear-gradient(145deg,#FBFCFF,#EEF2FA)", border: `1px solid ${C.line}`, overflow: "hidden", opacity: ease(frame, from + 74, from + 84) }}>
        <div style={{ position: "absolute", left: 20, top: 18, fontSize: 19, fontWeight: 700, letterSpacing: 1.3, color: C.muted }}>COMPOSITION PREVIEW</div>
        <div style={{ position: "absolute", left: 42, top: 59, fontSize: 32, lineHeight: 1, fontWeight: 740, letterSpacing: -1.5, color: C.ink, opacity: reply }}>Motion<br /><span style={{ color: C.purple }}>has a pulse.</span></div>
        <svg style={{ position: "absolute", right: 16, bottom: 30 }} width="200" height="90" viewBox="0 0 200 90"><path d="M 8 77 C 63 77 70 69 104 43 S 151 9 192 7" fill="none" stroke={C.cyan} strokeWidth="4" strokeLinecap="round" strokeDasharray="240" strokeDashoffset={240 * (1 - reply)} /></svg>
        <PopPill frame={frame} fps={fps} from={from + 74} label="Preview" color={C.blue} icon="▶" style={{ left: 25, bottom: 18, padding: "9px 16px", gap: 5, fontSize: 18 }} />
      </div>
    </div>
  );
};

const IterationCard: React.FC<{ frame: number; fps: number; from: number; to: number }> = ({ frame, fps, from, to }) => {
  const opacity = between(frame, from, to, 12);
  const p = spring({ frame: frame - from, fps, config: { damping: 18, stiffness: 140, mass: 0.82 } });
  const draw = ease(frame, from + 10, from + 80);
  const playX = interpolate(frame, [from + 8, from + 88], [0, 275], { easing: Easing.inOut(Easing.cubic), ...CLAMP });
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 760, height: 415, borderRadius: 30, background: "#FFFFFF", border: `1px solid ${C.line}`, boxShadow: "0 24px 64px #30324018", opacity, transform: `translateY(${interpolate(p, [0, 1], [48, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})` }}>
      <div style={{ position: "absolute", left: 25, top: 23, color: C.muted, fontSize: 18, fontWeight: 700, letterSpacing: 1.8 }}>ITERATION PREVIEW</div>
      <div style={{ position: "absolute", left: 24, top: 68, width: 310, height: 314, borderRadius: 24, background: "linear-gradient(145deg,#F4F6FC,#FFFFFF)", border: `1px solid ${C.line}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 26, top: 24, color: C.muted, fontSize: 19, fontWeight: 700, letterSpacing: 1.4 }}>LIVE COMPOSITION</div>
        <div style={{ position: "absolute", left: 27, top: 86, fontSize: 35, lineHeight: 1.02, fontWeight: 750, letterSpacing: -1.5, color: C.ink }}>Motion<br /><span style={{ color: C.purple }}>has a pulse.</span></div>
        <svg width="260" height="72" viewBox="0 0 260 72" style={{ position: "absolute", left: 25, bottom: 32 }}><path d="M 8 61 C 74 61 81 57 125 37 S 199 11 252 8" fill="none" stroke={C.cyan} strokeWidth="4" strokeLinecap="round" strokeDasharray="300" strokeDashoffset={300 * (1 - draw)} /></svg>
      </div>
      <div style={{ position: "absolute", right: 24, top: 68, width: 560, height: 314, borderRadius: 24, background: C.dark, border: "1px solid #343743", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 19, top: 15, color: "#C4C6CD", fontSize: 19, letterSpacing: 1.3, fontWeight: 700 }}>TIMELINE + CURVE</div>
        <div style={{ position: "absolute", left: 17, right: 17, top: 45, height: 130, borderRadius: 14, background: "#0D0E13", overflow: "hidden" }}>
          <svg width="100%" height="100%" viewBox="0 0 520 130" preserveAspectRatio="none"><path d="M 13 111 C 133 111 158 103 233 72 S 355 21 507 8" fill="none" stroke={`${C.purpleLight}38`} strokeWidth="17" strokeLinecap="round" /><path d="M 13 111 C 133 111 158 103 233 72 S 355 21 507 8" fill="none" stroke={C.purpleLight} strokeWidth="4" strokeLinecap="round" strokeDasharray="560" strokeDashoffset={560 * (1 - draw)} /></svg>
        </div>
        <div style={{ position: "absolute", left: 18, right: 18, top: 192, height: 101, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: playX, top: 0, bottom: 0, borderLeft: `2px solid ${C.orange}`, boxShadow: `0 0 12px ${C.orange}88` }} />
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 18 + i * 31, height: 17, borderRadius: 6, width: `${[74, 88, 61][i]}%`, background: [["#A889FF66", "#8C71F0"], ["#3478F666", "#3478F6"], ["#42B9C566", "#42B9C5"]][i][0], border: `1px solid ${[["#A889FF", "#8C71F0"], ["#3478F6", "#3478F6"], ["#42B9C5", "#42B9C5"]][i][0]}` }} />)}
        </div>
        <div style={{ position: "absolute", right: 17, bottom: 12, color: C.lime, fontSize: 18, fontWeight: 700, letterSpacing: 1.1 }}>TIMING REFINED <span style={{ marginLeft: 5 }}>●</span></div>
      </div>
    </div>
  );
};

const OutroOrbit: React.FC<{ frame: number; fps: number; to: number }> = ({ frame, fps, to }) => {
  const from = 603;
  const opacity = between(frame, from, to, 14);
  const p = spring({ frame: frame - from, fps, config: { damping: 16, stiffness: 132, mass: 0.8 } });
  const line = ease(frame, from + 12, from + 58);
  const float = Math.sin((frame - from) / 12) * 5;
  return (
    <div style={{ position: "absolute", left: 72, right: 72, top: 750, height: 430, opacity, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 18, bottom: 10, borderRadius: 36, background: "#FFFFFF", border: `1px solid ${C.line}`, boxShadow: "0 28px 78px #272A391A", transform: `translateY(${interpolate(p, [0, 1], [42, 0])}px) scale(${interpolate(p, [0, 1], [0.95, 1])})` }} />
      <svg width="100%" height="100%" viewBox="0 0 936 430" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path d="M 304 174 C 354 94 399 268 467 173 S 602 85 646 145" fill="none" stroke="#D8DAE2" strokeWidth="5" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520 * (1 - line)} />
        <circle cx="304" cy="174" r="7" fill={C.purple} opacity={line} />
        <circle cx="467" cy="173" r="9" fill={C.cyan} opacity={line} />
        <circle cx="646" cy="145" r="7" fill={C.blue} opacity={line} />
      </svg>

      <div style={{ position: "absolute", left: 48, top: 82, width: 256, height: 300, borderRadius: 27, overflow: "hidden", background: "linear-gradient(145deg,#F3F0FF,#F7FAFF 58%,#E9F8F5)", border: `1px solid ${C.line}`, boxShadow: "0 16px 40px #28304A18", transform: `translateY(${float}px)` }}>
        <div style={{ position: "absolute", width: 142, height: 142, borderRadius: "50%", left: 55, top: 45, background: "radial-gradient(circle at 35% 30%,#E8DFFF,#A889FF 55%,#6845D9)", boxShadow: "0 22px 48px #6741D933" }} />
        <div style={{ position: "absolute", left: 33, top: 171, width: 185, height: 55, borderRadius: 18, background: "#FFFFFFE8", border: `1px solid ${C.line}`, boxShadow: "0 11px 24px #34395414", transform: `translateX(${interpolate(line, [0, 1], [-20, 0])}px) rotate(-3deg)` }} />
        <div style={{ position: "absolute", left: 52, top: 245, width: 148, height: 20, borderRadius: 99, background: `${C.cyan}55` }} />
        <div style={{ position: "absolute", left: 52, top: 277, width: 97, height: 10, borderRadius: 99, background: "#D9DCE6" }} />
      </div>

      <div style={{ position: "absolute", left: 410, top: 130, width: 112, height: 112, borderRadius: 34, display: "grid", placeItems: "center", background: "linear-gradient(145deg,#4F8FFF,#3D63E8)", border: "1px solid #FFFFFFA8", boxShadow: "0 18px 40px #4278ED35", color: "white", fontSize: 47, transform: `translateY(${float * -0.7}px) rotate(${interpolate(p, [0, 1], [-13, 0])}deg) scale(${interpolate(p, [0, 1], [0.8, 1])})` }}>
        <svg width="62" height="62" viewBox="0 0 62 62"><path d="M31 4 37 24 58 31 37 37 31 58 24 37 4 31 24 24Z" fill="white" /><circle cx="49" cy="12" r="4" fill="#C8F56B" /></svg>
      </div>

      <div style={{ position: "absolute", right: 44, top: 78, width: 344, height: 208, borderRadius: 25, background: C.dark, border: "1px solid #343743", overflow: "hidden", boxShadow: "0 16px 40px #2527341A" }}>
        {Array.from({ length: 5 }, (_, i) => <div key={`gh${i}`} style={{ position: "absolute", left: 0, right: 0, top: `${(i + 1) * 16}%`, borderTop: "1px solid #292C36" }} />)}
        <svg width="100%" height="100%" viewBox="0 0 344 208" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
          <path d="M 21 171 C 99 171 120 164 163 123 S 238 52 324 29" fill="none" stroke={`${C.purpleLight}28`} strokeWidth="20" strokeLinecap="round" />
          <path d="M 21 171 C 99 171 120 164 163 123 S 238 52 324 29" fill="none" stroke={C.purpleLight} strokeWidth="4" strokeLinecap="round" strokeDasharray="360" strokeDashoffset={360 * (1 - line)} />
          <circle cx="163" cy="123" r="7" fill="white" stroke={C.cyan} strokeWidth="3" opacity={line} />
          <circle cx="238" cy="52" r="7" fill="white" stroke={C.cyan} strokeWidth="3" opacity={line} />
        </svg>
      </div>

      <div style={{ position: "absolute", right: 44, top: 311, width: 344, height: 70, borderRadius: 18, background: "#15161B", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: interpolate(line, [0, 1], [15, 329]), top: 8, bottom: 8, borderLeft: `2px solid ${C.orange}`, boxShadow: `0 0 12px ${C.orange}88` }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 18, top: 11 + i * 18, width: `${[56, 72, 44][i]}%`, height: 10, borderRadius: 5, background: [C.purple, C.blue, C.cyan][i], opacity: 0.84 }} />)}
      </div>
    </div>
  );
};

export const FirstRemotionVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, color: C.ink, fontFamily: "Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 51% 52%, #FFFFFF 0%, #FAFAFC 66%, #F5F6F9 100%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.5, background: "linear-gradient(180deg,#FFFFFF88,transparent 28%,transparent 82%,#F5F6F9AA)" }} />

      {/* Word reveals follow the VO; extra gaps let each sentence and scene breathe. */}
      <AppleCaption frame={frame} fps={fps} from={2} to={105} lines={[
        [{ text: "Biasanya", color: C.muted, frame: 2 }, { text: "motion-ku", frame: 16 }],
        [{ text: "dimulai", frame: 33 }, { text: "dari", frame: 45 }, { text: "timeline.", color: C.purple, frame: 71 }],
      ]} size={67} />
      <AppleCaption frame={frame} fps={fps} from={109} to={190} lines={[
        [{ text: "Kali", frame: 109 }, { text: "ini,", frame: 116 }],
        [{ text: "aku", frame: 137 }, { text: "mulai", frame: 146 }, { text: "dari", frame: 156 }, { text: "kode.", color: C.blue, frame: 165 }],
      ]} size={66} />
      <AppleCaption frame={frame} fps={fps} from={194} to={324} lines={[
        [{ text: "Aku", frame: 194 }, { text: "yang", frame: 200 }, { text: "biasa", frame: 207 }],
        [{ text: "pakai", frame: 213 }, { text: "After Effects,", color: C.purple, frame: 222 }],
        [{ text: "akhirnya", frame: 231 }, { text: "nyobain", frame: 243 }, { text: "Remotion.", color: C.blue, frame: 260 }],
      ]} size={62} />
      <AppleCaption frame={frame} fps={fps} from={330} to={467} lines={[
        [{ text: "Aku", frame: 330 }, { text: "ceritain", frame: 340 }, { text: "idenya,", frame: 352 }],
        [{ text: "AI", color: C.blue, frame: 379 }, { text: "agent", color: C.blue, frame: 387 }, { text: "bantu", frame: 398 }],
        [{ text: "nyusun", frame: 409 }, { text: "animasinya.", color: C.purple, frame: 421 }],
      ]} size={62} />
      <AppleCaption frame={frame} fps={fps} from={473} to={597} lines={[
        [{ text: "Lihat", frame: 473 }, { text: "hasilnya,", frame: 486 }],
        [{ text: "rapihin", frame: 513 }, { text: "timing,", color: C.blue, frame: 527 }],
        [{ text: "terus", frame: 552 }, { text: "coba", frame: 562 }, { text: "lagi.", color: C.purple, frame: 572 }],
      ]} size={65} />
      <AppleCaption frame={frame} fps={fps} from={603} to={650} lines={[
        [{ text: "Ini", frame: 603 }, { text: "percobaan", frame: 613 }, { text: "pertamaku.", color: C.purple, frame: 626 }],
      ]} size={62} />
      <AppleCaption frame={frame} fps={fps} from={662} to={726} holdToEnd lines={[
        [{ text: "Next,", frame: 662 }, { text: "kita", frame: 668 }, { text: "bikin", frame: 676 }],
        [{ text: "apa?", color: C.blue, frame: 684 }],
      ]} size={68} />

      {/* Familiar After Effects timeline and graph motifs are staged with the VO. */}
      <TimelineCard frame={frame} fps={fps} from={8} to={101} />
      <TimelineCard frame={frame} fps={fps} from={100} to={184} graph />

      {/* The Ae badge appears as the narration names After Effects, then hands off to Remotion. */}
      <AeIcon frame={frame} fps={fps} from={222} to={244} x={223} y={780} />
      <div style={{ position: "absolute", left: 474, top: 828, color: C.muted, fontSize: 42, fontWeight: 300, opacity: between(frame, 222, 278, 8), transform: `translateX(${interpolate(ease(frame, 222, 231), [0, 1], [-15, 0])}px)` }}>→</div>
      <RemotionIcon frame={frame} fps={fps} from={260} to={279} x={638} y={780} />
      <CodePill frame={frame} fps={fps} from={276} to={314} />

      <CollaborationCard frame={frame} fps={fps} from={318} to={466} />
      <IterationCard frame={frame} fps={fps} from={461} to={598} />

      {/* Ending visual connects both tools and the AI agent, filling the safe center with a clear payoff. */}
      <OutroOrbit frame={frame} fps={fps} to={726} />

      {VO.map((cue) => (
        <Sequence key={cue.file} from={cue.from} durationInFrames={cue.duration}>
          <Audio src={staticFile(`voice/${cue.file}`)} />
        </Sequence>
      ))}
      <Audio src={staticFile("audio/first-remotion-ui.wav")} volume={0.62} />

      {/* The essential action remains inside a conservative central safe area. */}
      <div style={{ position: "absolute", left: 86, right: 86, top: 92, height: 1, background: C.line, opacity: 0.8 }} />
      <div style={{ position: "absolute", left: 86, right: 86, bottom: 80, height: 1, background: C.line, opacity: 0.8 }} />
      <svg width="100%" height="100%" viewBox="0 0 1080 1920" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.1 }}>
        {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={(i * 173 + 41) % 1080} cy={(i * 317 + 109) % 1920} r={i % 5 === 0 ? 2 : 1} fill="#828794" />)}
      </svg>
    </AbsoluteFill>
  );
};
