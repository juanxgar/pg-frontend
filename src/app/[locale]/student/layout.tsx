"use client";

import { Box, Divider, useMediaQuery } from "@mui/material";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Navbar from "@/components/general/layout/Navbar";
import Header from "@/components/general/layout/Header";
import Footer from "@/components/general/layout/Footer";
import { redirect } from "next/navigation";
import { lightTheme } from "@/themes";

interface Props {
  children?: ReactNode;
  params: { locale: string };
}

export default function AdminLayout(props: Props): ReactElement {
  const { children, params } = props;
  const { status }: { status: string } = useSession<boolean>();
  const [open, setOpen] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const xs: boolean = useMediaQuery(lightTheme.breakpoints.up("xs"));

  const handleDrawer = () => {
    setOpen(!open);
  };

  if (status === "unauthenticated") {
    redirect(`/${props.params.locale}`);
  }

  useEffect(() => {
    if (xs) {
      setShow(true);
    }
  }, [xs]);

  return (
    <>
      {show && (
        <ThemeProvider theme={lightTheme}>
          <Box sx={{ display: "flex", minHeight: "98vh" }}>
            <Box
              component="nav"
              sx={{
                width: { xs: xs ? "0px" : "256px", lg: open ? "256px" : "0px" },
                transition: "width 300ms ease",
              }}
            >
              <Navbar
                open={open}
                onClose={handleDrawer}
                locale={params.locale}
              />
            </Box>
            <Box
              sx={{
                width: xs ? "0px" : "256px",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Header
                open={open}
                onDrawerToggle={handleDrawer}
                locale={params.locale}
              />
              <Divider />
              <Box
                component="main"
                sx={{
                  flex: 1,
                  py: 0,
                  px: 0,
                  bgcolor: "#ffffff",
                }}
              >
                {children}
              </Box>
              <Box component="footer" sx={{ p: 0, bgcolor: "#FFFFFF" }}>
                <Footer />
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
}
