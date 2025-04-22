import { Ability } from "../../../classes/Ability";
import { BattleCharacter } from "../../../classes/BattleCharacter";
import { BattleStateSchema, state } from "../../../state";
import {
  BattleUseAbilityRequest,
  Color,
  Constants,
  Direction,
  ResourcePool,
  TargetType,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createEllipse,
  createLabel,
  emitToSocketioServer,
  getGameHeight,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Reachable } from "../../../classes/Reachable";
import { createCharacterSprite } from "../components/createCharacterSprite";
import { createImage } from "../components/createImage";
import { createPanel } from "../components/createPanel";
import { createPressableButton } from "../components/createPressableButton";
import { createResourceBar } from "../components/createResourceBar";
import { getBattleState } from "../../state/getBattleState";
import { getConstants } from "../../getConstants";
import { getDefaultedClothesDye } from "../../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../defaulted-cosmetics/getDefaultedOutfit";
import { getDefinable } from "definables";
import { getSumOfNumbers } from "../../getSumOfNumbers";

const selectAbility = (abilityID: string): void => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const ability: Ability = getDefinable(Ability, abilityID);
  switch (ability.targetType) {
    case TargetType.AllAllies:
      emitToSocketioServer<BattleUseAbilityRequest>({
        data: {
          abilityID: ability.id,
        },
        event: "battle/use-ability",
      });
      break;
    case TargetType.None:
      emitToSocketioServer<BattleUseAbilityRequest>({
        data: {
          abilityID: ability.id,
        },
        event: "battle/use-ability",
      });
      break;
    case TargetType.Self:
      emitToSocketioServer<BattleUseAbilityRequest>({
        data: {
          abilityID: ability.id,
        },
        event: "battle/use-ability",
      });
      break;
    case TargetType.SingleEnemy:
      battleState.setValues({
        selectedAbilityID: ability.id,
      });
      break;
    case TargetType.SingleAlly:
      battleState.setValues({
        selectedAbilityID: ability.id,
      });
      break;
  }
};

export interface CreateBattleUIOptions {
  readonly enemyBattleCharacterIDs: readonly string[];
  readonly friendlyBattleCharacterIDs: readonly string[];
}
export const createBattleUI = ({
  enemyBattleCharacterIDs,
  friendlyBattleCharacterIDs,
}: CreateBattleUIOptions): HUDElementReferences => {
  const ellipseIDs: string[] = [];
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
    const getX = (): number => {
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
    };
    ellipseIDs.push(
      createEllipse({
        color: (): string =>
          getDefinable(Reachable, getBattleState().values.reachableID).landscape
            .shadowColor,
        coordinates: {
          x: (): number => getX() + 4,
          y: 122,
        },
        height: 8,
        width: 23,
      }),
    );
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
          x: (): number => getX(),
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
  // Commands panel
  //  new Panel(
  //   "battle/commands",
  //   (): PanelOptions => ({
  //     height: 100,
  //     imageSourceID: "panels/basic",
  //     width: 61,
  //     x: 0,
  //     y: 140,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     (player.battle.isOngoing() || player.battle.isOver() === false),
  // );
  hudElementReferences.push(
    createPanel({
      height: 100,
      imagePath: "panels/basic",
      width: 61,
      x: 0,
      y: 140,
    }),
  );
  // Commands attack button
  // new Button(
  //   "battle/commands/attack",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceID: "buttons/gray",
  //     text: "Attack",
  //     width: 49,
  //     x: 6,
  //     y: 146,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.playerHasHP(player.id) &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasQueuedAbilities(player.id) === false &&
  //     player.battle.playerHasQueuedHotkey(player.id) === false &&
  //     player.battle.playerIsUnbindingHotkeys(player.id) === false,
  //   (player: Player): void => {
  //     player.handleAttackCommand();
  //   },
  // );
  hudElementReferences.push(
    createPressableButton({
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        selectAbility("attack");
      },
      text: { value: "Attack" },
      width: 49,
      x: 6,
      y: 146,
    }),
  );
  // Commands ability button
  // new Button(
  //   "battle/commands/ability",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceID: "buttons/gray",
  //     text: "Ability",
  //     width: 49,
  //     x: 6,
  //     y: 164,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.playerHasHP(player.id) &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasQueuedAbilities(player.id) === false &&
  //     player.battle.playerHasQueuedHotkey(player.id) === false &&
  //     player.battle.playerIsUnbindingHotkeys(player.id) === false,
  //   (player: Player): void => {
  //     player.toggleBattleSpellbook();
  //   },
  // );
  hudElementReferences.push(
    createPressableButton({
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        console.log("ability");
      },
      text: { value: "Ability" },
      width: 49,
      x: 6,
      y: 164,
    }),
  );
  // Commands item button
  // new Button(
  //   "battle/commands/item",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceID: "buttons/gray",
  //     text: "Item",
  //     width: 49,
  //     x: 6,
  //     y: 182,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.playerHasHP(player.id) &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasQueuedAbilities(player.id) === false &&
  //     player.battle.playerHasQueuedHotkey(player.id) === false &&
  //     player.battle.playerIsUnbindingHotkeys(player.id) === false,
  //   (player: Player): void => {
  //     player.toggleBattleItems();
  //   },
  // );
  hudElementReferences.push(
    createPressableButton({
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        console.log("item");
      },
      text: { value: "Item" },
      width: 49,
      x: 6,
      y: 182,
    }),
  );
  // Commands pass button
  // new Button(
  //   "battle/commands/pass",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceID: "buttons/gray",
  //     text: "Pass",
  //     width: 49,
  //     x: 6,
  //     y: 200,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.playerHasHP(player.id) &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasQueuedAbilities(player.id) === false &&
  //     player.battle.playerHasQueuedHotkey(player.id) === false &&
  //     player.battle.playerIsUnbindingHotkeys(player.id) === false,
  //   (player: Player): void => {
  //     player.handlePassCommand();
  //   },
  // );
  hudElementReferences.push(
    createPressableButton({
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        console.log("pass");
      },
      text: { value: "Pass" },
      width: 49,
      x: 6,
      y: 200,
    }),
  );
  // Commands escape button
  // new Button(
  //   "battle/commands/escape",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceID: "buttons/gray",
  //     text: "Escape",
  //     width: 49,
  //     x: 6,
  //     y: 218,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.playerHasHP(player.id) &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasQueuedAbilities(player.id) === false &&
  //     player.battle.playerHasQueuedHotkey(player.id) === false &&
  //     player.battle.playerIsUnbindingHotkeys(player.id) === false &&
  //     player.battle.isSignificant() === false &&
  //     player.party.playerIsLeader(player.id),
  //   (player: Player): void => {
  //     player.handleEscapeCommand();
  //   },
  // );
  hudElementReferences.push(
    createPressableButton({
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        selectAbility("escape");
      },
      text: { value: "Escape" },
      width: 49,
      x: 6,
      y: 218,
    }),
  );
  // // Commands cancel button
  // new Button(
  //   "battle/commands/cancel",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceID: "buttons/gray",
  //     text: "Cancel",
  //     width: 49,
  //     x: 6,
  //     y: 146,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.playerHasHP(player.id) &&
  //     player.battle.isOngoing() === false &&
  //     (player.battle.playerHasQueuedAbilities(player.id) ||
  //       player.battle.playerHasQueuedHotkey(player.id) ||
  //       player.battle.playerIsUnbindingHotkeys(player.id)),
  //   (player: Player): void => {
  //     player.handleCancelCommand();
  //   },
  // );
  // Instructions panel
  // new Panel(
  //   "battle/instructions",
  //   (player: Player): PanelOptions => ({
  //     height:
  //       player.battle.playerHasQueuedMoves(player.id) ||
  //       player.battle.playerHasHP(player.id) === false
  //         ? 60
  //         : 34,
  //     imageSourceID: "panels/basic",
  //     width: 243,
  //     x: 61,
  //     y: 140,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasAMenuOpen(player.id) === false,
  // );
  hudElementReferences.push(
    createPanel({
      height: 34,
      imagePath: "panels/basic",
      width: 243,
      x: 61,
      y: 140,
    }),
  );
  // Instructions label
  // new Label(
  //   "battle/instructions",
  //   (player: Player): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "left",
  //     maxLines: 1,
  //     maxWidth: 229,
  //     size: 1,
  //     text: player.battle.getPlayerInstructions(player.id),
  //     verticalAlignment: "top",
  //     x: 69,
  //     y: 148,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasAMenuOpen(player.id) === false,
  // );
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => true,
        x: 69,
        y: 148,
      },
      horizontalAlignment: "left",
      maxLines: 1,
      maxWidth: 229,
      size: 1,
      text: (): CreateLabelOptionsText => ({
        value: "Select an action.",
      }),
    }),
  );
  // // Selected ability label
  // new Label(
  //   "battle/instructions/ability",
  //   (player: Player): LabelOptions => ({
  //     color: Color.White,
  //     horizontalAlignment: "right",
  //     maxLines: 1,
  //     maxWidth: 96,
  //     size: 1,
  //     text: getDefinable(
  //       Ability,
  //       player.battle.getPlayerLastQueuedAbility(player.id).abilityID,
  //     ).name,
  //     verticalAlignment: "middle",
  //     x: 276,
  //     y: 156,
  //   }),
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasAMenuOpen(player.id) === false &&
  //     player.battle.playerIsTargeting(player.id),
  // );
  // // Selected ability Slot
  // new Slot(
  //   "battle/instructions/ability",
  //   (player: Player): SlotOptions => {
  //     const queuedAbility: BattleQueuedAbility =
  //       player.battle.getPlayerLastQueuedAbility(player.id);
  //     const ability: Ability = getDefinable(Ability, queuedAbility.abilityID);
  //     return {
  //       grayscale: false,
  //       iconImageSourceID: ability.imageSource.id,
  //       panelImageSourceID: "panels/basic",
  //       selected: false,
  //       x: 280,
  //       y: 149,
  //     };
  //   },
  //   (player: Player): boolean =>
  //     player.hasBattle() &&
  //     player.battle.isOver() === false &&
  //     player.battle.isOngoing() === false &&
  //     player.battle.playerHasAMenuOpen(player.id) === false &&
  //     player.battle.playerIsTargeting(player.id),
  //   undefined,
  // );
  return mergeHUDElementReferences([
    {
      ellipseIDs,
      labelIDs,
    },
    ...hudElementReferences,
  ]);
};
