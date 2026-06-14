import {
  HUDElementReferences,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Readable } from "../classes/Readable";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { getDefinable } from "definables";
import { isForcedWorldUIVisible } from "../functions/isForcedWorldUIVisible";

export interface ReadableWorldMenuOpenOptions {
  readonly readableID: string;
}
export interface ReadableWorldMenuStateSchema {}
export const readableWorldMenu: WorldMenu<
  ReadableWorldMenuOpenOptions,
  ReadableWorldMenuStateSchema
> = new WorldMenu<ReadableWorldMenuOpenOptions, ReadableWorldMenuStateSchema>({
  create: (options: ReadableWorldMenuOpenOptions): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const readable: Readable = getDefinable(Readable, options.readableID);
    const shouldShowMenu = (): boolean => isForcedWorldUIVisible() === false;
    hudElementReferences.push(
      createPanel({
        condition: shouldShowMenu,
        height: readable.height,
        imagePath: readable.imagePath,
        width: 208,
        x: 48,
        y: 136,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: shouldShowMenu,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          readableWorldMenu.close({});
        },
        width: 10,
        x: 239,
        y: 143,
      }),
    );
    let labelX: number;
    switch (readable.horizontalAlignment) {
      case "center":
        labelX = 152;
        break;
      case "left":
        labelX = 58;
        break;
      case "right":
        labelX = 246;
        break;
    }
    labelIDs.push(
      createLabel({
        color: readable.color,
        coordinates: {
          condition: shouldShowMenu,
          x: labelX,
          y: 151,
        },
        horizontalAlignment: readable.horizontalAlignment,
        maxWidth: 152,
        size: 1,
        text: {
          value: readable.contents,
        },
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {},
});
