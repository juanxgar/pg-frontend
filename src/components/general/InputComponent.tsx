import { ReactElement } from "react";
import { FormControl, TextField, TextFieldProps } from "@mui/material";

export default function InputComponent(props: TextFieldProps): ReactElement {
  return (
    <FormControl fullWidth>
      <TextField
        {...props}
        size="small"
        sx={{
          margin: "10px",
          background: "#EEEEEE",
          borderRadius: 1,
          borderColor: "#048014",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#EEEEEE",
          },
          "& label.Mui-focused": { color: "#048014" },
          // focused color for input with variant='outlined'
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#048014",
            },
            "&:hover fieldset": {
              borderColor: "#048014",
            },
          },
        }}
      />
    </FormControl>
  );
}
