import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { Direction, Step } from "retrommo-types";
import { Figure } from "./Figure";
import { Item } from "./Item";
import { Party } from "./Party";
import { SkinColor } from "./SkinColor";
import { TilePosition } from "../types/TilePosition";
import { removeEntity } from "pixel-pigeon";

export interface WorldCharacterOptionsQuestInstance {
  readonly isCompleted: boolean;
  readonly monsterKills?: number;
  readonly isStarted: boolean;
}
export interface WorldCharacterOptionsResources {
  hp: number;
  maxHP: number;
  maxMP?: number;
  mp?: number;
}
export interface WorldCharacterOptions {
  readonly classID: string;
  readonly clothesDyeItemID?: string;
  readonly direction: Direction;
  readonly figureID: string;
  readonly hairDyeItemID?: string;
  readonly id: string;
  readonly isRenewing?: boolean;
  readonly level: number;
  readonly maskItemID?: string;
  readonly openedChestIDs?: readonly string[];
  readonly order: number;
  readonly outfitItemID?: string;
  readonly partyID: string;
  readonly playerID: string;
  readonly position: TilePosition;
  readonly questInstances?: Record<string, WorldCharacterOptionsQuestInstance>;
  readonly resources?: WorldCharacterOptionsResources;
  readonly skinColorID: string;
  readonly step: Step;
  readonly tilemapID: string;
  readonly userID: number;
  readonly username: string;
}
export interface WorldCharacterQuestInstance {
  isCompleted: boolean;
  isStarted: boolean;
  monsterKills?: number;
}
export interface WorldCharacterResources {
  readonly hp: number;
  readonly maxHP: number;
  readonly maxMP: number | null;
  readonly mp: number | null;
}
export interface WorldCharacterEmote {
  readonly entityID: string;
  readonly usedAt: number;
}
export class WorldCharacter extends Definable {
  private readonly _classID: string;
  private _clothesDyeItemID: string | null;
  private _direction: Direction;
  private _emote: WorldCharacterEmote | null = null;
  private _entityID: string | null = null;
  private readonly _figureID: string;
  private _hairDyeItemID: string | null;
  private _isRenewing: boolean | null;
  private _level: number;
  private _markerEntityID: string | null = null;
  private _maskItemID: string | null;
  private _movedAt: number | null = null;
  private _openedChestIDs: readonly string[] | null;
  private _order: number;
  private _outfitItemID: string | null;
  private _partyID: string;
  private readonly _playerID: string;
  private _position: TilePosition;
  private _questInstances: Record<string, WorldCharacterQuestInstance> = {};
  private _resources: WorldCharacterResources | null;
  private readonly _skinColorID: string;
  private _step: Step = Step.Right;
  private _tilemapID: string;
  private readonly _userID: number;
  private readonly _username: string;
  private _wasClicked: boolean = false;
  public constructor(options: WorldCharacterOptions) {
    super(options.id);
    this._classID = options.classID;
    this._clothesDyeItemID = options.clothesDyeItemID ?? null;
    this._direction = options.direction;
    this._figureID = options.figureID;
    this._hairDyeItemID = options.hairDyeItemID ?? null;
    this._isRenewing = options.isRenewing ?? null;
    this._level = options.level;
    this._maskItemID = options.maskItemID ?? null;
    this._openedChestIDs = options.openedChestIDs ?? null;
    this._order = options.order;
    this._outfitItemID = options.outfitItemID ?? null;
    this._partyID = options.partyID;
    this._playerID = options.playerID;
    this._position = {
      x: options.position.x,
      y: options.position.y,
    };
    for (const questID in options.questInstances) {
      const questInstance: WorldCharacterOptionsQuestInstance | undefined =
        options.questInstances[questID];
      if (typeof questInstance === "undefined") {
        throw new Error("No quest instance.");
      }
      this._questInstances[questID] = {
        isCompleted: questInstance.isCompleted,
        isStarted: questInstance.isStarted,
        monsterKills: questInstance.monsterKills,
      };
    }
    this._resources =
      typeof options.resources !== "undefined"
        ? {
            hp: options.resources.hp,
            maxHP: options.resources.maxHP,
            maxMP: options.resources.maxMP ?? null,
            mp: options.resources.mp ?? null,
          }
        : null;
    this._skinColorID = options.skinColorID;
    this._step = options.step;
    this._tilemapID = options.tilemapID;
    this._userID = options.userID;
    this._username = options.username;
  }

  public get class(): Class {
    return getDefinable(Class, this._classID);
  }

  public get clothesDyeItem(): Item {
    if (this._clothesDyeItemID !== null) {
      return getDefinable(Item, this._clothesDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItem"));
  }

  public get clothesDyeItemID(): string {
    if (this._clothesDyeItemID !== null) {
      return this._clothesDyeItemID;
    }
    throw new Error(this.getAccessorErrorMessage("clothesDyeItemID"));
  }

  public get direction(): Direction {
    return this._direction;
  }

  public get emote(): WorldCharacterEmote {
    if (this._emote !== null) {
      return this._emote;
    }
    throw new Error(this.getAccessorErrorMessage("emote"));
  }

  public get entityID(): string {
    if (this._entityID !== null) {
      return this._entityID;
    }
    throw new Error(this.getAccessorErrorMessage("entityID"));
  }

  public get figure(): Figure {
    return getDefinable(Figure, this._figureID);
  }

  public get figureID(): string {
    return this._figureID;
  }

  public get hairDyeItem(): Item {
    if (this._hairDyeItemID !== null) {
      return getDefinable(Item, this._hairDyeItemID);
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItem"));
  }

  public get hairDyeItemID(): string {
    if (this._hairDyeItemID !== null) {
      return this._hairDyeItemID;
    }
    throw new Error(this.getAccessorErrorMessage("hairDyeItemID"));
  }

  public get isRenewing(): boolean {
    if (this._isRenewing !== null) {
      return this._isRenewing;
    }
    throw new Error(this.getAccessorErrorMessage("isRenewing"));
  }

  public get level(): number {
    return this._level;
  }

  public get markerEntityID(): string {
    if (this._markerEntityID !== null) {
      return this._markerEntityID;
    }
    throw new Error(this.getAccessorErrorMessage("markerEntityID"));
  }

  public get maskItem(): Item {
    if (this._maskItemID !== null) {
      return getDefinable(Item, this._maskItemID);
    }
    throw new Error(this.getAccessorErrorMessage("maskItem"));
  }

  public get maskItemID(): string {
    if (this._maskItemID !== null) {
      return this._maskItemID;
    }
    throw new Error(this.getAccessorErrorMessage("maskItemID"));
  }

  public get movedAt(): number {
    if (this._movedAt !== null) {
      return this._movedAt;
    }
    throw new Error(this.getAccessorErrorMessage("movedAt"));
  }

  public get openedChestIDs(): readonly string[] {
    if (this._openedChestIDs !== null) {
      return this._openedChestIDs;
    }
    throw new Error(this.getAccessorErrorMessage("openedChestIDs"));
  }

  public get order(): number {
    return this._order;
  }

  public get outfitItem(): Item {
    if (this._outfitItemID !== null) {
      return getDefinable(Item, this._outfitItemID);
    }
    throw new Error(this.getAccessorErrorMessage("outfitItem"));
  }

  public get outfitItemID(): string {
    if (this._outfitItemID !== null) {
      return this._outfitItemID;
    }
    throw new Error(this.getAccessorErrorMessage("outfitItemID"));
  }

  public get party(): Party {
    return getDefinable(Party, this._partyID);
  }

  public get partyID(): string {
    return this._partyID;
  }

  public get playerID(): string {
    return this._playerID;
  }

  public get position(): TilePosition {
    return this._position;
  }

  public get questInstances(): Record<string, WorldCharacterQuestInstance> {
    return this._questInstances;
  }

  public get resources(): WorldCharacterResources {
    if (this._resources !== null) {
      return this._resources;
    }
    throw new Error(this.getAccessorErrorMessage("resources"));
  }

  public get skinColor(): SkinColor {
    return getDefinable(SkinColor, this._skinColorID);
  }

  public get skinColorID(): string {
    return this._skinColorID;
  }

  public get step(): Step {
    return this._step;
  }

  public get tilemapID(): string {
    return this._tilemapID;
  }

  public get username(): string {
    return this._username;
  }

  public get wasClicked(): boolean {
    return this._wasClicked;
  }

  public set clothesDyeItemID(clothesDyeItemID: string | null) {
    this._clothesDyeItemID = clothesDyeItemID;
  }

  public set direction(direction: Direction) {
    this._direction = direction;
  }

  public set emote(emote: WorldCharacterEmote | null) {
    this._emote = emote;
  }

  public set entityID(entityID: string) {
    this._entityID = entityID;
  }

  public set hairDyeItemID(hairDyeItemID: string | null) {
    this._hairDyeItemID = hairDyeItemID;
  }

  public set isRenewing(isRenewing: boolean | null) {
    this._isRenewing = isRenewing;
  }

  public set level(level: number) {
    this._level = level;
  }

  public set markerEntityID(markerEntityID: string | null) {
    this._markerEntityID = markerEntityID;
  }

  public set maskItemID(maskItemID: string | null) {
    this._maskItemID = maskItemID;
  }

  public set movedAt(movedAt: number) {
    this._movedAt = movedAt;
  }

  public set openedChestIDs(openedChestIDs: readonly string[]) {
    this._openedChestIDs = openedChestIDs;
  }

  public set order(order: number) {
    this._order = order;
  }

  public set outfitItemID(outfitItemID: string | null) {
    this._outfitItemID = outfitItemID;
  }

  public set partyID(partyID: string) {
    this._partyID = partyID;
  }

  public set position(position: TilePosition) {
    this._position = position;
  }

  public set questInstances(
    questInstances: Record<string, WorldCharacterQuestInstance>,
  ) {
    this._questInstances = questInstances;
  }

  public set resources(resources: WorldCharacterResources | null) {
    this._resources = resources;
  }

  public set step(step: Step) {
    this._step = step;
  }

  public set tilemapID(tilemapID: string) {
    this._tilemapID = tilemapID;
  }

  public set wasClicked(wasClicked: boolean) {
    this._wasClicked = wasClicked;
  }

  public hasClothesDyeItem(): boolean {
    return this._clothesDyeItemID !== null;
  }

  public hasEmote(): boolean {
    return this._emote !== null;
  }

  public hasHairDyeItem(): boolean {
    return this._hairDyeItemID !== null;
  }

  public hasIsRenewing(): boolean {
    return this._isRenewing !== null;
  }

  public hasMarker(): boolean {
    return this._markerEntityID !== null;
  }

  public hasMaskItem(): boolean {
    return this._maskItemID !== null;
  }

  public hasMovedAt(): boolean {
    return this._movedAt !== null;
  }

  public hasOutfitItem(): boolean {
    return this._outfitItemID !== null;
  }

  public remove(): void {
    if (this._entityID !== null) {
      removeEntity(this._entityID);
    }
    if (this._emote !== null) {
      removeEntity(this._emote.entityID);
    }
    if (this._markerEntityID !== null) {
      removeEntity(this._markerEntityID);
    }
    super.remove();
  }
}
