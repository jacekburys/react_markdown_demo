import React from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { metaBoldItalicPlugin, metaDiffsPlugin } from "../plugins";

interface Props {
    content: string;
}

export const MarkdownDisplay = ({ content }: Props) => {
    return (
        <ReactMarkdown
            remarkPlugins={[metaDiffsPlugin, metaBoldItalicPlugin, remarkGfm]}
        >
            {content}
        </ReactMarkdown>
    );
};
