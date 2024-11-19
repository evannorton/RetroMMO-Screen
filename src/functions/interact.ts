import {
  EntityCollidable,
  emitToSocketioServer,
  getEntityFieldValue,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import { WorldNPCInteractRequest } from "retrommo-types";
import { getDefinable } from "definables";
import { getInteractableEntityCollidable } from "./getInteractableEntityCollidable";

export const interact = (): void => {
  const entityCollidable: EntityCollidable | null =
    getInteractableEntityCollidable();
  if (entityCollidable !== null && entityCollidable.type === "npc") {
    const npcID: unknown = getEntityFieldValue(
      entityCollidable.entityID,
      "npcID",
    );
    if (typeof npcID !== "string") {
      throw new Error("No NPC ID.");
    }
    const npc: NPC = getDefinable(NPC, npcID);
    if (npc.hasDialogue()) {
      emitToSocketioServer<WorldNPCInteractRequest>({
        data: {
          npcID,
        },
        event: "world/npc-interact",
      });
      return;
    }
  }
  emitToSocketioServer({
    data: {},
    event: "legacy/action",
  });
};
