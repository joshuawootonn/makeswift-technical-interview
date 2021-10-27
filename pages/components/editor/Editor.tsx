import React, {useCallback, useState, useMemo} from "react";
import { createEditor, Node, Transforms} from "slate";
import {Editable, withReact, Slate, ReactEditor} from "slate-react";
import { Toolbar } from "./Toolbar";
import {renderLeaf} from "./elements";
import {renderElement} from "./elements";

export interface EditorProps {
    value: Node[];
    onChange: (value: Node[]) => void;
    placeholder?: string;
    autoFocus?: boolean;
    spellCheck?: boolean;
}

export function Editor({value, onChange, ...props}: EditorProps) {
    const editor = useMemo(() => withReact(createEditor()), []);

    // I am casting here because Popper types anchorElement as a more general type (ReferenceObject)
    // instead of what getBoundingClientRect Provides (DomRect) I could look more into this,
    // but I will let it rest since my config could have also messed this up.
    const [anchorEl, setAnchorEl] = useState<any>();
    const [open, setOpen] = useState(false);

    const setSelectionBoundingBox = useCallback((e) => {
        // since this is called on key down I want to return early on non arrow keys
        // since 16 and 93 are included since command + shift + arrow keys is not firing arrow key events :)
        if(e.keyCode && ![16,33,34,35,36,37,38,39,40,93].includes(e.keyCode)) return;

        const selection = window.getSelection();

        if (!selection) return;

        const domRect = selection.getRangeAt(0).getBoundingClientRect()

        // if the selected bounding box is not big enough don't show the toolbar
        if (domRect.width < 3) {
            setOpen(false);
        } else {
            setOpen(true);
            setAnchorEl({
                getBoundingClientRect: () => domRect
            });
        }

        return true;
    }, [editor])

    //  https://github.com/ianstormtaylor/slate/issues/3412#issuecomment-730002475
    // These lines are pretty much c/p from the github issue I found on the topic above
    // I originally tried handling this within the Toolbar, but saving selection but the
    // `Transform.select` wasn't working there for some reason. That's when I found the above!
    const savedSelection = React.useRef(editor.selection);
    const onFocus = React.useCallback(() => {
        if (savedSelection.current !== null) {
            Transforms.select(
                editor,
                savedSelection.current
            );
        }
    }, [editor]);
    const onBlur = React.useCallback(() => {
        savedSelection.current = editor.selection;
    }, [editor]);

    return (
        <Slate editor={editor} value={value} onChange={onChange}>
            <Toolbar open={open} anchorEl={anchorEl} />
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                onFocus={onFocus}
                onBlur={onBlur}
                onMouseUp={setSelectionBoundingBox}
                onKeyUp={setSelectionBoundingBox}
                {...props}
            />
        </Slate>
    );
}

export { Node };
