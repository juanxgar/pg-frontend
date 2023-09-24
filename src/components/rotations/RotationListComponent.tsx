import { SpecialityRotationItem } from "@/types";
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

type Props = {
  specialities: Array<SpecialityRotationItem>;
  deleteSpecialityFromList: (speciality_id: number) => void;
};
export function RotationListComponent(props: Props): ReactElement {
  const { specialities, deleteSpecialityFromList } = props;

  return (
    <List
      sx={{
        marginLeft: { lg: "60px", xs: "0px" },
        marginRight: { lg: "60px", xs: "0px" },
      }}
    >
      {specialities.map((speciality: SpecialityRotationItem, index: number) => (
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
              <Grid item lg={1} xs={0.5}>
                <Typography
                  fontSize={{ lg: "15px", xs: "13px" }}
                  fontWeight="500"
                >
                  {index + 1}
                </Typography>
              </Grid>
              <Grid item lg={4} xs={4}>
                <Typography fontSize={{ lg: "15px", xs: "13px" }}>
                  {speciality.speciality_description}
                </Typography>
              </Grid>
              <Grid item lg={4} xs={5}>
                <Typography fontSize={{ lg: "15px", xs: "13px" }}>
                  {speciality.professor_name}
                </Typography>
              </Grid>
              <Grid item lg={3} xs={2.5}>
                <Typography fontSize={{ lg: "15px", xs: "13px" }}>
                  {speciality.number_weeks} sem
                </Typography>
              </Grid>
            </Grid>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
