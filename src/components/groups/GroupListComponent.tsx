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
    <List sx={{ marginLeft: "60px", marginRight: "60px" }}>
      {students.map((student: StudentGroupItem, index: number) => (
        <ListItem
          key={student.user_id}
          secondaryAction={
            <IconButton
              edge="end"
              onClick={() => deleteStudentFromList(student.user_id)}
            >
              <Delete sx={{ color: "#f44336" }} />
            </IconButton>
          }
        >
          <ListItemText>
            <Grid container>
              <Grid item xs={2}>
                <Typography fontSize="15px" fontWeight="500">
                  {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontSize="15px">{student.name}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography fontSize="15px">{student.code}</Typography>
              </Grid>
            </Grid>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
