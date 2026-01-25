import { Chest } from "../classes/Chest";
import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createSlot } from "../functions/ui/components/createSlot";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface OpenedChestWorldMenuOpenOptions {
  readonly chestID: string;
}
export interface OpenedChestWorldMenuStateSchema {}
export const openedChestWorldMenu: WorldMenu<
  OpenedChestWorldMenuOpenOptions,
  OpenedChestWorldMenuStateSchema
> = new WorldMenu<
  OpenedChestWorldMenuOpenOptions,
  OpenedChestWorldMenuStateSchema
>({
  create: (options: OpenedChestWorldMenuOpenOptions): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const gameWidth: number = getGameWidth();
    const worldState: State<WorldStateSchema> = getWorldState();
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldState.values.worldCharacterID,
    );
    const isPartied: boolean =
      worldCharacter.player.character.party.playerIDs.length > 1;
    const chest: Chest = getDefinable(Chest, options.chestID);
    const shouldShowMenu = (): boolean => isWorldCombatInProgress() === false;
    hudElementReferences.push(
      createPanel({
        condition: shouldShowMenu,
        height: 64,
        imagePath: "panels/chest",
        width: 144,
        x: 80,
        y: 136,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: shouldShowMenu,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          openedChestWorldMenu.close();
        },
        width: 10,
        x: 205,
        y: 145,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 152,
          y: 154,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: isPartied ? "Your party finds" : "You find",
        }),
      }),
    );
    hudElementReferences.push(
      createSlot({
        condition: shouldShowMenu,
        icons: [
          {
            imagePath: (): string => {
              if (chest.hasGold()) {
                return "gold";
              }
              if (chest.hasItem()) {
                return chest.item.iconImagePath;
              }
              throw new Error("Chest has no gold or item");
            },
          },
        ],
        imagePath: "slots/chest",
        x: 95,
        y: 166,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 115,
          y: 171,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: chest.hasGold()
            ? `${getFormattedInteger(chest.gold)} gold`
            : chest.item.name,
        }),
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {},
  preventsWalking: false,
});
