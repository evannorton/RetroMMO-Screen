import { Definable } from "./definables";

export interface BodyCosmeticOptions {
  imagePaths: Record<string, string>;
}
export class BodyCosmetic extends Definable {
  private readonly _imagePaths: Record<string, string>;
  public constructor(options: BodyCosmeticOptions) {
    super();
    this._imagePaths = options.imagePaths;
    console.log(this._imagePaths);
  }
}
new BodyCosmetic({
  imagePaths: {
    feminine: "bodies/underwear/feminine",
    masculine: "bodies/underwear/masculine",
  },
});
new BodyCosmetic({
  imagePaths: {
    feminine: "bodies/armor-1/feminine",
    masculine: "bodies/armor-1/masculine",
  },
});
new BodyCosmetic({
  imagePaths: {
    feminine: "bodies/armor-2/feminine",
    masculine: "bodies/armor-2/masculine",
  },
});
new BodyCosmetic({
  imagePaths: {
    feminine: "bodies/robe-1/feminine",
    masculine: "bodies/robe-1/masculine",
  },
});
new BodyCosmetic({
  imagePaths: {
    feminine: "bodies/robe-2/feminine",
    masculine: "bodies/robe-2/masculine",
  },
});
new BodyCosmetic({
  imagePaths: {
    feminine: "bodies/vest-1/feminine",
    masculine: "bodies/vest-1/masculine",
  },
});
new BodyCosmetic({
  imagePaths: {
    feminine: "bodies/vest-2/feminine",
    masculine: "bodies/vest-2/masculine",
  },
});
