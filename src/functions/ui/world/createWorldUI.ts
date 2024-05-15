import { createButton, createSprite, emitToSocketioServer } from "pixel-pigeon";
import { createPanel } from "../components/createPanel";
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
};
