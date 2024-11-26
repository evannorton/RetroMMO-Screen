import {
  HUDElementReferences,
  State,
  createButton,
  createInputPressHandler,
  createSprite,
  playAudioSource,
} from "pixel-pigeon";
import { sfxVolumeChannelID } from "../../../volumeChannels";

interface BlackPianoKeyStateSchema {
  isPressed: boolean;
}

export interface CreateBlackPianoKeyOptions {
  audioPath: string;
  inputCollectionID: string;
  onPlay: () => void;
  x: number;
  y: number;
}
export const createBlackPianoKey = ({
  audioPath,
  inputCollectionID,
  onPlay,
  x,
  y,
}: CreateBlackPianoKeyOptions): HUDElementReferences => {
  const blackPianoKeyState: State<BlackPianoKeyStateSchema> = new State({
    isPressed: false,
  });
  const inputPressHandlerIDs: string[] = [];
  const spriteIDs: string[] = [];
  const buttonIDs: string[] = [];
  const width: number = 7;
  const height: number = 27;
  const blackKeysSourceX: number = 20;
  spriteIDs.push(
    createSprite({
      animationID: (): string =>
        blackPianoKeyState.values.isPressed ? "pressed" : "unpressed",
      animations: [
        {
          frames: [
            {
              height,
              sourceHeight: height,
              sourceWidth: width,
              sourceX: blackKeysSourceX,
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
              sourceX: blackKeysSourceX + width,
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
      height: 26,
      onMouseDown: (): void => {
        playAudioSource(audioPath, {
          volumeChannelID: sfxVolumeChannelID,
        });
        blackPianoKeyState.setValues({ isPressed: true });
        onPlay();
      },
      onRelease: (): void => {
        blackPianoKeyState.setValues({ isPressed: false });
      },
      width,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      inputCollectionID,
      onInput: (): void => {
        playAudioSource(audioPath, {
          volumeChannelID: sfxVolumeChannelID,
        });
        blackPianoKeyState.setValues({ isPressed: true });
        onPlay();
      },
      onRelease: (): void => {
        blackPianoKeyState.setValues({ isPressed: false });
      },
    }),
  );
  return {
    buttonIDs,
    inputPressHandlerIDs,
    spriteIDs,
  };
};
