import { Boost } from "../classes/Boost";
import { Chest } from "../classes/Chest";
import { Color, Constants, ResourcePool, Stat } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  emitToSocketioServer,
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
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { createSlot } from "../functions/ui/components/createSlot";
import { createUnderstrike } from "../functions/ui/components/createUnderstrike";
import { getConstants } from "../functions/getConstants";
import { getDefinable, getDefinables, getDefinablesCount } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getStatAbbreviation } from "../functions/stats/getStatAbbreviation";
import { getStatBonusAmount } from "../functions/stats/getStatBonusAmount";
import { getStatName } from "../functions/stats/getStatName";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface StatsWorldMenuOpenOptions {}
export interface StatsWorldMenuStateSchema {
  selectedBoostIndex: number | null;
}
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
        text: { value: getStatName(Stat.Strength) },
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
          const bonusStrength: number = getStatBonusAmount(Stat.Strength);
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
        text: { value: getStatName(Stat.Intelligence) },
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
          const bonusIntelligence: number = getStatBonusAmount(
            Stat.Intelligence,
          );
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
        text: { value: getStatName(Stat.Defense) },
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
          const bonusDefense: number = getStatBonusAmount(Stat.Defense);
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
        text: { value: getStatName(Stat.Wisdom) },
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
          const bonusWisdom: number = getStatBonusAmount(Stat.Wisdom);
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
        text: { value: getStatName(Stat.Agility) },
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
          const bonusAgility: number = getStatBonusAmount(Stat.Agility);
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
        text: { value: getStatName(Stat.Luck) },
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
          const bonusLuck: number = getStatBonusAmount(Stat.Luck);
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
    for (let i: number = 0; i < constants["maximum-boosts"]; i++) {
      hudElementReferences.push(
        createSlot({
          button: {
            condition: (): boolean =>
              i < worldState.values.boostItemInstanceIDs.length,
            onClick: (): void => {
              statsWorldMenu.state.setValues({
                selectedBoostIndex:
                  statsWorldMenu.state.values.selectedBoostIndex === i
                    ? null
                    : i,
              });
            },
          },
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
          isSelected: (): boolean =>
            statsWorldMenu.state.values.selectedBoostIndex === i,
          x: 23 + i * 35,
          y: 141,
        }),
      );
    }
    // Selected boost info
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            statsWorldMenu.state.values.selectedBoostIndex !== null,
          x: 257,
          y: 136,
        },
        horizontalAlignment: "center",
        text: (): CreateLabelOptionsText => {
          if (statsWorldMenu.state.values.selectedBoostIndex === null) {
            throw new Error("Selected boost index is null");
          }
          const itemInstanceID: string | undefined =
            worldState.values.boostItemInstanceIDs[
              statsWorldMenu.state.values.selectedBoostIndex
            ];
          if (typeof itemInstanceID === "undefined") {
            throw new Error("Item ID is undefined");
          }
          const itemInstance: ItemInstance = getDefinable(
            ItemInstance,
            itemInstanceID,
          );
          const boost: Boost = itemInstance.item.ability.boost;
          return {
            value: `+${getFormattedInteger(boost.amount)} ${getStatAbbreviation(
              boost.stat,
            )}`,
          };
        },
      }),
    );
    // Destroy boost
    hudElementReferences.push(
      createPressableButton({
        condition: (): boolean =>
          statsWorldMenu.state.values.selectedBoostIndex !== null,
        height: 16,
        imagePath: "pressable-buttons/red",
        onClick: (): void => {
          if (statsWorldMenu.state.values.selectedBoostIndex === null) {
            throw new Error("Selected boost index is null");
          }
          const itemInstanceID: string | undefined =
            worldState.values.boostItemInstanceIDs[
              statsWorldMenu.state.values.selectedBoostIndex
            ];
          if (typeof itemInstanceID === "undefined") {
            throw new Error("Item ID is undefined");
          }
          emitToSocketioServer({
            data: { itemInstanceID },
            event: "world/destroy-boost",
          });
        },
        text: { value: "Destroy" },
        width: 48,
        x: 233,
        y: 147,
      }),
    );
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
  initialStateValues: {
    selectedBoostIndex: null,
  },
  preventsWalking: false,
});
