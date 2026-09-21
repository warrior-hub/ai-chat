import {
  createContext,
  useContext,
  useState,
} from "react";

import {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation,
  sendMessageStream,
} from "../services/chat.service";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] =
    useState([]);

  const [activeConversation, setActiveConversation] =
    useState(null);

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [messageLoading, setMessageLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
    Load all conversations
  */
  const loadConversations = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getConversations();

      setConversations(
        data.conversations || []
      );
    } catch (error) {
      console.error(
        "Load conversations error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load conversations"
      );
    } finally {
      setLoading(false);
    }
  };


  /*
    Create new conversation
  */
  const createNewConversation = async () => {
    try {
      setError("");

      const data =
        await createConversation();

      const newConversation =
        data.conversation;

      setConversations((prev) => [
        newConversation,
        ...prev,
      ]);

      setActiveConversation(
        newConversation
      );

      setMessages([]);

      return newConversation;
    } catch (error) {
      console.error(
        "Create conversation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create conversation"
      );

      throw error;
    }
  };


  /*
    Open conversation
  */
  const openConversation = async (
    conversationId
  ) => {
    try {
      setMessageLoading(true);
      setError("");

      const data =
        await getConversation(
          conversationId
        );

      setActiveConversation(
        data.conversation
      );

      setMessages(
        data.messages || []
      );

      return data;
    } catch (error) {
      console.error(
        "Open conversation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to open conversation"
      );

      throw error;
    } finally {
      setMessageLoading(false);
    }
  };


  /*
    Rename conversation
  */
  const renameChat = async (
    conversationId,
    title
  ) => {
    try {
      setError("");

      const data =
        await renameConversation(
          conversationId,
          title
        );

      const updatedConversation =
        data.conversation;

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id ===
          conversationId
            ? updatedConversation
            : conversation
        )
      );

      setActiveConversation((prev) =>
        prev?._id === conversationId
          ? updatedConversation
          : prev
      );

      return updatedConversation;
    } catch (error) {
      console.error(
        "Rename conversation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to rename conversation"
      );

      throw error;
    }
  };


  /*
    Delete conversation
  */
  const removeConversation = async (
    conversationId
  ) => {
    try {
      setError("");

      await deleteConversation(
        conversationId
      );

      setConversations((prev) =>
        prev.filter(
          (conversation) =>
            conversation._id !==
            conversationId
        )
      );

      if (
        activeConversation?._id ===
        conversationId
      ) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error(
        "Delete conversation error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete conversation"
      );

      throw error;
    }
  };


  /*
    Send message to AI
  */
 const sendMessage = async (content) => {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return;
  }

  if (messageLoading) {
    return;
  }

  try {
    setError("");
    setMessageLoading(true);

    /*
      Agar active conversation nahi hai,
      to automatically new conversation create karo.
    */
    let conversation = activeConversation;

    if (!conversation) {
      const data = await createConversation();

      conversation = data.conversation;

      setConversations((prev) => [
        conversation,
        ...prev,
      ]);

      setActiveConversation(conversation);
      setMessages([]);
    }

    const temporaryAssistantId =
      `assistant-${Date.now()}`;

    await sendMessageStream(
      conversation._id,
      trimmedContent,
      {
        /*
          User message
        */
        onUserMessage: (userMessage) => {
          setMessages((prev) => [
            ...prev,
            userMessage,
          ]);
        },

        /*
          AI streaming chunks
        */
        onChunk: (text) => {
          setMessages((prev) => {
            const existingAssistant =
              prev.find(
                (message) =>
                  message._id ===
                  temporaryAssistantId
              );

            if (existingAssistant) {
              return prev.map((message) =>
                message._id ===
                temporaryAssistantId
                  ? {
                      ...message,
                      content:
                        message.content + text,
                    }
                  : message
              );
            }

            return [
              ...prev,
              {
                _id:
                  temporaryAssistantId,
                role: "assistant",
                content: text,
                createdAt:
                  new Date().toISOString(),
                streaming: true,
              },
            ];
          });
        },

        /*
          AI response complete
        */
        onDone: (assistantMessage) => {
          setMessages((prev) =>
            prev.map((message) =>
              message._id ===
              temporaryAssistantId
                ? {
                    ...assistantMessage,
                    streaming: false,
                  }
                : message
            )
          );
        },

        /*
          AI error
        */
        onError: (message) => {
          setError(
            message ||
              "AI response failed"
          );

          setMessages((prev) =>
            prev.filter(
              (message) =>
                message._id !==
                temporaryAssistantId
            )
          );
        },
      }
    );

    /*
      Sidebar conversations refresh
    */
    await loadConversations();

    /*
      Latest conversation data refresh
    */
    try {
      const updated =
        await getConversation(
          conversation._id
        );

      setActiveConversation(
        updated.conversation
      );
    } catch {
      // Ignore refresh error
    }
  } catch (error) {
    console.error(
      "Send message error:",
      error
    );

    setError(
      error.message ||
        "Failed to send message"
    );
  } finally {
    setMessageLoading(false);
  }
};


  /*
    Clear current chat
  */
  const clearActiveConversation = () => {
    setActiveConversation(null);
    setMessages([]);
  };


  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversation,
        messages,

        loading,
        messageLoading,
        error,

        loadConversations,
        createNewConversation,
        openConversation,
        renameChat,
        removeConversation,
        clearActiveConversation,

        sendMessage,

        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};


export const useChat = () => {
  const context =
    useContext(ChatContext);

  if (!context) {
    throw new Error(
      "useChat must be used inside ChatProvider"
    );
  }

  return context;
};