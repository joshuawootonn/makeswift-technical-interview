import React, {FC, PropsWithChildren} from "react";
import {Link} from "@material-ui/core";
import {RenderLeafProps} from "slate-react";

// Personally haven't seen a nice way to type Object.key, so that's why this type is so general.
// Definitely doesn't feel nice to me though!
const LeafPropertyNameToNodeTypeMapping: { [key: string]: FC<any> } = {
    link: (props: PropsWithChildren<{href: string}>) => <Link underline="hover" {...props} />,
    bold: (props: PropsWithChildren<{}>) => <b {...props} />,
    italics: (props: PropsWithChildren<{}>) => <i {...props} />,
    underline: (props: PropsWithChildren<{}>) => <u {...props} />,
};

export function renderLeaf(props: RenderLeafProps) {
    const {attributes, leaf, children} = props;

    return (
        <span {...attributes}>
            {Object.keys(LeafPropertyNameToNodeTypeMapping).reduce((acc, currentLeafProperty ) => {
                const NodeType = LeafPropertyNameToNodeTypeMapping[currentLeafProperty];
                if (!leaf[currentLeafProperty] || !NodeType) return acc;
                const props = leaf[currentLeafProperty];

                return <NodeType {...props}>{acc}</NodeType>;
            }, children)}
        </span>
    );
}