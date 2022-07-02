import { Plugin, Processor } from "unified";
import { visit, Visitor } from "unist-util-visit";
import { Node } from "unist";
import { is, Test } from "unist-util-is";
import { source } from "unist-util-source";
import { Root, Strong, Emphasis, Text } from "mdast";

const plugin: Plugin<any[], Root> = function (this) {
    return (root: any, vfile: any) => {
        visit(root, "strong", (node: Strong | Text) => {
            const sourceText = source(node, vfile);
            if (sourceText == null) {
                return;
            }
            node.type = "text";
            (<Text>node).value = sourceText;
        });

        visit(root, "emphasis", (node: Emphasis | Strong) => {
            const sourceText = source(node, vfile);
            if (sourceText == null) {
                return;
            }
            if (sourceText[0] === "*") {
                node.type = "strong";
            }
        });
    };
};

export { plugin };
