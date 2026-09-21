
import { useEffect, useState } from "react";
import { Menu, X, MoreHorizontal } from "lucide-react";

import Sidebar from "../components/sidebar/Sidebar";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";

import { useChat } from "../context/ChatContext";

const Chat = () => {
  const { activeConversation } = useChat();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================
  // Close sidebar with Escape
  // =========================
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =========================
  // Prevent body scroll
  // when mobile sidebar is open
  // =========================
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-slate-950 text-white">

      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}
      <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950 md:block">
        <Sidebar />
      </aside>


      {/* =====================================================
          MOBILE SIDEBAR
      ====================================================== */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
          />

          {/* Mobile Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-[min(86vw,320px)] border-r border-slate-800 bg-slate-950 shadow-2xl shadow-black/50 md:hidden">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <X size={19} />
            </button>

            {/* Existing Sidebar */}
            <Sidebar
              onClose={() => setSidebarOpen(false)}
            />

          </aside>
        </>
      )}


      {/* =====================================================
          MAIN CHAT AREA
      ====================================================== */}
      <main className="flex min-w-0 flex-1 flex-col bg-slate-950">

        {/* ===================================================
            CHAT HEADER
        ==================================================== */}
        <header className="flex h-14 shrink-0 items-center border-b border-slate-800/80 bg-slate-950/95 px-3 backdrop-blur sm:h-16 sm:px-5">

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95 md:hidden"
          >
            <Menu size={21} />
          </button>


          {/* Conversation Info */}
          <div className="min-w-0 flex-1">

            <h1 className="truncate text-sm font-semibold text-slate-200 sm:text-base">
              {activeConversation?.title || "New Chat"}
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              AI Assistant
            </p>

          </div>


          {/* Right Side */}
          <div className="ml-3 flex shrink-0 items-center gap-1.5">

            {/* Online Status */}
            <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 sm:flex">

              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-xs text-slate-400">
                Online
              </span>

            </div>


            {/* More Options */}
            <button
              type="button"
              aria-label="More options"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <MoreHorizontal size={20} />
            </button>

          </div>

        </header>


        {/* ===================================================
            MESSAGE LIST
        ==================================================== */}
      <section className="min-h-0 flex-1 overflow-y-auto">
  <MessageList />
</section>


        {/* ===================================================
            MESSAGE INPUT
        ==================================================== */}
        <footer className="shrink-0 border-t border-slate-800/60 bg-slate-950">
          <MessageInput />
        </footer>

      </main>

    </div>
  );
};

export default Chat;


