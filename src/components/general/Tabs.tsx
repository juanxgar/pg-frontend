"use client";

import { Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import { ReactNode, SyntheticEvent } from "react";
import { useTheme } from "@mui/material/styles";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface Props {
  tabsTitle: Array<string>;
  value: number;
  handleChange: (event: SyntheticEvent, newValue: number) => void;
  children?: ReactNode;
}

export default function tabs(props: Props) {
  const { value, handleChange, tabsTitle, children } = props;

  const theme = useTheme();
  const lg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "transparent",
          direction: "column",
          alignItems: "center",
          marginLeft: lg ? "45px" : "0px",
          justifyContent: lg ? "flex-start" : "center",
          display: "flex",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{
            style: {
              display: "flex",
              justifyContent: "center",
              backgroundColor: "transparent",
            },
          }}
        >
          {tabsTitle.map((title) => (
            <Tab key={title} label={title} sx={{ paddingX: "40px" }} />
          ))}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={value}>
        {children}
      </CustomTabPanel>
    </Box>
  );
}
