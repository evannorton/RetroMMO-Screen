import { HUDElementReferences, createNineSlice } from "pixel-pigeon";

export interface CreatePanelOptions {
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
}: CreatePanelOptions): HUDElementReferences => {
  const nineSliceIDs: string[] = [];
  nineSliceIDs.push(
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
    }),
  );
  return {
    nineSliceIDs,
  };
};
