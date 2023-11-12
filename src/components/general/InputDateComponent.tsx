import { ReactElement } from "react";
import { FormControl, TextFieldProps } from "@mui/material";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
import { Moment } from "moment";

export function InputDateComponent(
  props: DatePickerProps<Moment>
): ReactElement {
  return (
    <FormControl fullWidth>
      <DatePicker
        {...props}
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
          "& .MuiInputBase-input.Mui-disabled": {
            WebkitTextFillColor: "#000000",
            color: "black",
          },
        }}
        format="DD-MM-YYYY"
      />
    </FormControl>
  );
}
