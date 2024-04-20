import { connectToSocketioServer, getEnvironmentVariable } from "pixel-pigeon";

export const handleWindowMessage = (message: unknown): void => {
  if (typeof message !== "object" || message === null) {
    throw new Error("Invalid message");
  }
  if ("type" in message && "value" in message) {
    if (typeof message.type !== "string") {
      throw new Error("Invalid message type");
    }
    switch (message.type) {
      case "auth": {
        if (typeof message.value !== "string") {
          throw new Error("Invalid auth message value");
        }
        const url: unknown = getEnvironmentVariable("WEBSOCKET_URL");
        if (typeof url !== "string") {
          throw new Error(
            "WEBSOCKET_URL environment variable must be a string",
          );
        }
        connectToSocketioServer({
          auth: { token: message.value },
          url,
        });
        break;
      }
    }
  } else {
    throw new Error("Invalid message type");
  }
};
