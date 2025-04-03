import { Party } from "../../classes/Party";
import { PartyUpdate } from "retrommo-types";
import { definableExists, getDefinable } from "definables";

export const loadPartyUpdate = (partyUpdate: PartyUpdate): void => {
  const party: Party = definableExists(Party, partyUpdate.id)
    ? getDefinable(Party, partyUpdate.id)
    : new Party({ id: partyUpdate.id });
  party.playerIDs = partyUpdate.playerIDs;
};
