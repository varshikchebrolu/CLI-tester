import {
  Box,
  Avatar,
  Typography,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { AssistantContent } from "./AssistantContent";

function ChatMessages({ messages, isLoading }: any) {
  const userContent = (content: string, contentType: string) => {
    if (contentType === "url") {
      return (
        <Box
          sx={{
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            display: "inline-block",
           
          }}
        >
          <Link
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              color: "#000000ff",
              fontWeight: 500,
              wordBreak: "break-all",
            }}
          >
            {content}
          </Link>
        </Box>
      );
    }

    if (contentType === "file") {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
           
            borderRadius: 1.5,
            px: 1.5,
            py: 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
            maxWidth: "100%",
            wordBreak: "break-all",
          }}
        >
          <InsertDriveFileIcon sx={{ color: "#90caf9" }} fontSize="small" />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#010000ff",
            }}
          >
            {content}
          </Typography>
        </Box>
      );
    }

    return (
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-wrap", color: "#e3f2fd" }}
      >
        {content}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,

      }}
    >
      {messages?.length <= 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#4fc3f7",
            fontSize: "0.95rem",
            lineHeight: 1.5,
            px: 4,
            opacity: 0.8,
          }}
        >
          Hi, I am your setup assistant. Click the ➕ icon to upload a setup
          document or type your message to get started.
        </Box>
      )}

      {messages?.map(
        ({ role, content, loading, error, contentType }: any, idx: number) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              flexDirection: role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                bgcolor: role === "assistant" ? "#2196f3" : "#616161",
                width: 32,
                height: 32,
                boxShadow: "0 0 8px rgba(0,0,0,0.4)",
              }}
            >
              {role === "assistant" ? (
                <SmartToyIcon fontSize="small" />
              ) : (
                <PersonIcon fontSize="small" />
              )}
            </Avatar>

            <Paper
              elevation={3}
              sx={{
                maxWidth: "75%",
                p: 1.5,
                px: 2,
                background:
                  role === "user"
                    ? "linear-gradient(135deg, #0078ff 0%, #00b4d8 100%)"
                    : "linear-gradient(135deg, #2c2c2c 0%, #1e1e1e 100%)",
                color: role === "user" ? "#ffffff" : "#e0e0e0",
                borderRadius:
                  role === "user"
                    ? "16px 16px 0px 16px"
                    : "16px 16px 16px 0px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                boxShadow: "0 3px 6px rgba(0,0,0,0.4)",
              }}
            >
              {loading && !content ? (
                <CircularProgress size={18} color="inherit" />
              ) : error ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#f44336",
                  }}
                >
                  <ErrorOutlineIcon fontSize="small" />
                  <Typography variant="body2">
                    Error generating response
                  </Typography>
                </Box>
              ) : role === "assistant" ? (
                <AssistantContent
                  content={content}
                  contentType={contentType}
                />
              ) : (
                userContent(content, contentType)
              )}
            </Paper>
          </Box>
        )
      )}

      {isLoading && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <CircularProgress size={16} sx={{ color: "#64b5f6" }} />
          <Typography variant="body2" sx={{ color: "#bbdefb" }}>
            Assistant is thinking...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ChatMessages;
