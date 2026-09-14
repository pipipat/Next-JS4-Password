import { useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import KeyIcon from "@mui/icons-material/Key";

const API_URL = import.meta.env.VITE_API_URL;

export default function User() {
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const newPasswordRef = useRef(null);
  const isInit = useRef(false);

  const cols = [
    { field: "username", headerName: "Username", flex: 2 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "firstname", headerName: "Firstname", flex: 2 },
    { field: "lastname", headerName: "Lastname", flex: 2 },
    {
      field: "actions",
      headerName: "Change Password",
      sortable: false,
      filterable: false,
      flex: 2,
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          startIcon={<KeyIcon />} 
          onClick={() => openPasswordDialog(params.row._id)}
          size="small"
        >
          Reset
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (isInit.current) return;
    isInit.current = true;
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const fetchResult = await fetch(`${API_URL}/api/user`, {
        method: "GET",
        credentials: "include",
      });
      if (fetchResult.ok) {
        const data = await fetchResult.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const openPasswordDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setSelectedUserId(null);
    setOpenDialog(false);
  };

  const onChangePassword = async () => {
    const newPassword = newPasswordRef.current.value;
    if (!newPassword || !selectedUserId) return;

    try {
      const result = await fetch(`${API_URL}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: selectedUserId,
          newPassword: newPassword,
        }),
      });

      if (result.ok) {
        alert("Password changed successfully!");
      } else {
        alert("Failed to change password.");
      }
    } catch (err) {
      console.error("Failed to change password:", err);
    }
    closeDialog();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 px-1">
        <Typography variant="h6">User Management</Typography>
      </div>

      <DataGrid rows={users} columns={cols} getRowId={(row) => row._id} />

      <Dialog open={openDialog} onClose={closeDialog} fullWidth>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2, color: "text.secondary" }}>
            Change User Password
          </Typography>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter the new password for this user.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="new-password"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            inputRef={newPasswordRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={onChangePassword}>
            Save Password
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
