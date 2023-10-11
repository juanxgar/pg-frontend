import React, { ChangeEvent, ReactElement, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment, { Moment } from "moment";

interface Props {
  locale: string;
  setLoading: (loading: boolean) => void;
}

export function RotationDateCreation(props: Props): ReactElement {
  const [value, setValue] = useState<Moment | null>(
    moment("28-09-2023", "DD-MM-YYYY")
  );

  const onchangeValue = (value: Moment | null) => {
    setValue(value);
  };

  return (
    <>
      <DatePicker
        format="DD-MM-YYYY"
        value={value}
        onChange={onchangeValue}
        shouldDisableDate={(date: Moment) =>
          date.isBetween(
            moment("20-09-2023", "DD-MM-YYYY").subtract(1, "d"),
            moment("29-09-2023", "DD-MM-YYYY").add(1, "d")
          )
        }
      />
    </>
  );
}
