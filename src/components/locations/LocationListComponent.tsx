import { StudentGroupItem } from "@/types";
import { Delete } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { SpecialityLocationItem } from "../../types/common.type";

type Props = {
  specialities: Array<SpecialityLocationItem>;
  deleteSpecialityFromList: (speciality_id: number) => void;
};
export function LocationListComponent(props: Props): ReactElement {
  const { specialities, deleteSpecialityFromList } = props;

  return (
    <List
      sx={{
        marginLeft: { lg: "60px", xs: "0px" },
        marginRight: { lg: "60px", xs: "0px" },
      }}
    >
      {specialities.map((speciality: SpecialityLocationItem, index: number) => (
        <ListItem
          key={speciality.speciality_id}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => deleteSpecialityFromList(speciality.speciality_id)}
            >
              <Delete sx={{ color: "#f44336" }} />
            </IconButton>
          }
        >
          <ListItemText>
            <Grid container textAlign="center">
              <Grid item lg={2} xs={0.5}>
                <Typography
                  fontSize={{ lg: "15px", xs: "13px" }}
                  fontWeight="500"
                >
                  {index + 1}
                </Typography>
              </Grid>
              <Grid item lg={6} xs={8}>
                <Typography fontSize={{ lg: "15px", xs: "13px" }}>
                  {speciality.speciality_description}
                </Typography>
              </Grid>
              <Grid item lg={4} xs={3.5}>
                <Typography fontSize={{ lg: "15px", xs: "13px" }}>
                  {speciality.limit_capacity}
                </Typography>
              </Grid>
            </Grid>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
