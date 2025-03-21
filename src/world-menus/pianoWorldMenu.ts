import { Color, PianoKeyType, WorldPianoKeyRequest } from "retrommo-types";
import {
  HUDElementReferences,
  createLabel,
  emitToSocketioServer,
  getCurrentTime,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { WorldMenu } from "../classes/WorldMenu";
import {
  blackPianoKeyInputCollectionIDs,
  whitePianoKeyInputCollectionIDs,
} from "../input";
import { createBlackPianoKey } from "../functions/ui/components/createBlackPianoKey";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createVisibilityToggle } from "../functions/ui/components/createVisibilityToggle";
import { createWhitePianoKey } from "../functions/ui/components/createWhitePianoKey";
import { getPianoKeyAudioPath } from "../functions/getPianoKeyAudioPath";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface PianoWorldMenuOpenOptions {}
export interface PianoWorldMenuStateSchema {
  areLabelsVisible: boolean;
  lastKeyAt: number | null;
}
export const pianoWorldMenu: WorldMenu<
  PianoWorldMenuOpenOptions,
  PianoWorldMenuStateSchema
> = new WorldMenu<PianoWorldMenuOpenOptions, PianoWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const labelIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const gameWidth: number = getGameWidth();
    const octaves: number = 2;
    const whiteKeys: number = 7;
    const whiteKeyWidth: number = 10;
    const totalKeysWidth: number = whiteKeys * octaves * whiteKeyWidth;
    const whiteKeyIndicesWithBlackKeys: number[] = [0, 1, 3, 4, 5];
    const whiteKeyTexts: string[] = [
      "z",
      "x",
      "c",
      "v",
      "b",
      "n",
      "m",
      "q",
      "w",
      "e",
      "r",
      "t",
      "y",
      "u",
    ];
    const blackKeyTexts: string[] = [
      "s",
      "d",
      "g",
      "h",
      "j",
      "2",
      "3",
      "5",
      "6",
      "7",
    ];
    const panelWidth: number = 154;
    const panelHeight: number = 76;
    const panelX: number = Math.floor(gameWidth / 2 - panelWidth / 2);
    const panelY: number = 130;
    hudElementReferences.push(
      createPanel({
        condition: (): boolean => isWorldCombatInProgress() === false,
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
    let whiteKeyIndex: number = 0;
    const onPlay = (index: number, type: PianoKeyType): void => {
      emitToSocketioServer<WorldPianoKeyRequest>({
        data: {
          index,
          sinceLastKey:
            pianoWorldMenu.state.values.lastKeyAt !== null
              ? getCurrentTime() - pianoWorldMenu.state.values.lastKeyAt
              : undefined,
          type,
        },
        event: "world/piano-key",
      });
      const lastKeyAt: number = getCurrentTime();
      pianoWorldMenu.state.setValues({ lastKeyAt });
    };
    for (let i: number = 0; i < loopEnd; i++) {
      const audioPath: string = getPianoKeyAudioPath(
        whiteKeyIndex,
        PianoKeyType.White,
      );
      const playIndex: number = whiteKeyIndex;
      const inputCollectionID: string | undefined =
        whitePianoKeyInputCollectionIDs[whiteKeyIndex];
      if (typeof inputCollectionID === "undefined") {
        throw new Error(
          `No input collection ID found for white key index ${whiteKeyIndex}.`,
        );
      }
      const text: string | undefined = whiteKeyTexts[whiteKeyIndex];
      if (typeof text === "undefined") {
        throw new Error(`No text found for black key index ${whiteKeyIndex}.`);
      }
      hudElementReferences.push(
        createWhitePianoKey({
          audioPath,
          condition: (): boolean => isWorldCombatInProgress() === false,
          inputCollectionID,
          isLabelVisible: (): boolean =>
            pianoWorldMenu.state.values.areLabelsVisible,
          onPlay: (): void => {
            onPlay(playIndex, PianoKeyType.White);
          },
          text,
          x: keysX + i * whiteKeyWidth,
          y: keysY,
        }),
      );
      whiteKeyIndex++;
    }
    let blackKeyIndex: number = 0;
    for (let i: number = 0; i < loopEnd; i++) {
      if (whiteKeyIndicesWithBlackKeys.includes(i % whiteKeys)) {
        const audioPath: string = getPianoKeyAudioPath(
          blackKeyIndex,
          PianoKeyType.Black,
        );
        const playIndex: number = blackKeyIndex;
        const inputCollectionID: string | undefined =
          blackPianoKeyInputCollectionIDs[blackKeyIndex];
        if (typeof inputCollectionID === "undefined") {
          throw new Error(
            `No input collection ID found for black key index ${blackKeyIndex}.`,
          );
        }
        const text: string | undefined = blackKeyTexts[blackKeyIndex];
        if (typeof text === "undefined") {
          throw new Error(
            `No text found for black key index ${blackKeyIndex}.`,
          );
        }
        hudElementReferences.push(
          createBlackPianoKey({
            audioPath,
            condition: (): boolean => isWorldCombatInProgress() === false,
            inputCollectionID,
            isLabelVisible: (): boolean =>
              pianoWorldMenu.state.values.areLabelsVisible,
            onPlay: (): void => {
              onPlay(playIndex, PianoKeyType.Black);
            },
            text,
            x: keysX + (i + 1) * whiteKeyWidth - 3,
            y: keysY,
          }),
        );
        blackKeyIndex++;
      }
    }
    const xWidth: number = 10;
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
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
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: panelX + Math.floor(panelWidth / 2) - 1,
          y: panelY + 10,
        },
        horizontalAlignment: "center",
        text: {
          value: "Piano",
        },
      }),
    );
    hudElementReferences.push(
      createVisibilityToggle({
        condition: (): boolean => isWorldCombatInProgress() === false,
        isVisible: (): boolean => pianoWorldMenu.state.values.areLabelsVisible,
        onClick: (): void => {
          pianoWorldMenu.state.setValues({
            areLabelsVisible:
              pianoWorldMenu.state.values.areLabelsVisible === false,
          });
        },
        x: panelX + 7,
        y: panelY + 6,
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {
    areLabelsVisible: true,
    lastKeyAt: null,
  },
  preventsWalking: true,
});
