
import { useEffect, useState } from "react";
import {
  MessageSquarePlus,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();

  const {
    conversations,
    activeConversation,
    loading,
    loadConversations,
    createNewConversation,
    openConversation,
    renameChat,
    removeConversation,
  } = useChat();

  const [menuId, setMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // =========================
  // Load Conversations
  // =========================
  useEffect(() => {
    loadConversations();
  }, []);

  // =========================
  // New Chat
  // =========================
  const handleNewChat = async () => {
    try {
      setMenuId(null);
      setEditingId(null);

      await createNewConversation();

      // Mobile sidebar close
      onClose?.();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Open Chat
  // =========================
  const handleOpenChat = async (id) => {
    try {
      await openConversation(id);

      setMenuId(null);

      // Mobile sidebar close
      onClose?.();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Start Rename
  // =========================
  const startRename = (conversation) => {
    setEditingId(conversation._id);
    setEditTitle(conversation.title || "");
    setMenuId(null);
  };

  // =========================
  // Cancel Rename
  // =========================
  const cancelRename = () => {
    setEditingId(null);
    setEditTitle("");
  };

  // =========================
  // Rename Chat
  // =========================
  const handleRename = async (id) => {
    const title = editTitle.trim();

    if (!title) return;

    try {
      await renameChat(id, title);

      cancelRename();
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Delete Chat
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmed) return;

    try {
      await removeConversation(id);

      setMenuId(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-slate-950 text-white">

      {/* =====================================================
          SIDEBAR HEADER
      ====================================================== */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">

        {/* Logo + Name */}
        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950 shadow-sm">
            <MessageSquare
              size={18}
              strokeWidth={2.2}
            />
          </div>

          <div className="min-w-0">

            <h1 className="truncate text-sm font-semibold">
              AI Chat
            </h1>

            <p className="text-[11px] text-slate-500">
              AI Assistant
            </p>

          </div>

        </div>


        {/* New Chat Icon */}
        <button
          type="button"
          onClick={handleNewChat}
          title="New chat"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-white active:scale-95"
        >
          
        </button>

      </div>


      {/* =====================================================
          NEW CHAT BUTTON
      ====================================================== */}
      <div className="shrink-0 p-3">

        <button
          type="button"
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white active:scale-[0.99]"
        >
          <MessageSquarePlus size={17} />
          New Chat
        </button>

      </div>


      {/* =====================================================
          CONVERSATIONS
      ====================================================== */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">

        {/* Section Title */}
        <div className="flex items-center justify-between px-3 py-2">

          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Conversations
          </p>

          {conversations.length > 0 && (
            <span className="text-[11px] text-slate-600">
              {conversations.length}
            </span>
          )}

        </div>


        {/* ===================================================
            LOADING
        ==================================================== */}
        {loading ? (

          <div className="space-y-2 px-1">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-11 animate-pulse rounded-xl bg-slate-900"
              />
            ))}

          </div>

        ) : conversations.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================== */
          <div className="px-4 py-12 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900">

              <MessageSquare
                size={21}
                className="text-slate-600"
              />

            </div>

            <p className="text-sm font-medium text-slate-400">
              No conversations
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Start a new chat to begin
            </p>

          </div>

        ) : (

          /* =================================================
             CONVERSATION LIST
          ================================================== */
          <div className="space-y-1">

            {conversations.map((conversation) => {

              const isActive =
                activeConversation?._id === conversation._id;

              const isEditing =
                editingId === conversation._id;

              return (
                <div
                  key={conversation._id}
                  className={`group relative rounded-xl transition ${
                    isActive
                      ? "bg-slate-800"
                      : "hover:bg-slate-900"
                  }`}
                >

                  {/* =========================================
                      RENAME MODE
                  ========================================== */}
                  {isEditing ? (

                    <div className="flex items-center gap-1 p-1.5">

                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) =>
                          setEditTitle(e.target.value)
                        }
                        onKeyDown={(e) => {

                          if (e.key === "Enter") {
                            handleRename(
                              conversation._id
                            );
                          }

                          if (e.key === "Escape") {
                            cancelRename();
                          }

                        }}
                        className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
                      />


                      {/* Save */}
                      <button
                        type="button"
                        onClick={() =>
                          handleRename(
                            conversation._id
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-white"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>


                      {/* Cancel */}
                      <button
                        type="button"
                        onClick={cancelRename}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-white"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>

                    </div>

                  ) : (

                    /* =========================================
                       NORMAL CONVERSATION
                    ========================================== */
                    <div className="flex items-center">

                      {/* Conversation Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenChat(
                            conversation._id
                          )
                        }
                        className="min-w-0 flex-1 px-3 py-3 text-left"
                      >

                        <div className="flex min-w-0 items-center gap-2.5">

                          <MessageSquare
                            size={15}
                            className={`shrink-0 ${
                              isActive
                                ? "text-slate-300"
                                : "text-slate-600"
                            }`}
                          />

                          <span
                            className={`truncate text-sm ${
                              isActive
                                ? "font-medium text-white"
                                : "text-slate-400"
                            }`}
                          >
                            {conversation.title ||
                              "New Chat"}
                          </span>

                        </div>

                      </button>


                      {/* More Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setMenuId(
                            menuId ===
                              conversation._id
                              ? null
                              : conversation._id
                          );
                        }}
                        className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 opacity-0 transition hover:bg-slate-700 hover:text-white group-hover:opacity-100 focus:opacity-100"
                        title="Options"
                      >
                        <MoreHorizontal size={17} />
                      </button>


                      {/* =====================================
                          CONTEXT MENU
                      ====================================== */}
                      {menuId === conversation._id && (

                        <div className="absolute right-2 top-11 z-50 w-36 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-1 shadow-2xl shadow-black/40">

                          {/* Rename */}
                          <button
                            type="button"
                            onClick={() =>
                              startRename(
                                conversation
                              )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                          >
                            <Pencil size={14} />
                            Rename
                          </button>


                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                conversation._id
                              )
                            }
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-400 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>

                        </div>

                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>


      {/* =====================================================
          USER PROFILE
      ====================================================== */}
      <div className="shrink-0 border-t border-slate-800 p-3">

        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">

          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-slate-950">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>


          {/* User Info */}
          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-medium text-slate-200">
              {user?.name || "User"}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.email || ""}
            </p>

          </div>


          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            title="Logout"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
          >
            <LogOut size={16} />
          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;
