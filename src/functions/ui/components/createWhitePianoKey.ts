import {
  HUDElementReferences,
  State,
  createButton,
  createSprite,
  playAudioSource,
} from "pixel-pigeon";
import { sfxVolumeChannelID } from "../../../volumeChannels";

interface WhitePianoKeyStateSchema {
  isPressed: boolean;
}

export interface CreateWhitePianoKeyOptions {
  audioPath: string;
  onPlay: () => void;
  x: number;
  y: number;
}
export const createWhitePianoKey = ({
  audioPath,
  onPlay,
  x,
  y,
}: CreateWhitePianoKeyOptions): HUDElementReferences => {
  const whitePianoKeyState: State<WhitePianoKeyStateSchema> = new State({
    isPressed: false,
  });
  const spriteIDs: string[] = [];
  const buttonIDs: string[] = [];
  const width: number = 10;
  const height: number = 48;
  spriteIDs.push(
    createSprite({
      animationID: (): string =>
        whitePianoKeyState.values.isPressed ? "pressed" : "unpressed",
      animations: [
        {
          frames: [
            {
              height,
              sourceHeight: height,
              sourceWidth: width,
              sourceX: 0,
              sourceY: 0,
              width,
            },
          ],
          id: "unpressed",
        },
        {
          frames: [
            {
              height,
              sourceHeight: height,
              sourceWidth: width,
              sourceX: width,
              sourceY: 0,
              width,
            },
          ],
          id: "pressed",
        },
      ],
      coordinates: {
        x,
        y,
      },
      imagePath: "piano-keys",
    }),
  );
  buttonIDs.push(
    createButton({
      consumesInput: true,
      coordinates: {
        x,
        y,
      },
      height,
      onMouseDown: (): void => {
        playAudioSource(audioPath, {
          volumeChannelID: sfxVolumeChannelID,
        });
        whitePianoKeyState.setValues({ isPressed: true });
        onPlay();
      },
      onRelease: (): void => {
        whitePianoKeyState.setValues({ isPressed: false });
      },
      width,
    }),
  );
  return {
    buttonIDs,
    spriteIDs,
  };
};
