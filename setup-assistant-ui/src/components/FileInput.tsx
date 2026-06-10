import {
  Box,
  Button,
  Modal,
  OutlinedInput,
  styled,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  width: 1,
  overflow: "hidden",
  position: "absolute",
  whiteSpace: "nowrap",
});

export default function FileInput(props: any) {
  const {
    modalOpen,
    setModalOpen,
    submitNewMessage,
    setIsLoading,
    setMessages,
  } = props;

  const [tabValue, setTabValue] = useState(0);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleTabValueChange = (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    setTabValue(newValue);
  };

  const handleUrlSubmit = () => {
    if (!url.trim()) return;
    submitNewMessage(url);
    setUrl("");
    setModalOpen(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setMessages((draft: any) => {
      draft.push({
        role: "user",
        content: file?.name,
        contentType: "file",
      });
    });

    setModalOpen(false);
    setIsLoading(true);
    const response = await axios.post(
      "http://localhost:8000/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response?.data.filename;
  };

  const streamFileProcessing = (filename: string) => {
    const evtSource = new EventSource(
      `http://localhost:8000/upload_stream?filename=${filename}`
    );

    evtSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.event === "initial" || data.event === "command") {
        setMessages((draft: any) => {
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
        setMessages((draft: any) => {
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
    };

    evtSource.onerror = (err) => {
      console.error("SSE error", err);
      evtSource.close();
    };

    setFile(null);
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const filename = await uploadFile(file);
    streamFileProcessing(filename);
  };

  const handleUploadClick = () => {
    if (tabValue === 0) handleUrlSubmit();
    else if (tabValue === 1) handleFileUpload();
  };

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: 700 },
          bgcolor: "#1e1e1e",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          color: "#e0e0e0",
        }}
      >
        <Typography variant="h6" fontWeight={600} color="#fff">
          File Input
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabValueChange}
          aria-label="file input tabs"
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: "#333",
            "& .MuiTabs-indicator": { backgroundColor: "#4fc3f7" },
            "& .MuiTab-root": { color: "#90caf9", textTransform: "none" },
            "& .Mui-selected": { color: "#fff" },
          }}
        >
          <Tab label="Drive URL" />
          <Tab label="File Upload" />
        </Tabs>

        {tabValue === 0 && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" color="#b0b0b0">
              Enter the file’s public Drive URL:
            </Typography>
            <OutlinedInput
              placeholder="https://drive.google.com/..."
              fullWidth
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={{
                backgroundColor: "#2a2a2a",
                color: "#fff",
                borderRadius: 2,
                px: 1,
              }}
            />
          </Box>
        )}

        {tabValue === 1 && (
          <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="body2" color="#b0b0b0">
              Upload a local file:
            </Typography>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: "#4fc3f7",
                color: "#000",
                "&:hover": { backgroundColor: "#29b6f6" },
              }}
            >
              {file ? `Selected: ${file.name}` : "Choose File"}
              <VisuallyHiddenInput type="file" onChange={handleFileSelect} />
            </Button>
          </Box>
        )}

        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
          <Button
            variant="contained"
            onClick={handleUploadClick}
            disabled={tabValue === 0 ? !url : !file}
            sx={{
              backgroundColor: "#4fc3f7",
              "&:hover": { backgroundColor: "#29b6f6" },
            }}
          >
            {tabValue === 0 ? "Submit" : "Upload"}
          </Button>
          <Button
            onClick={() => setModalOpen(false)}
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "#555",
              "&:hover": { borderColor: "#4fc3f7" },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
