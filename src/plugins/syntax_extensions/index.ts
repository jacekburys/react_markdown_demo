import { Plugin } from "unified";
import { Root } from "mdast";
import {
    combineExtensions,
    combineHtmlExtensions,
} from "micromark-util-combine-extensions";

import { diffsExtension, diffsHtmlExtension } from "./meta_diffs";
import { mentionsExtension, mentionsHtmlExtension } from "./meta_mentions";

const plugin: Plugin<any[], Root> = function (this) {
    const data = this.data();

    data["micromarkExtensions"] = [
        combineExtensions([diffsExtension, mentionsExtension]),
    ];
    data["fromMarkdownExtensions"] = [
        // @ts-ignore
        combineHtmlExtensions([diffsHtmlExtension, mentionsHtmlExtension]),
    ];

    //data["micromarkExtensions"] = [diffsExtension];
    //data["fromMarkdownExtensions"] = [diffsHtmlExtension];
};

export { plugin };
