import {
  CreateLabelOptionsText,
  Scriptable,
  State,
  createButton,
  createLabel,
  createSprite,
} from "pixel-pigeon";

export interface CreatePressableButtonOptions {
  condition: () => boolean;
  onClick: () => void;
  height: number;
  imagePath: string;
  text: Scriptable<CreateLabelOptionsText>;
  width: number;
  x: number;
  y: number;
}
interface PressableButtonStateSchema {
  isPressed: boolean;
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
}: CreatePressableButtonOptions): void => {
  const pressableButtonState: State<PressableButtonStateSchema> = new State({
    isPressed: false,
  });
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
  });
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
      x: x + width / 2,
      y: (): number => {
        if (pressableButtonState.values.isPressed) {
          return y + 3;
        }
        return y + 1;
      },
    },
    horizontalAlignment: "center",
    text,
  });
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
  });
};
