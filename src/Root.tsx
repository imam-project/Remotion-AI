import { Composition } from "remotion";
import { MotionPulse } from "./MotionPulse";
import { FirstRemotionVideo } from "./FirstRemotionVideo";

export const Root: React.FC = () => (
  <>
    <Composition
      id="MotionPulse"
      component={MotionPulse}
      durationInFrames={360}
      fps={30}
      width={1080}
      height={1920}
    />
    <Composition
      id="FirstRemotionVideo"
      component={FirstRemotionVideo}
      durationInFrames={726}
      fps={30}
      width={1080}
      height={1920}
    />
  </>
);
