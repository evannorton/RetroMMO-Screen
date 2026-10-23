import { Achievement } from "../classes/Achievement";
import { Color, Stat } from "retrommo-types";
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
import { getCyclicIndex } from "../functions/getCyclicIndex";
import { getDefinable, getDefinables } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getQuestIconImagePath } from "../functions/getQuestIconImagePath";
import { getQuestIconRecolors } from "../functions/getQuestIconRecolors";
import { getQuestState } from "../functions/getQuestState";
import { getStatAbbreviation } from "../functions/stats/getStatAbbreviation";
import { getWorldState } from "../functions/state/getWorldState";
import {
  grayColors,
  questLogAchievementsPerPage,
  questLogBestiaryMonstersPerPage,
  questLogCompletedQuestsPerPage,
  questLogInProgressQuestsPerPage,
} from "../constants";
import { isForcedWorldUIVisible } from "../functions/isForcedWorldUIVisible";

enum QuestLogTab {
  Achievements = "achievements",
  Bestiary = "bestiary",
  Completed = "completed",
  InProgress = "in-progress",
}
interface BestiaryPanelStat {
  readonly column: number;
  readonly getValue: (monster: Monster) => number;
  readonly label: string;
  readonly row: number;
}
interface BestiaryPanelStatColumn {
  readonly labelX: number;
  readonly valueX: number;
}
const bestiaryPanelStatColumns: readonly BestiaryPanelStatColumn[] = [
  {
    labelX: 8,
    valueX: 84,
  },
  {
    labelX: 92,
    valueX: 168,
  },
];
const bestiaryPanelStats: readonly BestiaryPanelStat[] = [
  {
    column: 0,
    getValue: (monster: Monster): number => monster.maxHP,
    label: "HP",
    row: 0,
  },
  {
    column: 1,
    getValue: (monster: Monster): number => monster.maxMP,
    label: "MP",
    row: 0,
  },
  {
    column: 0,
    getValue: (monster: Monster): number => monster.strength,
    label: getStatAbbreviation(Stat.Strength),
    row: 1,
  },
  {
    column: 1,
    getValue: (monster: Monster): number => monster.intelligence,
    label: getStatAbbreviation(Stat.Intelligence),
    row: 1,
  },
  {
    column: 0,
    getValue: (monster: Monster): number => monster.defense,
    label: getStatAbbreviation(Stat.Defense),
    row: 2,
  },
  {
    column: 1,
    getValue: (monster: Monster): number => monster.wisdom,
    label: getStatAbbreviation(Stat.Wisdom),
    row: 2,
  },
  {
    column: 0,
    getValue: (monster: Monster): number => monster.agility,
    label: getStatAbbreviation(Stat.Agility),
    row: 3,
  },
  {
    column: 1,
    getValue: (monster: Monster): number => monster.luck,
    label: getStatAbbreviation(Stat.Luck),
    row: 3,
  },
  {
    column: 0,
    getValue: (monster: Monster): number => monster.experience,
    label: "Exp",
    row: 4,
  },
  {
    column: 1,
    getValue: (monster: Monster): number => monster.gold,
    label: "Gold",
    row: 4,
  },
];

export interface QuestLogWorldMenuOpenOptions {}
export interface QuestLogWorldMenuStateSchema {
  achievementsPage: number;
  bestiaryPage: number;
  completedQuestsPage: number;
  inProgressQuestsPage: number;
  selectedAchievementID: string | null;
  selectedBestiaryMonsterID: string | null;
  selectedCompletedQuestID: string | null;
  selectedInProgressQuestID: string | null;
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
    const achievementsTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.Achievements;
    const bestiaryTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.Bestiary;
    // Background panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean => isForcedWorldUIVisible() === false,
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
            case QuestLogTab.Achievements:
              return "3";
            case QuestLogTab.Bestiary:
              return "4";
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
          {
            frames: [
              {
                height: 21,
                sourceHeight: 21,
                sourceWidth: 124,
                sourceX: 248,
                sourceY: 0,
                width: 124,
              },
            ],
            id: "3",
          },
          {
            frames: [
              {
                height: 21,
                sourceHeight: 21,
                sourceWidth: 124,
                sourceX: 372,
                sourceY: 0,
                width: 124,
              },
            ],
            id: "4",
          },
        ],
        coordinates: {
          condition: (): boolean => isForcedWorldUIVisible() === false,
          x: 178,
          y: 26,
        },
        imagePath: "tabs/4",
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isForcedWorldUIVisible() === false,
        height: 16,
        imagePath: "tab-icons/quest-log/in-progress",
        width: 16,
        x: 184,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isForcedWorldUIVisible() === false,
        height: 16,
        imagePath: "tab-icons/quest-log/completed",
        width: 16,
        x: 211,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isForcedWorldUIVisible() === false,
        height: 16,
        imagePath: "tab-icons/quest-log/achievements",
        width: 16,
        x: 237,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isForcedWorldUIVisible() === false,
        height: 16,
        imagePath: "tab-icons/quest-log/bestiary",
        width: 16,
        x: 263,
        y: 29,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            inProgressTabCondition() === false &&
            isForcedWorldUIVisible() === false,
          x: 180,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            achievementsPage: 0,
            bestiaryPage: 0,
            completedQuestsPage: 0,
            selectedAchievementID: null,
            selectedBestiaryMonsterID: null,
            selectedCompletedQuestID: null,
            selectedQuestDialoguePage: null,
            tab: QuestLogTab.InProgress,
          });
        },
        width: 24,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            completedTabCondition() === false &&
            isForcedWorldUIVisible() === false,
          x: 205,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            achievementsPage: 0,
            bestiaryPage: 0,
            inProgressQuestsPage: 0,
            selectedAchievementID: null,
            selectedBestiaryMonsterID: null,
            selectedInProgressQuestID: null,
            selectedQuestDialoguePage: null,
            tab: QuestLogTab.Completed,
          });
        },
        width: 25,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            achievementsTabCondition() === false &&
            isForcedWorldUIVisible() === false,
          x: 231,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            bestiaryPage: 0,
            completedQuestsPage: 0,
            inProgressQuestsPage: 0,
            selectedBestiaryMonsterID: null,
            selectedCompletedQuestID: null,
            selectedInProgressQuestID: null,
            selectedQuestDialoguePage: null,
            tab: QuestLogTab.Achievements,
          });
        },
        width: 25,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            bestiaryTabCondition() === false &&
            isForcedWorldUIVisible() === false,
          x: 257,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            achievementsPage: 0,
            completedQuestsPage: 0,
            inProgressQuestsPage: 0,
            selectedAchievementID: null,
            selectedCompletedQuestID: null,
            selectedInProgressQuestID: null,
            selectedQuestDialoguePage: null,
            tab: QuestLogTab.Bestiary,
          });
        },
        width: 25,
      }),
    );
    // X button
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isForcedWorldUIVisible() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          questLogWorldMenu.close({});
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
      const pageOffset: number =
        questLogWorldMenu.state.values.inProgressQuestsPage *
        questLogInProgressQuestsPerPage;
      const inProgressQuestID: string | undefined =
        inProgressQuestIDs[i + pageOffset];
      if (typeof inProgressQuestID === "undefined") {
        throw new Error("Quest ID not found");
      }
      return getDefinable(Quest, inProgressQuestID);
    };
    const getInProgressQuestsLastPage = (): number =>
      Math.max(
        Math.floor(
          (getInProgressQuestIDs().length - 1) /
            questLogInProgressQuestsPerPage,
        ),
        0,
      );
    const isInProgressQuestsPaginated = (): boolean =>
      getInProgressQuestIDs().length > questLogInProgressQuestsPerPage;
    const pageInProgressQuests = (offset: number): void => {
      const pages: number[] = [];
      for (let i: number = 0; i < getInProgressQuestsLastPage() + 1; i++) {
        pages.push(i);
      }
      questLogWorldMenu.state.setValues({
        inProgressQuestsPage: getCyclicIndex(
          pages.indexOf(questLogWorldMenu.state.values.inProgressQuestsPage) +
            offset,
          pages,
        ),
      });
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
      const pageOffset: number =
        questLogWorldMenu.state.values.completedQuestsPage *
        questLogCompletedQuestsPerPage;
      const completedQuestID: string | undefined =
        completedQuestIDs[i + pageOffset];
      if (typeof completedQuestID === "undefined") {
        throw new Error("Quest ID not found");
      }
      return getDefinable(Quest, completedQuestID);
    };
    const getCompletedQuestsLastPage = (): number =>
      Math.max(
        Math.floor(
          (getCompletedQuestIDs().length - 1) / questLogCompletedQuestsPerPage,
        ),
        0,
      );
    const isCompletedQuestsPaginated = (): boolean =>
      getCompletedQuestIDs().length > questLogCompletedQuestsPerPage;
    const pageCompletedQuests = (offset: number): void => {
      const pages: number[] = [];
      for (let i: number = 0; i < getCompletedQuestsLastPage() + 1; i++) {
        pages.push(i);
      }
      questLogWorldMenu.state.setValues({
        completedQuestsPage: getCyclicIndex(
          pages.indexOf(questLogWorldMenu.state.values.completedQuestsPage) +
            offset,
          pages,
        ),
      });
    };
    for (let i: number = 0; i < questLogInProgressQuestsPerPage; i++) {
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean => {
            const pageOffset: number =
              questLogWorldMenu.state.values.inProgressQuestsPage *
              questLogInProgressQuestsPerPage;
            return (
              inProgressTabCondition() &&
              i + pageOffset < getInProgressQuestIDs().length &&
              isForcedWorldUIVisible() === false
            );
          },
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
          isSelected: (): boolean => {
            const slotQuestID: string = getInProgressQuest(i).id;
            return (
              questLogWorldMenu.state.values.selectedInProgressQuestID ===
              slotQuestID
            );
          },
          onClick: (): void => {
            const slotQuestID: string = getInProgressQuest(i).id;
            if (
              questLogWorldMenu.state.values.selectedInProgressQuestID ===
              slotQuestID
            ) {
              questLogWorldMenu.state.setValues({
                selectedInProgressQuestID: null,
                selectedQuestDialoguePage: null,
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedInProgressQuestID: slotQuestID,
                selectedQuestDialoguePage: null,
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
    // In-progress quests page left arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          inProgressTabCondition() &&
          isInProgressQuestsPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/left",
        onClick: (): void => {
          pageInProgressQuests(-1);
        },
        width: 14,
        x: 190,
        y: 176,
      }),
    );
    // In-progress quests page right arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          inProgressTabCondition() &&
          isInProgressQuestsPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/right",
        onClick: (): void => {
          pageInProgressQuests(1);
        },
        width: 14,
        x: 275,
        y: 176,
      }),
    );
    // In-progress quests page number
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            inProgressTabCondition() &&
            isInProgressQuestsPaginated() &&
            isForcedWorldUIVisible() === false,
          x: 296,
          y: 193,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => ({
          value: String(
            questLogWorldMenu.state.values.inProgressQuestsPage + 1,
          ),
        }),
      }),
    );
    for (let i: number = 0; i < questLogCompletedQuestsPerPage; i++) {
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean => {
            const pageOffset: number =
              questLogWorldMenu.state.values.completedQuestsPage *
              questLogCompletedQuestsPerPage;
            return (
              completedTabCondition() &&
              i + pageOffset < getCompletedQuestIDs().length &&
              isForcedWorldUIVisible() === false
            );
          },
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
          isSelected: (): boolean => {
            const slotQuestID: string = getCompletedQuest(i).id;
            return (
              questLogWorldMenu.state.values.selectedCompletedQuestID ===
              slotQuestID
            );
          },
          onClick: (): void => {
            const slotQuestID: string = getCompletedQuest(i).id;
            if (
              questLogWorldMenu.state.values.selectedCompletedQuestID ===
              slotQuestID
            ) {
              questLogWorldMenu.state.setValues({
                selectedCompletedQuestID: null,
                selectedQuestDialoguePage: null,
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedCompletedQuestID: slotQuestID,
                selectedQuestDialoguePage: null,
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
    // Completed quests page left arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          completedTabCondition() &&
          isCompletedQuestsPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/left",
        onClick: (): void => {
          pageCompletedQuests(-1);
        },
        width: 14,
        x: 190,
        y: 176,
      }),
    );
    // Completed quests page right arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          completedTabCondition() &&
          isCompletedQuestsPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/right",
        onClick: (): void => {
          pageCompletedQuests(1);
        },
        width: 14,
        x: 275,
        y: 176,
      }),
    );
    // Completed quests page number
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            completedTabCondition() &&
            isCompletedQuestsPaginated() &&
            isForcedWorldUIVisible() === false,
          x: 296,
          y: 193,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => ({
          value: String(questLogWorldMenu.state.values.completedQuestsPage + 1),
        }),
      }),
    );
    const getAchievementIDs = (): string[] =>
      Array.from(getDefinables(Achievement).keys()).sort(
        (a: string, b: string): number => {
          const achievementA: Achievement = getDefinable(Achievement, a);
          const achievementB: Achievement = getDefinable(Achievement, b);
          return achievementA.name.localeCompare(achievementB.name);
        },
      );
    const getAchievement = (i: number): Achievement => {
      const achievementIDs: string[] = getAchievementIDs();
      const pageOffset: number =
        questLogWorldMenu.state.values.achievementsPage *
        questLogAchievementsPerPage;
      const achievementID: string | undefined = achievementIDs[i + pageOffset];
      if (typeof achievementID === "undefined") {
        throw new Error("Achievement ID not found");
      }
      return getDefinable(Achievement, achievementID);
    };
    const getAchievementsLastPage = (): number =>
      Math.max(
        Math.floor(
          (getAchievementIDs().length - 1) / questLogAchievementsPerPage,
        ),
        0,
      );
    const isAchievementsPaginated = (): boolean =>
      getAchievementIDs().length > questLogAchievementsPerPage;
    const pageAchievements = (offset: number): void => {
      const pages: number[] = [];
      for (let i: number = 0; i < getAchievementsLastPage() + 1; i++) {
        pages.push(i);
      }
      questLogWorldMenu.state.setValues({
        achievementsPage: getCyclicIndex(
          pages.indexOf(questLogWorldMenu.state.values.achievementsPage) +
            offset,
          pages,
        ),
      });
    };
    for (let i: number = 0; i < questLogAchievementsPerPage; i++) {
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          color: (): Color =>
            getAchievement(i).hasUnlockedAtServerTime()
              ? Color.White
              : Color.DarkGray,
          condition: (): boolean => {
            const pageOffset: number =
              questLogWorldMenu.state.values.achievementsPage *
              questLogAchievementsPerPage;
            return (
              achievementsTabCondition() &&
              i + pageOffset < getAchievementIDs().length &&
              isForcedWorldUIVisible() === false
            );
          },
          icons: [
            {
              imagePath: (): string => getAchievement(i).imagePath,
              palette: (): string[] =>
                getAchievement(i).hasUnlockedAtServerTime() ? [] : grayColors,
            },
          ],
          isSelected: (): boolean => {
            const slotAchievementID: string = getAchievement(i).id;
            return (
              questLogWorldMenu.state.values.selectedAchievementID ===
              slotAchievementID
            );
          },
          onClick: (): void => {
            const slotAchievementID: string = getAchievement(i).id;
            if (
              questLogWorldMenu.state.values.selectedAchievementID ===
              slotAchievementID
            ) {
              questLogWorldMenu.state.setValues({
                selectedAchievementID: null,
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedAchievementID: slotAchievementID,
              });
            }
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => ({
            value: getAchievement(i).name,
          }),
          width: 116,
          x: 182,
          y,
        }),
      );
    }
    // Achievements page left arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          achievementsTabCondition() &&
          isAchievementsPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/left",
        onClick: (): void => {
          pageAchievements(-1);
        },
        width: 14,
        x: 190,
        y: 176,
      }),
    );
    // Achievements page right arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          achievementsTabCondition() &&
          isAchievementsPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/right",
        onClick: (): void => {
          pageAchievements(1);
        },
        width: 14,
        x: 275,
        y: 176,
      }),
    );
    // Achievements page number
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            achievementsTabCondition() &&
            isAchievementsPaginated() &&
            isForcedWorldUIVisible() === false,
          x: 296,
          y: 193,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => ({
          value: String(questLogWorldMenu.state.values.achievementsPage + 1),
        }),
      }),
    );
    const getBestiaryMonsterIDs = (): string[] =>
      Array.from(getDefinables(Monster).keys()).sort(
        (a: string, b: string): number => {
          const monsterA: Monster = getDefinable(Monster, a);
          const monsterB: Monster = getDefinable(Monster, b);
          return monsterA.name.localeCompare(monsterB.name);
        },
      );
    const getBestiaryMonster = (i: number): Monster => {
      const bestiaryMonsterIDs: string[] = getBestiaryMonsterIDs();
      const pageOffset: number =
        questLogWorldMenu.state.values.bestiaryPage *
        questLogBestiaryMonstersPerPage;
      const bestiaryMonsterID: string | undefined =
        bestiaryMonsterIDs[i + pageOffset];
      if (typeof bestiaryMonsterID === "undefined") {
        throw new Error("Monster ID not found");
      }
      return getDefinable(Monster, bestiaryMonsterID);
    };
    const getBestiaryLastPage = (): number =>
      Math.max(
        Math.floor(
          (getBestiaryMonsterIDs().length - 1) /
            questLogBestiaryMonstersPerPage,
        ),
        0,
      );
    const isBestiaryPaginated = (): boolean =>
      getBestiaryMonsterIDs().length > questLogBestiaryMonstersPerPage;
    const pageBestiary = (offset: number): void => {
      const pages: number[] = [];
      for (let i: number = 0; i < getBestiaryLastPage() + 1; i++) {
        pages.push(i);
      }
      questLogWorldMenu.state.setValues({
        bestiaryPage: getCyclicIndex(
          pages.indexOf(questLogWorldMenu.state.values.bestiaryPage) + offset,
          pages,
        ),
      });
    };
    for (let i: number = 0; i < questLogBestiaryMonstersPerPage; i++) {
      const y: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          color: (): Color =>
            (worldCharacter.bestiaryKills[getBestiaryMonster(i).id] ?? 0) === 0
              ? Color.DarkGray
              : Color.White,
          condition: (): boolean => {
            const pageOffset: number =
              questLogWorldMenu.state.values.bestiaryPage *
              questLogBestiaryMonstersPerPage;
            return (
              bestiaryTabCondition() &&
              i + pageOffset < getBestiaryMonsterIDs().length &&
              isForcedWorldUIVisible() === false
            );
          },
          icons: [
            {
              imagePath: "monster-icons/placeholder",
              palette: (): string[] =>
                (worldCharacter.bestiaryKills[getBestiaryMonster(i).id] ??
                  0) === 0
                  ? grayColors
                  : [],
            },
          ],
          isSelected: (): boolean => {
            const slotMonsterID: string = getBestiaryMonster(i).id;
            return (
              questLogWorldMenu.state.values.selectedBestiaryMonsterID ===
              slotMonsterID
            );
          },
          onClick: (): void => {
            const slotMonsterID: string = getBestiaryMonster(i).id;
            if (
              questLogWorldMenu.state.values.selectedBestiaryMonsterID ===
              slotMonsterID
            ) {
              questLogWorldMenu.state.setValues({
                selectedBestiaryMonsterID: null,
              });
            } else {
              questLogWorldMenu.state.setValues({
                selectedBestiaryMonsterID: slotMonsterID,
              });
            }
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => {
            const bestiaryMonster: Monster = getBestiaryMonster(i);
            const bestiaryMonsterName: string =
              (worldCharacter.bestiaryKills[bestiaryMonster.id] ?? 0) === 0
                ? "???"
                : bestiaryMonster.name;
            return {
              value: bestiaryMonsterName,
            };
          },
          width: 116,
          x: 182,
          y,
        }),
      );
    }
    // Bestiary page left arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          bestiaryTabCondition() &&
          isBestiaryPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/left",
        onClick: (): void => {
          pageBestiary(-1);
        },
        width: 14,
        x: 190,
        y: 176,
      }),
    );
    // Bestiary page right arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          bestiaryTabCondition() &&
          isBestiaryPaginated() &&
          isForcedWorldUIVisible() === false,
        height: 14,
        imagePath: "arrows/right",
        onClick: (): void => {
          pageBestiary(1);
        },
        width: 14,
        x: 275,
        y: 176,
      }),
    );
    // Bestiary page number
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            bestiaryTabCondition() &&
            isBestiaryPaginated() &&
            isForcedWorldUIVisible() === false,
          x: 296,
          y: 193,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => ({
          value: String(questLogWorldMenu.state.values.bestiaryPage + 1),
        }),
      }),
    );
    const isBestiaryMonsterSelected = (): boolean =>
      bestiaryTabCondition() &&
      questLogWorldMenu.state.values.selectedBestiaryMonsterID !== null;
    const getSelectedBestiaryMonster = (): Monster => {
      if (questLogWorldMenu.state.values.selectedBestiaryMonsterID === null) {
        throw new Error("No selected bestiary monster ID");
      }
      return getDefinable(
        Monster,
        questLogWorldMenu.state.values.selectedBestiaryMonsterID,
      );
    };
    const selectedBestiaryY: number = 24;
    const selectedBestiaryWidth: number = 176;
    const bestiaryPanelStatRowHeight: number = 11;
    const bestiaryPanelStatLastRow: number = bestiaryPanelStats.reduce(
      (lastRow: number, bestiaryPanelStat: BestiaryPanelStat): number =>
        Math.max(lastRow, bestiaryPanelStat.row),
      0,
    );
    const selectedBestiaryStatsY: number =
      selectedBestiaryY +
      169 -
      bestiaryPanelStatLastRow * bestiaryPanelStatRowHeight;
    const selectedBestiaryKillsDividerY: number = selectedBestiaryY + 39;
    const selectedBestiaryStatsDividerY: number = selectedBestiaryStatsY - 5;
    const selectedBestiaryArtRegionY: number =
      selectedBestiaryKillsDividerY + 1;
    const selectedBestiaryArtRegionHeight: number =
      selectedBestiaryStatsDividerY - selectedBestiaryArtRegionY;
    // Selected bestiary monster panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean =>
          isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
        height: 184,
        imagePath: "panels/basic",
        width: selectedBestiaryWidth,
        x: 0,
        y: selectedBestiaryY,
      }),
    );
    // Selected bestiary monster icon
    hudElementReferences.push(
      createSlot({
        condition: (): boolean =>
          isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
        icons: [
          {
            imagePath: "monster-icons/placeholder",
            palette: (): string[] =>
              (worldCharacter.bestiaryKills[getSelectedBestiaryMonster().id] ??
                0) === 0
                ? grayColors
                : [],
          },
        ],
        imagePath: "slots/basic",
        x: 7,
        y: selectedBestiaryY + 7,
      }),
    );
    // Selected bestiary monster name
    labelIDs.push(
      createLabel({
        color: (): Color =>
          (worldCharacter.bestiaryKills[getSelectedBestiaryMonster().id] ??
            0) === 0
            ? Color.DarkGray
            : Color.White,
        coordinates: {
          condition: (): boolean =>
            isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
          x: 26,
          y: selectedBestiaryY + 12,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 97,
        text: (): CreateLabelOptionsText => {
          const selectedBestiaryMonster: Monster = getSelectedBestiaryMonster();
          const selectedBestiaryMonsterName: string =
            (worldCharacter.bestiaryKills[selectedBestiaryMonster.id] ?? 0) ===
            0
              ? "???"
              : selectedBestiaryMonster.name;
          return {
            value: selectedBestiaryMonsterName,
          };
        },
      }),
    );
    // Selected bestiary monster kills
    labelIDs.push(
      createLabel({
        color: (): Color =>
          (worldCharacter.bestiaryKills[getSelectedBestiaryMonster().id] ??
            0) === 0
            ? Color.DarkGray
            : Color.White,
        coordinates: {
          condition: (): boolean =>
            isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
          x: 8,
          y: selectedBestiaryY + 27,
        },
        horizontalAlignment: "left",
        maxLines: 1,
        maxWidth: 160,
        text: (): CreateLabelOptionsText => ({
          value: `Defeated: ${getFormattedInteger(
            worldCharacter.bestiaryKills[getSelectedBestiaryMonster().id] ?? 0,
          )}`,
        }),
      }),
    );
    // Selected bestiary monster kills divider
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean =>
          isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
        width: 162,
        x: 7,
        y: selectedBestiaryKillsDividerY,
      }),
    );
    // Selected bestiary monster close button
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedBestiaryMonsterID: null,
          });
        },
        width: 10,
        x: selectedBestiaryWidth - 17,
        y: selectedBestiaryY + 7,
      }),
    );
    // Selected bestiary monster art
    for (const bestiaryMonsterID of getBestiaryMonsterIDs()) {
      const bestiaryMonster: Monster = getDefinable(Monster, bestiaryMonsterID);
      spriteIDs.push(
        createSprite({
          animationID: "default",
          animations: [
            {
              frames: [
                {
                  height: bestiaryMonster.battleHeight,
                  sourceHeight: bestiaryMonster.battleHeight,
                  sourceWidth: bestiaryMonster.battleWidth,
                  sourceX: 0,
                  sourceY: 0,
                  width: bestiaryMonster.battleWidth,
                },
              ],
              id: "default",
            },
          ],
          coordinates: {
            condition: (): boolean =>
              isBestiaryMonsterSelected() &&
              questLogWorldMenu.state.values.selectedBestiaryMonsterID ===
                bestiaryMonsterID &&
              isForcedWorldUIVisible() === false,
            x: Math.floor(
              (selectedBestiaryWidth - bestiaryMonster.battleWidth) / 2,
            ),
            y:
              selectedBestiaryArtRegionY +
              Math.floor(
                (selectedBestiaryArtRegionHeight -
                  bestiaryMonster.battleHeight) /
                  2,
              ),
          },
          imagePath: bestiaryMonster.imagePath,
          isSilhouette: (): boolean =>
            (worldCharacter.bestiaryKills[bestiaryMonsterID] ?? 0) === 0,
        }),
      );
    }
    // Selected bestiary monster stats divider
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean =>
          isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
        width: 162,
        x: 7,
        y: selectedBestiaryStatsDividerY,
      }),
    );
    for (const bestiaryPanelStat of bestiaryPanelStats) {
      const bestiaryPanelStatColumn: BestiaryPanelStatColumn | undefined =
        bestiaryPanelStatColumns[bestiaryPanelStat.column];
      if (typeof bestiaryPanelStatColumn === "undefined") {
        throw new Error("Bestiary panel stat column not found");
      }
      const bestiaryPanelStatY: number =
        selectedBestiaryStatsY +
        bestiaryPanelStat.row * bestiaryPanelStatRowHeight;
      labelIDs.push(
        createLabel({
          color: (): Color =>
            (worldCharacter.bestiaryKills[getSelectedBestiaryMonster().id] ??
              0) === 0
              ? Color.DarkGray
              : Color.White,
          coordinates: {
            condition: (): boolean =>
              isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
            x: bestiaryPanelStatColumn.labelX,
            y: bestiaryPanelStatY,
          },
          horizontalAlignment: "left",
          text: { value: bestiaryPanelStat.label },
        }),
      );
      labelIDs.push(
        createLabel({
          color: (): Color =>
            (worldCharacter.bestiaryKills[getSelectedBestiaryMonster().id] ??
              0) === 0
              ? Color.DarkGray
              : Color.White,
          coordinates: {
            condition: (): boolean =>
              isBestiaryMonsterSelected() && isForcedWorldUIVisible() === false,
            x: bestiaryPanelStatColumn.valueX,
            y: bestiaryPanelStatY,
          },
          horizontalAlignment: "right",
          text: (): CreateLabelOptionsText => {
            const selectedBestiaryMonster: Monster =
              getSelectedBestiaryMonster();
            const bestiaryPanelStatValue: string =
              (worldCharacter.bestiaryKills[selectedBestiaryMonster.id] ??
                0) === 0
                ? "???"
                : getFormattedInteger(
                    bestiaryPanelStat.getValue(selectedBestiaryMonster),
                  );
            return {
              value: bestiaryPanelStatValue,
            };
          },
        }),
      );
    }
    const getSelectedQuest = (): Quest => {
      switch (questLogWorldMenu.state.values.tab) {
        case QuestLogTab.InProgress:
          if (
            questLogWorldMenu.state.values.selectedInProgressQuestID === null
          ) {
            throw new Error("No selected in-progress quest ID");
          }
          return getDefinable(
            Quest,
            questLogWorldMenu.state.values.selectedInProgressQuestID,
          );
        case QuestLogTab.Completed:
          if (
            questLogWorldMenu.state.values.selectedCompletedQuestID === null
          ) {
            throw new Error("No selected completed quest ID");
          }
          return getDefinable(
            Quest,
            questLogWorldMenu.state.values.selectedCompletedQuestID,
          );
        case QuestLogTab.Achievements:
          throw new Error("No selected quest on achievements tab");
        case QuestLogTab.Bestiary:
          throw new Error("No selected quest on bestiary tab");
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
    const isQuestSelected = (): boolean => {
      if (questLogWorldMenu.state.values.tab === QuestLogTab.InProgress) {
        if (questLogWorldMenu.state.values.selectedInProgressQuestID === null) {
          return false;
        }
        return getInProgressQuestIDs().includes(
          questLogWorldMenu.state.values.selectedInProgressQuestID,
        );
      }
      if (questLogWorldMenu.state.values.tab === QuestLogTab.Completed) {
        if (questLogWorldMenu.state.values.selectedCompletedQuestID === null) {
          return false;
        }
        return getCompletedQuestIDs().includes(
          questLogWorldMenu.state.values.selectedCompletedQuestID,
        );
      }
      return false;
    };
    const getSelectedQuestDialogueLastPage = (): number => {
      const selectedQuestInstance: WorldCharacterQuestInstance =
        getSelectedQuestInstance();
      return selectedQuestInstance.isCompleted ? 2 : 1;
    };
    const getSelectedQuestDialoguePage = (): number =>
      questLogWorldMenu.state.values.selectedQuestDialoguePage ??
      getSelectedQuestDialogueLastPage();
    const getSelectedQuestDialoguePageNPC = (): NPC => {
      const page: number = getSelectedQuestDialoguePage();
      const quest: Quest = getSelectedQuest();
      if (page === 2) {
        return quest.receiverNPC;
      }
      return quest.giverNPC;
    };
    const isAchievementSelected = (): boolean =>
      achievementsTabCondition() &&
      questLogWorldMenu.state.values.selectedAchievementID !== null;
    const getSelectedAchievement = (): Achievement => {
      if (questLogWorldMenu.state.values.selectedAchievementID === null) {
        throw new Error("No selected achievement ID");
      }
      return getDefinable(
        Achievement,
        questLogWorldMenu.state.values.selectedAchievementID,
      );
    };
    // Selected achievement panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean =>
          isAchievementSelected() && isForcedWorldUIVisible() === false,
        height: 76,
        imagePath: "panels/basic",
        width: 176,
        x: 0,
        y: 132,
      }),
    );
    // Selected achievement icon
    hudElementReferences.push(
      createSlot({
        condition: (): boolean =>
          isAchievementSelected() && isForcedWorldUIVisible() === false,
        icons: [
          {
            imagePath: (): string => getSelectedAchievement().imagePath,
            palette: (): string[] =>
              getSelectedAchievement().hasUnlockedAtServerTime()
                ? []
                : grayColors,
          },
        ],
        imagePath: "slots/basic",
        x: 7,
        y: 139,
      }),
    );
    // Selected achievement name
    labelIDs.push(
      createLabel({
        color: (): Color =>
          getSelectedAchievement().hasUnlockedAtServerTime()
            ? Color.White
            : Color.DarkGray,
        coordinates: {
          condition: (): boolean =>
            isAchievementSelected() && isForcedWorldUIVisible() === false,
          x: 27,
          y: 144,
        },
        horizontalAlignment: "left",
        text: (): CreateLabelOptionsText => ({
          value: getSelectedAchievement().name,
        }),
      }),
    );
    // Selected achievement close button
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isAchievementSelected() && isForcedWorldUIVisible() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedAchievementID: null,
          });
        },
        width: 10,
        x: 159,
        y: 139,
      }),
    );
    // Selected achievement description
    labelIDs.push(
      createLabel({
        color: (): Color =>
          getSelectedAchievement().hasUnlockedAtServerTime()
            ? Color.White
            : Color.DarkGray,
        coordinates: {
          condition: (): boolean =>
            isAchievementSelected() && isForcedWorldUIVisible() === false,
          x: 8,
          y: 159,
        },
        horizontalAlignment: "left",
        maxLines: 3,
        maxWidth: 160,
        text: (): CreateLabelOptionsText => ({
          value: getSelectedAchievement().description,
        }),
      }),
    );
    // Selected achievement unlock date
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isAchievementSelected() &&
            getSelectedAchievement().hasUnlockedAtServerTime() &&
            isForcedWorldUIVisible() === false,
          x: 169,
          y: 194,
        },
        horizontalAlignment: "right",
        maxLines: 1,
        maxWidth: 160,
        text: (): CreateLabelOptionsText => {
          const date: Date = new Date(
            getSelectedAchievement().unlockedAtServerTime,
          );
          const year: string = String(date.getFullYear());
          const month: string = String(date.getMonth() + 1).padStart(2, "0");
          const day: string = String(date.getDate()).padStart(2, "0");
          return {
            value: `Unlocked: ${year}-${month}-${day}`,
          };
        },
      }),
    );
    const selectedQuestY: number = 24;
    const selectedQuestWidth: number = 176;
    // Selected quest panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean =>
          isQuestSelected() && isForcedWorldUIVisible() === false,
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
          isQuestSelected() && isForcedWorldUIVisible() === false,
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
            isQuestSelected() && isForcedWorldUIVisible() === false,
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
            isQuestSelected() && isForcedWorldUIVisible() === false,
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
              value:
                quest.monster.kills === 1
                  ? `Defeat ${monster.name}`
                  : `${monster.name} - ${getFormattedInteger(
                      questInstance.monsterKills,
                    )}/${getFormattedInteger(quest.monster.kills)}`,
            };
          }
          return {
            value: `Talk to ${quest.receiverNPC.name}`,
          };
        },
      }),
    );
    // Divider
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean =>
          isQuestSelected() && isForcedWorldUIVisible() === false,
        width: 162,
        x: 7,
        y: selectedQuestY + 39,
      }),
    );
    // Selected quest npc actor image
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isQuestSelected() && isForcedWorldUIVisible() === false,
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
            isQuestSelected() && isForcedWorldUIVisible() === false,
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
          isQuestSelected() && isForcedWorldUIVisible() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            selectedCompletedQuestID: null,
            selectedInProgressQuestID: null,
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
            isQuestSelected() && isForcedWorldUIVisible() === false,
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
          isForcedWorldUIVisible() === false,
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
          isForcedWorldUIVisible() === false,
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
          isForcedWorldUIVisible() === false,
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
            isForcedWorldUIVisible() === false,
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
            isForcedWorldUIVisible() === false,
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
    achievementsPage: 0,
    bestiaryPage: 0,
    completedQuestsPage: 0,
    inProgressQuestsPage: 0,
    selectedAchievementID: null,
    selectedBestiaryMonsterID: null,
    selectedCompletedQuestID: null,
    selectedInProgressQuestID: null,
    selectedQuestDialoguePage: null,
    tab: QuestLogTab.InProgress,
  },
});
