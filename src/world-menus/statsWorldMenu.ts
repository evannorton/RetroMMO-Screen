import { Chest } from "../classes/Chest";
import { Color, Constants, ResourcePool } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Item } from "../classes/Item";
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
    // new Panel(
    //   "world/stats",
    //   (): PanelOptions => ({
    //     height: 174,
    //     imageSourceID: "panels/basic",
    //     width: 282,
    //     x: 11,
    //     y: 24,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Picture(
    //   "world/stats/close",
    //   (): PictureOptions => ({
    //     grayscale: false,
    //     height: 11,
    //     imageSourceID: "x",
    //     recolors: [],
    //     sourceHeight: 11,
    //     sourceWidth: 10,
    //     sourceX: 0,
    //     sourceY: 0,
    //     width: 10,
    //     x: 276,
    //     y: 31,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    //   (player: Player): void => {
    //     player.closeStats();
    //   },
    // );
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
    // new Label(
    //   "world/stats/username",
    //   (player: Player): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "center",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: player.username,
    //     verticalAlignment: "top",
    //     x: 152,
    //     y: 33,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Picture(
    //   "world/stats/dividers/1",
    //   (): PictureOptions => ({
    //     grayscale: false,
    //     height: 1,
    //     imageSourceID: "divider",
    //     recolors: [],
    //     sourceHeight: 1,
    //     sourceWidth: 266,
    //     sourceX: 0,
    //     sourceY: 0,
    //     width: 266,
    //     x: 19,
    //     y: 44,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    //   undefined,
    // );
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean => isWorldCombatInProgress() === false,
        width: 266,
        x: 19,
        y: 44,
      }),
    );
    // Level
    // new Label(
    //   "world/stats/level",
    //   (player: Player): LabelOptions => {
    //     const level: number = player.level;
    //     const classObject: Class = player.class;
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "left",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `Level ${level} ${classObject.name}`,
    //       verticalAlignment: "top",
    //       x: 20,
    //       y: 50,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/hp/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "HP",
    //     verticalAlignment: "top",
    //     x: 160,
    //     y: 50,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/hp/value",
    //   (player: Player): LabelOptions => {
    //     const hp: number = player.hp;
    //     const maxHP: number = player.getMaxHP();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `${hp}/${maxHP}`,
    //       verticalAlignment: "top",
    //       x: 284,
    //       y: 50,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/experience/name",
    //   (player: Player): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: player.isMaxLevel() ? "Max level" : "Next level",
    //     verticalAlignment: "top",
    //     x: 20,
    //     y: 67,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/experience/value",
    //   (player: Player): LabelOptions => {
    //     const experienceUntilLevel: number = player.experienceUntilLevel;
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `${experienceUntilLevel}xp`,
    //       verticalAlignment: "top",
    //       x: 144,
    //       y: 67,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     player.isMaxLevel() === false &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/mp/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "MP",
    //     verticalAlignment: "top",
    //     x: 160,
    //     y: 67,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     player.hasResourcePool(ResourcePool.MP) &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/mp/value",
    //   (player: Player): LabelOptions => {
    //     const mp: number = player.mp;
    //     const maxMP: number | null = player.getMaxMP();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `${mp}/${maxMP}`,
    //       verticalAlignment: "top",
    //       x: 284,
    //       y: 67,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     player.hasResourcePool(ResourcePool.MP) &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/strength/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "Strength",
    //     verticalAlignment: "top",
    //     x: 20,
    //     y: 84,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/strength/value",
    //   (player: Player): LabelOptions => {
    //     const strength: number = player.getStrength();
    //     const bonusStrength: number = player.getBonusStrength();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text:
    //         bonusStrength === 0
    //           ? String(strength)
    //           : `${strength} (+${bonusStrength})`,
    //       verticalAlignment: "top",
    //       x: 144,
    //       y: 84,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/intelligence/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "Intelligence",
    //     verticalAlignment: "top",
    //     x: 160,
    //     y: 84,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/intelligence/value",
    //   (player: Player): LabelOptions => {
    //     const intelligence: number | null = player.getIntelligence();
    //     const bonusIntelligence: number | null = player.getBonusIntelligence();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text:
    //         bonusIntelligence === 0
    //           ? String(intelligence)
    //           : `${intelligence} (+${bonusIntelligence})`,
    //       verticalAlignment: "top",
    //       x: 284,
    //       y: 84,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/defense/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "Defense",
    //     verticalAlignment: "top",
    //     x: 20,
    //     y: 101,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/defense/value",
    //   (player: Player): LabelOptions => {
    //     const defense: number | null = player.getDefense();
    //     const bonusDefense: number | null = player.getBonusDefense();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text:
    //         bonusDefense === 0
    //           ? String(defense)
    //           : `${defense} (+${bonusDefense})`,
    //       verticalAlignment: "top",
    //       x: 144,
    //       y: 101,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/wisdom/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "Wisdom",
    //     verticalAlignment: "top",
    //     x: 160,
    //     y: 101,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/wisdom/value",
    //   (player: Player): LabelOptions => {
    //     const wisdom: number | null = player.getWisdom();
    //     const bonusWisdom: number | null = player.getBonusWisdom();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text:
    //         bonusWisdom === 0 ? String(wisdom) : `${wisdom} (+${bonusWisdom})`,
    //       verticalAlignment: "top",
    //       x: 284,
    //       y: 101,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/agility/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "Agility",
    //     verticalAlignment: "top",
    //     x: 20,
    //     y: 118,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/agility/value",
    //   (player: Player): LabelOptions => {
    //     const agility: number | null = player.getAgility();
    //     const bonusAgility: number | null = player.getBonusAgility();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text:
    //         bonusAgility === 0
    //           ? String(agility)
    //           : `${agility} (+${bonusAgility})`,
    //       verticalAlignment: "top",
    //       x: 144,
    //       y: 118,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/luck/name",
    //   (): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "left",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: "Luck",
    //     verticalAlignment: "top",
    //     x: 160,
    //     y: 118,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/luck/value",
    //   (player: Player): LabelOptions => {
    //     const luck: number | null = player.getLuck();
    //     const bonusLuck: number | null = player.getBonusLuck();
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: bonusLuck === 0 ? String(luck) : `${luck} (+${bonusLuck})`,
    //       verticalAlignment: "top",
    //       x: 284,
    //       y: 118,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Picture(
    //   "world/stats/dividers/2",
    //   (): PictureOptions => ({
    //     grayscale: false,
    //     height: 1,
    //     imageSourceID: "divider",
    //     recolors: [],
    //     sourceHeight: 1,
    //     sourceWidth: 266,
    //     sourceX: 0,
    //     sourceY: 0,
    //     width: 266,
    //     x: 19,
    //     y: 130,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    //   undefined,
    // );
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
                const itemID: string | undefined =
                  worldState.values.boostItemInstanceIDs[i];
                if (typeof itemID === "undefined") {
                  throw new Error("Item ID is undefined");
                }
                const item: Item = getDefinable(Item, itemID);
                return item.iconImagePath;
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
    // new Picture(
    //   "world/stats/dividers/3",
    //   (): PictureOptions => ({
    //     grayscale: false,
    //     height: 1,
    //     imageSourceID: "divider",
    //     recolors: [],
    //     sourceHeight: 1,
    //     sourceWidth: 266,
    //     sourceX: 0,
    //     sourceY: 0,
    //     width: 266,
    //     x: 19,
    //     y: 167,
    //   }),
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    //   undefined,
    // );
    hudElementReferences.push(
      createUnderstrike({
        condition: (): boolean => isWorldCombatInProgress() === false,
        width: 266,
        x: 19,
        y: 167,
      }),
    );
    // Time played
    // new Label(
    //   "world/stats/time-played",
    //   (player: Player): LabelOptions => {
    //     const timePlayed: number = player.timePlayed;
    //     const hours: number = Math.floor(timePlayed / (1000 * 60 * 60));
    //     const minutes: number = Math.floor(timePlayed / (1000 * 60)) % 60;
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "left",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `Time played: ${hours}:${minutes.toString().padStart(2, "0")}`,
    //       verticalAlignment: "top",
    //       x: 20,
    //       y: 177,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
          const timePlayed: number = worldState.values.timePlayed;
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
    // new Label(
    //   "world/stats/quests",
    //   (player: Player): LabelOptions => {
    //     const character: SavefileCharacter = getPlayerActiveCharacter(player.id);
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `Quests: ${
    //         Object.values(character.questInstances).filter(
    //           (questInstance: SavefileQuestInstance): boolean =>
    //             questInstance.completedAt !== null,
    //         ).length
    //       }/${getDefinables(Quest).size}`,
    //       verticalAlignment: "top",
    //       x: 286,
    //       y: 172,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Label(
    //   "world/stats/treasure",
    //   (player: Player): LabelOptions => {
    //     const openedChests: number = player.chestOpens.filter(
    //       ({ chestID }: SavefileChestOpen): boolean =>
    //         getDefinable(Chest, chestID).countsTowardTold,
    //     ).length;
    //     const totalChests: number = Array.from(
    //       getDefinables(Chest).values(),
    //     ).filter((chest: Chest): boolean => chest.countsTowardTold).length;
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "right",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `Treasure: ${openedChests}/${totalChests}`,
    //       verticalAlignment: "top",
    //       x: 286,
    //       y: 183,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.statsIsOpen &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
