import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  createButton,
  createLabel,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import { Quest } from "../classes/Quest";
import { QuestGiverQuest } from "../classes/QuestGiver";
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
export interface NPCDialogueWorldMenuStateSchema {
  selectedQuestIndex: number | null;
}
export const npcDialogueWorldMenu: WorldMenu<
  NPCDialogueWorldMenuOpenOptions,
  NPCDialogueWorldMenuStateSchema
> = new WorldMenu<
  NPCDialogueWorldMenuOpenOptions,
  NPCDialogueWorldMenuStateSchema
>({
  create: (options: NPCDialogueWorldMenuOpenOptions): HUDElementReferences => {
    const labelIDs: string[] = [];
    const buttonIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const npc: NPC = getDefinable(NPC, options.npcID);
    const width: number = getGameWidth();
    const x: number = 0;
    const y: number = 136;
    const xOffset: number = 10;
    const getSelectedQuest = (): Quest | null => {
      if (npcDialogueWorldMenu.state.values.selectedQuestIndex === null) {
        return null;
      }
      const questGiverQuest: QuestGiverQuest | undefined =
        npc.questGiver.quests[
          npcDialogueWorldMenu.state.values.selectedQuestIndex
        ];
      if (typeof questGiverQuest === "undefined") {
        throw new Error("No quest giver quest.");
      }
      return getDefinable(Quest, questGiverQuest.questID);
    };
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
        text: (): CreateLabelOptionsText => {
          const pieces: string[] = [npc.name];
          const quest: Quest | null = getSelectedQuest();
          if (quest !== null) {
            pieces.push(quest.name);
          }
          return {
            value: pieces.join(" - "),
          };
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
        text: (): CreateLabelOptionsText => {
          const quest: Quest | null = getSelectedQuest();
          if (quest !== null) {
            return {
              value: quest.description,
            };
          }
          return {
            value: npc.dialogue,
          };
        },
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
          const index: number = i;
          const questGiverQuest: QuestGiverQuest | undefined =
            npc.questGiver.quests[i];
          if (typeof questGiverQuest === "undefined") {
            throw new Error("No quest giver quest.");
          }
          const quest: Quest = getDefinable(Quest, questGiverQuest.questID);
          hudElementReferences.push(
            createSlot({
              imagePath: "slots/basic",
              isSelected: (): boolean =>
                npcDialogueWorldMenu.state.values.selectedQuestIndex === i,
              x: questsX + 5,
              y: questsY + 25 + i * 18,
            }),
          );
          labelIDs.push(
            createLabel({
              color: Color.White,
              coordinates: {
                x: questsX + 25,
                y: questsY + 31 + i * 18,
              },
              horizontalAlignment: "left",
              maxLines: 1,
              maxWidth: 96,
              size: 1,
              text: {
                value: quest.name,
              },
            }),
          );
          buttonIDs.push(
            createButton({
              coordinates: {
                x: questsX + 6,
                y: questsY + 26 + i * 18,
              },
              height: 16,
              onClick: (): void => {
                if (
                  npcDialogueWorldMenu.state.values.selectedQuestIndex === i
                ) {
                  npcDialogueWorldMenu.state.setValues({
                    selectedQuestIndex: null,
                  });
                } else {
                  npcDialogueWorldMenu.state.setValues({
                    selectedQuestIndex: index,
                  });
                }
              },
              width: 116,
            }),
          );
        }
      }
    }
    return mergeHUDElementReferences([
      {
        buttonIDs,
        labelIDs,
      },
      ...hudElementReferences,
    ]);
  },
  initialStateValues: {
    selectedQuestIndex: null,
  },
  preventsWalking: true,
});
