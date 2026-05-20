import { postWindowMessage as postPixelPigeonWindowMessage } from "pixel-pigeon";

interface PostWindowMessageOptions<Data extends object> {
  readonly data: Data;
  readonly event: string;
}

export const postWindowMessage = <Data extends object>(
  options: PostWindowMessageOptions<Data>,
): void => {
  postPixelPigeonWindowMessage({
    data: options.data,
    event: `retrommo/${options.event}`,
  });
};
