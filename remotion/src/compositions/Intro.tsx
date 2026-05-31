import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  brandName: string;
  tagline: string;
  accentColor: string;
  textColor: string;
  bgColor: string;
};

export const defaultProps: Props = {
  brandName: "Studio Name",
  tagline: "Your tagline here",
  accentColor: "#ffffff",
  textColor: "#ffffff",
  bgColor: "#111111",
};

export const Intro: React.FC<Props> = ({
  brandName,
  tagline,
  accentColor,
  textColor,
  bgColor,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const nameOpacity = spring({ frame, fps, config: { damping: 20, stiffness: 80 } });
  const nameY = interpolate(nameOpacity, [0, 1], [40, 0]);

  const taglineOpacity = spring({ frame: frame - 18, fps, config: { damping: 20, stiffness: 80 } });
  const taglineY = interpolate(taglineOpacity, [0, 1], [20, 0]);

  const lineScale = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 60 } });

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: fadeOut, textAlign: "center" }}>
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            fontSize: 80,
            fontWeight: 700,
            color: textColor,
            fontFamily: "sans-serif",
            letterSpacing: "-2px",
          }}
        >
          {brandName}
        </div>

        <div
          style={{
            width: `${lineScale * 120}px`,
            height: 3,
            backgroundColor: accentColor,
            margin: "16px auto",
          }}
        />

        <div
          style={{
            opacity: Math.max(0, taglineOpacity),
            transform: `translateY(${taglineY}px)`,
            fontSize: 28,
            color: textColor,
            fontFamily: "sans-serif",
            opacity: taglineOpacity * 0.7,
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          {tagline}
        </div>
      </div>
    </AbsoluteFill>
  );
};
