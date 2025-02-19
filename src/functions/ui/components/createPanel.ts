import { HUDElementReferences, createNineSlice } from "pixel-pigeon";

export interface CreatePanelOptions {
  readonly condition?: () => boolean;
  readonly height: number;
  readonly imagePath: string;
  readonly width: number;
  readonly x: number;
  readonly y: number;
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
