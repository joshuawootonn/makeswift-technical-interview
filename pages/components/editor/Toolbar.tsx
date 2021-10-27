import React  from "react";
import {
    Popper,
    PopperProps,
    ButtonGroup,
    Input, IconButtonProps, IconButton,
} from "@material-ui/core";
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    Link,
    Close,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { useEditor, ReactEditor } from "slate-react";
import {Editor} from "slate";

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


// this is an adaption from examples I found in react-slate docs
const toggleMark = (editor: ReactEditor, action: ToolbarActions, props = {}) => {
    const marks = Editor.marks(editor);
    if (!marks) return;
    return marks[action]
        ? Editor.removeMark(editor, action)
        : Editor.addMark(editor, action, props);
};

export function ToolbarAction(props: IconButtonProps) {
    const s = useStyles();
    return (
        <IconButton
            className={s.button}
            size="small"
            {...props}
        >
            <FormatBold fontSize="small" />
        </IconButton>
    )
}

type ToolbarActions = 'bold' | 'italics' | 'underline' | 'link'

interface SimpleToolbarActionProps extends IconButtonProps {
    toolbarAction: ToolbarActions
}

export function SimpleToolbarAction({toolbarAction, ...props}: SimpleToolbarActionProps) {
    const editor = useEditor();
    return (
        <ToolbarAction
            {...props}
            onClick={(x: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                x.preventDefault();
                ReactEditor.focus(editor);
                toggleMark(editor, toolbarAction);
            }}
        />
    )
}


export interface ToolbarProps extends Omit<PopperProps, "children"> {}

export function Toolbar(props: ToolbarProps) {
    const editor = useEditor();
    const [link, setLink] = React.useState<null | string>(null);
    const s = useStyles();

    return (
        <Popper className={s.root} {...props}>
            {link === null ? (
                /* Formatting controls */
                <ButtonGroup variant="text" color="primary">
                    <SimpleToolbarAction
                        toolbarAction={'bold'}
                    >
                        <FormatBold fontSize="small" />
                    </SimpleToolbarAction>
                    <SimpleToolbarAction
                        toolbarAction={'italics'}
                    >
                        <FormatItalic fontSize="small" />
                    </SimpleToolbarAction>
                    <SimpleToolbarAction
                        toolbarAction={'underline'}
                    >
                        <FormatUnderlined fontSize="small" />
                    </SimpleToolbarAction>
                    <ToolbarAction
                        onClick={() => {
                            setLink("");
                        }}
                    >
                        <Link fontSize="small" />
                    </ToolbarAction>
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
