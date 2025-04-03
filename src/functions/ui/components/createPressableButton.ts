import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  Scriptable,
  State,
  createButton,
  createLabel,
  createSprite,
} from "pixel-pigeon";

interface PressableButtonStateSchema {
  isPressed: boolean;
}

export interface CreatePressableButtonOptions {
  readonly condition: () => boolean;
  readonly onClick: () => void;
  readonly height: number;
  readonly imagePath: string;
  readonly text: Scriptable<CreateLabelOptionsText>;
  readonly width: number;
  readonly x: Scriptable<number>;
  readonly y: number;
}
export const createPressableButton = ({
  condition,
  height,
  imagePath,
  onClick,
  text,
  width,
  x,
  y,
}: CreatePressableButtonOptions): HUDElementReferences => {
  const buttonIDs: string[] = [];
  const labelIDs: string[] = [];
  const spriteIDs: string[] = [];
  const pressableButtonState: State<PressableButtonStateSchema> = new State({
    isPressed: false,
  });
  spriteIDs.push(
    createSprite({
      animationID: (): string => {
        if (pressableButtonState.values.isPressed) {
          return "pressed";
        }
        return "default";
      },
      animations: [
        {
          frames: [
            {
              height,
              sourceHeight: 8,
              sourceWidth: 8,
              sourceX: 0,
              sourceY: 0,
              width,
            },
          ],
          id: "default",
        },
        {
          frames: [
            {
              height,
              sourceHeight: 8,
              sourceWidth: 8,
              sourceX: 8,
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
      imagePath,
    }),
  );
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition,
        x: (typeof x === "function" ? x() : x) + width / 2,
        y: (): number => {
          if (pressableButtonState.values.isPressed) {
            return y + 3;
          }
          return y + 1;
        },
      },
      horizontalAlignment: "center",
      text,
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
      onClick,
      onMouseDown: (): void => {
        pressableButtonState.setValues({ isPressed: true });
      },
      onRelease: (): void => {
        pressableButtonState.setValues({ isPressed: false });
      },
      width,
    }),
  );
  return {
    buttonIDs,
    labelIDs,
    spriteIDs,
  };
};
