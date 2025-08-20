import { BattleStateSchema } from "../state";
import { Battler } from "../classes/Battler";
import { Party } from "../classes/Party";
import { State, removeHUDElements } from "pixel-pigeon";
import { createBattleUI } from "./ui/battle/createBattleUI";
import { getBattleState } from "./state/getBattleState";
import { getDefinable } from "definables";

export const exitBattlers = (battlerIDs: readonly string[]): void => {
  const affectedPartyIDs: string[] = [];
  for (const battlerID of battlerIDs) {
    const battler: Battler = getDefinable(Battler, battlerID);
    const party: Party = battler.battleCharacter.player.character.party;
    party.playerIDs = party.playerIDs.filter(
      (partyPlayerID: string): boolean =>
        partyPlayerID !== battler.battleCharacter.playerID,
    );
    if (affectedPartyIDs.includes(party.id) === false) {
      affectedPartyIDs.push(party.id);
    }
    battler.battleCharacter.remove();
    battler.remove();
  }
  for (const affectedPartyID of affectedPartyIDs) {
    const affectedParty: Party = getDefinable(Party, affectedPartyID);
    if (affectedParty.playerIDs.length === 0) {
      affectedParty.remove();
    }
  }
  const battleState: State<BattleStateSchema> = getBattleState();
  removeHUDElements(battleState.values.hudElementReferences);
  const enemyBattlerIDs: string[] = battleState.values.enemyBattlerIDs.filter(
    (battlerID: string): boolean => battlerIDs.includes(battlerID) === false,
  );
  const friendlyBattlerIDs: string[] =
    battleState.values.friendlyBattlerIDs.filter(
      (battlerID: string): boolean => battlerIDs.includes(battlerID) === false,
    );
  battleState.setValues({
    enemyBattlerIDs,
    friendlyBattlerIDs,
    hudElementReferences: createBattleUI({
      enemyBattlerIDs,
      friendlyBattlerIDs,
    }),
  });
};
