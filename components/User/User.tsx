import { Avatar, Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { getRoleName, getUserInitials } from "../../helpers/UserExtensions";
import { IUser } from "../../models/IUser";

type UserProps = {
    user: IUser,
    onEditClick: () => void;
    onDeleteClick: () => void;
}

const User = ({ user, onEditClick, onDeleteClick }: UserProps) => {
    return (
        <Card sx={{ padding: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <Avatar >
                        {getUserInitials(user)}
                    </Avatar>
                </Box>
                <Typography
                    color="textSecondary"
                    variant="h6"
                    align="center"
                >
                    {user.firstName + " " + user.lastName}
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    align="center"
                >
                    {user.email}
                </Typography>{" "}
                <Typography
                    color="textSecondary"
                    variant="subtitle1"
                    align="center"
                >
                    {getRoleName(user.role)}
                </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: "end" }}>
                <Button size="large" color="primary" variant="outlined" onClick={onEditClick}>
                    Edit
                </Button>
                <Button size="large" color="error" variant="outlined" onClick={onDeleteClick}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    )
};

export default User;
