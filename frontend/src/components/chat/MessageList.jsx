import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";

import { useChat } from "../../context/ChatContext";
import MarkdownMessage from "./MarkdownMessage";

const MessageList = () => {
  const {
    messages,
    messageLoading,
  } = useChat();

  const bottomRef = useRef(null);

  /*
    Automatically scroll to latest message
  */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
    Empty state
  */
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-lg text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-950">
            <Bot size={30} />
          </div>

          <h2 className="text-2xl font-bold">
            How can I help you?
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Ask me anything. I can help you
            write code, explain concepts,
            debug errors, generate ideas,
            and much more.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">

      <div className="mx-auto w-full max-w-4xl px-4 py-8">

        {messages.map((message, index) => {
          const isUser =
            message.role === "user";

          const isStreaming =
            message.streaming === true;

          return (
            <div
              key={
                message._id ||
                `${message.role}-${index}`
              }
              className={`mb-8 flex gap-4 ${
                isUser
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {/* AI Avatar */}
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950">
                  <Bot size={19} />
                </div>
              )}

              {/* Message */}
              <div
                className={`max-w-[80%] ${
                  isUser
                    ? "rounded-2xl bg-slate-800 px-4 py-3"
                    : "pt-1"
                }`}
              >
                <div
                  className={
                    isUser
                      ? "whitespace-pre-wrap text-sm leading-7 text-slate-100"
                      : "text-slate-300"
                  }
                >

                  {/* User message */}
                  {isUser ? (
                    message.content
                  ) : (
                    /* AI Markdown message */
                    <MarkdownMessage
                      content={message.content}
                    />
                  )}

                  {/* Streaming cursor */}
                  {isStreaming && (
                    <span className="ml-1 inline-block h-4 w-1 animate-pulse rounded-sm bg-slate-400 align-middle" />
                  )}

                </div>
              </div>

              {/* User Avatar */}
              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white">
                  <User size={18} />
                </div>
              )}

            </div>
          );
        })}

        {/* AI thinking indicator */}
        {messageLoading &&
          messages[messages.length - 1]
            ?.role === "user" && (
          <div className="mb-8 flex gap-4">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950">
              <Bot size={19} />
            </div>

            <div className="flex items-center gap-1 pt-2">

              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />

              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />

              <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500" />

            </div>

          </div>
        )}

        {/* Scroll target */}
        <div ref={bottomRef} />

      </div>

    </div>
  );
};

export default MessageList;