import { Color } from "retrommo-types";
import {
  HUDElementReferences,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { isForcedWorldUIVisible } from "../functions/isForcedWorldUIVisible";

export interface NotPartyLeaderWorldMenuOpenOptions {}
export interface NotPartyLeaderWorldMenuStateSchema {}
export const notPartyLeaderWorldMenu: WorldMenu<
  NotPartyLeaderWorldMenuOpenOptions,
  NotPartyLeaderWorldMenuStateSchema
> = new WorldMenu<
  NotPartyLeaderWorldMenuOpenOptions,
  NotPartyLeaderWorldMenuStateSchema
>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const shouldShowMenu = (): boolean => isForcedWorldUIVisible() === false;
    hudElementReferences.push(
      createPanel({
        condition: shouldShowMenu,
        height: 62,
        imagePath: "panels/basic",
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
          notPartyLeaderWorldMenu.close();
        },
        width: 10,
        x: 239,
        y: 143,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 152,
          y: 146,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 304,
        size: 1,
        text: {
          value: "Invite Cancelled",
        },
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 152,
          y: 159,
        },
        horizontalAlignment: "center",
        maxLines: 3,
        maxWidth: 140,
        size: 1,
        text: {
          value: "The player who invited you is no longer leading a party.",
        },
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {},
});
