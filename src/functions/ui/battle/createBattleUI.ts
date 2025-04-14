import { BattleCharacter } from "../../../classes/BattleCharacter";
import { Color, Constants, Direction, ResourcePool } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  createLabel,
  getGameHeight,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Reachable } from "../../../classes/Reachable";
import { createCharacterSprite } from "../components/createCharacterSprite";
import { createImage } from "../components/createImage";
import { createPanel } from "../components/createPanel";
import { createResourceBar } from "../components/createResourceBar";
import { getBattleState } from "../../state/getBattleState";
import { getConstants } from "../../getConstants";
import { getDefaultedClothesDye } from "../../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../defaulted-cosmetics/getDefaultedOutfit";
import { getDefinable } from "definables";
import { getSumOfNumbers } from "../../getSumOfNumbers";
import { state } from "../../../state";

export interface CreateBattleUIOptions {
  readonly enemyBattleCharacterIDs: readonly string[];
  readonly friendlyBattleCharacterIDs: readonly string[];
}
export const createBattleUI = ({
  enemyBattleCharacterIDs,
  friendlyBattleCharacterIDs,
}: CreateBattleUIOptions): HUDElementReferences => {
  const labelIDs: string[] = [];
  const hudElementReferences: HUDElementReferences[] = [];
  const gameWidth: number = getGameWidth();
  const gameHeight: number = getGameHeight();
  const constants: Constants = getConstants();
  // Landscape BG
  hudElementReferences.push(
    createImage({
      condition: (): boolean => state.values.battleState !== null,
      height: gameHeight,
      imagePath: (): string =>
        getDefinable(Reachable, getBattleState().values.reachableID).landscape
          .imagePath,
      width: gameWidth,
      x: 0,
      y: 0,
    }),
  );
  // Friendly characters
  for (let i: number = 0; i < constants["maximum-party-size"]; i++) {
    const partyMemberCondition = (): boolean => {
      if (state.values.battleState !== null) {
        return typeof friendlyBattleCharacterIDs[i] !== "undefined";
      }
      return false;
    };
    const getBattleCharacter = (): BattleCharacter => {
      const friendlyBattleCharacterID: string | undefined =
        friendlyBattleCharacterIDs[i];
      if (typeof friendlyBattleCharacterID === "undefined") {
        throw new Error("friendlyBattleCharacterID is undefined");
      }
      return getDefinable(BattleCharacter, friendlyBattleCharacterID);
    };
    // Battler panel
    hudElementReferences.push(
      createPanel({
        condition: partyMemberCondition,
        height: 40,
        imagePath: "panels/basic",
        width: 81,
        x: 61 + i * 81,
        y: 200,
      }),
    );
    // Battler name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: partyMemberCondition,
          x: 101 + i * 81,
          y: 206,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 64,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: getBattleCharacter().player.username,
        }),
      }),
    );
    // Battler player sprite
    hudElementReferences.push(
      createCharacterSprite({
        clothesDyeID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedClothesDye(
            battleCharacter.hasClothesDyeItem()
              ? battleCharacter.clothesDyeItemID
              : undefined,
          ).id;
        },
        coordinates: {
          condition: partyMemberCondition,
          x: 73 + i * 81,
          y: 216,
        },
        direction: Direction.Down,
        figureID: (): string => getBattleCharacter().figureID,
        hairDyeID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedHairDye(
            battleCharacter.hasHairDyeItem()
              ? battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedMask(
            battleCharacter.hasMaskItem()
              ? battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedOutfit(
            battleCharacter.hasOutfitItem()
              ? battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        skinColorID: (): string => getBattleCharacter().skinColorID,
      }),
    );
    // Battler HP bar
    hudElementReferences.push(
      createResourceBar({
        condition: partyMemberCondition,
        iconImagePath: "resource-bar-icons/hp",
        maxValue: (): number => getBattleCharacter().resources.maxHP,
        primaryColor: Color.BrightRed,
        secondaryColor: Color.DarkPink,
        value: (): number => getBattleCharacter().resources.hp,
        x: 97 + i * 81,
        y: 216,
      }),
    );
    // Battler MP bar
    hudElementReferences.push(
      createResourceBar({
        condition: (): boolean =>
          partyMemberCondition() &&
          getBattleCharacter().player.character.class.resourcePool ===
            ResourcePool.MP,
        iconImagePath: "resource-bar-icons/mp",
        maxValue: (): number => {
          const maxMP: number | null = getBattleCharacter().resources.maxMP;
          if (maxMP === null) {
            throw new Error("maxMP is null");
          }
          return maxMP;
        },
        primaryColor: Color.PureBlue,
        secondaryColor: Color.StrongBlue,
        value: (): number => {
          const mp: number | null = getBattleCharacter().resources.mp;
          if (mp === null) {
            throw new Error("mp is null");
          }
          return mp;
        },
        x: 97 + i * 81,
        y: 226,
      }),
    );
  }
  // Enemy characters
  for (let i: number = 0; i < enemyBattleCharacterIDs.length; i++) {
    const getBattleCharacter = (): BattleCharacter => {
      const enemyBattleCharacterID: string | undefined =
        enemyBattleCharacterIDs[i];
      if (typeof enemyBattleCharacterID === "undefined") {
        throw new Error("enemyBattleCharacterID is undefined");
      }
      return getDefinable(BattleCharacter, enemyBattleCharacterID);
    };
    hudElementReferences.push(
      createCharacterSprite({
        clothesDyeID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedClothesDye(
            battleCharacter.hasClothesDyeItem()
              ? battleCharacter.clothesDyeItemID
              : undefined,
          ).id;
        },
        coordinates: {
          condition: (): boolean => true,
          x: (): number => {
            const width: number = 32;
            const leftWidths: number[] = [];
            const rightWidths: number[] = [];
            for (let j: number = 0; j < enemyBattleCharacterIDs.length; j++) {
              if (j < i) {
                leftWidths.push(width);
              } else if (j > i) {
                rightWidths.push(width);
              }
            }
            const leftWidth: number =
              getSumOfNumbers(leftWidths) + leftWidths.length * 8;
            const rightWidth: number =
              getSumOfNumbers(rightWidths) + rightWidths.length * 8;
            const totalWidth: number = width + leftWidth + rightWidth;
            const startX: number = Math.floor(gameWidth / 2 - totalWidth / 2);
            return startX + leftWidth;
          },
          y: 96,
        },
        direction: Direction.Down,
        figureID: (): string => getBattleCharacter().figureID,
        hairDyeID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedHairDye(
            battleCharacter.hasHairDyeItem()
              ? battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedMask(
            battleCharacter.hasMaskItem()
              ? battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedOutfit(
            battleCharacter.hasOutfitItem()
              ? battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        scale: 2,
        skinColorID: (): string => getBattleCharacter().skinColorID,
      }),
    );
  }
  return mergeHUDElementReferences([
    {
      labelIDs,
    },
    ...hudElementReferences,
  ]);
};
