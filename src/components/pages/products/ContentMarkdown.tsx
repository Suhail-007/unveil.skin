import ReactMarkdown from "react-markdown";
import { Box, Heading, Text } from "@chakra-ui/react";

interface ContentMarkdownProps {
  content: string;
}

export default function ContentMarkdown({ content }: ContentMarkdownProps) {
  return (
    <Box
      mt={12}
      p={6}
      borderRadius="xl"
      bg="gray.900"
      _dark={{ bg: "gray.900" }}
      className="prose prose-sm md:prose-base prose-invert max-w-none"
    >
      <ReactMarkdown
        components={{
          h1: (props) => <Heading as="h1" size="xl" mb={4} color="white" {...props} />,
          h2: (props) => <Heading as="h2" size="lg" mb={3} mt={6} color="white" {...props} />,
          h3: (props) => <Heading as="h3" size="md" mb={2} mt={4} color="white" {...props} />,
          p: (props) => <Text mb={3} lineHeight="tall" color="gray.300" {...props} />,
          ul: (props) => <ul style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem", color: "#D1D5DB" }} {...props} />,
          ol: (props) => <ol style={{ paddingLeft: "1.5rem", marginBottom: "0.75rem", color: "#D1D5DB" }} {...props} />,
          li: (props) => <li style={{ marginBottom: "0.25rem" }} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
}
