import { createNineSlice } from "pixel-pigeon";

interface CreatePanelOptions {
  condition?: () => boolean;
  height: number;
  width: number;
  x: number;
  y: number;
}

export const createPanel = ({
  condition,
  height,
  x,
  y,
  width,
}: CreatePanelOptions): void => {
  createNineSlice({
    bottomHeight: 16,
    coordinates: {
      condition,
      x,
      y,
    },
    height,
    imagePath: "panels/basic",
    leftWidth: 16,
    rightWidth: 16,
    topHeight: 16,
    width,
  });
};
