import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type Props = {
  chapter: string;
  title: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
};

export const defaultProps: Props = {
  chapter: "Part 1",
  title: "Section Title",
  accentColor: "#ffffff",
  bgColor: "#111111",
  textColor: "#ffffff",
};

export const TitleCard: React.FC<Props> = ({ chapter, title, accentColor, bgColor, textColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames - 5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = Math.min(fadeIn, fadeOut);

  const chapterY = interpolate(fadeIn, [0, 1], [-20, 0]);
  const titleY = interpolate(fadeIn, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{ backgroundColor: bgColor, justifyContent: "center", alignItems: "center" }}
    >
      <div style={{ opacity, textAlign: "center", padding: "0 120px" }}>
        <div
          style={{
            fontSize: 22,
            color: accentColor,
            fontFamily: "sans-serif",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: 16,
            transform: `translateY(${chapterY}px)`,
          }}
        >
          {chapter}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: textColor,
            fontFamily: "sans-serif",
            lineHeight: 1.1,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
