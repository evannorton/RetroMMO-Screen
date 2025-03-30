import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { WorldCharacter } from "./WorldCharacter";

export interface PlayerOptionsCharacter {
  readonly classID: string;
  readonly level: number;
}
export interface PlayerOptions {
  readonly character?: PlayerOptionsCharacter;
  readonly id: string;
  readonly userID: number;
  readonly username: string;
  readonly worldCharacterID?: string;
}
export interface PlayerCharacter {
  readonly classID: string;
  readonly level: number;
}
export interface PlayerCharacterWithAccessors extends PlayerCharacter {
  class: Class;
}
export interface PlayerModification {
  readonly isOpen: boolean;
  readonly modifiedAt: number;
}
export class Player extends Definable {
  private _character: PlayerCharacter | null;
  private readonly _userID: number;
  private _username: string;
  private _worldCharacterID: string | null;
  public constructor(options: PlayerOptions) {
    super(options.id);
    this._character =
      typeof options.character !== "undefined"
        ? {
            classID: options.character.classID,
            level: options.character.level,
          }
        : null;
    this._userID = options.userID;
    this._username = options.username;
    this._worldCharacterID = options.worldCharacterID ?? null;
  }

  public get character(): PlayerCharacterWithAccessors {
    if (this._character !== null) {
      const { classID } = this._character;
      return {
        ...this._character,
        get class(): Class {
          return getDefinable(Class, classID);
        },
      };
    }
    throw new Error(this.getAccessorErrorMessage("character"));
  }

  public get userID(): number {
    return this._userID;
  }

  public get username(): string {
    return this._username;
  }

  public get worldCharacter(): WorldCharacter {
    if (this._worldCharacterID !== null) {
      return getDefinable(WorldCharacter, this._worldCharacterID);
    }
    throw new Error(this.getAccessorErrorMessage("worldCharacter"));
  }

  public get worldCharacterID(): string {
    if (this._worldCharacterID !== null) {
      return this._worldCharacterID;
    }
    throw new Error(this.getAccessorErrorMessage("worldCharacterID"));
  }

  public set character(character: PlayerCharacter | null) {
    this._character = character;
  }

  public set username(username: string) {
    this._username = username;
  }

  public set worldCharacterID(worldCharacterID: string | null) {
    this._worldCharacterID = worldCharacterID;
  }

  public hasCharacter(): boolean {
    return this._character !== null;
  }

  public hasWorldCharacter(): boolean {
    return this._worldCharacterID !== null;
  }
}
