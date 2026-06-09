import { ChatChannel } from "./classes/ChatChannel";
import { ChatChannel as ChatChannelEnum } from "retrommo-types";
import { Player } from "./classes/Player";
import { getDefinable } from "definables";
import {
  globalChatInputCollectionID,
  localChatInputCollectionID,
  modChatInputCollectionID,
  partyChatInputCollectionID,
  tradeChatInputCollectionID,
} from "./inputCollections";
import { state } from "./state";
import { tradeWorldMenu } from "./world-menus/tradeWorldMenu";

new ChatChannel({
  condition: true,
  id: ChatChannelEnum.Global,
  inputCollectionID: globalChatInputCollectionID,
});
new ChatChannel({
  condition: (): boolean =>
    state.values.worldState !== null || state.values.battleState !== null,
  id: ChatChannelEnum.Local,
  inputCollectionID: localChatInputCollectionID,
});
new ChatChannel({
  condition: (): boolean =>
    state.values.playerID !== null &&
    getDefinable(Player, state.values.playerID).permission > 0,
  id: ChatChannelEnum.Mod,
  inputCollectionID: modChatInputCollectionID,
});
new ChatChannel({
  condition: (): boolean =>
    state.values.playerID !== null &&
    (state.values.worldState !== null || state.values.battleState !== null) &&
    getDefinable(Player, state.values.playerID).character.party.playerIDs
      .length > 1,
  id: ChatChannelEnum.Party,
  inputCollectionID: partyChatInputCollectionID,
});
new ChatChannel({
  condition: (): boolean => tradeWorldMenu.isOpen(),
  id: ChatChannelEnum.Trade,
  inputCollectionID: tradeChatInputCollectionID,
});
