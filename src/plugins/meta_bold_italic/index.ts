import { Plugin, Processor } from "unified";
import { visit, Visitor } from "unist-util-visit";
import { Node } from "unist";
import { is, Test } from "unist-util-is";
import { source } from "unist-util-source";
import { Root, Strong, Emphasis, Text } from "mdast";

/*
export const plugin: () => Plugin<any[], Root, Root> = () => {
    return (tree: Node): void | Transformer<Root, Root> => {
        console.log(tree);
        return {};
    };
};
*/

export function plugin(): Plugin<any[], Root, Root> {
    return (root: any, vfile) => {
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
}
