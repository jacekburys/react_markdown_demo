import { Extension, Construct, Tokenizer, State } from "micromark-util-types";
import {
    Extension as FromMarkdownExtension,
    Handle as FromMarkdownHandle,
} from "mdast-util-from-markdown";
import { codes } from "micromark-util-symbol/codes.js";

const CODE_SPACE = 32;
const CODE_CR = -5;
const CODE_LF = -4;
const CODE_CRLF = -3;
const CODE_0 = 48;
const CODE_9 = 57;
const CODE_D = 68;

const DIFF_STRING = "diffString";
const DIFF_PREFIX = "diffPrefix";
const DIFF_NUMBER = "diffNumber";

// ------------ SYNTAX EXTENSION ------------------

const diffTokenize: Tokenizer = (effects, ok, nok) => {
    const start: State = (code) => {
        effects.enter(DIFF_STRING);
        effects.enter(DIFF_PREFIX);
        effects.consume(code);
        effects.exit(DIFF_PREFIX);
        effects.enter(DIFF_NUMBER, { contentType: "string" });
        return begin;
    };

    const begin: State = (code) => {
        if (code != null && CODE_0 <= code && code <= CODE_9) {
            return insideNumber(code);
        }
        return nok(code);
    };

    const insideNumber: State = (code) => {
        if (code != null && CODE_0 <= code && code <= CODE_9) {
            effects.consume(code);
            return insideNumber;
        }

        if (
            code == null ||
            code === CODE_SPACE ||
            code === CODE_CR ||
            code === CODE_LF ||
            code === CODE_CRLF
        ) {
            effects.exit(DIFF_NUMBER);
            effects.exit(DIFF_STRING);
            return ok(code);
        }

        return nok(code);
    };

    return start;
};

const diffConstruct: Construct = {
    name: "diff",
    tokenize: diffTokenize,
};

const diffsExtension: Extension = {
    text: {
        [CODE_D]: diffConstruct,
    },
};

//  ------------ HTML EXTENSION ------------------

const enterDiff: FromMarkdownHandle = function (this, token) {
    this.buffer();
};

const exitDiff: FromMarkdownHandle = function (this, token) {
    const diffNumber = this.resume();
    this.enter(
        {
            type: "link",
            url: `https://www.google.com?q=D${diffNumber}`,
            title: "hello",
            children: [{ type: "text", value: `D${diffNumber}` }],
        },
        token
    );
    this.exit(token);
};

const diffsHtmlExtension: FromMarkdownExtension = {
    enter: {
        [DIFF_STRING]: enterDiff,
    },
    exit: {
        [DIFF_STRING]: exitDiff,
    },
};

// -------------------------------------------------------------

export { diffsExtension, diffsHtmlExtension };
