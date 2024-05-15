import { createNineSlice } from "pixel-pigeon";

interface CreatePanelOptions {
  condition?: () => boolean;
  height: number;
  imagePath: string;
  width: number;
  x: number;
  y: number;
}

export const createPanel = ({
  condition,
  height,
  imagePath,
  x,
  y,
  width,
}: CreatePanelOptions): void => {
  createNineSlice({
    bottomHeight: 8,
    coordinates: {
      condition,
      x,
      y,
    },
    height,
    imagePath,
    leftWidth: 8,
    rightWidth: 8,
    topHeight: 8,
    width,
  });
};
