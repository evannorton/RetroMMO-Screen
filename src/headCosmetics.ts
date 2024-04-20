import { Definable } from "./definables";

export interface HeadCosmeticOptions {
  backImagePaths: Record<string, string | null>;
  frontImagePaths: Record<string, string | null>;
}
export class HeadCosmetic extends Definable {
  private readonly _backImagePaths: Record<string, string | null>;
  private readonly _frontImagePaths: Record<string, string | null>;
  public constructor(options: HeadCosmeticOptions) {
    super();
    this._backImagePaths = options.backImagePaths;
    this._frontImagePaths = options.frontImagePaths;
    console.log(this._backImagePaths);
    console.log(this._frontImagePaths);
  }
}
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/afro/front/feminine",
    masculine: "heads/afro/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/bald-head/front/feminine",
    masculine: "heads/bald-head/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/barbute/front/feminine",
    masculine: "heads/barbute/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/barbute-l/front/feminine",
    masculine: "heads/barbute-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/big-brain/front/feminine",
    masculine: "heads/big-brain/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/big-floof/front/feminine",
    masculine: "heads/big-floof/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/birthday-hat-1/front/feminine",
    masculine: "heads/birthday-hat-1/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/birthday-hat-1-l/front/feminine",
    masculine: "heads/birthday-hat-1-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/birthday-hat-2/front/feminine",
    masculine: "heads/birthday-hat-2/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/birthday-hat-2-l/front/feminine",
    masculine: "heads/birthday-hat-2-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/birthday-hat-3/front/feminine",
    masculine: "heads/birthday-hat-3/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/birthday-hat-3-l/front/feminine",
    masculine: "heads/birthday-hat-3-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/buns/front/feminine",
    masculine: "heads/buns/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/buzzed-hair/front/feminine",
    masculine: "heads/buzzed-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/cat-mask/front/feminine",
    masculine: "heads/cat-mask/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/devil-horns/back/feminine",
    masculine: "heads/devil-horns/back/feminine",
  },
  frontImagePaths: {
    feminine: "heads/devil-horns/front/feminine",
    masculine: "heads/devil-horns/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/dimitris-hood/front/feminine",
    masculine: "heads/dimitris-hood/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/double-braids/front/feminine",
    masculine: "heads/double-braids/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/hijab/back/feminine",
    masculine: "heads/hijab/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/hijab/front/feminine",
    masculine: "heads/hijab/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/horned-helmet/front/feminine",
    masculine: "heads/horned-helmet/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/horned-helmet-l/back/feminine",
    masculine: "heads/horned-helmet-l/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/horned-helmet-l/front/feminine",
    masculine: "heads/horned-helmet-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/long-hair/back/feminine",
    masculine: "heads/long-hair/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/long-hair/front/feminine",
    masculine: "heads/long-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/messy-bun/front/feminine",
    masculine: "heads/messy-bun/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/messy-hair/back/feminine",
    masculine: "heads/messy-hair/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/messy-hair/front/feminine",
    masculine: "heads/messy-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/mitre/front/feminine",
    masculine: "heads/mitre/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/mitre-l/back/feminine",
    masculine: "heads/mitre-l/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/mitre-l/front/feminine",
    masculine: "heads/mitre-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/mushroom-hat/front/feminine",
    masculine: "heads/mushroom-hat/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/nurse-cap/front/feminine",
    masculine: "heads/nurse-cap/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/nurse-cap-l/back/feminine",
    masculine: "heads/nurse-cap-l/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/nurse-cap-l/front/feminine",
    masculine: "heads/nurse-cap-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/paper-bag/front/feminine",
    masculine: "heads/paper-bag/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/pigtails/back/feminine",
    masculine: "heads/pigtails/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/pigtails/front/feminine",
    masculine: "heads/pigtails/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/plumed-helmet/front/feminine",
    masculine: "heads/plumed-helmet/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/princess-crown/back/feminine",
    masculine: "heads/princess-crown/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/princess-crown/front/feminine",
    masculine: "heads/princess-crown/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/rockstar-hair/back/feminine",
    masculine: "heads/rockstar-hair/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/rockstar-hair/front/feminine",
    masculine: "heads/rockstar-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/santa-hat/front/feminine",
    masculine: "heads/santa-hat/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/shaved-hair/front/feminine",
    masculine: "heads/shaved-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/single-braid/front/feminine",
    masculine: "heads/single-braid/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/small-floof/front/feminine",
    masculine: "heads/small-floof/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/spiked-hair/front/feminine",
    masculine: "heads/spiked-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/sunglasses/front/feminine",
    masculine: "heads/sunglasses/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/sunglasses-b/front/feminine",
    masculine: "heads/sunglasses-b/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/sunglasses-l/back/feminine",
    masculine: "heads/sunglasses-l/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/sunglasses-l/front/feminine",
    masculine: "heads/sunglasses-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/swoopy-hair/front/feminine",
    masculine: "heads/swoopy-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/triple-braids/front/feminine",
    masculine: "heads/triple-braids/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: "heads/wavy-hair/back/feminine",
    masculine: "heads/wavy-hair/back/masculine",
  },
  frontImagePaths: {
    feminine: "heads/wavy-hair/front/feminine",
    masculine: "heads/wavy-hair/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/wizard-hat/front/feminine",
    masculine: "heads/wizard-hat/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/wizard-hat-l/front/feminine",
    masculine: "heads/wizard-hat-l/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/wizard-hood/front/feminine",
    masculine: "heads/wizard-hood/front/masculine",
  },
});
new HeadCosmetic({
  backImagePaths: {
    feminine: null,
    masculine: null,
  },
  frontImagePaths: {
    feminine: "heads/wizard-hood-l/front/feminine",
    masculine: "heads/wizard-hood-l/front/masculine",
  },
});
