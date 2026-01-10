"use client";

import ContentMarkdown from "./ContentMarkdown";
import { useFeatureFlags } from "@/lib/features/FeatureFlagsContext";

interface ContentMarkdownWrapperProps {
  content?: string;
}

export default function ContentMarkdownWrapper({ content }: ContentMarkdownWrapperProps) {
  const { flags } = useFeatureFlags();

  if (!flags.showContentMarkdown || !content) {
    return null;
  }

  return <ContentMarkdown content={content} />;
}
