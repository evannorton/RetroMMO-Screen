import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  createLabel,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Player } from "../classes/Player";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { getDefinable } from "definables";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface PlayerBusyWorldMenuOpenOptions {
  readonly playerID: string;
}
export interface PlayerBusyWorldMenuStateSchema {}
export const playerBusyWorldMenu: WorldMenu<
  PlayerBusyWorldMenuOpenOptions,
  PlayerBusyWorldMenuStateSchema
> = new WorldMenu<
  PlayerBusyWorldMenuOpenOptions,
  PlayerBusyWorldMenuStateSchema
>({
  create: (options: PlayerBusyWorldMenuOpenOptions): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const busyPlayer: Player = getDefinable(Player, options.playerID);
    const gameWidth: number = getGameWidth();
    const shouldShowMenu = (): boolean => isWorldCombatInProgress() === false;
    // Background panel
    hudElementReferences.push(
      createPanel({
        condition: shouldShowMenu,
        height: 41,
        imagePath: "panels/basic",
        width: 208,
        x: 48,
        y: 136,
      }),
    );
    // Close button
    hudElementReferences.push(
      createImage({
        condition: shouldShowMenu,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          playerBusyWorldMenu.close();
        },
        width: 10,
        x: 239,
        y: 143,
      }),
    );
    // Username
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
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: busyPlayer.username,
        }),
      }),
    );
    // Notice
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 152,
          y: 159,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 140,
        size: 1,
        text: {
          value: "Player is currently busy.",
        },
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {},
  preventsWalking: false,
});
