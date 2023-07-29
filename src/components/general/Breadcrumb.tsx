import { Breadcrumbs, Typography } from "@mui/material";
import { Navigator } from "@/types/common.type";
import Link from "next/link";
import { ReactElement } from "react";

interface Props {
  navigator: Array<Navigator>;
}

export function Breadcrumb(props: Props): ReactElement {
  const { navigator } = props;

  return (
    <>
      <Breadcrumbs>
        {navigator.map((item, index) =>
          index === navigator.length - 1 ? (
            <Typography key={item.name} color="text.primary">
              {item.name}
            </Typography>
          ) : (
            <Link
              key={item.name}
              href={item.ref}
              passHref
              style={{ textDecoration: "none" }}
            >
              <Typography
                key={item.name}
                color="#4a5361"
                sx={{
                  "&:hover": {
                    color: "text.primary",
                    textDecoration: "underline",
                  },
                }}
              >
                {item.name}
              </Typography>
            </Link>
          )
        )}
      </Breadcrumbs>
    </>
  );
}
