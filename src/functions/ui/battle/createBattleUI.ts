import { BattleCharacter } from "../../../classes/BattleCharacter";
import { BattleStateSchema, state } from "../../../state";
import { Color, Constants, Direction, ResourcePool } from "retrommo-types";
import {
  CreateLabelOptionsText,
  State,
  createLabel,
  getGameHeight,
  getGameWidth,
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

export const createBattleUI = (): void => {
  const gameWidth: number = getGameWidth();
  const gameHeight: number = getGameHeight();
  const constants: Constants = getConstants();
  // Landscape BG
  createImage({
    condition: (): boolean => state.values.battleState !== null,
    height: gameHeight,
    imagePath: (): string =>
      getDefinable(Reachable, getBattleState().values.reachableID).landscape
        .imagePath,
    width: gameWidth,
    x: 0,
    y: 0,
  });
  // Friendly charactesr
  for (let i: number = 0; i < constants["maximum-party-size"]; i++) {
    const partyMemberCondition = (): boolean => {
      if (state.values.battleState !== null) {
        const battleState: State<BattleStateSchema> = getBattleState();
        return (
          typeof battleState.values.friendlyBattleCharacterIDs[i] !==
          "undefined"
        );
      }
      return false;
    };
    const getBattleCharacter = (): BattleCharacter => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const friendlyBattleCharacterID: string | undefined =
        battleState.values.friendlyBattleCharacterIDs[i];
      if (typeof friendlyBattleCharacterID === "undefined") {
        throw new Error("friendlyBattleCharacterID is undefined");
      }
      return getDefinable(BattleCharacter, friendlyBattleCharacterID);
    };
    // Battler panel
    // new Panel(
    //   `battle/team/${i}`,
    //   (): PanelOptions => ({
    //     height: 40,
    //     imageSourceID: "panels/basic",
    //     width: 81,
    //     x: 61 + i * 81,
    //     y: 200,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasBattle() &&
    //     (player.battle.isOngoing() || player.battle.isOver() === false) &&
    //     player.battle.playerAllyTeamHasSize(player.id, i + 1),
    // );
    createPanel({
      condition: partyMemberCondition,
      height: 40,
      imagePath: "panels/basic",
      width: 81,
      x: 61 + i * 81,
      y: 200,
    });
    // Battler name
    // new Label(
    //   `battle/team/${i}/name`,
    //   (player: Player): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "center",
    //     maxLines: 1,
    //     maxWidth: 64,
    //     size: 1,
    //     text: player.battle.getPlayerAllyBattleParticipantName(player.id, i),
    //     verticalAlignment: "top",
    //     x: 101 + i * 81,
    //     y: 206,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasBattle() &&
    //     (player.battle.isOngoing() || player.battle.isOver() === false) &&
    //     player.battle.playerAllyTeamHasSize(player.id, i + 1),
    // );
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
    });
    // Battler player sprite
    // new Switch(
    //   `battle/team/${i}/player`,
    //   (): SwitchOptions => ({
    //     height: 16,
    //     width: 16,
    //     x: 73 + i * 81,
    //     y: 216,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasBattle() &&
    //     (player.battle.isOngoing() || player.battle.isOver() === false) &&
    //     player.battle.playerIsTargeting(player.id) &&
    //     player.battle.playerIsTargetingAlly(player.id) &&
    //     player.battle.playerAllyTeamHasSize(player.id, i + 1) &&
    //     player.battle.playerAllyBattleParticipantIsPlayer(player.id, i),
    //   (player: Player): void => {
    //     player.battle.queuePlayerAllyBattleParticipant(player.id, i);
    //   },
    // );
    // new PlayerSprite(
    //   `battle/team/${i}`,
    //   (player: Player): PlayerSpriteOptions => {
    //     const clothesDye: ClothesDye | null =
    //       player.battle.playerAllyBattleParticipantHasClothesDye(player.id, i)
    //         ? player.battle.getPlayerAllyBattleParticipantClothesDye(
    //             player.id,
    //             i,
    //           )
    //         : null;
    //     const figure: Figure =
    //       player.battle.getPlayerAllyBattleParticipantFigure(player.id, i);
    //     const hairDye: HairDye | null =
    //       player.battle.playerAllyBattleParticipantHasHairDye(player.id, i)
    //         ? player.battle.getPlayerAllyBattleParticipantHairDye(player.id, i)
    //         : null;
    //     const mask: Mask | null =
    //       player.battle.playerAllyBattleParticipantHasMask(player.id, i)
    //         ? player.battle.getPlayerAllyBattleParticipantMask(player.id, i)
    //         : null;
    //     const outfit: Outfit | null =
    //       player.battle.playerAllyBattleParticipantHasOutfit(player.id, i)
    //         ? player.battle.getPlayerAllyBattleParticipantOutfit(player.id, i)
    //         : null;
    //     const skinColor: SkinColor =
    //       player.battle.getPlayerAllyBattleParticipantSkinColor(player.id, i);
    //     return {
    //       clothesDyeID: clothesDye !== null ? clothesDye.id : null,
    //       direction: Direction.Down,
    //       figureID: figure.id,
    //       hairDyeID: hairDye !== null ? hairDye.id : null,
    //       maskID: mask !== null ? mask.id : null,
    //       outfitID: outfit !== null ? outfit.id : null,
    //       renewing: false,
    //       skinColorID: skinColor.id,
    //       x: 73 + i * 81,
    //       y: 216,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.hasBattle() &&
    //     (player.battle.isOngoing() || player.battle.isOver() === false) &&
    //     player.battle.playerAllyTeamHasSize(player.id, i + 1) &&
    //     player.battle.playerAllyBattleParticipantIsPlayer(player.id, i),
    //   false,
    // );
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
    });
    // Battler HP bar
    // new ResourceBar(
    //   `battle/team/${i}/hp`,
    //   (player: Player): ResourceBarOptions => ({
    //     iconImageSourceID: "resource-bar-icons/hp",
    //     maxValue: player.battle.getPlayerAllyBattleParticipantMaxHP(
    //       player.id,
    //       i,
    //     ),
    //     primaryColor: Color.BrightRed,
    //     secondaryColor: Color.DarkPink,
    //     value: player.battle.getPlayerAllyBattleParticipantRenderedHP(
    //       player.id,
    //       i,
    //     ),
    //     x: 97 + i * 81,
    //     y: 216,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasBattle() &&
    //     (player.battle.isOngoing() || player.battle.isOver() === false) &&
    //     player.battle.playerAllyTeamHasSize(player.id, i + 1),
    // );
    createResourceBar({
      condition: partyMemberCondition,
      iconImagePath: "resource-bar-icons/hp",
      maxValue: (): number => getBattleCharacter().resources.maxHP,
      primaryColor: Color.BrightRed,
      secondaryColor: Color.DarkPink,
      value: (): number => getBattleCharacter().resources.hp,
      x: 97 + i * 81,
      y: 216,
    });
    // Battler MP bar
    // new ResourceBar(
    //   `battle/team/${i}/mp`,
    //   (player: Player): ResourceBarOptions => ({
    //     iconImageSourceID: "resource-bar-icons/mp",
    //     maxValue: player.battle.getPlayerAllyBattleParticipantMaxMP(
    //       player.id,
    //       i,
    //     ),
    //     primaryColor: Color.PureBlue,
    //     secondaryColor: Color.StrongBlue,
    //     value: player.battle.getPlayerAllyBattleParticipantRenderedMP(
    //       player.id,
    //       i,
    //     ),
    //     x: 97 + i * 81,
    //     y: 226,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasBattle() &&
    //     (player.battle.isOngoing() || player.battle.isOver() === false) &&
    //     player.battle.playerAllyTeamHasSize(player.id, i + 1) &&
    //     player.battle.playerAllyBattleParticipantHasResourcePool(
    //       player.id,
    //       i,
    //       ResourcePool.MP,
    //     ),
    // );
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
    });
  }
};
