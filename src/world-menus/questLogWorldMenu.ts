import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  State,
  createButton,
  createLabel,
  createSprite,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Monster } from "../classes/Monster";
import { NPC } from "../classes/NPC";
import { Quest } from "../classes/Quest";
import { QuestExchangerQuest } from "../classes/QuestExchanger";
import { QuestState } from "../types/QuestState";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createSlot } from "../functions/ui/components/createSlot";
import { createUnderstrike } from "../functions/ui/components/createUnderstrike";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getQuestIconImagePath } from "../functions/getQuestIconImagePath";
import { getQuestIconRecolors } from "../functions/getQuestIconRecolors";
import { getQuestState } from "../functions/getQuestState";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import {
  questLogCompletedQuestsPerPage,
  questLogInProgressQuestsPerPage,
} from "../constants";

enum QuestLogTab {
  Completed = "completed",
  InProgress = "in-progress",
}

export interface QuestLogWorldMenuOpenOptions {}
export interface QuestLogWorldMenuStateSchema {
  selectedCompletedQuestIndex: number | null;
  selectedInProgressQuestIndex: number | null;
  selectedQuestDialoguePage: number | null;
  tab: QuestLogTab;
}
export const questLogWorldMenu: WorldMenu<
  QuestLogWorldMenuOpenOptions,
  QuestLogWorldMenuStateSchema
> = new WorldMenu<QuestLogWorldMenuOpenOptions, QuestLogWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const buttonIDs: string[] = [];
    const labelIDs: string[] = [];
    const spriteIDs: string[] = [];
    const worldState: State<WorldStateSchema> = getWorldState();
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldState.values.worldCharacterID,
    );
    const inProgressTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.InProgress;
    const completedTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.Completed;
    // Background panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 184,
        imagePath: "panels/basic",
        width: 128,
        x: 176,
        y: 24,
      }),
    );
    // Tabs
    spriteIDs.push(
      createSprite({
        animationID: (): string => {
          switch (questLogWorldMenu.state.values.tab) {
            case QuestLogTab.InProgress:
              return "1";
            case QuestLogTab.Completed:
              return "2";
          }
        },
        animations: [
          {
            frames: [
              {
                height: 21,
                sourceHeight: 21,
                sourceWidth: 124,
                sourceX: 0,
                sourceY: 0,
                width: 124,
              },
            ],
            id: "1",
          },
          {
            frames: [
              {
                height: 21,
                sourceHeight: 21,
                sourceWidth: 124,
                sourceX: 124,
                sourceY: 0,
                width: 124,
              },
            ],
            id: "2",
          },
        ],
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 178,
          y: 26,
        },
        imagePath: "tabs/2",
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 16,
        imagePath: "tab-icons/quest-log/in-progress",
        width: 16,
        x: 197,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 16,
        imagePath: "tab-icons/quest-log/completed",
        width: 16,
        x: 250,
        y: 29,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            completedTabCondition() && isWorldCombatInProgress() === false,
          x: 179,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedCompletedQuestIndex: null,
            selectedQuestDialoguePage: null,
            tab: QuestLogTab.InProgress,
          });
        },
        width: 52,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: inProgressTabCondition,
          x: 232,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedInProgressQuestIndex: null,
            selectedQuestDialoguePage: null,
            tab: QuestLogTab.Completed,
          });
        },
        width: 51,
      }),
    );
    // X button
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          questLogWorldMenu.close();
        },
        width: 10,
        x: 287,
        y: 31,
      }),
    );
    const getInProgressQuestIDs = (): string[] =>
      Object.keys(worldCharacter.questInstances)
        .filter((questInstanceID: string): boolean => {
          const questInstance: WorldCharacterQuestInstance | undefined =
            worldCharacter.questInstances[questInstanceID];
          if (typeof questInstance === "undefined") {
            throw new Error("Quest instance not found");
          }
          return questInstance.isStarted && questInstance.isCompleted === false;
        })
        .sort((a: string, b: string): number => {
          const questA: Quest = getDefinable(Quest, a);
          const questB: Quest = getDefinable(Quest, b);
          return questA.name.localeCompare(questB.name);
        });
    const getInProgressQuest = (i: number): Quest => {
      const inProgressQuestIDs: string[] = getInProgressQuestIDs();
      const inProgressQuestID: string | undefined = inProgressQuestIDs[i];
      if (typeof inProgressQuestID === "undefined") {
        throw new Error("Quest ID not found");
      }
      return getDefinable(Quest, inProgressQuestID);
    };
    const getCompletedQuestIDs = (): string[] =>
      Object.keys(worldCharacter.questInstances)
        .filter((questInstanceID: string): boolean => {
          const questInstance: WorldCharacterQuestInstance | undefined =
            worldCharacter.questInstances[questInstanceID];
          if (typeof questInstance === "undefined") {
            throw new Error("Quest instance not found");
          }
          return questInstance.isCompleted;
        })
        .sort((a: string, b: string): number => {
          const questA: Quest = getDefinable(Quest, a);
          const questB: Quest = getDefinable(Quest, b);
          return questA.name.localeCompare(questB.name);
        });
    const getCompletedQuest = (i: number): Quest => {
      const completedQuestIDs: string[] = getCompletedQuestIDs();
      const completedQuestID: string | undefined = completedQuestIDs[i];
      if (typeof completedQuestID === "undefined") {
        throw new Error("Quest ID not found");
      }
      return getDefinable(Quest, completedQuestID);
    };
    for (let i: number = 0; i < questLogInProgressQuestsPerPage; i++) {
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            inProgressTabCondition() &&
            i < getInProgressQuestIDs().length &&
            isWorldCombatInProgress() === false,
          icons: [
            {
              imagePath: (): string =>
                getQuestIconImagePath(getInProgressQuest(i).id),
            },
            {
              condition: (): boolean => {
                const questState: QuestState | null = getQuestState(
                  getInProgressQuest(i).id,
                );
                return (
                  questState === QuestState.InProgress ||
                  questState === QuestState.TurnIn
                );
              },
              imagePath: "quest-banners/default",
              recolors: (): CreateSpriteOptionsRecolor[] =>
                getQuestIconRecolors(getInProgressQuest(i).id, false),
            },
          ],
          isSelected: (): boolean =>
            questLogWorldMenu.state.values.selectedInProgressQuestIndex === i,
          onClick: (): void => {
            if (
              questLogWorldMenu.state.values.selectedInProgressQuestIndex === i
            ) {
              questLogWorldMenu.state.setValues({
                selectedInProgressQuestIndex: null,
                selectedQuestDialoguePage: null,
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedInProgressQuestIndex: i,
              });
            }
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => ({
            value: getInProgressQuest(i).name,
          }),
          width: 116,
          x: 182,
          y,
        }),
      );
    }
    for (let i: number = 0; i < questLogCompletedQuestsPerPage; i++) {
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            completedTabCondition() &&
            i < getCompletedQuestIDs().length &&
            isWorldCombatInProgress() === false,
          icons: [
            {
              imagePath: (): string =>
                getQuestIconImagePath(getCompletedQuest(i).id),
            },
            {
              condition: (): boolean => {
                const questState: QuestState | null = getQuestState(
                  getCompletedQuest(i).id,
                );
                return (
                  questState === QuestState.InProgress ||
                  questState === QuestState.TurnIn
                );
              },
              imagePath: "quest-banners/default",
              recolors: (): CreateSpriteOptionsRecolor[] =>
                getQuestIconRecolors(getCompletedQuest(i).id, false),
            },
          ],
          isSelected: (): boolean =>
            questLogWorldMenu.state.values.selectedCompletedQuestIndex === i,
          onClick: (): void => {
            if (
              questLogWorldMenu.state.values.selectedCompletedQuestIndex === i
            ) {
              questLogWorldMenu.state.setValues({
                selectedCompletedQuestIndex: null,
                selectedQuestDialoguePage: null,
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedCompletedQuestIndex: i,
              });
            }
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => ({
            value: getCompletedQuest(i).name,
          }),
          width: 116,
          x: 182,
          y,
        }),
      );
    }
    const getSelectedQuest = (): Quest => {
      switch (questLogWorldMenu.state.values.tab) {
        case QuestLogTab.InProgress:
          if (
            questLogWorldMenu.state.values.selectedInProgressQuestIndex === null
          ) {
            throw new Error("No selected quest index");
          }
          return getInProgressQuest(
            questLogWorldMenu.state.values.selectedInProgressQuestIndex,
          );
        case QuestLogTab.Completed:
          if (
            questLogWorldMenu.state.values.selectedCompletedQuestIndex === null
          ) {
            throw new Error("No selected quest index");
          }
          return getCompletedQuest(
            questLogWorldMenu.state.values.selectedCompletedQuestIndex,
          );
      }
    };
    const getSelectedQuestInstance = (): WorldCharacterQuestInstance => {
      const questInstance: WorldCharacterQuestInstance | undefined =
        worldCharacter.questInstances[getSelectedQuest().id];
      if (typeof questInstance === "undefined") {
        throw new Error("Quest instance not found");
      }
      return questInstance;
    };
    const isQuestSelected = (): boolean =>
      questLogWorldMenu.state.values.selectedInProgressQuestIndex !== null ||
      questLogWorldMenu.state.values.selectedCompletedQuestIndex !== null;
    const getSelectedQuestDialogueLastPage = (): number => {
      const selectedQuestInstance: WorldCharacterQuestInstance =
        getSelectedQuestInstance();
      const quest: Quest = getSelectedQuest();
      let page: number = selectedQuestInstance.isCompleted ? 2 : 1;
      if (
        quest.receiverNPCID !== quest.giverNPCID &&
        selectedQuestInstance.isCompleted
      ) {
        page++;
      }
      return page;
    };
    const getSelectedQuestDialoguePage = (): number =>
      questLogWorldMenu.state.values.selectedQuestDialoguePage ??
      getSelectedQuestDialogueLastPage();
    const getSelectedQuestDialoguePageNPC = (): NPC => {
      const page: number = getSelectedQuestDialoguePage();
      const lastPage: number = getSelectedQuestDialogueLastPage();
      const quest: Quest = getSelectedQuest();
      if (lastPage === 3 && page === 2) {
        return quest.receiverNPC;
      }
      return quest.giverNPC;
    };
    const selectedQuestY: number = 24;
    const selectedQuestWidth: number = 176;
    // Selected quest panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean =>
          isQuestSelected() && isWorldCombatInProgress() === false,
        height: 184,
        imagePath: "panels/basic",
        width: selectedQuestWidth,
        x: 0,
        y: selectedQuestY,
      }),
    );
    // Selected quest icon
    hudElementReferences.push(
      createSlot({
        condition: (): boolean =>
          isQuestSelected() && isWorldCombatInProgress() === false,
        icons: [
          {
            imagePath: (): string =>
              getQuestIconImagePath(getSelectedQuest().id),
          },
          {
            condition: (): boolean => {
              const questState: QuestState | null = getQuestState(
                getSelectedQuest().id,
              );
              return (
                questState === QuestState.InProgress ||
                questState === QuestState.TurnIn
              );
            },
            imagePath: "quest-banners/default",
            recolors: (): CreateSpriteOptionsRecolor[] =>
              getQuestIconRecolors(getSelectedQuest().id, false),
          },
        ],
        imagePath: "slots/basic",
        x: 7,
        y: selectedQuestY + 7,
      }),
    );
    // Selected quest name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isQuestSelected() && isWorldCombatInProgress() === false,
          x: 26,
          y: selectedQuestY + 12,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 97,
        text: (): CreateLabelOptionsText => ({
          value: getSelectedQuest().name,
        }),
      }),
    );
    // Selected quest objective
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isQuestSelected() && isWorldCombatInProgress() === false,
          x: 8,
          y: selectedQuestY + 27,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 160,
        text: (): CreateLabelOptionsText => {
          const quest: Quest = getSelectedQuest();
          const questInstance: WorldCharacterQuestInstance =
            getSelectedQuestInstance();
          if (quest.hasMonster()) {
            const monster: Monster = getDefinable(
              Monster,
              quest.monster.monsterID,
            );
            if (typeof questInstance.monsterKills === "undefined") {
              throw new Error("No monster kills found");
            }
            return {
              value: `Defeat ${monster.name} - ${getFormattedInteger(
                questInstance.monsterKills,
              )}/${getFormattedInteger(quest.monster.kills)}`,
            };
          }
          return {
            value: `Talk to ${quest.receiverNPC.name} - ${getFormattedInteger(
              questInstance.isCompleted ? 1 : 0,
            )}/${getFormattedInteger(1)}`,
          };
        },
      }),
    );
    // Divider
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean =>
          isQuestSelected() && isWorldCombatInProgress() === false,
        width: 162,
        x: 7,
        y: selectedQuestY + 39,
      }),
    );
    // Selected quest npc actor image
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isQuestSelected() && isWorldCombatInProgress() === false,
        height: 16,
        imagePath: (): string =>
          getSelectedQuestDialoguePageNPC().actorImagePath,
        width: 16,
        x: 7,
        y: selectedQuestY + 45,
      }),
    );
    // Selected quest npc name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isQuestSelected() && isWorldCombatInProgress() === false,
          x: 26,
          y: selectedQuestY + 50,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 97,
        text: (): CreateLabelOptionsText => ({
          value: getSelectedQuestDialoguePageNPC().name,
        }),
      }),
    );
    // Selected quest close button
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isQuestSelected() && isWorldCombatInProgress() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedCompletedQuestIndex: null,
            selectedInProgressQuestIndex: null,
            selectedQuestDialoguePage: null,
          });
        },
        width: 10,
        x: selectedQuestWidth - 17,
        y: selectedQuestY + 7,
      }),
    );
    // Selected quest text
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isQuestSelected() && isWorldCombatInProgress() === false,
          x: 8,
          y: selectedQuestY + 65,
        },
        horizontalAlignment: "left",
        maxLines: 6,
        maxWidth: 160,
        text: (): CreateLabelOptionsText => {
          const selectedQuest: Quest = getSelectedQuest();
          const questInstance: WorldCharacterQuestInstance =
            getSelectedQuestInstance();
          const giverQuestExchangerQuest: QuestExchangerQuest | undefined =
            selectedQuest.giverNPC.questExchanger.quests.find(
              (questExchangerQuest: QuestExchangerQuest): boolean =>
                questExchangerQuest.questID === selectedQuest.id,
            );
          if (typeof giverQuestExchangerQuest === "undefined") {
            throw new Error("No quest giver quest.");
          }
          const receiverQuestExchangerQuest: QuestExchangerQuest | undefined =
            selectedQuest.receiverNPC.questExchanger.quests.find(
              (questExchangerQuest: QuestExchangerQuest): boolean =>
                questExchangerQuest.questID === selectedQuest.id,
            );
          if (typeof receiverQuestExchangerQuest === "undefined") {
            throw new Error("No quest receiver quest.");
          }
          const values: string[] = [
            selectedQuest.availableText,
            selectedQuest.inProgressText,
          ];
          if (questInstance.isCompleted) {
            values.push(receiverQuestExchangerQuest.completedText);
            values.push(giverQuestExchangerQuest.completedText);
          }
          const page: number = getSelectedQuestDialoguePage();
          const value: string | undefined = values[page];
          if (typeof value === "undefined") {
            throw new Error("No value found");
          }
          return {
            value,
          };
        },
      }),
    );
    // Selected quest pagination arrows
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isQuestSelected() &&
          getSelectedQuestDialoguePage() > 0 &&
          isWorldCombatInProgress() === false,
        height: 14,
        imagePath: "arrows/left",
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedQuestDialoguePage: getSelectedQuestDialoguePage() - 1,
          });
        },
        width: 14,
        x: 7,
        y: selectedQuestY + 133,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isQuestSelected() &&
          getSelectedQuestDialoguePage() < getSelectedQuestDialogueLastPage() &&
          isWorldCombatInProgress() === false,
        height: 14,
        imagePath: "arrows/right",
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedQuestDialoguePage: getSelectedQuestDialoguePage() + 1,
          });
        },
        width: 14,
        x: 155,
        y: selectedQuestY + 133,
      }),
    );
    // Understrike
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean =>
          isQuestSelected() &&
          getSelectedQuestInstance().isCompleted &&
          isWorldCombatInProgress() === false,
        width: 162,
        x: 7,
        y: selectedQuestY + 152,
      }),
    );
    // Exp reward
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isQuestSelected() &&
            getSelectedQuestInstance().isCompleted &&
            isWorldCombatInProgress() === false,
          x: 8,
          y: selectedQuestY + 158,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 160,
        text: (): CreateLabelOptionsText => {
          const selectedQuest: Quest = getSelectedQuest();
          return {
            value: `Experience gained: ${getFormattedInteger(
              selectedQuest.experience,
            )}`,
          };
        },
      }),
    );
    // Gold reward
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isQuestSelected() &&
            getSelectedQuestInstance().isCompleted &&
            isWorldCombatInProgress() === false,
          x: 8,
          y: selectedQuestY + 169,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 160,
        text: (): CreateLabelOptionsText => {
          const selectedQuest: Quest = getSelectedQuest();
          return {
            value: `Gold earned: ${getFormattedInteger(selectedQuest.gold)}`,
          };
        },
      }),
    );
    return mergeHUDElementReferences([
      {
        buttonIDs,
        labelIDs,
        spriteIDs,
      },
      ...hudElementReferences,
    ]);
  },
  initialStateValues: {
    selectedCompletedQuestIndex: null,
    selectedInProgressQuestIndex: null,
    selectedQuestDialoguePage: null,
    tab: QuestLogTab.InProgress,
  },
  preventsWalking: false,
});
