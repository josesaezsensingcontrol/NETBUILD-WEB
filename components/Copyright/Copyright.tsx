import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

export default function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        NetBuild
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}