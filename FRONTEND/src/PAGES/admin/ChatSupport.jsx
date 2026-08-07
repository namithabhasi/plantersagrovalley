import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  SupportAgent as AgentIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  HeadsetMic as TakeoverIcon
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  fetchAdminConversations,
  fetchChatMessages,
  sendAdminReply,
  updateConversationStatus
} from "../../services/chat/chatApi";

export default function ChatSupport() {
  const { user } = useSelector((state) => state.auth || {});

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const messagesEndRef = useRef(null);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <Box sx={{ p: { xs: 2, md: 3 }, height: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#06492D" }}>
            💬 Live Customer Chat Support
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage live user conversations, answer queries, or let the AI bot respond.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshIcon />}
          onClick={loadConversations}
          variant="outlined"
          sx={{ borderRadius: "20px", textTransform: "none" }}
        >
          Refresh
        </Button>
      </Stack>

      {/* Main Workspace Grid */}
      <Paper
        elevation={2}
        sx={{
          flex: 1,
          display: "flex",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e0e0e0"
        }}
      >
        {/* LEFT COLUMN: CONVERSATIONS LIST */}
        <Box
          sx={{
            width: { xs: "100%", sm: "320px", md: "360px" },
            borderRight: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fafafa"
          }}
        >
          <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}>
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">
              CUSTOMER CHATS ({conversations.length})
            </Typography>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ p: 4 }}>
                <CircularProgress size={30} />
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
                      borderBottom: "1px solid #f0f0f0",
                      bgcolor: isSelected ? "#e8f5e9" : "transparent",
                      "&:hover": { bgcolor: isSelected ? "#e8f5e9" : "#f0f7f4" },
                      transition: "background 0.2s"
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: "#1b7a42", width: 36, height: 36, fontSize: "14px" }}>
                          {conv.userName ? conv.userName[0].toUpperCase() : "G"}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {conv.userName || "Guest User"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {conv.lastMessage || "No messages"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Chip
                        label={conv.status === "active_agent" ? "Agent" : conv.status}
                        size="small"
                        color={conv.status === "active_agent" ? "primary" : "default"}
                        sx={{ fontSize: "10px", height: "20px" }}
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
                  borderBottom: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
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
                    icon={selectedConv.status === "active_agent" ? <AgentIcon /> : <BotIcon />}
                    label={selectedConv.status === "active_agent" ? "Live Agent Mode" : "Bot Automated Mode"}
                    color={selectedConv.status === "active_agent" ? "success" : "secondary"}
                    variant="outlined"
                  />

                  {selectedConv.status === "bot" ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<TakeoverIcon />}
                      onClick={() => handleStatusChange("active_agent")}
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                      Takeover Chat
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<BotIcon />}
                      onClick={() => handleStatusChange("bot")}
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                      Switch to Bot
                    </Button>
                  )}
                </Stack>
              </Box>

              {/* Message Thread */}
              <Box sx={{ flex: 1, overflowY: "auto", p: 3, bgcolor: "#fafafa" }}>
                {loadingMsgs ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                    <CircularProgress size={30} />
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
                          mb: 2
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, px: 1 }}>
                          {isUser ? selectedConv.userName : isAgent ? `Agent (${msg.senderName || "Support"})` : "AI Bot"}
                        </Typography>

                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            px: 2,
                            maxWidth: "75%",
                            borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                            bgcolor: isUser ? "#5B46F6" : isAgent ? "#1b7a42" : "#ffffff",
                            color: isUser || isAgent ? "#ffffff" : "#2c3e50",
                            border: isUser || isAgent ? "none" : "1px solid #e0e0e0"
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
                <div ref={messagesEndRef} />
              </Box>

              {/* Reply Input Bar */}
              <Box component="form" onSubmit={handleSendReply} sx={{ p: 2, bgcolor: "#ffffff", borderTop: "1px solid #e0e0e0" }}>
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your support reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "25px" } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!replyText.trim()}
                    endIcon={<SendIcon />}
                    sx={{
                      borderRadius: "25px",
                      px: 3,
                      bgcolor: "#1b7a42",
                      "&:hover": { bgcolor: "#06492D" }
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
