import {
  Color,
  WorldAcceptQuestRequest,
  WorldSelectQuestRequest,
  WorldTurnInQuestRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
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
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { createUnderstrike } from "../functions/ui/components/createUnderstrike";
import { getDefinable } from "definables";
import { getQuestIconImagePath } from "../functions/getQuestIconImagePath";
import { getQuestIconRecolors } from "../functions/getQuestIconRecolors";
import { getQuestPartyState } from "../functions/getQuestPartyState";
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
            switch (getQuestPartyState(quest.id)) {
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
      // Quests list
      for (let i: number = 0; i < npcQuestsPerPage; i++) {
        const index: number = i;
        const getQuestGiverQuests = (): readonly QuestGiverQuest[] =>
          npc.questGiver.quests.filter(
            (questGiverQuest: QuestGiverQuest): boolean => {
              const quest: Quest = getDefinable(Quest, questGiverQuest.questID);
              if (quest.hasPrerequisiteQuest()) {
                if (
                  getQuestState(quest.prerequisiteQuestID) !==
                  QuestState.Complete
                ) {
                  return false;
                }
              }
              return true;
            },
          );
        const getQuest = (): Quest => {
          const questGiverQuest: QuestGiverQuest | undefined =
            getQuestGiverQuests()[i];
          if (typeof questGiverQuest === "undefined") {
            throw new Error("No quest giver quest.");
          }
          return getDefinable(Quest, questGiverQuest.questID);
        };
        hudElementReferences.push(
          createIconListItem({
            condition: (): boolean => getQuestGiverQuests().length > i,
            icons: [
              { imagePath: (): string => getQuestIconImagePath(getQuest().id) },
              {
                condition: (): boolean => {
                  const questState: QuestState | null = getQuestPartyState(
                    getQuest().id,
                  );
                  return (
                    questState === QuestState.InProgress ||
                    questState === QuestState.TurnIn
                  );
                },
                imagePath: "quest-banners/default",
                recolors: (): CreateSpriteOptionsRecolor[] =>
                  getQuestIconRecolors(getQuest().id, true),
              },
            ],
            isSelected: (): boolean =>
              npcDialogueWorldMenu.state.values.selectedQuestIndex === i,
            onClick: (): void => {
              if (npcDialogueWorldMenu.state.values.selectedQuestIndex === i) {
                npcDialogueWorldMenu.state.setValues({
                  selectedQuestIndex: null,
                });
                emitToSocketioServer<WorldSelectQuestRequest>({
                  data: {},
                  event: "world/select-quest",
                });
              } else {
                npcDialogueWorldMenu.state.setValues({
                  selectedQuestIndex: index,
                });
                emitToSocketioServer<WorldSelectQuestRequest>({
                  data: {
                    questID: getQuest().id,
                  },
                  event: "world/select-quest",
                });
              }
            },
            slotImagePath: "slots/basic",
            text: (): CreateLabelOptionsText => ({ value: getQuest().name }),
            width: 116,
            x: questsX + 6,
            y: questsY + 26 + i * 18,
          }),
        );
      }
      // Quest accept button
      const acceptButtonWidth: number = 64;
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            const quest: Quest | null = getSelectedQuest();
            if (quest !== null) {
              return getQuestPartyState(quest.id) === QuestState.Accept;
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
      // Quest turn in button
      const turnInButtonWidth: number = 64;
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            const quest: Quest | null = getSelectedQuest();
            if (quest !== null) {
              return getQuestPartyState(quest.id) === QuestState.TurnIn;
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
            emitToSocketioServer<WorldTurnInQuestRequest>({
              data: {
                questID: quest.id,
              },
              event: "world/turn-in-quest",
            });
          },
          text: {
            value: "Complete",
          },
          width: turnInButtonWidth,
          x: x + width - turnInButtonWidth - 7,
          y: y + height - 23,
        }),
      );
    }
    return mergeHUDElementReferences([
      {
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
