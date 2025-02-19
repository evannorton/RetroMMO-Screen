import {
  HUDElementReferences,
  Scriptable,
  createButton,
  createSprite,
  mergeHUDElementReferences,
} from "pixel-pigeon";

export interface CreateVisibilityToggleOptions {
  readonly condition?: () => boolean;
  readonly isVisible: Scriptable<boolean>;
  readonly onClick?: () => void;
  readonly x: number;
  readonly y: number;
}
export const createVisibilityToggle = ({
  condition,
  isVisible,
  onClick,
  x,
  y,
}: CreateVisibilityToggleOptions): HUDElementReferences => {
  const buttonIDs: string[] = [];
  const spriteIDs: string[] = [];
  spriteIDs.push(
    createSprite({
      animationID: (): string =>
        (typeof isVisible === "function" ? isVisible() : isVisible)
          ? "visible"
          : "hidden",
      animations: [
        {
          frames: [
            {
              height: 16,
              sourceHeight: 16,
              sourceWidth: 16,
              sourceX: 0,
              sourceY: 0,
              width: 16,
            },
          ],
          id: "visible",
        },
        {
          frames: [
            {
              height: 16,
              sourceHeight: 16,
              sourceWidth: 16,
              sourceX: 16,
              sourceY: 0,
              width: 16,
            },
          ],
          id: "hidden",
        },
      ],
      coordinates: {
        condition,
        x,
        y,
      },
      imagePath: "visibility-toggle",
    }),
  );
  if (typeof onClick !== "undefined") {
    buttonIDs.push(
      createButton({
        coordinates: {
          x,
          y,
        },
        height: 16,
        onClick,
        width: 16,
      }),
    );
  }
  return mergeHUDElementReferences([
    {
      buttonIDs,
      spriteIDs,
    },
  ]);
};
