import { Color, WorldInnRequest } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  emitToSocketioServer,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface NPCInnWorldMenuOpenOptions {
  readonly npcID: string;
}
export interface NPCInnWorldMenuStateSchema {}
export const npcInnWorldMenu: WorldMenu<
  NPCInnWorldMenuOpenOptions,
  NPCInnWorldMenuStateSchema
> = new WorldMenu<NPCInnWorldMenuOpenOptions, NPCInnWorldMenuStateSchema>({
  create: (options: NPCInnWorldMenuOpenOptions): HUDElementReferences => {
    const labelIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const npc: NPC = getDefinable(NPC, options.npcID);
    const worldState: State<WorldStateSchema> = getWorldState();
    const canAffordInn = (): boolean =>
      worldState.values.inventoryGold >= npc.innCost;
    const width: number = 256;
    const getHeight = (): number => {
      if (canAffordInn()) {
        return 71;
      }
      return 49;
    };
    const x: number = 24;
    const y: number = 136;
    const getInnText = (): string => {
      const pieces: string[] = [
        "You may rest here to restore your party's health.",
      ];
      if (canAffordInn()) {
        pieces.push(
          `Would you like to stay a night for ${getFormattedInteger(
            npc.innCost,
          )}g (You have ${getFormattedInteger(
            worldState.values.inventoryGold,
          )}g)?`,
        );
      } else {
        pieces.push(
          `You need at least ${getFormattedInteger(
            npc.innCost,
          )}g to stay a night (You have ${getFormattedInteger(
            worldState.values.inventoryGold,
          )}g).`,
        );
      }
      return pieces.join(" ");
    };
    hudElementReferences.push(
      createPanel({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: getHeight(),
        imagePath: "panels/basic",
        width,
        x,
        y,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          npcInnWorldMenu.close();
        },
        width: 10,
        x: x + width - 17,
        y: y + 7,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: x + Math.round(width / 2),
          y: y + 10,
        },
        horizontalAlignment: "center",
        maxLines: 3,
        maxWidth: width - 20,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: getInnText(),
        }),
      }),
    );
    const yesButtonWidth: number = 48;
    hudElementReferences.push(
      createPressableButton({
        condition: (): boolean =>
          canAffordInn() && isWorldCombatInProgress() === false,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          emitToSocketioServer<WorldInnRequest>({
            data: {},
            event: "world/inn",
          });
        },
        text: {
          value: "Yes",
        },
        width: yesButtonWidth,
        x: x + 77,
        y: y + 45,
      }),
    );
    const noButtonWidth: number = 48;
    hudElementReferences.push(
      createPressableButton({
        condition: (): boolean =>
          canAffordInn() && isWorldCombatInProgress() === false,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          npcInnWorldMenu.close();
        },
        text: {
          value: "No",
        },
        width: noButtonWidth,
        x: x + 131,
        y: y + 45,
      }),
    );
    return mergeHUDElementReferences([
      {
        labelIDs,
      },
      ...hudElementReferences,
    ]);
  },
  initialStateValues: {},
  preventsWalking: true,
});
