import { postWindowMessage as postPixelPigeonWindowMessage } from "pixel-pigeon";

interface PostWindowMessageOptions {
  event: string;
  data?: unknown;
}

export const postWindowMessage = (options: PostWindowMessageOptions): void => {
  postPixelPigeonWindowMessage(options);
};
