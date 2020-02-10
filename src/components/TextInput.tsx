/** @jsx jsx */
import { jsx } from "theme-ui";
import * as React from "react";
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
/**
 * A base component that can be easily customized within
 * the CPW design system
 */
const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "primary",
          borderWidth: 2,
          p: 1,
          fontSize: 2
        }}
        {...props}
      />
    );
  }
);

export default TextInput;
