import React, {useCallback, useState, useMemo} from "react";
import { createEditor, Node, Transforms, Editor as SlateEditor } from "slate";
import { Link } from "@material-ui/core";
import {
    Editable,
    withReact,
    Slate,
    RenderElementProps,
    RenderLeafProps,
} from "slate-react";

import { DefaultElement } from "./elements";
import { Toolbar } from "./Toolbar";

function renderElement(props: RenderElementProps) {
    const { attributes, children } = props;

    return <DefaultElement {...attributes}>{children}</DefaultElement>;
}

const textTypes = {
    link: (props) => <Link underline="hover" {...props} />,
    bold: (props) => <b {...props} />,
    italics: (props) => <i {...props} />,
    underline: (props) => <u {...props} />,
};

function renderLeaf(props: RenderLeafProps) {
    const { attributes, leaf, children } = props;

    return (
        <span {...attributes}>
      {Object.keys(textTypes).reduce((acc, curr) => {
          if (!leaf[curr]) return acc;
          const NodeType = textTypes[curr];
          const props = leaf[curr];

          return <NodeType {...props}>{acc}</NodeType>;
      }, children)}
    </span>
    );
}

export interface EditorProps {
    value: Node[];
    onChange: (value: Node[]) => void;
    placeholder?: string;
    autoFocus?: boolean;
    spellCheck?: boolean;
}

export function Editor({value, onChange, ...props}: EditorProps) {
    const editor = useMemo(() => withReact(createEditor()), []);

    const [anchorEl, setAnchorEl] = useState<any>();
    const [open, setOpen] = useState(false);

    const setSelectionBoundingBox = useCallback((e) => {
        const selection = window.getSelection();

        // Resets when the selection has a length of 0
        if (!selection || selection.anchorOffset === selection.focusOffset) {
            setOpen(false);
            return;
        }

        const getBoundingClientRect = () =>
            selection.getRangeAt(0).getBoundingClientRect();

        setOpen(true);
        setAnchorEl({
            getBoundingClientRect
        } as any);

        return true;
    }, [editor])

    //  https://github.com/ianstormtaylor/slate/issues/3412#issuecomment-730002475
    // These lines are pretty much c/p from the github issue I found on the topic above
    // I originally tried handling this within the Toolbar, but saving selection but the
    // `Transform.select` wasn't working there for some reason. That's when I found the above!
    const savedSelection = React.useRef(editor.selection);
    const onFocus = React.useCallback(() => {
        if (!editor.selection) {
            Transforms.select(
                editor,
                savedSelection.current ?? SlateEditor.end(editor, []),
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
                {...props}
            />
        </Slate>
    );
}

export { Node };
