import React from "react";

import ReactMarkdown from "react-markdown";

interface Props {
    content: string;
}

export const MarkdownDisplay = ({ content }: Props) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
};
