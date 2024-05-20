import { BodyCosmetic } from "../classes/BodyCosmetic";
import {
  BodyCosmeticDefinition,
  ClassDefinition,
  ClothesColorDefinition,
  ClothesDyeDefinition,
  Constants,
  Definition,
  FigureDefinition,
  HairColorDefinition,
  HairDyeDefinition,
  HeadCosmeticDefinition,
  ItemDefinition,
  MaskDefinition,
  OutfitDefinition,
  SkinColorDefinition,
  TilemapDefinition,
  TilemapTileDefinition,
  TilemapTilesetDefinition,
  TilesetDefinition,
  TilesetTileDefinition,
} from "retrommo-types";
import { Class } from "../classes/Class";
import { ClothesColor } from "../classes/ClothesColor";
import { ClothesDye } from "../classes/ClothesDye";
import {
  CreateLevelOptionsLayer,
  CreateTilesetOptionsTile,
  createLevel,
  createTileset,
  makeHTTPRequest,
} from "pixel-pigeon";
import { Figure } from "../classes/Figure";
import { HairColor } from "../classes/HairColor";
import { HairDye } from "../classes/HairDye";
import { HeadCosmetic } from "../classes/HeadCosmetic";
import { Item } from "../classes/Item";
import { Mask } from "../classes/Mask";
import { Outfit } from "../classes/Outfit";
import { SkinColor } from "../classes/SkinColor";
import { getDefinables } from "../definables";
import { state } from "../state";

export const loadGameData = async (): Promise<void> => {
  if (state.values.serverURL === null) {
    throw new Error("Attempted to load game data with no server URL.");
  }
  const constantsReponse: Response = await makeHTTPRequest({
    url: `${state.values.serverURL}/constants.json`,
  });
  const constants: Constants = (await constantsReponse.json()) as Constants;
  const gameDataResponse: Response = await makeHTTPRequest({
    url: `${state.values.serverURL}/game-data.json`,
  });
  const gameData: Record<
    string,
    Record<string, Definition>
  > = (await gameDataResponse.json()) as Record<
    string,
    Record<string, Definition>
  >;
  for (const className in gameData) {
    for (const id in gameData[className]) {
      switch (className) {
        case "Ability":
          break;
        case "AudioSource":
          break;
        case "Bank":
          break;
        case "BattleImpactAnimation":
          break;
        case "BodyCosmetic": {
          const definition: BodyCosmeticDefinition = gameData[className][
            id
          ] as BodyCosmeticDefinition;
          new BodyCosmetic({
            definition,
            id,
          });
          break;
        }
        case "Chest":
          break;
        case "Class": {
          const definition: ClassDefinition = gameData[className][
            id
          ] as ClassDefinition;
          new Class({
            definition,
            id,
          });
          break;
        }
        case "ClothesColor": {
          const definition: ClothesColorDefinition = gameData[className][
            id
          ] as ClothesColorDefinition;
          new ClothesColor({
            definition,
            id,
          });
          break;
        }
        case "ClothesDye": {
          const definition: ClothesDyeDefinition = gameData[className][
            id
          ] as ClothesDyeDefinition;
          new ClothesDye({
            definition,
            id,
          });
          break;
        }
        case "CombinationLock":
          break;
        case "Emote":
          break;
        case "Enterable":
          break;
        case "Figure": {
          const definition: FigureDefinition = gameData[className][
            id
          ] as FigureDefinition;
          new Figure({
            definition,
            id,
          });
          break;
        }
        case "HairColor": {
          const definition: HairColorDefinition = gameData[className][
            id
          ] as HairColorDefinition;
          new HairColor({
            definition,
            id,
          });
          break;
        }
        case "HairDye": {
          const definition: HairDyeDefinition = gameData[className][
            id
          ] as HairDyeDefinition;
          new HairDye({
            definition,
            id,
          });
          break;
        }
        case "HeadCosmetic": {
          const definition: HeadCosmeticDefinition = gameData[className][
            id
          ] as HeadCosmeticDefinition;
          new HeadCosmetic({
            definition,
            id,
          });
          break;
        }
        case "ImageSource":
          break;
        case "Item": {
          const definition: ItemDefinition = gameData[className][
            id
          ] as ItemDefinition;
          new Item({
            definition,
            id,
          });
          break;
        }
        case "Label":
          break;
        case "Landscape":
          break;
        case "Mask": {
          const definition: MaskDefinition = gameData[className][
            id
          ] as MaskDefinition;
          new Mask({
            definition,
            id,
          });
          break;
        }
        case "Monster":
          break;
        case "MusicTrack":
          break;
        case "NPC":
          break;
        case "Noise":
          break;
        case "Outfit": {
          const definition: OutfitDefinition = gameData[className][
            id
          ] as OutfitDefinition;
          new Outfit({
            definition,
            id,
          });
          break;
        }
        case "Panel":
          break;
        case "Picture":
          break;
        case "Reachable":
          break;
        case "Rectangle":
          break;
        case "ResourceBar":
          break;
        case "SkinColor": {
          const definition: SkinColorDefinition = gameData[className][
            id
          ] as SkinColorDefinition;
          new SkinColor({
            definition,
            id,
          });
          break;
        }
        case "Switch":
          break;
        case "Tilemap": {
          const definition: TilemapDefinition = gameData[className][
            id
          ] as TilemapDefinition;
          const getTilemapTilesetDefinitionAtIndex = (
            index: number,
          ): TilemapTilesetDefinition => {
            for (let i: number = definition.tilesets.length - 1; i >= 0; i--) {
              const tileset: TilemapTilesetDefinition = definition.tilesets[i];
              if (tileset.firstTileID <= index) {
                return tileset;
              }
            }
            throw new Error(
              `Tilemap "${id}" does not have TilemapTilesetDefinition at index ${index}.`,
            );
          };
          const getTileXAtIndex = (index: number, width: number): number =>
            index % width;
          const getTileYAtIndex = (index: number, width: number): number =>
            Math.floor(index / width);
          const layers: CreateLevelOptionsLayer[] = [];
          definition.tiles.forEach(
            (row: TilemapTileDefinition[], x: number): void => {
              row.forEach((tile: TilemapTileDefinition, y: number): void => {
                tile.belowIndices.forEach(
                  (index: number, layerIndex: number): void => {
                    const tilesetDefinition: TilemapTilesetDefinition =
                      getTilemapTilesetDefinitionAtIndex(index);
                    const tileset: TilesetDefinition = gameData.Tileset[
                      tilesetDefinition.tileset
                    ] as TilesetDefinition;
                    const tilesetX: number = getTileXAtIndex(
                      index - tilesetDefinition.firstTileID,
                      tileset.width,
                    );
                    const tilesetY: number = getTileYAtIndex(
                      index - tilesetDefinition.firstTileID,
                      tileset.width,
                    );
                    const layerID: string = `below-${layerIndex}`;
                    let layer: CreateLevelOptionsLayer | undefined =
                      layers.find(
                        (layerInLoop: CreateLevelOptionsLayer): boolean =>
                          layerInLoop.id === layerID,
                      );
                    if (!layer) {
                      layer = {
                        id: layerID,
                        tiles: [],
                      };
                      layers.push(layer);
                    }
                    layer.tiles.push({
                      tilesetID: tilesetDefinition.tileset,
                      tilesetX,
                      tilesetY,
                      x: x * 16,
                      y: y * 16,
                    });
                  },
                );
              });
            },
          );
          definition.tiles.forEach(
            (row: TilemapTileDefinition[], x: number): void => {
              row.forEach((tile: TilemapTileDefinition, y: number): void => {
                tile.aboveIndices.forEach(
                  (index: number, layerIndex: number): void => {
                    const tilesetDefinition: TilemapTilesetDefinition =
                      getTilemapTilesetDefinitionAtIndex(index);
                    const tileset: TilesetDefinition = gameData.Tileset[
                      tilesetDefinition.tileset
                    ] as TilesetDefinition;
                    const tilesetX: number = getTileXAtIndex(
                      index - tilesetDefinition.firstTileID,
                      tileset.width,
                    );
                    const tilesetY: number = getTileYAtIndex(
                      index - tilesetDefinition.firstTileID,
                      tileset.width,
                    );
                    const layerID: string = `above-${layerIndex}`;
                    let layer: CreateLevelOptionsLayer | undefined =
                      layers.find(
                        (layerInLoop: CreateLevelOptionsLayer): boolean =>
                          layerInLoop.id === layerID,
                      );
                    if (!layer) {
                      layer = {
                        id: layerID,
                        tiles: [],
                      };
                      layers.push(layer);
                    }
                    layer.tiles.push({
                      tilesetID: tilesetDefinition.tileset,
                      tilesetX,
                      tilesetY,
                      x: x * 16,
                      y: y * 16,
                    });
                  },
                );
              });
            },
          );
          createLevel({
            height: definition.height * constants["tile-size"],
            id,
            layers,
            tileSize: constants["tile-size"],
            width: definition.width * constants["tile-size"],
          });
          break;
        }
        case "Tileset": {
          const definition: TilesetDefinition = gameData[className][
            id
          ] as TilesetDefinition;
          const tiles: CreateTilesetOptionsTile[] = [];
          definition.tiles.forEach(
            (row: TilesetTileDefinition[], tilesetX: number): void => {
              row.forEach(
                (tile: TilesetTileDefinition, tilesetY: number): void => {
                  tiles.push({
                    isCollidable: tile.collision,
                    tilesetX,
                    tilesetY,
                  });
                },
              );
            },
          );
          createTileset({
            height: definition.height * constants["tile-size"],
            id,
            imagePath: `tilesets/${id}`,
            tileSize: constants["tile-size"],
            tiles,
            width: definition.width * constants["tile-size"],
          });
          break;
        }
        case "Transport":
          break;
        default:
          throw new Error(`Unknown class name: ${className}`);
      }
    }
  }
  const defaultClothesDye: [string, ClothesDye] | undefined = Array.from(
    getDefinables(ClothesDye),
  ).find(
    (clothesDye: [string, ClothesDye]): boolean => clothesDye[1].isDefault,
  );
  if (typeof defaultClothesDye === "undefined") {
    throw new Error("Default clothes dye is undefined");
  }
  const defaultHairDye: [string, HairDye] | undefined = Array.from(
    getDefinables(HairDye),
  ).find((hairDye: [string, HairDye]): boolean => hairDye[1].isDefault);
  if (typeof defaultHairDye === "undefined") {
    throw new Error("Default hair dye is undefined");
  }
  const defaultMask: [string, Mask] | undefined = Array.from(
    getDefinables(Mask),
  ).find((mask: [string, Mask]): boolean => mask[1].isDefault);
  if (typeof defaultMask === "undefined") {
    throw new Error("Default mask is undefined");
  }
  const defaultOutfit: [string, Outfit] | undefined = Array.from(
    getDefinables(Outfit),
  ).find((outfit: [string, Outfit]): boolean => outfit[1].isDefault);
  if (typeof defaultOutfit === "undefined") {
    throw new Error("Default outfit is undefined");
  }
  state.setValues({
    constants,
    defaultClothesDyeID: defaultClothesDye[1].id,
    defaultHairDyeID: defaultHairDye[1].id,
    defaultMaskID: defaultMask[1].id,
    defaultOutfitID: defaultOutfit[1].id,
  });
  for (const classObject of getDefinables(Class).values()) {
    classObject.populateCharacterCustomizeOptions();
  }
};
