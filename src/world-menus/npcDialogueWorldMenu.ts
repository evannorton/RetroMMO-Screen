import {
  Color,
  WorldQuestAcceptRequest,
  WorldQuestSelectRequest,
  WorldQuestTurnInRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  State,
  createLabel,
  emitToSocketioServer,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import { Quest } from "../classes/Quest";
import { QuestExchangerQuest } from "../classes/QuestExchanger";
import { QuestState } from "../types/QuestState";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { createUnderstrike } from "../functions/ui/components/createUnderstrike";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getQuestExchangerQuests } from "../functions/getQuestExchangerQuests";
import { getQuestIconImagePath } from "../functions/getQuestIconImagePath";
import { getQuestIconRecolors } from "../functions/getQuestIconRecolors";
import { getQuestPartyState } from "../functions/getQuestPartyState";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import { npcQuestsPerPage } from "../constants";

export interface NPCDialogueWorldMenuStateQuestCompletion {
  readonly didLevelUp: boolean;
  readonly questID: string;
}
export interface NPCDialogueWorldMenuOpenOptions {
  readonly isLeader: boolean;
  readonly npcID: string;
}
export interface NPCDialogueWorldMenuStateSchema {
  questCompletion: NPCDialogueWorldMenuStateQuestCompletion | null;
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
    const worldState: State<WorldStateSchema> = getWorldState();
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldState.values.worldCharacterID,
    );
    const getSelectedQuest = (): Quest | null => {
      if (npcDialogueWorldMenu.state.values.selectedQuestIndex === null) {
        return null;
      }
      const questExchangerQuest: QuestExchangerQuest | undefined =
        npc.questExchanger.quests[
          npcDialogueWorldMenu.state.values.selectedQuestIndex
        ];
      if (typeof questExchangerQuest === "undefined") {
        throw new Error("No quest giver quest.");
      }
      return getDefinable(Quest, questExchangerQuest.questID);
    };
    // Background panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean => isWorldCombatInProgress() === false,
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
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          if (
            worldCharacter.player.character.party.playerIDs[0] ===
            worldCharacter.playerID
          ) {
            if (npcDialogueWorldMenu.state.values.selectedQuestIndex !== null) {
              npcDialogueWorldMenu.state.setValues({
                selectedQuestIndex: null,
              });
            } else if (
              npcDialogueWorldMenu.state.values.questCompletion !== null
            ) {
              npcDialogueWorldMenu.state.setValues({
                questCompletion: null,
              });
            } else {
              npcDialogueWorldMenu.close();
            }
          } else {
            npcDialogueWorldMenu.close();
          }
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
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: x + xOffset,
          y: y + 10,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: width - xOffset * 2,
        size: 1,
        text: (): CreateLabelOptionsText => {
          if (npcDialogueWorldMenu.state.values.questCompletion !== null) {
            const quest: Quest = getDefinable(
              Quest,
              npcDialogueWorldMenu.state.values.questCompletion.questID,
            );
            return { value: `Quest Complete: ${quest.name}` };
          }
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
          condition: (): boolean =>
            npc.hasDialogue() &&
            npcDialogueWorldMenu.state.values.questCompletion === null &&
            isWorldCombatInProgress() === false,
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
            const matchedQuestExchangerQuest: QuestExchangerQuest | undefined =
              npc.questExchanger.quests.find(
                (questExchangerQuest: QuestExchangerQuest): boolean =>
                  questExchangerQuest.questID === quest.id,
              );
            if (typeof matchedQuestExchangerQuest === "undefined") {
              throw new Error("No quest giver quest.");
            }
            switch (getQuestPartyState(quest.id, npc.id)) {
              case QuestState.Accept:
                return {
                  value: quest.availableText,
                };
              case QuestState.Complete:
              case QuestState.TurnIn:
                return {
                  value: matchedQuestExchangerQuest.completedText,
                };
              case QuestState.InProgress:
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
    if (npc.hasQuestExchanger()) {
      if (options.isLeader) {
        // Quest panel
        hudElementReferences.push(
          createPanel({
            condition: (): boolean =>
              getQuestExchangerQuests(npc.id).length > 0 &&
              isWorldCombatInProgress() === false,
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
            condition: (): boolean =>
              getQuestExchangerQuests(npc.id).length > 0 &&
              isWorldCombatInProgress() === false,
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
              condition: (): boolean =>
                getQuestExchangerQuests(npc.id).length > 0 &&
                isWorldCombatInProgress() === false,
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
            condition: (): boolean =>
              getQuestExchangerQuests(npc.id).length > 0 &&
              isWorldCombatInProgress() === false,
            width: questsWidth - 16,
            x: questsX + 8,
            y: questsY + 20,
          }),
        );
        // Quests list
        for (let i: number = 0; i < npcQuestsPerPage; i++) {
          const index: number = i;
          const getQuest = (): Quest => {
            const questExchangerQuest: QuestExchangerQuest | undefined =
              getQuestExchangerQuests(npc.id)[i];
            if (typeof questExchangerQuest === "undefined") {
              throw new Error("No quest giver quest.");
            }
            return getDefinable(Quest, questExchangerQuest.questID);
          };
          hudElementReferences.push(
            createIconListItem({
              condition: (): boolean =>
                getQuestExchangerQuests(npc.id).length > i &&
                isWorldCombatInProgress() === false,
              icons: [
                {
                  imagePath: (): string =>
                    getQuestIconImagePath(getQuest().id, npc.id),
                },
                {
                  condition: (): boolean => {
                    const questState: QuestState | null = getQuestPartyState(
                      getQuest().id,
                      npc.id,
                    );
                    return (
                      (questState === QuestState.InProgress ||
                        questState === QuestState.TurnIn) &&
                      isWorldCombatInProgress() === false
                    );
                  },
                  imagePath: "quest-banners/default",
                  recolors: (): CreateSpriteOptionsRecolor[] =>
                    getQuestIconRecolors(getQuest().id, true, npc.id),
                },
              ],
              isSelected: (): boolean =>
                npcDialogueWorldMenu.state.values.selectedQuestIndex === i,
              onClick: (): void => {
                if (
                  npcDialogueWorldMenu.state.values.selectedQuestIndex === i
                ) {
                  npcDialogueWorldMenu.state.setValues({
                    selectedQuestIndex: null,
                  });
                  emitToSocketioServer<WorldQuestSelectRequest>({
                    data: {},
                    event: "world/quest/select",
                  });
                } else {
                  npcDialogueWorldMenu.state.setValues({
                    questCompletion: null,
                    selectedQuestIndex: index,
                  });
                  emitToSocketioServer<WorldQuestSelectRequest>({
                    data: {
                      questID: getQuest().id,
                    },
                    event: "world/quest/select",
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
        const acceptButtonWidth: number = 48;
        hudElementReferences.push(
          createPressableButton({
            condition: (): boolean => {
              const quest: Quest | null = getSelectedQuest();
              if (quest !== null) {
                return (
                  getQuestPartyState(quest.id, npc.id) === QuestState.Accept &&
                  isWorldCombatInProgress() === false
                );
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
              emitToSocketioServer<WorldQuestAcceptRequest>({
                data: {
                  questID: quest.id,
                },
                event: "world/quest/accept",
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
        const turnInButtonWidth: number = 56;
        hudElementReferences.push(
          createPressableButton({
            condition: (): boolean => {
              const quest: Quest | null = getSelectedQuest();
              if (quest !== null) {
                return (
                  getQuestPartyState(quest.id, npc.id) === QuestState.TurnIn &&
                  isWorldCombatInProgress() === false
                );
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
              emitToSocketioServer<WorldQuestTurnInRequest>({
                data: {
                  questID: quest.id,
                },
                event: "world/quest/turn-in",
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
      // Reward experience
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean =>
              npcDialogueWorldMenu.state.values.questCompletion !== null &&
              isWorldCombatInProgress() === false,
            x: x + xOffset,
            y: y + 33,
          },
          horizontalAlignment: "left",
          maxLines: 1,
          maxWidth: width - xOffset * 2,
          size: 1,
          text: (): CreateLabelOptionsText => {
            if (npcDialogueWorldMenu.state.values.questCompletion === null) {
              throw new Error("No completed quest.");
            }
            const quest: Quest = getDefinable(
              Quest,
              npcDialogueWorldMenu.state.values.questCompletion.questID,
            );
            const pieces: string[] = [
              `Experience gained: ${getFormattedInteger(quest.experience)}`,
            ];
            if (npcDialogueWorldMenu.state.values.questCompletion.didLevelUp) {
              pieces.push(
                `(Leveled up to ${getFormattedInteger(
                  worldCharacter.player.character.level,
                )}!)`,
              );
            }
            return {
              value: pieces.join(" "),
            };
          },
        }),
      );
      // Reward gold
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean =>
              npcDialogueWorldMenu.state.values.questCompletion !== null &&
              isWorldCombatInProgress() === false,
            x: x + xOffset,
            y: y + 44,
          },
          horizontalAlignment: "left",
          maxLines: 1,
          maxWidth: width - xOffset * 2,
          size: 1,
          text: (): CreateLabelOptionsText => {
            if (npcDialogueWorldMenu.state.values.questCompletion === null) {
              throw new Error("No completed quest.");
            }
            const quest: Quest = getDefinable(
              Quest,
              npcDialogueWorldMenu.state.values.questCompletion.questID,
            );
            return {
              value: `Gold earned: ${getFormattedInteger(quest.gold)}`,
            };
          },
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
    questCompletion: null,
    selectedQuestIndex: null,
  },
  preventsWalking: true,
});
