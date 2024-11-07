import { WorldCharacter } from "../../classes/WorldCharacter";
import { WorldPartyCharacterUpdate } from "retrommo-types";
import { getDefinable } from "definables";

export const loadWorldPartyCharacterUpdate = (
  worldPartyCharacterUpdate: WorldPartyCharacterUpdate,
): void => {
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldPartyCharacterUpdate.worldCharacterID,
  );
  worldCharacter.resources = {
    hp: worldPartyCharacterUpdate.resources.hp,
    maxHP: worldPartyCharacterUpdate.resources.maxHP,
    maxMP: worldPartyCharacterUpdate.resources.maxMP ?? null,
    mp: worldPartyCharacterUpdate.resources.mp ?? null,
  };
  worldCharacter.openedChestIDs = worldPartyCharacterUpdate.openedChestIDs;
};
