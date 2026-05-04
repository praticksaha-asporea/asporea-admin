import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import dataTable from "../../tables/DashboardTables.module.scss"

interface UserVerifyModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  imageSrc?: string;
  loading?: boolean;
  buttonLabel?: string
}

const UserVerifyModal: React.FC<UserVerifyModalProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Verify User",
  description = "Are you sure you want to verify this user?",
  imageSrc,
  loading = false,
  buttonLabel = "Verify"
}) => {
  return (
    <Dialog
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "35px",
          overflowY: "inherit",
          padding: "40px",
          maxWidth: "562px",
        },
      }}
      maxWidth="md"
      fullWidth
      className={dataTable.custommodal}
      open={open}
      onClose={onClose}
    >
      {imageSrc && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", }}>
          <img src={imageSrc} alt="Dialog Visual" style={{height:'100px', width:'100px' }}/>
        </div>
      )}

      <DialogTitle
        style={{
          textAlign: "center",
          fontSize: "32px",
          color: "#000",
          fontWeight: "700",
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          style={{
            textAlign: "center",
            color: "#676767",
            fontSize: "16px",
          }}
        >
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions style={{ justifyContent: "center", gap: "15px" }}>
        <Button onClick={onClose} className="btn btn-gray" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} className="btn" disabled={loading}>
          {buttonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserVerifyModal;
