import api from "./api";
import { API_URL } from "../utils/constants";

/*
  Create a new conversation
*/
export const createConversation = async () => {
  const response = await api.post("/chats");

  return response.data;
};


/*
  Get all conversations
*/
export const getConversations = async () => {
  const response = await api.get("/chats");

  return response.data;
};


/*
  Get one conversation with messages
*/
export const getConversation = async (
  conversationId
) => {
  const response = await api.get(
    `/chats/${conversationId}`
  );

  return response.data;
};


/*
  Rename conversation
*/
export const renameConversation = async (
  conversationId,
  title
) => {
  const response = await api.patch(
    `/chats/${conversationId}`,
    {
      title,
    }
  );

  return response.data;
};


/*
  Delete conversation
*/
export const deleteConversation = async (
  conversationId
) => {
  const response = await api.delete(
    `/chats/${conversationId}`
  );

  return response.data;
};


/*
  Send message + receive AI response as stream
*/
export const sendMessageStream = async (
  conversationId,
  content,
  {
    onUserMessage,
    onChunk,
    onDone,
    onError,
  } = {}
) => {
  try {
    const token =
      localStorage.getItem("token");

    if (!token) {
      throw new Error(
        "Authentication token not found"
      );
    }

    const response = await fetch(
      `${API_URL}/chats/${conversationId}/messages`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          content,
        }),
      }
    );

    if (!response.ok) {
      let errorMessage =
        "Failed to send message";

      try {
        const errorData =
          await response.json();

        errorMessage =
          errorData.message ||
          errorMessage;
      } catch {
        // Ignore JSON parsing error
      }

      throw new Error(errorMessage);
    }

    if (!response.body) {
      throw new Error(
        "Streaming is not supported by this response"
      );
    }

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const {
        value,
        done,
      } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(
        value,
        { stream: true }
      );

      const events =
        buffer.split("\n\n");

      buffer =
        events.pop() || "";

      for (const event of events) {
        const lines =
          event.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data:")) {
            continue;
          }

          const rawData =
            line.slice(5).trim();

          if (!rawData) {
            continue;
          }

          try {
            const data =
              JSON.parse(rawData);

            /*
              User message saved by backend
            */
            if (
              data.type ===
              "user_message"
            ) {
              onUserMessage?.(
                data.message
              );
            }

            /*
              AI text chunk
            */
            else if (
              data.type === "chunk"
            ) {
              onChunk?.(
                data.text || ""
              );
            }

            /*
              Stream finished
            */
            else if (
              data.type === "done"
            ) {
              onDone?.(
                data.message
              );
            }

            /*
              Backend error
            */
            else if (
              data.type === "error"
            ) {
              onError?.(
                data.message ||
                  "AI response failed"
              );
            }
          } catch (parseError) {
            console.error(
              "SSE parse error:",
              parseError,
              rawData
            );
          }
        }
      }
    }

    /*
      Process any remaining data
      after stream closes.
    */
    if (buffer.trim()) {
      const lines =
        buffer.split("\n");

      for (const line of lines) {
        if (!line.startsWith("data:")) {
          continue;
        }

        const rawData =
          line.slice(5).trim();

        if (!rawData) {
          continue;
        }

        try {
          const data =
            JSON.parse(rawData);

          if (
            data.type === "done"
          ) {
            onDone?.(
              data.message
            );
          }

          if (
            data.type === "error"
          ) {
            onError?.(
              data.message
            );
          }
        } catch {
          // Ignore incomplete SSE data
        }
      }
    }
  } catch (error) {
    console.error(
      "Send message stream error:",
      error
    );

    onError?.(
      error.message ||
        "Failed to send message"
    );

    throw error;
  }
};