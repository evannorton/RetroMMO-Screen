import { Color } from "retrommo-types";
import {
  HUDElementReferences,
  Scriptable,
  State,
  createButton,
  createInputPressHandler,
  createLabel,
  createSprite,
  playAudioSource,
} from "pixel-pigeon";
import { sfxVolumeChannelID } from "../../../volumeChannels";

interface BlackPianoKeyStateSchema {
  isPressed: boolean;
}

export interface CreateBlackPianoKeyOptions {
  readonly audioPath: string;
  readonly condition?: () => boolean;
  readonly inputCollectionID: string;
  readonly isLabelVisible: Scriptable<boolean>;
  readonly onPlay: () => void;
  readonly text: string;
  readonly x: number;
  readonly y: number;
}
export const createBlackPianoKey = ({
  audioPath,
  condition,
  inputCollectionID,
  isLabelVisible,
  onPlay,
  text,
  x,
  y,
}: CreateBlackPianoKeyOptions): HUDElementReferences => {
  const blackPianoKeyState: State<BlackPianoKeyStateSchema> = new State({
    isPressed: false,
  });
  const inputPressHandlerIDs: string[] = [];
  const spriteIDs: string[] = [];
  const buttonIDs: string[] = [];
  const labelIDs: string[] = [];
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
        condition,
        x,
        y,
      },
      imagePath: "piano-keys",
    }),
  );
  buttonIDs.push(
    createButton({
      coordinates: {
        condition,
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
      condition,
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
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean =>
          (typeof condition !== "undefined" ? condition() : true) &&
          (typeof isLabelVisible === "function"
            ? isLabelVisible()
            : isLabelVisible),
        x: x + 1,
        y: (): number => y + 9 + (blackPianoKeyState.values.isPressed ? 1 : 0),
      },
      horizontalAlignment: "left",
      text: {
        value: text,
      },
    }),
  );
  return {
    buttonIDs,
    inputPressHandlerIDs,
    labelIDs,
    spriteIDs,
  };
};
