import { connectToSocketioServer } from "pixel-pigeon";

export const handleWindowMessage = (message: unknown): void => {
  if (typeof message !== "object" || message === null) {
    throw new Error("Invalid message");
  }
  if ("type" in message && "value" in message) {
    if (typeof message.type !== "string") {
      throw new Error("Invalid message type");
    }
    switch (message.type) {
      case "auth":
        if (typeof message.value !== "string") {
          throw new Error("Invalid auth message value");
        }
        connectToSocketioServer({
          auth: { token: message.value },
          url: "http://localhost:4000",
        });
        break;
    }
  } else {
    throw new Error("Invalid message type");
  }
};
