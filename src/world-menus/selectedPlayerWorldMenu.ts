import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Player } from "../classes/Player";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { getDefinable } from "definables";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import { state } from "../state";

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
    const player: Player = getDefinable(Player, state.values.selectedPlayerID);
    // Background panel
    // new Panel(
    //   "world/player-selected",
    //   (): PanelOptions => ({
    //     height: 62,
    //     imageSourceID: "panels/basic",
    //     width: 208,
    //     x: 48,
    //     y: 136,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
    // new Picture(
    //   "world/player-selected/close",
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
    //     x: 239,
    //     y: 143,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    //   (player: Player): void => {
    //     player.dequeuePlayer(player.queuedPlayer.playerID);
    //   },
    // );
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
    // new Label(
    //   "world/player-selected/username",
    //   (player: Player): LabelOptions => ({
    //     color: Color.White,
    //     horizontalAlignment: "center",
    //     maxLines: 1,
    //     maxWidth: 304,
    //     size: 1,
    //     text: getDefinable(Player, player.queuedPlayer.playerID).username,
    //     verticalAlignment: "top",
    //     x: 152,
    //     y: 146,
    //   }),
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 152,
          y: 146,
        },
        horizontalAlignment: "center",
        text: (): CreateLabelOptionsText => ({ value: player.username }),
      }),
    );
    // Class
    // new Label(
    //   "world/player-selected/class",
    //   (player: Player): LabelOptions => {
    //     const queuedPlayer: Player = getDefinable(
    //       Player,
    //       player.queuedPlayer.playerID,
    //     );
    //     const classObject: Class = queuedPlayer.class;
    //     const level: number = queuedPlayer.level;
    //     const className: string = classObject.name;
    //     return {
    //       color: Color.White,
    //       horizontalAlignment: "center",
    //       maxLines: 1,
    //       maxWidth: 304,
    //       size: 1,
    //       text: `Lv${getFormattedInteger(level)} ${className}`,
    //       verticalAlignment: "top",
    //       x: 152,
    //       y: 159,
    //     };
    //   },
    //   (player: Player): boolean =>
    //     player.hasActiveCharacter() &&
    //     player.hasQueuedPlayer() &&
    //     (player.party.hasWorldCombatStartedAt() === false ||
    //       player.party.worldCombatIsOngoing() === false),
    // );
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
          value: `Lv${player.character.level} ${player.character.class.name}`,
        }),
      }),
    );
    // // Emote button
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
    if (selectedPlayerWorldMenu.state.values.isBattleStarting === false) {
      state.setValues({ selectedPlayerID: null });
    }
  },
  preventsWalking: false,
});
