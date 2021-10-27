import React from "react";
import {
    CssBaseline,
    MuiThemeProvider,
    Container,
    Card,
    CardContent,
    Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import theme from "./theme";
import { Editor, Node } from "./editor";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(4),
    },
    title: {
        margin: theme.spacing(0, 2, 2),
    },
    card: {
        marginBottom: theme.spacing(2),
    },
}));

const initialValue: Node[] = [
    {
        type: "paragraph",
        children: [
            {
                text:
                    "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
            },
        ],
    },
];

export function App() {
    const [value, setValue] = React.useState(initialValue);
    const s = useStyles();

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Container className={s.root} maxWidth="sm">
                <Typography className={s.title} component="h1" variant="h5">
                    Slate.js Sandbox
                </Typography>
                <Card className={s.card} elevation={0}>
                    <CardContent>
                        <Editor
                            value={value}
                            onChange={(x) => setValue(x)}
                            placeholder="Write text here..."
                            autoFocus
                            spellCheck
                        />
                    </CardContent>
                </Card>
            </Container>
        </MuiThemeProvider>
    );
}
