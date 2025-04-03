import { Party } from "../../classes/Party";
import { PartyUpdate } from "retrommo-types";
import { definableExists, getDefinable } from "definables";

export const loadPartyUpdate = (partyUpdate: PartyUpdate): void => {
  const party: Party = definableExists(Party, partyUpdate.partyID)
    ? getDefinable(Party, partyUpdate.partyID)
    : new Party({ id: partyUpdate.partyID });
  party.playerIDs = partyUpdate.playerIDs;
};
