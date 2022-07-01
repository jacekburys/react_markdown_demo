import { Plugin, Processor } from "unified";
import { visit, Visitor } from "unist-util-visit";
import { Node } from "unist";
import { is, Test } from "unist-util-is";
import { source } from "unist-util-source";
import { Root, Strong, Emphasis, Text } from "mdast";
import { Extension } from "micromark-util-types";

const plugin: Plugin<any[], Root> = function (this) {
    const data = this.data();
    data["micromarkExtensions"] = [extension];
};

/*
function extension(): Extension {
    return {};
}
*/

const extension: Extension = {};

export { plugin };
