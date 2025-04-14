import { BattleCharacter } from "../classes/BattleCharacter";
import { BattleStateSchema } from "../state";
import { Party } from "../classes/Party";
import { State, removeHUDElements } from "pixel-pigeon";
import { createBattleUI } from "./ui/battle/createBattleUI";
import { getBattleState } from "./state/getBattleState";
import { getDefinable } from "definables";

export const exitBattleCharacters = (
  battleCharacterIDs: readonly string[],
): void => {
  const affectedPartyIDs: string[] = [];
  for (const battleCharacterID of battleCharacterIDs) {
    const battleCharacter: BattleCharacter = getDefinable(
      BattleCharacter,
      battleCharacterID,
    );
    const party: Party = getDefinable(
      Party,
      battleCharacter.player.character.party.id,
    );
    party.playerIDs = party.playerIDs.filter(
      (partyPlayerID: string): boolean =>
        partyPlayerID !== battleCharacter.playerID,
    );
    if (affectedPartyIDs.includes(party.id) === false) {
      affectedPartyIDs.push(party.id);
    }
    battleCharacter.remove();
  }
  for (const affectedPartyID of affectedPartyIDs) {
    const affectedParty: Party = getDefinable(Party, affectedPartyID);
    if (affectedParty.playerIDs.length === 0) {
      affectedParty.remove();
    }
  }
  const battleState: State<BattleStateSchema> = getBattleState();
  removeHUDElements(battleState.values.hudElementReferences);
  const enemyBattleCharacterIDs: string[] =
    battleState.values.enemyBattleCharacterIDs.filter(
      (battleCharacterID: string): boolean =>
        battleCharacterIDs.includes(battleCharacterID) === false,
    );
  const friendlyBattleCharacterIDs: string[] =
    battleState.values.friendlyBattleCharacterIDs.filter(
      (battleCharacterID: string): boolean =>
        battleCharacterIDs.includes(battleCharacterID) === false,
    );
  battleState.setValues({
    enemyBattleCharacterIDs,
    friendlyBattleCharacterIDs,
    hudElementReferences: createBattleUI({
      enemyBattleCharacterIDs,
      friendlyBattleCharacterIDs,
    }),
  });
};
