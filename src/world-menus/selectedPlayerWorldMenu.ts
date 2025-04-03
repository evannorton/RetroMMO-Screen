import {
  Color,
  Constants,
  WorldDuelInviteRequest,
  WorldPartyInviteRequest,
  WorldTradeInviteRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  emitToSocketioServer,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Player } from "../classes/Player";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema, state } from "../state";
import { clearWorldCharacterMarker } from "../functions/clearWorldCharacterMarker";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { emotesWorldMenu } from "./emotesWorldMenu";
import { getConstants } from "../functions/getConstants";
import { getDefinable } from "definables";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface SelectedPlayerWorldMenuOpenOptions {}
export interface SelectedPlayerWorldMenuStateSchema {
  isBattleStarting: boolean;
}
export const selectedPlayerWorldMenu: WorldMenu<
  SelectedPlayerWorldMenuOpenOptions,
  SelectedPlayerWorldMenuStateSchema
> = new WorldMenu<
  SelectedPlayerWorldMenuOpenOptions,
  SelectedPlayerWorldMenuStateSchema
>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    if (state.values.selectedPlayerID === null) {
      throw new Error("No player ID selected");
    }
    const selectedPlayer: Player = getDefinable(
      Player,
      state.values.selectedPlayerID,
    );
    const worldState: State<WorldStateSchema> = getWorldState();
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldState.values.worldCharacterID,
    );
    const constants: Constants = getConstants();
    // Background panel
    hudElementReferences.push(
      createPanel({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 62,
        imagePath: "panels/basic",
        width: 208,
        x: 48,
        y: 136,
      }),
    );
    // Close button
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          selectedPlayerWorldMenu.close();
        },
        width: 10,
        x: 239,
        y: 143,
      }),
    );
    // Username
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 152,
          y: 146,
        },
        horizontalAlignment: "center",
        text: (): CreateLabelOptionsText => ({
          value: selectedPlayer.username,
        }),
      }),
    );
    // Class
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 152,
          y: 159,
        },
        horizontalAlignment: "center",
        text: (): CreateLabelOptionsText => ({
          value: `Lv${selectedPlayer.character.level} ${selectedPlayer.character.class.name}`,
        }),
      }),
    );
    // Emote button
    if (worldCharacter.playerID === state.values.selectedPlayerID) {
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            selectedPlayerWorldMenu.close();
            emotesWorldMenu.open({});
          },
          text: { value: "Emote" },
          width: 40,
          x: 132,
          y: 172,
        }),
      );
    }
    if (worldCharacter.playerID !== state.values.selectedPlayerID) {
      const buttonWidth: number = 40;
      const buttonSpacing: number = 4;
      const duelButtonCondition = (): boolean =>
        worldCharacter.player.character.party.playerIDs[0] ===
          worldCharacter.playerID &&
        worldCharacter.player.character.party.playerIDs.includes(
          selectedPlayer.id,
        ) === false;
      const partyButtonCondition = (): boolean =>
        worldCharacter.player.character.party.playerIDs[0] ===
          worldCharacter.playerID &&
        worldCharacter.player.character.party.playerIDs.length <
          constants["maximum-party-size"] &&
        selectedPlayer.character.party.playerIDs.length === 1;
      const tradeButtonCondition = (): boolean =>
        worldCharacter.playerID !== selectedPlayer.id;
      const buttonConditions: (() => boolean)[] = [
        duelButtonCondition,
        partyButtonCondition,
        tradeButtonCondition,
      ];
      const getButtonsCount = (): number => {
        let count: number = 0;
        for (const condition of buttonConditions) {
          if (condition()) {
            count++;
          }
        }
        return count;
      };
      const getButtonX = (index: number): number => {
        let adjustedIndex: number = 0;
        for (let i: number = 0; i < index; i++) {
          const buttonCondition: (() => boolean) | undefined =
            buttonConditions[i];
          if (typeof buttonCondition === "undefined") {
            throw new Error(`Button condition at index ${i} is undefined`);
          }
          if (buttonCondition()) {
            adjustedIndex++;
          }
        }
        const buttonsCount: number = getButtonsCount();
        const buttonsWidth: number =
          buttonsCount * buttonWidth + (buttonsCount - 1) * buttonSpacing;
        const center: number = Math.floor(getGameWidth() / 2);
        const startX: number = center - Math.floor(buttonsWidth / 2);
        return startX + adjustedIndex * (buttonWidth + buttonSpacing);
      };
      // Duel button
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean =>
            duelButtonCondition() && isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            selectedPlayerWorldMenu.close();
            emitToSocketioServer<WorldDuelInviteRequest>({
              data: {
                playerID: selectedPlayer.id,
              },
              event: "world/duel-invite",
            });
          },
          text: { value: "Battle" },
          width: buttonWidth,
          x: (): number => getButtonX(0),
          y: 172,
        }),
      );
      // Party button
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean =>
            partyButtonCondition() && isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            selectedPlayerWorldMenu.close();
            emitToSocketioServer<WorldPartyInviteRequest>({
              data: {
                playerID: selectedPlayer.id,
              },
              event: "world/party-invite",
            });
          },
          text: { value: "Party" },
          width: buttonWidth,
          x: (): number => getButtonX(1),
          y: 172,
        }),
      );
      // Trade button
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean =>
            tradeButtonCondition() && isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            selectedPlayerWorldMenu.close();
            emitToSocketioServer<WorldTradeInviteRequest>({
              data: {
                playerID: selectedPlayer.id,
              },
              event: "world/trade-invite",
            });
          },
          text: { value: "Trade" },
          width: buttonWidth,
          x: (): number => getButtonX(2),
          y: 172,
        }),
      );
    }
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {
    isBattleStarting: false,
  },
  onClose: (): void => {
    if (state.values.selectedPlayerID === null) {
      throw new Error("No player ID selected");
    }
    const selectedPlayer: Player = getDefinable(
      Player,
      state.values.selectedPlayerID,
    );
    if (selectedPlayer.hasWorldCharacter()) {
      clearWorldCharacterMarker(selectedPlayer.worldCharacterID);
    }
    if (selectedPlayerWorldMenu.state.values.isBattleStarting === false) {
      state.setValues({ selectedPlayerID: null });
    }
  },
  preventsWalking: false,
});
