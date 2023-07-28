import { Box, Button, Modal, styled, Typography } from "@mui/material";
import { ContentModal } from "@/types";
import { ReactElement } from "react";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  content: ContentModal;
  onSubmit: () => void;
}

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "#048014",
  borderRadius: "15px",
  padding: "30px 50px 30px 50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

export default function ModalComponent(props: Props): ReactElement {
  const { open, onClose, content, onSubmit } = props;
  const t = useTranslations();

  return (
    <ModalStyled
      disableEscapeKeyDown
      sx={{ backdropFilter: "blur(12.5px)" }}
      open={open}
      onClose={onClose}
    >
      <Box sx={styleModal}>
        {content.title && (
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontSize: { xs: "20px", sm: "20px", md: "32px" },
              fontWeight: "700",
              color: "white",
            }}
          >
            {content.title}
          </Typography>
        )}
        <Typography color="#ffffff" sx={{ mt: 1, textAlign: "center", mb: 5 }}>
          {content.description}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            sx={{ minWidth: "150px", mr: 2, backgroundColor: "white" }}
            fullWidth
            onClick={onClose}
            color="inherit"
            type="button"
          >
            <Typography
              sx={{ fontSize: "18px", fontWeight: "700" }}
              noWrap
              component="span"
              color="#048014"
            >
              {t("commons.cancel")}
            </Typography>
          </Button>
          <Button
            variant="contained"
            sx={{ minWidth: "150px" }}
            fullWidth
            onClick={onSubmit}
            color="error"
            type="submit"
          >
            <Typography
              sx={{ fontSize: "18px", fontWeight: "700" }}
              noWrap
              component="span"
              color="#ffffff"
            >
              {t("commons.accept")}
            </Typography>
          </Button>
        </Box>
      </Box>
    </ModalStyled>
  );
}

const ModalStyled = styled(Modal)(() => ({
  "& .MuiModal-backdrop": {
    backgroundColor: "rgba(217, 217, 217, 0.6)",
  },
}));
