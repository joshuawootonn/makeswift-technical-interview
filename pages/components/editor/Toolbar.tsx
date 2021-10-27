import React  from "react";
import {
    Popper,
    PopperProps,
    ButtonGroup,
    IconButton,
    Input,
} from "@material-ui/core";
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    Link,
    Close,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { Editor } from "slate";
import { useEditor, ReactEditor } from "slate-react";

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.common.black,
    },
    button: {
        color: theme.palette.common.white,
        opacity: 0.75,
        "&:hover": {
            opacity: 1,
        },
        paddingTop: 8,
        paddingBottom: 8,
    },
    input: {
        color: theme.palette.common.white,
        padding: theme.spacing(0.25, 1),
    },
    close: {
        opacity: 0.75,
        cursor: "pointer",
        "&:hover": {
            opacity: 1,
        },
    },
}));

export interface ToolbarProps extends Omit<PopperProps, "children"> {}

type Format = 'bold' | 'italics' | 'underline' | 'link'

// this is an addaption from examples I found in react-slate docs
const toggleMark = (editor: ReactEditor, format: Format, props = {}) => {
    const marks = Editor.marks(editor);
    if (!marks) return;
    return marks[format]
        ? Editor.removeMark(editor, format)
        : Editor.addMark(editor, format, props);
};

// admittedly it's probably risky to use partial applicaiton in a technical interview
// gotta have fun though :)
const createFormatHandler = (editor: ReactEditor, format: Format) => (x: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    x.preventDefault();
    ReactEditor.focus(editor);
    toggleMark(editor, format);
};

export function Toolbar(props: ToolbarProps) {
    const editor = useEditor();
    const [link, setLink] = React.useState<null | string>(null);
    const s = useStyles();

    return (
        <Popper className={s.root} {...props}>
            {link === null ? (
                /* Formatting controls */
                <ButtonGroup variant="text" color="primary">
                    <IconButton
                        className={s.button}
                        size="small"
                        onClick={createFormatHandler(editor, "bold")}
                    >
                        <FormatBold fontSize="small" />
                    </IconButton>
                    <IconButton
                        className={s.button}
                        size="small"
                        onClick={createFormatHandler(editor, "italics")}
                    >
                        <FormatItalic fontSize="small" />
                    </IconButton>
                    <IconButton
                        className={s.button}
                        size="small"
                        onClick={createFormatHandler(editor, "underline")}
                    >
                        <FormatUnderlined fontSize="small" />
                    </IconButton>
                    <IconButton
                        className={s.button}
                        size="small"
                        onClick={() => {
                            setLink("");
                        }}
                    >
                        <Link fontSize="small" />
                    </IconButton>
                </ButtonGroup>
            ) : (
                /* URL input field */
                <form
                    onSubmit={(x) => {
                        x.preventDefault();
                        setLink(null);
                        ReactEditor.focus(editor);
                        toggleMark(editor, "link", { href: link });
                    }}
                >
                    <Input
                        className={s.input}
                        type="url"
                        value={link}
                        onChange={(x) => setLink(x.target.value)}
                        endAdornment={
                            <Close
                                className={s.close}
                                fontSize="small"
                                onClick={() => {
                                    setLink(null);
                                    ReactEditor.focus(editor);
                                }}
                            />
                        }
                        fullWidth
                        placeholder="https://"
                        disableUnderline
                        autoFocus
                    />
                </form>
            )}
        </Popper>
    );
}
