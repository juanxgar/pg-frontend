import { Box, Tab, Tabs } from "@mui/material";
import { ReactElement, ReactNode, SyntheticEvent } from "react";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps): ReactElement {
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

export function TabsComponent(props: Props): ReactElement {
  const { value, handleChange, tabsTitle, children } = props;

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "transparent",
          direction: "column",
          alignItems: "center",
          marginLeft: { lg: "45px", xs: "0px" },
          justifyContent: { lg: "flex-start", xs: "center" },
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
