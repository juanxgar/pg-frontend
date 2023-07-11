"use client";

import { Box, Divider, useMediaQuery } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSession } from "next-auth/react";
import Navbar from "@/components/general/layouts/navbar";
import Header from "@/components/general/layouts/header";
import Footer from "@/components/general/Footer";
import { redirect } from "next/navigation";
import { lightTheme } from "@/themes";


interface Props {
  children?: ReactNode;
  params: { locale: string };
}

export default function AdminLayout(props: Props) {
  const { children, params } = props;
  const { status } = useSession();
  const [open, setOpen] = useState(true);
  const [show, setShow] = useState(false);
  const xs = useMediaQuery(lightTheme.breakpoints.up("xs"));

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
