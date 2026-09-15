import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const navigate = useNavigate();
  const { user, isLoggedIn, isInitializing, logout } = useContext(UserContext);

  useEffect(() => {
    if (!isLoggedIn && !isInitializing) {
      navigate("/login");
    }
  }, [isInitializing, isLoggedIn, navigate]);

  if (isInitializing) return <></>;

  return (
    <div>
      <AppBar position="static">
        <Toolbar sx={{ position: 'relative' }}>
          <Typography variant="h5" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            NextJS
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="inherit"
            onClick={() => {
              navigate("/item");
            }}
          >
            Item
          </Button>

          {/* แสดงปุ่ม User เฉพาะเมื่อผู้ใช้มี _id หรือ id เป็น "-1" (Admin) */}
          {(user?._id == "-1" || user?.id == "-1") && (
            <Button
              color="inherit"
              onClick={() => {
                navigate("/user");
              }}
            >
              User
            </Button>
          )}

          <Button
            color="inherit"
            onClick={async () => {
              await logout();
              localStorage.clear();
              sessionStorage.clear();
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ px: 2, pt: 2 }}>
        <Outlet />
      </Box>
    </div>
  );
}