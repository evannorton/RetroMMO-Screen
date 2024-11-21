import { Color } from "retrommo-types";
import {
  HUDElementReferences,
  createLabel,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { WorldMenu } from "../classes/WorldMenu";
import { createBlackPianoKey } from "../functions/ui/components/createBlackPianoKey";
import { createClickableImage } from "../functions/ui/components/createClickableImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createWhitePianoKey } from "../functions/ui/components/createWhitePianoKey";

export interface PianoWorldMenuOpenOptions {}
export const pianoWorldMenu: WorldMenu<PianoWorldMenuOpenOptions> =
  new WorldMenu<PianoWorldMenuOpenOptions>({
    create: (): HUDElementReferences => {
      const labelIDs: string[] = [];
      const hudElementReferences: HUDElementReferences[] = [];
      const whiteKeyAudioPaths: string[] = [
        "sfx/piano-keys/1c",
        "sfx/piano-keys/3d",
        "sfx/piano-keys/5e",
        "sfx/piano-keys/6f",
        "sfx/piano-keys/8g",
        "sfx/piano-keys/10a",
        "sfx/piano-keys/12b",
        "sfx/piano-keys/13c",
        "sfx/piano-keys/15d",
        "sfx/piano-keys/17e",
        "sfx/piano-keys/18f",
        "sfx/piano-keys/20g",
        "sfx/piano-keys/22a",
        "sfx/piano-keys/24b",
      ];
      const blackKeyAudioPaths: string[] = [
        "sfx/piano-keys/2c#",
        "sfx/piano-keys/4d#",
        "sfx/piano-keys/7f#",
        "sfx/piano-keys/9g#",
        "sfx/piano-keys/11a#",
        "sfx/piano-keys/14c#",
        "sfx/piano-keys/16d#",
        "sfx/piano-keys/19f#",
        "sfx/piano-keys/21g#",
        "sfx/piano-keys/23a#",
      ];
      const gameWidth: number = getGameWidth();
      const octaves: number = 2;
      const whiteKeys: number = 7;
      const whiteKeyWidth: number = 10;
      const totalKeysWidth: number = whiteKeys * octaves * whiteKeyWidth;
      const whiteKeyIndicesWithBlackKeys: number[] = [0, 1, 3, 4, 5];
      const panelWidth: number = 154;
      const panelHeight: number = 76;
      const panelX: number = Math.floor(gameWidth / 2 - panelWidth / 2);
      const panelY: number = 130;
      hudElementReferences.push(
        createPanel({
          height: panelHeight,
          imagePath: "panels/piano",
          width: panelWidth,
          x: panelX,
          y: panelY,
        }),
      );
      const keysX: number = Math.floor(gameWidth / 2 - totalKeysWidth / 2) - 1;
      const keysY: number = 151;
      const loopEnd: number = whiteKeys * octaves;
      let whiteKeyCount: number = 0;
      for (let i: number = 0; i < loopEnd; i++) {
        const audioPath: string | undefined = whiteKeyAudioPaths[whiteKeyCount];
        if (typeof audioPath === "undefined") {
          throw new Error("Audio path is undefined");
        }
        hudElementReferences.push(
          createWhitePianoKey({
            audioPath,
            x: keysX + i * whiteKeyWidth,
            y: keysY,
          }),
        );
        whiteKeyCount++;
      }
      let blackKeyCount: number = 0;
      for (let i: number = 0; i < loopEnd; i++) {
        if (whiteKeyIndicesWithBlackKeys.includes(i % whiteKeys)) {
          const audioPath: string | undefined =
            blackKeyAudioPaths[blackKeyCount];
          if (typeof audioPath === "undefined") {
            throw new Error("Audio path is undefined");
          }
          hudElementReferences.push(
            createBlackPianoKey({
              audioPath,
              x: keysX + (i + 1) * whiteKeyWidth - 3,
              y: keysY,
            }),
          );
          blackKeyCount++;
        }
      }
      const xWidth: number = 10;
      hudElementReferences.push(
        createClickableImage({
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            pianoWorldMenu.close();
          },
          width: xWidth,
          x: panelX + panelWidth - xWidth - 8,
          y: panelY + 8,
        }),
      );
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            x: panelX + Math.floor(panelWidth / 2) - 1,
            y: panelY + 10,
          },
          horizontalAlignment: "center",
          text: {
            value: "Piano",
          },
        }),
      );
      return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
    },
    preventsWalking: true,
  });
