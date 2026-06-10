import { Box, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import StopCircleIcon from "@mui/icons-material/StopCircle";
// import SendIcon from "@mui/icons-material/Send";
// import { useState } from "react";

function ChatInput({ isLoading, setModalOpen, onStop }: any) {
  // const [newMessage, setNewMessage] = useState("");

  const handleModalOpen = () => setModalOpen(true);

  // const handleSend = () => {
  //   if (!newMessage.trim() || isLoading) return;
  //   submitNewMessage(undefined, newMessage.trim());
  //   setNewMessage("");
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === "Enter" && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSend();
  //   }
  // };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent:'center',
        gap: 1,
        backgroundColor: "#1e1e1e",
        borderRadius: "25px",
        p: "6px 12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      }}
    >
      <IconButton
        onClick={isLoading ? onStop : handleModalOpen}
        sx={{
          color: !isLoading ? "#33d338ff" : "#f44336",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        {!isLoading ? <AddCircleIcon /> : <StopCircleIcon />}
      </IconButton>

      {/* <InputBase
        placeholder="Type a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          flexGrow: 1,
          color: "#fff",
          fontSize: "1rem",
          lineHeight: 1.5,
          px: 1,
        }}
        multiline
        maxRows={4}
      /> */}

      {/* <IconButton
        onClick={handleSend}
        disabled={isLoading || !newMessage.trim()}
        sx={{
          color: "#1976d2",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
        }}
      >
        <SendIcon />
      </IconButton> */}
    </Box>
  );
}

export default ChatInput;
