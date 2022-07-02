import React, { useEffect, useState, createElement } from "react";

import { unified, Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import { Root } from "mdast";

import { metaBoldItalicPlugin, syntaxExtensionPlugin } from "../plugins";

interface Props {
    content: string;
}

const logTreePlugin: Plugin<any[], Root> = function () {
    return (tree: any) => {
        console.log(tree);
    };
};

const useProcessor = (content: string) => {
    const [element, setElement] = useState<React.ReactElement>(<></>);

    useEffect(() => {
        unified()
            .use(remarkParse)
            .use(syntaxExtensionPlugin)
            .use(metaBoldItalicPlugin)
            .use(remarkGfm)
            //.use(logTreePlugin)
            .use(remarkRehype)
            .use(rehypeReact, {
                createElement,
            })
            .process(content)
            .then((file) => {
                setElement(file.result);
            });
    }, [content]);

    return element;
};

export const MarkdownUnified = ({ content }: Props) => {
    const element = useProcessor(content);
    return element;
};
