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

interface WhitePianoKeyStateSchema {
  isPressed: boolean;
}

export interface CreateWhitePianoKeyOptions {
  readonly audioPath: string;
  readonly condition?: () => boolean;
  readonly inputCollectionID: string;
  readonly isLabelVisible: Scriptable<boolean>;
  readonly onPlay: () => void;
  readonly text: string;
  readonly x: number;
  readonly y: number;
}
export const createWhitePianoKey = ({
  audioPath,
  condition,
  inputCollectionID,
  isLabelVisible,
  onPlay,
  text,
  x,
  y,
}: CreateWhitePianoKeyOptions): HUDElementReferences => {
  const inputPressHandlerIDs: string[] = [];
  const whitePianoKeyState: State<WhitePianoKeyStateSchema> = new State({
    isPressed: false,
  });
  const spriteIDs: string[] = [];
  const buttonIDs: string[] = [];
  const labelIDs: string[] = [];
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
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition,
      inputCollectionID,
      onInput: (): void => {
        playAudioSource(audioPath, {
          volumeChannelID: sfxVolumeChannelID,
        });
        whitePianoKeyState.setValues({ isPressed: true });
        onPlay();
      },
      onRelease: (): void => {
        whitePianoKeyState.setValues({ isPressed: false });
      },
    }),
  );
  labelIDs.push(
    createLabel({
      color: Color.Black,
      coordinates: {
        condition: (): boolean =>
          (typeof condition !== "undefined" ? condition() : true) &&
          (typeof isLabelVisible === "function"
            ? isLabelVisible()
            : isLabelVisible),
        x: x + 3,
        y: (): number => y + 28 + (whitePianoKeyState.values.isPressed ? 1 : 0),
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
