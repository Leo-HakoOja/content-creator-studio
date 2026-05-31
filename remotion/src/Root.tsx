import "./index.css";
import { Composition } from "remotion";
import { Intro, defaultProps as introDefaults } from "./compositions/Intro";
import { LowerThird, defaultProps as lowerThirdDefaults } from "./compositions/LowerThird";
import { TitleCard, defaultProps as titleCardDefaults } from "./compositions/TitleCard";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={introDefaults}
      />
      <Composition
        id="LowerThird"
        component={LowerThird}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={lowerThirdDefaults}
      />
      <Composition
        id="TitleCard"
        component={TitleCard}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={titleCardDefaults}
      />
    </>
  );
};
