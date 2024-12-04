import { Color, WorldAcceptQuestRequest } from "retrommo-types";
import {
  CreateLabelOptionsText,
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  createButton,
  createLabel,
  emitToSocketioServer,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import { Quest } from "../classes/Quest";
import { QuestGiverQuest } from "../classes/QuestGiver";
import { QuestState } from "../types/QuestState";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { createSlot } from "../functions/ui/components/createSlot";
import { createUnderstrike } from "../functions/ui/components/createUnderstrike";
import { getDefinable } from "definables";
import { getQuestIconImagePath } from "../functions/getQuestIconImagePath";
import { getQuestState } from "../functions/getQuestState";
import { npcQuestsPerPage } from "../constants/npcQuestsPerPage";

export interface NPCDialogueWorldMenuOpenOptions {
  readonly isLeader: boolean;
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
    const buttonIDs: string[] = [];
    const labelIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const npc: NPC = getDefinable(NPC, options.npcID);
    const width: number = getGameWidth();
    const height: number = 72;
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
        height,
        imagePath: "panels/basic",
        width,
        x,
        y,
      }),
    );
    // Close button
    hudElementReferences.push(
      createImage({
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
            switch (getQuestState(quest.id)) {
              case QuestState.Accept:
                return {
                  value: quest.availableText,
                };
              case QuestState.Complete:
                return {
                  value: quest.completedText,
                };
              case QuestState.InProgress:
              case QuestState.TurnIn:
                return {
                  value: quest.inProgressText,
                };
            }
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
    if (npc.hasQuestGiver() && options.isLeader) {
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
        createImage({
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
              x: questsX + 6,
              y: questsY + 26 + i * 18,
            }),
          );
          hudElementReferences.push(
            createImage({
              height: 16,
              imagePath: getQuestIconImagePath(quest.id),
              width: 16,
              x: questsX + 6,
              y: questsY + 26 + i * 18,
            }),
          );
          hudElementReferences.push(
            createImage({
              condition: (): boolean => {
                const questState: QuestState | null = getQuestState(quest.id);
                return (
                  questState === QuestState.InProgress ||
                  questState === QuestState.TurnIn
                );
              },
              height: 16,
              imagePath: "quest-banners/default",
              recolors: (): CreateSpriteOptionsRecolor[] => {
                let toColor: Color | undefined;
                switch (getQuestState(quest.id)) {
                  case QuestState.InProgress:
                    toColor = Color.DarkGray;
                    break;
                  case QuestState.TurnIn:
                    toColor = Color.StrongLimeGreen;
                    break;
                }
                if (typeof toColor === "undefined") {
                  throw new Error("No recolor found for quest state.");
                }
                return [
                  {
                    fromColor: Color.White,
                    toColor,
                  },
                ];
              },
              width: 16,
              x: questsX + 6,
              y: questsY + 26 + i * 18,
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
      // Quest accept button
      const acceptButtonWidth: number = 48;
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            const quest: Quest | null = getSelectedQuest();
            if (quest !== null) {
              return getQuestState(quest.id) === QuestState.Accept;
            }
            return false;
          },
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            const quest: Quest | null = getSelectedQuest();
            if (quest === null) {
              throw new Error("No selected quest.");
            }
            emitToSocketioServer<WorldAcceptQuestRequest>({
              data: {
                questID: quest.id,
              },
              event: "world/accept-quest",
            });
          },
          text: {
            value: "Accept",
          },
          width: acceptButtonWidth,
          x: x + width - acceptButtonWidth - 7,
          y: y + height - 23,
        }),
      );
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
