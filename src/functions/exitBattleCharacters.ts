import { BattleCharacter } from "../classes/BattleCharacter";
import { Party } from "../classes/Party";
import { getDefinable } from "definables";
import { resetParty } from "./resetParty";

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
    } else {
      resetParty(affectedPartyID);
    }
  }
};
