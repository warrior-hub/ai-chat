import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

import { useChat } from "../../context/ChatContext";

const MessageInput = () => {
  const [content, setContent] = useState("");

  const textareaRef = useRef(null);

  const {
    messageLoading,
    sendMessage,
  } = useChat();

  /*
    Send message
  */
  const handleSubmit = async (e) => {
    e?.preventDefault();

    const message = content.trim();

    if (!message) {
      return;
    }

    if (messageLoading) {
      return;
    }

    /*
      Clear input immediately
    */
    setContent("");

    /*
      Reset textarea height
    */
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await sendMessage(message);
    } catch (error) {
      console.error(
        "Message send error:",
        error
      );
    }
  };

  /*
    Handle keyboard
  */
  const handleKeyDown = (e) => {
    /*
      Enter = Send

      Shift + Enter = New line
    */
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSubmit();
    }
  };

  /*
    Auto resize textarea
  */
  const handleChange = (e) => {
    const value = e.target.value;

    setContent(value);

    const textarea =
      textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      200
    )}px`;
  };

  /*
    Send button disabled state
  */
  const disabled =
    messageLoading ||
    !content.trim();

  return (
    <div className="border-t border-slate-800 bg-slate-950 p-4">

      <div className="mx-auto w-full max-w-4xl">

        <form
          onSubmit={handleSubmit}
          className="relative flex items-end rounded-2xl border border-slate-700 bg-slate-900 shadow-lg transition focus-within:border-slate-500"
        >

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={messageLoading}
            rows={1}
            maxLength={10000}
            placeholder="Message AI..."
            className="max-h-[200px] min-h-[52px] flex-1 resize-none overflow-y-auto bg-transparent px-4 py-4 pr-14 text-sm leading-6 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={disabled}
            className="absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            title="Send message"
          >
            <ArrowUp
              size={19}
              strokeWidth={2.5}
            />
          </button>

        </form>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between px-2">

          <p className="text-[11px] text-slate-600">
            Enter to send · Shift + Enter for new line
          </p>

          <p className="text-[11px] text-slate-600">
            {content.length}/10000
          </p>

        </div>

      </div>

    </div>
  );
};

export default MessageInput;