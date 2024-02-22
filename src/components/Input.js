import React, { forwardRef } from "react";
import _ from "lodash";
import { TextField } from "@mui/material";

import "./style.css";

const Input = forwardRef(
  (
    {
      type,
      rows,
      onChange,
      error,
      helperText,
      errorText,
      inputProps,
      required,
      sx,
      ...props
    },
    ref
  ) => {
    return (
      <TextField
        {...props}
        required={required}
        ref={ref}
        variant="outlined"
        fullWidth
        type={type}
        inputProps={inputProps}
        error={error}
        helperText={helperText || errorText}
        rows={rows}
        onChange={onChange}
        sx={[
          {
            flex: 5,
            margin: "10px 0",
          },
          sx,
        ]}
      />
    );
  }
);

export default Input;
