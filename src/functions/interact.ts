import {
  EntityCollidable,
  emitToSocketioServer,
  getEntityFieldValue,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import {
  WorldChestInteractRequest,
  WorldNPCInteractRequest,
} from "retrommo-types";
import { getDefinable } from "definables";
import { getInteractableEntityCollidable } from "./getInteractableEntityCollidable";
import { pianoWorldMenu } from "../world-menus/pianoWorldMenu";

export const interact = (): void => {
  const entityCollidable: EntityCollidable | null =
    getInteractableEntityCollidable();
  if (entityCollidable !== null) {
    switch (entityCollidable.type) {
      case "chest": {
        const chestID: unknown = getEntityFieldValue(
          entityCollidable.entityID,
          "chestID",
        );
        if (typeof chestID !== "string") {
          throw new Error("No chest ID.");
        }
        emitToSocketioServer<WorldChestInteractRequest>({
          data: {
            chestID,
          },
          event: "world/chest-interact",
        });
        return;
      }
      case "npc": {
        const npcID: unknown = getEntityFieldValue(
          entityCollidable.entityID,
          "npcID",
        );
        if (typeof npcID !== "string") {
          throw new Error("No NPC ID.");
        }
        const npc: NPC = getDefinable(NPC, npcID);
        if (
          npc.hasDialogue() ||
          npc.hasQuestExchanger() ||
          npc.hasEncounter()
        ) {
          emitToSocketioServer<WorldNPCInteractRequest>({
            data: {
              npcID,
            },
            event: "world/npc-interact",
          });
          return;
        }
        break;
      }
      case "piano": {
        const pianoID: unknown = getEntityFieldValue(
          entityCollidable.entityID,
          "pianoID",
        );
        if (typeof pianoID !== "string") {
          throw new Error("No piano ID.");
        }
        pianoWorldMenu.open({});
        return;
      }
    }
  }
  emitToSocketioServer({
    data: {},
    event: "legacy/action",
  });
};
