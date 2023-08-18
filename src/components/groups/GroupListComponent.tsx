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
import { ReactElement, useEffect } from "react";

type Props = {
  students: Array<StudentGroupItem>;
  deleteStudentFromList: (user_id: number) => void;
};
export function ListComponent(props: Props): ReactElement {
  const { students, deleteStudentFromList } = props;

  useEffect(() => {}, [students]);

  return (
    <List
      sx={{
        marginLeft: { lg: "60px", xs: "0px" },
        marginRight: { lg: "60px", xs: "0px" },
      }}
    >
      {students.map((student: StudentGroupItem, index: number) => (
        <ListItem
          key={student.user_id}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => deleteStudentFromList(student.user_id)}
            >
              <Delete
                sx={{ color: "#f44336" }}
              />
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
                  {student.name}
                </Typography>
              </Grid>
              <Grid item lg={4} xs={3.5}>
                <Typography fontSize={{ lg: "15px", xs: "13px" }}>
                  {student.code}
                </Typography>
              </Grid>
            </Grid>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
