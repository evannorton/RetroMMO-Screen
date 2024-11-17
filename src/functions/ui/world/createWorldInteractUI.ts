import { Constants } from "retrommo-types";
import {
  CreateLabelOptionsText,
  EntityCollidable,
  emitToSocketioServer,
  getCurrentTime,
  getEntityFieldValue,
} from "pixel-pigeon";
import { NPC } from "../../../classes/NPC";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import { createPanel } from "../components/createPanel";
import { createPressableButton } from "../components/createPressableButton";
import { getConstants } from "../../getConstants";
import { getDefinable } from "definables";
import { getInteractableEntityCollidable } from "../../getInteractableEntityCollidable";
import { getWorldState } from "../../state/getWorldState";
import { isAWorldMenuOpen } from "../../world-menus/isAWorldMenuOpen";
import { state } from "../../../state";

export const createWorldInteractUI = (): void => {
  // Background panel
  const condition = (): boolean => {
    const constants: Constants = getConstants();
    if (state.values.worldState !== null) {
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        getWorldState().values.worldCharacterID,
      );
      if (isAWorldMenuOpen() === false) {
        if (
          worldCharacter.hasMovedAt() === false ||
          getCurrentTime() - worldCharacter.movedAt >=
            constants["movement-duration"]
        ) {
          return getInteractableEntityCollidable() !== null;
        }
      }
    }
    return false;
  };
  createPanel({
    condition,
    height: 28,
    imagePath: "panels/basic",
    width: 60,
    x: 122,
    y: 180,
  });
  // Interact button
  createPressableButton({
    condition,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      emitToSocketioServer({
        data: {},
        event: "legacy/action",
      });
    },
    text: (): CreateLabelOptionsText => {
      const entityCollidable: EntityCollidable | null =
        getInteractableEntityCollidable();
      if (entityCollidable === null) {
        throw new Error("No entity collidable.");
      }
      let value: string | undefined;
      switch (entityCollidable.type) {
        case "bank":
          value = "Bank";
          break;
        case "chest":
          value = "Open";
          break;
        case "combination-lock":
          value = "Unlock";
          break;
        case "npc": {
          const npcID: unknown = getEntityFieldValue(
            entityCollidable.entityID,
            "npcID",
          );
          if (typeof npcID !== "string") {
            throw new Error("No NPC ID.");
          }
          const npc: NPC = getDefinable(NPC, npcID);
          if (npc.hasDialogue()) {
            value = "Talk";
          }
          if (npc.hasInnCost()) {
            value = "Rest";
          }
          if (npc.hasShopID()) {
            value = "Shop";
          }
          if (npc.hasEncounterID()) {
            value = "Fight";
          }
          break;
        }
      }
      if (typeof value === "undefined") {
        throw new Error("No value.");
      }
      return {
        value,
      };
    },
    width: 48,
    x: 128,
    y: 186,
  });
};
