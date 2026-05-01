import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Player } from "../classes/Player";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { getDefinable } from "definables";
import { isForcedWorldUIVisible } from "../functions/isForcedWorldUIVisible";

export interface PlayerInvitedWorldMenuOpenOptions {
  readonly playerID: string;
}
export interface PlayerInvitedWorldMenuStateSchema {}
export const playerInvitedWorldMenu: WorldMenu<
  PlayerInvitedWorldMenuOpenOptions,
  PlayerInvitedWorldMenuStateSchema
> = new WorldMenu<
  PlayerInvitedWorldMenuOpenOptions,
  PlayerInvitedWorldMenuStateSchema
>({
  create: (
    options: PlayerInvitedWorldMenuOpenOptions,
  ): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const partyInviteePlayer: Player = getDefinable(Player, options.playerID);
    const shouldShowMenu = (): boolean => isForcedWorldUIVisible() === false;
    hudElementReferences.push(
      createPanel({
        condition: shouldShowMenu,
        height: 51,
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
          playerInvitedWorldMenu.close();
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
        text: (): CreateLabelOptionsText => ({
          value: partyInviteePlayer.username,
        }),
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
        maxLines: 2,
        maxWidth: 140,
        size: 1,
        text: {
          value: "Move next to each other to initiate.",
        },
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {},
});
