import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  SupportAgent as AgentIcon,
  Refresh as RefreshIcon,
  HeadsetMic as TakeoverIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchAdminConversations,
  fetchChatMessages,
  sendAdminReply,
  updateConversationStatus,
} from "../../services/chat/chatApi";

export default function ChatSupport() {
  const { user } = useSelector((state) => state.auth || {});

  // Restrict access for shipping-manager
  if (user?.role === "shipping-manager") {
    return <Navigate to="/dashboard" replace />;
  }

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const messagesContainerRef = useRef(null);

  const loadConversations = async () => {
    try {
      const data = await fetchAdminConversations();
      if (data.success) {
        setConversations(data.conversations || []);
        // Auto select first conversation if none selected
        if (!selectedConv && data.conversations && data.conversations.length > 0) {
          handleSelectConversation(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = async (conv) => {
    setSelectedConv(conv);
    setLoadingMsgs(true);
    try {
      const data = await fetchChatMessages(conv._id);
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      toast.error("Failed to load conversation messages");
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    loadConversations();
    // Poll every 5 seconds for live update
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedConv || !replyText.trim()) return;

    const agentName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Support Agent";
    const res = await sendAdminReply(selectedConv._id, replyText.trim(), agentName);

    if (res.success) {
      setMessages(res.messages || []);
      setSelectedConv(res.conversation);
      setReplyText("");
      toast.success("Reply sent to customer");
      loadConversations();
    } else {
      toast.error(res.message || "Failed to send reply");
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedConv) return;
    const res = await updateConversationStatus(selectedConv._id, newStatus);
    if (res.success) {
      setSelectedConv(res.conversation);
      toast.info(`Chat status set to ${newStatus}`);
      loadConversations();
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Header matching other admin pages */}
      <Box mb={3} sx={{ width: "100%" }}>
        <Typography variant="h4" fontWeight={700} mb={1}>
          Live Customer Chat Support
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ width: "100%", minHeight: 40 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ m: 0, lineHeight: 1.5 }}>
            Manage live user conversations, answer queries, or let the AI bot respond.
          </Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={loadConversations}
            variant="outlined"
            size="small"
            sx={{
              ml: "auto",
              height: 36,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-lg, 8px)",
              textTransform: "none",
              borderColor: "var(--color-border, #e2e8f0)",
              color: "text.primary",
              bgcolor: "#ffffff",
              whiteSpace: "nowrap",
              "&:hover": {
                borderColor: "var(--color-primary, #1b7a42)",
                bgcolor: "var(--color-primary-bg, #f3f8f3)",
              },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Box>

      {/* Main Workspace Grid */}
      <Paper
        elevation={0}
        sx={{
          height: "calc(100vh - 210px)",
          minHeight: "560px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: "var(--radius-lg, 12px)",
          overflow: "hidden",
          border: "1px solid var(--color-border, #e2e8f0)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* LEFT COLUMN: CONVERSATIONS LIST */}
        <Box
          sx={{
            width: { xs: "100%", sm: "320px", md: "360px" },
            borderRight: { xs: "none", md: "1px solid var(--color-border, #e2e8f0)" },
            borderBottom: { xs: "1px solid var(--color-border, #e2e8f0)", md: "none" },
            display: "flex",
            flexDirection: "column",
            bgcolor: "#ffffff",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid var(--color-border, #e2e8f0)",
            }}
          >
            <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
              CUSTOMER CHATS ({conversations.length})
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ p: 4 }}>
                <CircularProgress size={30} sx={{ color: "var(--color-primary, #1b7a42)" }} />
              </Stack>
            ) : conversations.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  No chat conversations found.
                </Typography>
              </Box>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedConv?._id === conv._id;
                return (
                  <Box
                    key={conv._id}
                    onClick={() => handleSelectConversation(conv)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      borderBottom: "1px solid var(--color-border, #f1f5f9)",
                      bgcolor: isSelected ? "var(--color-primary-subtle, #e8f5e9)" : "transparent",
                      "&:hover": {
                        bgcolor: isSelected ? "var(--color-primary-subtle, #e8f5e9)" : "#f8fafc",
                      },
                      transition: "background 0.2s",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "var(--color-primary, #1b7a42)",
                            width: 36,
                            height: 36,
                            fontSize: "14px",
                            fontWeight: 600,
                          }}
                        >
                          {conv.userName ? conv.userName[0].toUpperCase() : "G"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={isSelected ? 700 : 600}>
                            {conv.userName || "Guest User"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {conv.lastMessage || "No messages"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={conv.status === "active_agent" ? "Agent" : conv.status}
                        size="small"
                        sx={{
                          fontSize: "10px",
                          height: "20px",
                          fontWeight: 600,
                          bgcolor: conv.status === "active_agent" ? "#e0f2fe" : "#f1f5f9",
                          color: conv.status === "active_agent" ? "#0284c7" : "text.secondary",
                        }}
                      />
                    </Stack>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>

        {/* RIGHT COLUMN: ACTIVE CHAT CONVERSATION */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#ffffff" }}>
          {selectedConv ? (
            <>
              {/* Active Conversation Top Bar */}
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#ffffff",
                  borderBottom: "1px solid var(--color-border, #e2e8f0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "#5B46F6" }}>
                    <UserIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {selectedConv.userName || "Guest Visitor"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Session: {selectedConv.sessionId}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: "auto" }}>
                  <Chip
                    icon={selectedConv.status === "active_agent" ? <AgentIcon sx={{ fontSize: 16 }} /> : <BotIcon sx={{ fontSize: 16 }} />}
                    label={selectedConv.status === "active_agent" ? "Live Agent Mode" : "Bot Automated Mode"}
                    variant="outlined"
                    sx={{
                      borderColor: selectedConv.status === "active_agent" ? "var(--color-primary, #1b7a42)" : "#5B46F6",
                      color: selectedConv.status === "active_agent" ? "var(--color-primary, #1b7a42)" : "#5B46F6",
                      fontWeight: 600,
                      fontSize: "12px",
                    }}
                  />

                  {selectedConv.status === "bot" ? (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<TakeoverIcon />}
                      onClick={() => handleStatusChange("active_agent")}
                      sx={{
                        borderRadius: "var(--radius-lg, 8px)",
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "var(--color-primary, #1b7a42)",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "var(--color-primary-dark, #06492D)",
                          boxShadow: "none",
                        },
                      }}
                    >
                      Takeover Chat
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<BotIcon />}
                      onClick={() => handleStatusChange("bot")}
                      sx={{
                        borderRadius: "var(--radius-lg, 8px)",
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#5B46F6",
                        color: "#5B46F6",
                        "&:hover": {
                          borderColor: "#4c38d6",
                          bgcolor: "#f5f3ff",
                        },
                      }}
                    >
                      Switch to Bot
                    </Button>
                  )}
                </Stack>
              </Box>

              {/* Message Thread */}
              <Box ref={messagesContainerRef} sx={{ flex: 1, overflowY: "auto", p: 3, bgcolor: "#f8fafc" }}>
                {loadingMsgs ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress size={30} sx={{ color: "var(--color-primary, #1b7a42)" }} />
                  </Stack>
                ) : (
                  messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    const isAgent = msg.sender === "agent";
                    return (
                      <Box
                        key={msg._id}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isUser ? "flex-end" : "flex-start",
                          mb: 2,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, px: 1 }}>
                          {isUser ? selectedConv.userName : isAgent ? `Agent (${msg.senderName || "Support"})` : "AI Bot"}
                        </Typography>

                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            px: 2,
                            maxWidth: "75%",
                            borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                            bgcolor: isUser ? "#5B46F6" : isAgent ? "var(--color-primary, #1b7a42)" : "#ffffff",
                            color: isUser || isAgent ? "#ffffff" : "#1F2937",
                            border: isUser || isAgent ? "none" : "1px solid var(--color-border, #e2e8f0)",
                            boxShadow: isUser || isAgent ? "0 2px 6px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
                          }}
                        >
                          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                            {msg.text}
                          </Typography>
                        </Paper>
                      </Box>
                    );
                  })
                )}
              </Box>

              {/* Reply Input Bar */}
              <Box
                component="form"
                onSubmit={handleSendReply}
                sx={{
                  p: 2,
                  bgcolor: "#ffffff",
                  borderTop: "1px solid var(--color-border, #e2e8f0)",
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your support reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "var(--radius-lg, 8px)",
                        bgcolor: "#f8fafc",
                        "& fieldset": {
                          borderColor: "var(--color-border, #e2e8f0)",
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--color-primary, #1b7a42)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--color-primary, #1b7a42)",
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!replyText.trim()}
                    endIcon={<SendIcon />}
                    sx={{
                      borderRadius: "var(--radius-lg, 8px)",
                      px: 3,
                      textTransform: "none",
                      fontWeight: 600,
                      bgcolor: "var(--color-primary, #1b7a42)",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "var(--color-primary-dark, #06492D)",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Send
                  </Button>
                </Stack>
              </Box>
            </>
          ) : (
            <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
              <Typography variant="body1" color="text.secondary">
                Select a conversation from the left panel to start chatting.
              </Typography>
            </Stack>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
