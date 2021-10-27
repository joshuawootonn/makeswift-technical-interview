import React from "react";
import { Typography, TypographyProps } from "@material-ui/core";
import {RenderElementProps} from "slate-react";

const DefaultElement = React.forwardRef(function DefaultElement(
    props: TypographyProps,
    ref: React.Ref<HTMLElement>,
) {
    return <Typography ref={ref} {...props} />;
});

// the things we do to get TS working sometimes :)
export function renderElement(props: RenderElementProps) {
    const {attributes, children} = props;
    return <DefaultElement {...attributes}>{children}</DefaultElement>;
}