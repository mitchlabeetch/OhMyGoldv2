import React from "react";

type VisuallyHiddenProps<T extends React.ElementType = "span"> = {
  as?: T;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children">;

const visuallyHiddenStyles: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  borderWidth: 0,
};

export function VisuallyHidden<T extends React.ElementType = "span">({
  as,
  children,
  ...props
}: VisuallyHiddenProps<T>) {
  const Element = (as ?? "span") as React.ElementType;
  return (
    <Element style={visuallyHiddenStyles} {...props}>
      {children}
    </Element>
  );
}
