import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  CreateSpriteOptionsRecolor,
  HUDElementReferences,
  State,
  createButton,
  createSprite,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Quest } from "../classes/Quest";
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
import { getDefinable } from "definables";
import { getQuestIconImagePath } from "../functions/getQuestIconImagePath";
import { getQuestState } from "../functions/getQuestState";
import { getWorldState } from "../functions/state/getWorldState";
import { questLogQuestsPerPage } from "../constants/questLogQuestsPerPage";

enum QuestLogTab {
  Completed = "completed",
  InProgress = "in-progress",
}

export interface QuestLogWorldMenuOpenOptions {}
export interface QuestLogWorldMenuStateSchema {
  tab: QuestLogTab;
  selectedCompletedQuestIndex: number | null;
  selectedInProgressQuestIndex: number | null;
}
export const questLogWorldMenu: WorldMenu<
  QuestLogWorldMenuOpenOptions,
  QuestLogWorldMenuStateSchema
> = new WorldMenu<QuestLogWorldMenuOpenOptions, QuestLogWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const buttonIDs: string[] = [];
    const spriteIDs: string[] = [];
    const inProgressTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.InProgress;
    const completedTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.Completed;
    // Background panel
    hudElementReferences.push(
      createPanel({
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
          x: 178,
          y: 26,
        },
        imagePath: "tabs/2",
      }),
    );
    hudElementReferences.push(
      createImage({
        height: 16,
        imagePath: "tab-icons/quest-log/in-progress",
        width: 16,
        x: 197,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
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
          condition: completedTabCondition,
          x: 179,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
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
            tab: QuestLogTab.Completed,
          });
        },
        width: 51,
      }),
    );
    // X button
    hudElementReferences.push(
      createImage({
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
    for (let i: number = 0; i < questLogQuestsPerPage; i++) {
      const getInProgressQuestIDs = (): string[] => {
        const worldState: State<WorldStateSchema> = getWorldState();
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldState.values.worldCharacterID,
        );
        return Object.keys(worldCharacter.questInstances)
          .filter((questInstanceID: string): boolean => {
            const questInstance: WorldCharacterQuestInstance | undefined =
              worldCharacter.questInstances[questInstanceID];
            if (typeof questInstance === "undefined") {
              throw new Error("Quest instance not found");
            }
            return (
              questInstance.isStarted && questInstance.isCompleted === false
            );
          })
          .sort((a: string, b: string): number => {
            const questA: Quest = getDefinable(Quest, a);
            const questB: Quest = getDefinable(Quest, b);
            return questA.name.localeCompare(questB.name);
          });
      };
      const getInProgressQuest = (): Quest => {
        const inProgressQuestIDs: string[] = getInProgressQuestIDs();
        const inProgressQuestID: string | undefined = inProgressQuestIDs[i];
        if (typeof inProgressQuestID === "undefined") {
          throw new Error("Quest ID not found");
        }
        return getDefinable(Quest, inProgressQuestID);
      };
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            inProgressTabCondition() && i < getInProgressQuestIDs().length,
          icons: [
            {
              imagePath: (): string =>
                getQuestIconImagePath(getInProgressQuest().id),
            },
            {
              condition: (): boolean => {
                const questState: QuestState | null = getQuestState(
                  getInProgressQuest().id,
                );
                return (
                  questState === QuestState.InProgress ||
                  questState === QuestState.TurnIn
                );
              },
              imagePath: "quest-banners/default",
              recolors: (): CreateSpriteOptionsRecolor[] => {
                let toColor: Color | undefined;
                switch (getQuestState(getInProgressQuest().id)) {
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
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedInProgressQuestIndex: i,
              });
            }
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => ({
            value: getInProgressQuest().name,
          }),
          width: 116,
          x: 182,
          y,
        }),
      );
    }
    for (let i: number = 0; i < questLogQuestsPerPage; i++) {
      const getCompletedQuestIDs = (): string[] => {
        const worldState: State<WorldStateSchema> = getWorldState();
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldState.values.worldCharacterID,
        );
        return Object.keys(worldCharacter.questInstances)
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
      };
      const getCompletedQuest = (): Quest => {
        const completedQuestIDs: string[] = getCompletedQuestIDs();
        const completedQuestID: string | undefined = completedQuestIDs[i];
        if (typeof completedQuestID === "undefined") {
          throw new Error("Quest ID not found");
        }
        return getDefinable(Quest, completedQuestID);
      };
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            inProgressTabCondition() && i < getCompletedQuestIDs().length,
          icons: [
            {
              imagePath: (): string =>
                getQuestIconImagePath(getCompletedQuest().id),
            },
            {
              condition: (): boolean => {
                const questState: QuestState | null = getQuestState(
                  getCompletedQuest().id,
                );
                return (
                  questState === QuestState.InProgress ||
                  questState === QuestState.TurnIn
                );
              },
              imagePath: "quest-banners/default",
              recolors: (): CreateSpriteOptionsRecolor[] => {
                let toColor: Color | undefined;
                switch (getQuestState(getCompletedQuest().id)) {
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
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedCompletedQuestIndex: i,
              });
            }
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => ({
            value: getCompletedQuest().name,
          }),
          width: 116,
          x: 182,
          y,
        }),
      );
    }
    return mergeHUDElementReferences([
      {
        buttonIDs,
        spriteIDs,
      },
      ...hudElementReferences,
    ]);
  },
  initialStateValues: {
    selectedCompletedQuestIndex: null,
    selectedInProgressQuestIndex: null,
    tab: QuestLogTab.InProgress,
  },
  preventsWalking: false,
});
