import { Bank } from "../classes/Bank";
import {
  EntityCollidable,
  emitToSocketioServer,
  getCurrentTime,
  getEntityFieldValue,
  playAudioSource,
} from "pixel-pigeon";
import {
  WorldChestInteractRequest,
  WorldNPCInteractRequest,
} from "retrommo-types";
import { bankWorldMenu } from "../world-menus/bankWorldMenu";
import { getDefinable } from "definables";
import { getInteractableEntityCollidable } from "./getInteractableEntityCollidable";
import { pianoWorldMenu } from "../world-menus/pianoWorldMenu";
import { sfxVolumeChannelID } from "../volumeChannels";

export const interact = (): void => {
  const entityCollidable: EntityCollidable | null =
    getInteractableEntityCollidable();
  if (entityCollidable !== null) {
    switch (entityCollidable.type) {
      case "bank": {
        const bankID: unknown = getEntityFieldValue(
          entityCollidable.entityID,
          "bankID",
        );
        if (typeof bankID !== "string") {
          throw new Error("No bank ID.");
        }
        const bank: Bank = getDefinable(Bank, bankID);
        bank.isOpen = true;
        bank.toggledAt = getCurrentTime();
        bankWorldMenu.open({ bankID });
        playAudioSource("sfx/open-chest", {
          volumeChannelID: sfxVolumeChannelID,
        });
        break;
      }
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
        break;
      }
      case "npc": {
        const npcID: unknown = getEntityFieldValue(
          entityCollidable.entityID,
          "npcID",
        );
        if (typeof npcID !== "string") {
          throw new Error("No NPC ID.");
        }
        emitToSocketioServer<WorldNPCInteractRequest>({
          data: {
            npcID,
          },
          event: "world/npc-interact",
        });
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
        break;
      }
    }
  }
  emitToSocketioServer({
    data: {},
    event: "legacy/action",
  });
};
