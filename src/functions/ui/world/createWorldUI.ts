import { createBottomBarIcon } from "../components/createBottomBarIcon";
import { createButton, createSprite, emitToSocketioServer } from "pixel-pigeon";
import { createPanel } from "../components/createPanel";
import {
  inventoryInputCollectionID,
  spellbookInputCollectionID,
  statsInputCollectionID,
} from "../../../input";
import { state } from "../../../state";

export const createWorldUI = (): void => {
  const condition = (): boolean => state.values.worldState !== null;
  // Logout
  createPanel({
    condition,
    height: 24,
    imagePath: "panels/basic",
    width: 48,
    x: 256,
    y: 0,
  });
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 14,
            sourceHeight: 14,
            sourceWidth: 28,
            sourceX: 0,
            sourceY: 0,
            width: 28,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: 266,
      y: 5,
    },
    imagePath: "arrows/logout",
  });
  createButton({
    coordinates: {
      condition,
      x: 266,
      y: 5,
    },
    height: 14,
    onClick: (): void => {
      emitToSocketioServer({
        event: "world/exit-to-main-menu",
      });
    },
    width: 28,
  });
  // Bottom bar background
  createPanel({
    condition,
    height: 32,
    imagePath: "panels/basic",
    width: 304,
    x: 0,
    y: 208,
  });
  // Stats icon
  createBottomBarIcon({
    condition,
    inputCollectionID: statsInputCollectionID,
    legacyOpen: (): void => {
      emitToSocketioServer({ event: "legacy/open-stats" });
    },
    selectedImagePath: "bottom-bar-icons/stats/selected",
    unselectedImagePath: "bottom-bar-icons/stats/unselected",
    x: 232,
    y: 214,
  });
  // Spellbook icon
  createBottomBarIcon({
    condition,
    inputCollectionID: spellbookInputCollectionID,
    legacyOpen: (): void => {
      emitToSocketioServer({ event: "legacy/open-spellbook" });
    },
    selectedImagePath: "bottom-bar-icons/spellbook/selected",
    unselectedImagePath: "bottom-bar-icons/spellbook/unselected",
    x: 255,
    y: 214,
  });
  // Inventory icon
  createBottomBarIcon({
    condition,
    inputCollectionID: inventoryInputCollectionID,
    legacyOpen: (): void => {
      emitToSocketioServer({ event: "legacy/open-inventory" });
    },
    selectedImagePath: "bottom-bar-icons/inventory/selected",
    unselectedImagePath: "bottom-bar-icons/inventory/unselected",
    x: 278,
    y: 214,
  });
};
