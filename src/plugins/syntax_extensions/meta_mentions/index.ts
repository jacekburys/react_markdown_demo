import { Plugin, Processor } from "unified";
import { visit, Visitor } from "unist-util-visit";
import { Node } from "unist";
import { is, Test } from "unist-util-is";
import { source } from "unist-util-source";
import { Root, Strong, Emphasis, Text } from "mdast";
import {
    Extension,
    Construct,
    Tokenizer,
    State,
    HtmlExtension,
    Handle,
    CompileContext,
    Token,
    Resolver,
} from "micromark-util-types";
import {
    Extension as FromMarkdownExtension,
    Handle as FromMarkdownHandle,
} from "mdast-util-from-markdown";
import { text } from "stream/consumers";

const CODE_SPACE = 32;
const CODE_CR = -5;
const CODE_LF = -4;
const CODE_CRLF = -3;

const CODE_AT = 64;
const CODE_OPEN_BRACKET = 123;
const CODE_CLOSE_BRACKET = 125;

const MENTION_STRING = "mentionString";
const MENTION_AT_SIGN = "mentionAtSign";
const MENTION_OPEN = "mentionOpen";
const MENTION_CLOSE = "mentionClose";
const MENTION_CONTENT = "mentionContent";

// ------------ SYNTAX EXTENSION ------------------

const mentionTokenize: Tokenizer = (effects, ok, nok) => {
    const start: State = (code) => {
        effects.enter(MENTION_STRING);
        effects.enter(MENTION_AT_SIGN);
        effects.consume(code);
        effects.exit(MENTION_AT_SIGN);
        return insideOpen;
    };

    const insideOpen: State = (code) => {
        if (code !== CODE_OPEN_BRACKET) {
            return nok(code);
        }
        effects.enter(MENTION_OPEN);
        effects.consume(code);
        effects.exit(MENTION_OPEN);
        effects.enter(MENTION_CONTENT, { contentType: "string" });
        return insideContent;
    };

    const insideContent: State = (code) => {
        if (
            code == null ||
            code === CODE_SPACE ||
            code === CODE_CR ||
            code === CODE_LF ||
            code === CODE_CRLF
        ) {
            return nok(code);
        }

        if (code === CODE_CLOSE_BRACKET) {
            effects.exit(MENTION_CONTENT);
            effects.enter(MENTION_CLOSE);
            effects.consume(code);
            effects.exit(MENTION_CLOSE);
            effects.exit(MENTION_STRING);
            return ok;
        }

        effects.consume(code);
        return insideContent;
    };

    return start;
};

const mentionsResolveAll: Resolver = (events, context) => {
    console.log("resolve mention", events);
    return events;
};

const mentionConstruct: Construct = {
    name: "mention",
    tokenize: mentionTokenize,
    resolveAll: mentionsResolveAll,
};

const mentionsExtension: Extension = {
    text: {
        [CODE_AT]: mentionConstruct,
    },
};

//  ------------ HTML EXTENSION ------------------

const enterMention: FromMarkdownHandle = function (this, token) {
    this.buffer();
};

const exitMention: FromMarkdownHandle = function (this, token) {
    const mention = this.resume();
    this.enter(
        {
            type: "link",
            url: `https://www.google.com?q=${mention}`,
            title: "hello",
            children: [
                {
                    type: "strong",
                    children: [{ type: "text", value: mention }],
                },
            ],
        },
        token
    );
    this.exit(token);
};

const mentionsHtmlExtension: FromMarkdownExtension = {
    enter: {
        [MENTION_STRING]: enterMention,
    },
    exit: {
        [MENTION_STRING]: exitMention,
    },
};

// -------------------------------------------------------------

export { mentionsExtension, mentionsHtmlExtension };
