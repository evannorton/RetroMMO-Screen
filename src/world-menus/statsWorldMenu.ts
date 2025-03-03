import { Chest } from "../classes/Chest";
import { Color, Constants, ResourcePool } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  getCurrentTime,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { ItemInstance } from "../classes/ItemInstance";
import { Quest } from "../classes/Quest";
import {
  WorldCharacter,
  WorldCharacterQuestInstance,
} from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createSlot } from "../functions/ui/components/createSlot";
import { createUnderstrike } from "../functions/ui/components/createUnderstrike";
import { getBonusAgility } from "../functions/bonus-stats/getBonusAgility";
import { getBonusDefense } from "../functions/bonus-stats/getBonusDefense";
import { getBonusIntelligence } from "../functions/bonus-stats/getBonusIntelligence";
import { getBonusLuck } from "../functions/bonus-stats/getBonusLuck";
import { getBonusStrength } from "../functions/bonus-stats/getBonusStrength";
import { getBonusWisdom } from "../functions/bonus-stats/getBonusWisdom";
import { getConstants } from "../functions/getConstants";
import { getDefinable, getDefinables, getDefinablesCount } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface StatsWorldMenuOpenOptions {}
export interface StatsWorldMenuStateSchema {}
export const statsWorldMenu: WorldMenu<
  StatsWorldMenuOpenOptions,
  StatsWorldMenuStateSchema
> = new WorldMenu<StatsWorldMenuOpenOptions, StatsWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const worldState: State<WorldStateSchema> = getWorldState();
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldState.values.worldCharacterID,
    );
    const constants: Constants = getConstants();
    // Panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 174,
        imagePath: "panels/basic",
        width: 282,
        x: 11,
        y: 24,
      }),
    );
    // Close button
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          statsWorldMenu.close();
        },
        width: 10,
        x: 276,
        y: 31,
      }),
    );
    // Username
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 152,
          y: 33,
        },
        horizontalAlignment: "center",
        text: { value: worldCharacter.username },
      }),
    );
    // Divider 1
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean => isWorldCombatInProgress() === false,
        width: 266,
        x: 19,
        y: 44,
      }),
    );
    // Level
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 20,
          y: 50,
        },
        horizontalAlignment: "left",
        text: (): CreateLabelOptionsText => ({
          value: `Level ${getFormattedInteger(worldCharacter.level)} ${
            worldCharacter.class.name
          }`,
        }),
      }),
    );
    // HP name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 160,
          y: 50,
        },
        horizontalAlignment: "left",
        text: { value: "HP" },
      }),
    );
    // HP value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 284,
          y: 50,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(
            worldCharacter.resources.hp,
          )}/${getFormattedInteger(worldCharacter.resources.maxHP)}`,
        }),
      }),
    );
    // Experience name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 20,
          y: 67,
        },
        horizontalAlignment: "left",
        text: {
          value:
            worldCharacter.level === constants["maximum-level"]
              ? "Max level"
              : "Next level",
        },
      }),
    );
    // Experience value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            worldCharacter.level < constants["maximum-level"] &&
            isWorldCombatInProgress() === false,
          x: 144,
          y: 67,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          if (worldState.values.experienceUntilLevel === null) {
            throw new Error("Experience until level is null");
          }
          return {
            value: `${getFormattedInteger(
              worldState.values.experienceUntilLevel,
            )}xp`,
          };
        },
      }),
    );
    // MP name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            worldCharacter.class.resourcePool === ResourcePool.MP &&
            isWorldCombatInProgress() === false,
          x: 160,
          y: 67,
        },
        horizontalAlignment: "left",
        text: { value: "MP" },
      }),
    );
    // MP value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            worldCharacter.class.resourcePool === ResourcePool.MP &&
            isWorldCombatInProgress() === false,
          x: 284,
          y: 67,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          if (worldCharacter.resources.mp === null) {
            throw new Error("MP is null");
          }
          if (worldCharacter.resources.maxMP === null) {
            throw new Error("Max MP is null");
          }
          return {
            value: `${getFormattedInteger(
              worldCharacter.resources.mp,
            )}/${getFormattedInteger(worldCharacter.resources.maxMP)}`,
          };
        },
      }),
    );
    // Strength name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 20,
          y: 84,
        },
        horizontalAlignment: "left",
        text: { value: "Strength" },
      }),
    );
    // Strength value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 144,
          y: 84,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const strength: number = worldState.values.strength;
          const bonusStrength: number = getBonusStrength();
          return {
            value:
              bonusStrength === 0
                ? getFormattedInteger(strength)
                : `${getFormattedInteger(strength)} (+${getFormattedInteger(
                    bonusStrength,
                  )})`,
          };
        },
      }),
    );
    // Intelligence name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 160,
          y: 84,
        },
        horizontalAlignment: "left",
        text: { value: "Intelligence" },
      }),
    );
    // Intelligence value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 284,
          y: 84,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const intelligence: number = worldState.values.intelligence;
          const bonusIntelligence: number = getBonusIntelligence();
          return {
            value:
              bonusIntelligence === 0
                ? getFormattedInteger(intelligence)
                : `${getFormattedInteger(intelligence)} (+${getFormattedInteger(
                    bonusIntelligence,
                  )})`,
          };
        },
      }),
    );
    // Defense name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 20,
          y: 101,
        },
        horizontalAlignment: "left",
        text: { value: "Defense" },
      }),
    );
    // Defense value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 144,
          y: 101,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const defense: number = worldState.values.defense;
          const bonusDefense: number = getBonusDefense();
          return {
            value:
              bonusDefense === 0
                ? getFormattedInteger(defense)
                : `${getFormattedInteger(defense)} (+${getFormattedInteger(
                    bonusDefense,
                  )})`,
          };
        },
      }),
    );
    // Wisdom name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 160,
          y: 101,
        },
        horizontalAlignment: "left",
        text: { value: "Wisdom" },
      }),
    );
    // Wisdom value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 284,
          y: 101,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const wisdom: number = worldState.values.wisdom;
          const bonusWisdom: number = getBonusWisdom();
          return {
            value:
              bonusWisdom === 0
                ? getFormattedInteger(wisdom)
                : `${getFormattedInteger(wisdom)} (+${getFormattedInteger(
                    bonusWisdom,
                  )})`,
          };
        },
      }),
    );
    // Agility name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 20,
          y: 118,
        },
        horizontalAlignment: "left",
        text: { value: "Agility" },
      }),
    );
    // Agility value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 144,
          y: 118,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const agility: number = worldState.values.agility;
          const bonusAgility: number = getBonusAgility();
          return {
            value:
              bonusAgility === 0
                ? getFormattedInteger(agility)
                : `${getFormattedInteger(agility)} (+${getFormattedInteger(
                    bonusAgility,
                  )})`,
          };
        },
      }),
    );
    // Luck name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 160,
          y: 118,
        },
        horizontalAlignment: "left",
        text: { value: "Luck" },
      }),
    );
    // Luck value
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 284,
          y: 118,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const luck: number = worldState.values.luck;
          const bonusLuck: number = getBonusLuck();
          return {
            value:
              bonusLuck === 0
                ? getFormattedInteger(luck)
                : `${getFormattedInteger(luck)} (+${getFormattedInteger(
                    bonusLuck,
                  )})`,
          };
        },
      }),
    );
    // Divider 2
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean => isWorldCombatInProgress() === false,
        width: 266,
        x: 19,
        y: 130,
      }),
    );
    // For each boost slot
    // for (let i: number = 0; i < serverConstants.maximumBoosts; i++) {
    //   // Boost icon
    //   new Switch(
    //     `world/stats/boosts/${i}`,
    //     (): SwitchOptions => ({
    //       height: 16,
    //       width: 16,
    //       x: 23 + i * 35,
    //       y: 141,
    //     }),
    //     (player: Player): boolean =>
    //       player.statsIsOpen &&
    //       player.hasBoostItemInstance(i) &&
    //       (player.party.hasWorldCombatStartedAt() === false ||
    //         player.party.worldCombatIsOngoing() === false),
    //     (player: Player): void => {
    //       player.toggleBoostItemInstanceSelection(i);
    //     },
    //   );
    //   new Slot(
    //     `world/stats/boosts/${i}`,
    //     (player: Player): SlotOptions => {
    //       const savefileItemInstance: SavefileItemInstance | null =
    //         player.hasBoostItemInstance(i)
    //           ? player.getBoostItemInstance(i)
    //           : null;
    //       const item: Item | null =
    //         savefileItemInstance !== null
    //           ? getItemInstanceItem(savefileItemInstance)
    //           : null;
    //       return {
    //         grayscale: false,
    //         iconImageSourceID: item !== null ? item.imageSource.id : null,
    //         panelImageSourceID: "panels/basic",
    //         selected:
    //           player.hasBoostItemInstance(i) &&
    //           player.hasSelectedBoostItemInstance() &&
    //           player.hasBoostItemInstanceSelected(i),
    //         x: 23 + i * 35,
    //         y: 141,
    //       };
    //     },
    //     (player: Player): boolean =>
    //       player.statsIsOpen &&
    //       (player.party.hasWorldCombatStartedAt() === false ||
    //         player.party.worldCombatIsOngoing() === false),
    //     undefined,
    //   );
    // }
    for (let i: number = 0; i < constants["maximum-boosts"]; i++) {
      hudElementReferences.push(
        createSlot({
          icons: [
            {
              condition: (): boolean =>
                i < worldState.values.boostItemInstanceIDs.length,
              imagePath: (): string => {
                const itemInstanceID: string | undefined =
                  worldState.values.boostItemInstanceIDs[i];
                if (typeof itemInstanceID === "undefined") {
                  throw new Error("Item ID is undefined");
                }
                const itemInstance: ItemInstance = getDefinable(
                  ItemInstance,
                  itemInstanceID,
                );
                return itemInstance.item.iconImagePath;
              },
            },
          ],
          imagePath: "slots/basic",
          x: 23 + i * 35,
          y: 141,
        }),
      );
    }
    // // Selected boost info
    // new Label(
    //   `world/stats/boosts`,
    //   (player: Player): LabelOptions => {
    //     const item: Item = getItemInstanceItem(player.selectedBoostItemInstance);
    //     const ability: Ability = item.ability;
    //     const boost: Boost = ability.boost;
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "center",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `+${getFormattedInteger(boost.amount)} ${getStatAbbreviation(
    //         boost.stat,
    //       )}`,
    //       verticalAlignment: "top",
    //       x: 257,
    //       y: 136,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     player.hasSelectedBoostItemInstance() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
    // // Destroy boost
    // new Button(
    //   `world/stats/boosts`,
    //   (): ButtonOptions => ({
    //     color: Color.White,
    //     height: 16,
    //     imageSourceID: "buttons/red",
    //     text: "Destroy",
    //     width: 48,
    //     x: 233,
    //     y: 147,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     player.hasSelectedBoostItemInstance() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    //   (player: Player): void => {
    //     player.destroySelectedBoostItemInstance();
    //   },
    // );
    // Divider 3
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean => isWorldCombatInProgress() === false,
        width: 266,
        x: 19,
        y: 167,
      }),
    );
    // Time played
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 20,
          y: 177,
        },
        horizontalAlignment: "left",
        text: (): CreateLabelOptionsText => {
          const timePlayed: number =
            worldState.values.timePlayed.amount +
            (getCurrentTime() - worldState.values.timePlayed.updatedAt);
          const hours: number = Math.floor(timePlayed / (1000 * 60 * 60));
          const minutes: number = Math.floor(timePlayed / (1000 * 60)) % 60;
          return {
            value: `Time played: ${hours}:${minutes
              .toString()
              .padStart(2, "0")}`,
          };
        },
      }),
    );
    // Quests
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 286,
          y: 172,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const completedCount: number = Object.values(
            worldCharacter.questInstances,
          ).filter(
            (questInstance: WorldCharacterQuestInstance): boolean =>
              questInstance.isCompleted,
          ).length;
          const totalCount: number = getDefinablesCount(Quest);
          return {
            value: `Quests: ${getFormattedInteger(
              completedCount,
            )}/${getFormattedInteger(totalCount)}`,
          };
        },
      }),
    );
    // Treasure
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 286,
          y: 183,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => {
          const openedCount: number = worldCharacter.openedChestIDs.filter(
            (openedChestID: string): boolean =>
              getDefinable(Chest, openedChestID).countsTowardTotal,
          ).length;
          const totalCount: number = Array.from(getDefinables(Chest)).filter(
            ([, chest]: [string, Chest]): boolean => chest.countsTowardTotal,
          ).length;
          return {
            value: `Treasure: ${getFormattedInteger(
              openedCount,
            )}/${getFormattedInteger(totalCount)}`,
          };
        },
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
  preventsWalking: false,
});
