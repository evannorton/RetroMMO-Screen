import { NPC } from "../../classes/NPC";
import { WorldNPCUpdate } from "retrommo-types";
import { getDefinable } from "definables";

export const loadWorldNPCUpdate = (worldNPCUpdate: WorldNPCUpdate): void => {
  const npc: NPC = getDefinable(NPC, worldNPCUpdate.npcID);
  npc.direction = worldNPCUpdate.direction;
};
