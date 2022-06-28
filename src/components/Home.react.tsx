import React, { useState } from "react";

import { Container, Row, Col, FormControl } from "react-bootstrap";

import { MarkdownDisplay } from "./MarkdownDisplay.react";

interface Props {}

export const Home = ({}: Props) => {
    const [content, setContent] = useState<string>(
        "*bold* and _italic_ and ~strikethrough~  \n" +
            "**normal** and __normal__  \n" +
            "\n" +
            "this should be a diff D123456  \n" +
            "\n" +
            "this should be a task T432342  \n" +
            "\n" +
            "this should be a mention @{Jacek}  \n"
    );

    return (
        <Container>
            <Row>
                <Col style={{ minHeight: "99vh" }}>
                    <FormControl
                        as={"textarea"}
                        className={"h-100 py-3 border-0"}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></FormControl>
                </Col>
                <Col style={{ overflowY: "scroll" }}>
                    <MarkdownDisplay content={content} />
                </Col>
            </Row>
        </Container>
    );
};
