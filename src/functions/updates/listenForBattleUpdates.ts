import { BattleExitToWorldUpdate } from "retrommo-types";
import { createWorldState } from "../state/createWorldState";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { loadWorldPartyUpdate } from "../loadWorldPartyUpdate";
import { selectWorldCharacter } from "../selectWorldCharacter";
import { state } from "../../state";

export const listenForBattleUpdates = (): void => {
  listenToSocketioEvent<BattleExitToWorldUpdate>({
    event: "battle/exit-to-world",
    onMessage: (update: BattleExitToWorldUpdate): void => {
      state.setValues({
        battleState: null,
        worldState: createWorldState(update.worldCharacterID),
      });
      for (const characterUpdate of update.worldCharacters) {
        loadWorldCharacterUpdate(characterUpdate);
      }
      for (const partyUpdate of update.parties) {
        loadWorldPartyUpdate(partyUpdate);
      }
      selectWorldCharacter(update.worldCharacterID);
    },
  });
};
