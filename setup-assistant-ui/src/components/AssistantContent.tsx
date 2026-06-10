import DOMPurify from "dompurify";
import { Box, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import TypewriterText from "./Typewriter";

interface AssistantContentProps {
  content: string;
  contentType?: "html" | "markdown" | "text";
  typingSpeed?: number;
}

export const AssistantContent = ({
  content,
  contentType = "markdown",
  typingSpeed = 10,
}: AssistantContentProps) => {
  const sanitizedHTML = DOMPurify.sanitize(content);

  const commonStyles = {
    color: "#e8eaed",
    fontSize: "0.95rem",
    lineHeight: 1.6,
    "& p": {
      color: "#e8eaed",
      marginBottom: "0.6rem",
    },
    "& ul, & ol": {
      pl: 3,
      mb: 1.2,
      color: "#d6d8da",
    },
    "& li": {
      mb: 0.5,
    },
    "& code": {
      backgroundColor: "rgba(255,255,255,0.08)",
      color: "#80cbc4",
      borderRadius: "6px",
      px: "6px",
      py: "3px",
      fontFamily: "monospace",
      fontSize: "0.85rem",
      wordBreak: "break-all",
    },
    "& pre": {
      background:
        "linear-gradient(145deg, rgba(30,30,30,1) 0%, rgba(25,25,25,1) 100%)",
      color: "#f8f8f2",
      p: 1.5,
      borderRadius: "10px",
      overflowX: "auto",
      fontFamily: "monospace",
      fontSize: "0.9rem",
      boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      "& code": {
        color: "#c3e88d",
        background: "transparent",
        px: 0,
      },
    },
    "& a": {
      color: "#4fc3f7",
      textDecoration: "underline",
      wordBreak: "break-all",
      transition: "color 0.2s ease",
      "&:hover": {
        color: "#82e9de",
      },
    },
    "& blockquote": {
      borderLeft: "4px solid #4fc3f7",
      pl: 2,
      py: 1,
      my: 1.2,
      background:
        "linear-gradient(90deg, rgba(79,195,247,0.1) 0%, rgba(0,0,0,0.1) 100%)",
      color: "#cfd8dc",
      fontStyle: "italic",
      borderRadius: "4px",
    },
    "& table": {
      borderCollapse: "collapse",
      width: "100%",
      my: 1,
      "& th, & td": {
        border: "1px solid rgba(255,255,255,0.1)",
        p: "6px 10px",
        textAlign: "left",
      },
      "& th": {
        backgroundColor: "rgba(255,255,255,0.08)",
        color: "#ffffff",
      },
      "& td": {
        color: "#e0e0e0",
      },
    },
  };

  if (contentType === "html") {
    return (
      <Box sx={commonStyles}>
        <TypewriterText text={sanitizedHTML} speed={typingSpeed} />
      </Box>
    );
  }

  if (contentType === "markdown") {
    return (
      <Box sx={commonStyles}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {sanitizedHTML}
        </ReactMarkdown>
      </Box>
    );
  }

  return (
    <Typography
      variant="body2"
      sx={{ whiteSpace: "pre-wrap", color: "#e8eaed", fontSize: "0.95rem" }}
    >
      <TypewriterText text={content} speed={typingSpeed} />
    </Typography>
  );
};
