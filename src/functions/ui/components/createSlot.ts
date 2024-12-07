import { HUDElementReferences, Scriptable, createSprite } from "pixel-pigeon";

interface CreateSlotOptions {
  condition?: () => boolean;
  imagePath: string;
  isSelected?: Scriptable<boolean>;
  x: number;
  y: number;
}

export const createSlot = ({
  condition,
  imagePath,
  isSelected,
  x,
  y,
}: CreateSlotOptions): HUDElementReferences => {
  const spriteIDs: string[] = [];
  spriteIDs.push(
    createSprite({
      animationID: (): string => {
        const isSelectedResult: boolean | undefined =
          typeof isSelected === "function" ? isSelected() : isSelected;
        return isSelectedResult === true ? "selected" : "default";
      },
      animations: [
        {
          frames: [
            {
              height: 18,
              sourceHeight: 18,
              sourceWidth: 18,
              sourceX: 0,
              sourceY: 0,
              width: 18,
            },
          ],
          id: "default",
        },
        {
          frames: [
            {
              height: 18,
              sourceHeight: 18,
              sourceWidth: 18,
              sourceX: 18,
              sourceY: 0,
              width: 18,
            },
          ],
          id: "selected",
        },
      ],
      coordinates: {
        condition,
        x: x - 1,
        y: y - 1,
      },
      imagePath,
    }),
  );
  return {
    spriteIDs,
  };
};
