import { createVolumeChannel } from "pixel-pigeon";

export const sfxVolumeChannelID: string = createVolumeChannel({
  name: "SFX",
});
export const musicVolumeChannelID: string = createVolumeChannel({
  name: "Music",
});
