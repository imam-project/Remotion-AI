import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
} from "remotion";

type MotionTitleProps = {
  title: string;
  subtitle?: string;
};

/**
 * Small reusable title entrance.
 * Timing is expressed in frames at the parent composition's fps.
 */
export const MotionTitle: React.FC<MotionTitleProps> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, 24], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(progress, [0, 1], [42, 0]);
  const opacity = progress;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: 96,
        color: "#f5f1e8",
        backgroundColor: "#090b12",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          fontSize: 92,
          lineHeight: 0.98,
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        {title}
      </div>

      {subtitle ? (
        <div
          style={{
            opacity,
            marginTop: 28,
            fontSize: 32,
            color: "#aeb5c2",
          }}
        >
          {subtitle}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
