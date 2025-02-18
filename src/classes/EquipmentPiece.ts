import { Class } from "./Class";
import { Definable, getDefinable } from "definables";
import { EquipmentPieceDefinition, EquipmentSlot } from "retrommo-types";

export interface EquipmentPieceOptions {
  readonly definition: EquipmentPieceDefinition;
  readonly id: string;
}
export class EquipmentPiece extends Definable {
  private readonly _agility: number;
  private readonly _classIDs: readonly string[];
  private readonly _defense: number;
  private readonly _intelligence: number;
  private readonly _luck: number;
  private readonly _slot: EquipmentSlot;
  private readonly _strength: number;
  private readonly _wisdom: number;
  public constructor(options: EquipmentPieceOptions) {
    super(options.id);
    this._agility = options.definition.agility;
    this._classIDs = options.definition.classIDs;
    this._defense = options.definition.defense;
    this._intelligence = options.definition.intelligence;
    this._luck = options.definition.luck;
    this._slot = options.definition.slot;
    this._strength = options.definition.strength;
    this._wisdom = options.definition.wisdom;
  }

  public get agility(): number {
    return this._agility;
  }

  public get classIDs(): readonly string[] {
    return this._classIDs;
  }

  public get classes(): readonly Class[] {
    return this._classIDs.map(
      (classID: string): Class => getDefinable(Class, classID),
    );
  }

  public get defense(): number {
    return this._defense;
  }

  public get intelligence(): number {
    return this._intelligence;
  }

  public get luck(): number {
    return this._luck;
  }

  public get slot(): EquipmentSlot {
    return this._slot;
  }

  public get strength(): number {
    return this._strength;
  }

  public get wisdom(): number {
    return this._wisdom;
  }
}
