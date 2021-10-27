import React, {useEffect} from "react";
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
import {makeStyles} from "@material-ui/core/styles";
import {useEditor, ReactEditor} from "slate-react";
import {Editor} from "slate";
import {AnimatePresence, motion} from "framer-motion";

const useStyles = makeStyles((theme) => ({
    root: {
        background: theme.palette.common.black,
        borderRadius: 8,
        padding: 2,
    },
    button: {
        color: theme.palette.common.white,
        opacity: 0.75,
        "&:hover": {
            opacity: 1,
        },
        padding: 8,
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
    // I think casting at your limits like this is okish!
    const marks = Editor.marks(editor) as { [key in ToolbarActions]: any };
    if (!marks) return;
    return marks[action]
        ? Editor.removeMark(editor, action)
        : Editor.addMark(editor, action, props);
};

export function ToolbarAction(props: IconButtonProps) {
    const s = useStyles();
    return (
        <IconButton
            {...props}
            className={s.button}
            size="small"

        />
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


export interface ToolbarProps extends Omit<PopperProps, "children"> {
}

export function Toolbar(props: ToolbarProps) {
    const editor = useEditor();
    const [link, setLink] = React.useState<null | string>(null);
    const s = useStyles();

    return (
        <Popper className={s.root} placement={'top'}  {...props}>
            <AnimatePresence exitBeforeEnter={true}>
                {link === null ? (
                    /* Formatting controls */
                    <ButtonGroup
                        variant="text"
                        color="primary"
                        component={motion.div}
                        initial={{x: 100, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        exit={{x: -100, opacity: 0}}
                    >
                        <SimpleToolbarAction
                            toolbarAction={'bold'}
                        >
                            <FormatBold fontSize="small"/>
                        </SimpleToolbarAction>
                        <SimpleToolbarAction
                            toolbarAction={'italics'}
                        >
                            <FormatItalic fontSize="small"/>
                        </SimpleToolbarAction>
                        <SimpleToolbarAction
                            toolbarAction={'underline'}
                        >
                            <FormatUnderlined fontSize="small"/>
                        </SimpleToolbarAction>
                        <ToolbarAction
                            onClick={(x) => {
                                x.preventDefault();
                                setLink("");
                            }}
                        >
                            <Link fontSize="small"/>
                        </ToolbarAction>
                    </ButtonGroup>
                ) : (
                    /* URL input field */
                    <motion.form
                        onSubmit={(x) => {
                            x.preventDefault();
                            setLink(null);
                            ReactEditor.focus(editor);
                            toggleMark(editor, "link", {href: link});
                        }}
                        initial={{x: 100, opacity: 0}}
                        animate={{x: 0, opacity: 1}}
                        exit={{x: -100, opacity: 0}}
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
                                    onClick={(x) => {
                                        x.preventDefault();
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
                    </motion.form>
                )}
            </AnimatePresence>
        </Popper>
    );
}
