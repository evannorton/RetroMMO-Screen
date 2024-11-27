import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  createLabel,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import { WorldMenu } from "../classes/WorldMenu";
import { createClickableImage } from "../functions/ui/components/createClickableImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createSlot } from "../functions/ui/components/createSlot";
import { createUnderstrike } from "../functions/ui/components/createUnderstrike";
import { getDefinable } from "definables";
import { npcQuestsPerPage } from "../constants/npcQuestsPerPage";

export interface NPCDialogueWorldMenuOpenOptions {
  readonly npcID: string;
}
export interface NPCDialogueWorldMenuStateSchema {}
export const npcDialogueWorldMenu: WorldMenu<
  NPCDialogueWorldMenuOpenOptions,
  NPCDialogueWorldMenuStateSchema
> = new WorldMenu<
  NPCDialogueWorldMenuOpenOptions,
  NPCDialogueWorldMenuStateSchema
>({
  create: (options: NPCDialogueWorldMenuOpenOptions): HUDElementReferences => {
    const labelIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const npc: NPC = getDefinable(NPC, options.npcID);
    const width: number = getGameWidth();
    const x: number = 0;
    const y: number = 136;
    const xOffset: number = 10;
    // Background panel
    hudElementReferences.push(
      createPanel({
        height: 72,
        imagePath: "panels/basic",
        width,
        x,
        y,
      }),
    );
    // Close button
    hudElementReferences.push(
      createClickableImage({
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          npcDialogueWorldMenu.close();
        },
        width: 10,
        x: x + width - 17,
        y: y + 7,
      }),
    );
    // Name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          x: x + xOffset,
          y: y + 10,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: width - xOffset * 2,
        size: 1,
        text: {
          value: npc.name,
        },
      }),
    );
    // Dialogue
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => npc.hasDialogue(),
          x: x + xOffset,
          y: y + 23,
        },
        horizontalAlignment: "left",
        maxLines: 3,
        maxWidth: width - xOffset * 2,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: npc.dialogue,
        }),
      }),
    );
    const questsX: number = 176;
    const questsY: number = 49;
    const questsWidth: number = x + width - questsX;
    const questsHeight: number = y - questsY;
    if (npc.hasQuestGiver()) {
      // Quest panel
      hudElementReferences.push(
        createPanel({
          height: questsHeight,
          imagePath: "panels/basic",
          width: questsWidth,
          x: questsX,
          y: questsY,
        }),
      );
      // Close quests button
      hudElementReferences.push(
        createClickableImage({
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            npcDialogueWorldMenu.close();
          },
          width: 10,
          x: questsX + questsWidth - 17,
          y: questsY + 7,
        }),
      );
      // Quests heading
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            x: questsX + Math.round(questsWidth / 2),
            y: questsY + 9,
          },
          horizontalAlignment: "center",
          maxLines: 1,
          maxWidth: questsWidth - 16,
          size: 1,
          text: {
            value: "Quests",
          },
        }),
      );
      // Quests understrike
      hudElementReferences.push(
        createUnderstrike({
          width: questsWidth - 16,
          x: questsX + 8,
          y: questsY + 20,
        }),
      );
      for (let i: number = 0; i < npcQuestsPerPage; i++) {
        if (npc.questGiver.quests.length > i) {
          hudElementReferences.push(
            createSlot({
              imagePath: "slots/basic",
              isSelected: false,
              x: questsX + 8,
              y: questsY + 25 + i * 18,
            }),
          );
        }
      }
    }
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {},
  preventsWalking: true,
});
