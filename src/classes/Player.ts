import { BattleCharacter } from "./BattleCharacter";
import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { Party } from "./Party";
import { WorldCharacter } from "./WorldCharacter";

export interface PlayerOptionsCharacter {
  readonly classID: string;
  readonly level: number;
  readonly partyID: string;
}
export interface PlayerOptions {
  readonly battleCharacterID?: string;
  readonly character?: PlayerOptionsCharacter;
  readonly id: string;
  readonly userID: number;
  readonly username: string;
  readonly worldCharacterID?: string;
}
export interface PlayerCharacter {
  readonly classID: string;
  level: number;
  partyID: string;
}
export interface PlayerCharacterWithAccessors extends PlayerCharacter {
  readonly class: Class;
  readonly party: Party;
}
export interface PlayerModification {
  readonly isOpen: boolean;
  readonly modifiedAt: number;
}
export class Player extends Definable {
  private _battleCharacterID: string | null;
  private _character: PlayerCharacter | null;
  private readonly _userID: number;
  private _username: string;
  private _worldCharacterID: string | null;
  public constructor(options: PlayerOptions) {
    super(options.id);
    this._battleCharacterID = options.battleCharacterID ?? null;
    this._character =
      typeof options.character !== "undefined"
        ? {
            classID: options.character.classID,
            level: options.character.level,
            partyID: options.character.partyID,
          }
        : null;
    this._userID = options.userID;
    this._username = options.username;
    this._worldCharacterID = options.worldCharacterID ?? null;
  }

  public get battleCharacter(): BattleCharacter {
    if (this._battleCharacterID !== null) {
      return getDefinable(BattleCharacter, this._battleCharacterID);
    }
    throw new Error(this.getAccessorErrorMessage("battleCharacter"));
  }

  public get battleCharacterID(): string {
    if (this._battleCharacterID !== null) {
      return this._battleCharacterID;
    }
    throw new Error(this.getAccessorErrorMessage("battleCharacterID"));
  }

  public get character(): PlayerCharacterWithAccessors {
    if (this._character !== null) {
      const character: PlayerCharacter = this._character;
      return {
        get class(): Class {
          return getDefinable(Class, character.classID);
        },
        classID: character.classID,
        get level(): number {
          return character.level;
        },
        set level(level: number) {
          character.level = level;
        },
        get party(): Party {
          return getDefinable(Party, character.partyID);
        },
        get partyID(): string {
          return character.partyID;
        },
        set partyID(partyID: string) {
          character.partyID = partyID;
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

  public set battleCharacterID(battleCharacterID: string | null) {
    this._battleCharacterID = battleCharacterID;
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

  public hasBattleCharacter(): boolean {
    return this._battleCharacterID !== null;
  }

  public hasCharacter(): boolean {
    return this._character !== null;
  }

  public hasWorldCharacter(): boolean {
    return this._worldCharacterID !== null;
  }
}
