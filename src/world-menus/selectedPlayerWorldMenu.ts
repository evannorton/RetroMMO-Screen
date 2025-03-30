import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Player } from "../classes/Player";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema, state } from "../state";
import { clearWorldCharacterMarker } from "../functions/clearWorldCharacterMarker";
import { closeWorldMenus } from "../functions/world-menus/closeWorldMenus";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { emotesWorldMenu } from "./emotesWorldMenu";
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
    // new Button(
    //   "world/player-selected/emote",
    //   (): ButtonOptions => ({
    //     color: Color.White,
    //     height: 16,
    //     imageSourceID: "buttons/gray",
    //     text: "Emote",
    //     width: 40,
    //     x: 132,
    //     y: 172,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false) &&
    //     player.hasSelfSelected(),
    //   (player: Player): void => {
    //     player.closeWorldMenus();
    //     emitUpdate(player.id, "legacy/open-emotes", {});
    //   },
    // );
    if (worldCharacter.playerID === state.values.selectedPlayerID) {
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => isWorldCombatInProgress() === false,
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            closeWorldMenus();
            emotesWorldMenu.open({});
          },
          text: { value: "Emote" },
          width: 40,
          x: 132,
          y: 172,
        }),
      );
    }
    // // Duel button
    // new Button(
    //   "world/player-selected/duel",
    //   (player: Player): ButtonOptions => ({
    //     color: Color.White,
    //     height: 16,
    //     imageSourceID: "buttons/gray",
    //     text: "Battle",
    //     width: 40,
    //     x: player.getWorldPlayerSelectedDuelButtonX(),
    //     y: 172,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false) &&
    //     player.canInvitePlayerToDuel(player.queuedPlayer.playerID),
    //   (player: Player): void => {
    //     player.invitePlayerToDuel();
    //   },
    // );
    // // Party button
    // new Button(
    //   "world/player-selected/party",
    //   (player: Player): ButtonOptions => ({
    //     color: Color.White,
    //     height: 16,
    //     imageSourceID: "buttons/gray",
    //     text: "Party",
    //     width: 40,
    //     x: player.getWorldPlayerSelectedPartyButtonX(),
    //     y: 172,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false) &&
    //     player.canInvitePlayerToParty(player.queuedPlayer.playerID),
    //   (player: Player): void => {
    //     player.invitePlayerToParty();
    //   },
    // );
    // // Trade button
    // new Button(
    //   "world/player-selected/trade",
    //   (player: Player): ButtonOptions => ({
    //     color: Color.White,
    //     height: 16,
    //     imageSourceID: "buttons/gray",
    //     text: "Trade",
    //     width: 40,
    //     x: player.getWorldPlayerSelectedTradeButtonX(),
    //     y: 172,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false) &&
    //     player.canInvitePlayerToTrade(player.queuedPlayer.playerID),
    //   (player: Player): void => {
    //     player.invitePlayerToTrade();
    //   },
    // );
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
