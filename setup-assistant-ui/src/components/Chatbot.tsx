import { useRef, useState } from "react";
import { useImmer } from "use-immer";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import FileInput from "./FileInput";
import { Box } from "@mui/material";

type Message = {
  role: string;
  loading?: boolean;
  content: any;
  error?: any;
  contentType?: string;
};

function Chatbot() {
  const [messages, setMessages] = useImmer<Message[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function submitNewMessage(url?: string, message?: any) {
    if (!message && !url) return;

    setMessages((draft) => {
      draft.push({
        role: "user",
        content: message || url,
        contentType: url ? "url" : "text",
        loading: true,
      });
    });
    setIsLoading(true);

    const params = { fileUrl: url };
    const queryString = new URLSearchParams(params as any).toString();
    const evtSource = new EventSource(
      `http://localhost:8000/run?${queryString}`
    );

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === "initial" || data.event==="command") {
          setMessages((draft) => {
            draft.push({
              role: "assistant",
              content: data.message,
              contentType: "markdown",
              loading: true,
            });
          });
        } 

        if (data.event === "done") {
          setIsLoading(false);
          setMessages((draft) => {
            const lastMsg = draft[draft.length - 1];
            if (lastMsg?.role === "assistant" && lastMsg.loading) {
              lastMsg.loading = false;
            }
            draft.push({
              role: "assistant",
              content: data.message,
              contentType: "markdown",
              loading: false,
            });
          });
          evtSource.close();
        }
      } catch (err) {
        console.error("Failed to parse SSE event:", err);
      }
    };

    evtSource.onerror = (err) => {
      console.error("SSE error", err);
      setIsLoading(false);
      evtSource.close();
    };
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      console.log("API call stopped.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "inherit",
        width: "100%",
        backgroundColor: "#121212",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Box
        sx={{
          p: 3,
          fontSize: "1.5rem",
          fontWeight: 600,
          textAlign: "center",
          borderBottom: "1px solid #333",
          backgroundColor: "#1e1e1e",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        Setup Assistant
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          p: 2,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            backgroundColor: "#1a1a1a",
            borderRadius: 2,
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)",
            mb: 2,
          }}
        >
          <ChatMessages messages={messages} isLoading={isLoading} />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: "#1e1e1e",
            borderRadius: 2,
            p: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        >
          <ChatInput
            isLoading={isLoading}
            setModalOpen={setModalOpen}
            onStop={handleStop}
          />
          <FileInput
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            submitNewMessage={submitNewMessage}
            setIsLoading={setIsLoading}
            setMessages={setMessages}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Chatbot;
