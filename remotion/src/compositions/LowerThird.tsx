import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  name: string;
  title: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
};

export const defaultProps: Props = {
  name: "Creator Name",
  title: "Role or Location",
  accentColor: "#ffffff",
  bgColor: "rgba(0,0,0,0.75)",
  textColor: "#ffffff",
};

export const LowerThird: React.FC<Props> = ({ name, title, accentColor, bgColor, textColor }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slideIn = spring({ frame, fps, config: { damping: 18, stiffness: 100 } });
  const x = interpolate(slideIn, [0, 1], [-400, 0]);

  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames - 3], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const barWidth = spring({ frame: frame - 5, fps, config: { damping: 20, stiffness: 80 } });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 80,
          transform: `translateX(${x}px)`,
          opacity: fadeOut,
        }}
      >
        <div
          style={{
            width: `${barWidth * 5}px`,
            height: 4,
            backgroundColor: accentColor,
            marginBottom: 10,
          }}
        />
        <div
          style={{
            backgroundColor: bgColor,
            padding: "12px 24px",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 700, color: textColor, fontFamily: "sans-serif" }}>
            {name}
          </div>
          <div style={{ fontSize: 22, color: accentColor, fontFamily: "sans-serif", marginTop: 4 }}>
            {title}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
