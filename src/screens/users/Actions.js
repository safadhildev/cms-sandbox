import { Block, Delete, ThumbUp } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";

const styles = {
  button: {
    textTransform: "none",
  },
  actionButton: {
    textTransform: "none",
    margin: "0 5px",
  },
};

const ACTION_CONSTANTS = {
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  DELETE: "DELETE",
};

const ButtonByViewType = ({ disabled, sx, onClick, icon, text }) => {
  const mobileView = useMediaQuery("(max-width:600px)");

  return (
    <Button
      disabled={disabled}
      variant="outlined"
      sx={sx}
      endIcon={!mobileView && icon}
      onClick={onClick}
    >
      {mobileView ? icon : text}
    </Button>
  );
};

const Actions = ({ loading, status, onApprove, onReject, onDelete }) => {
  const mobileView = useMediaQuery("(max-width:600px)");
  const [openDialog, setOpenDialog] = useState({
    visible: false,
    type: null,
    title: "",
    contentText: "",
    confirmText: "",
    cancelText: "",
    onConfirm: () => {},
    confirmButtonStyle: {},
  });

  const onCloseDialog = () => {
    setOpenDialog({
      visible: false,
      type: null,
      title: "",
      contentText: "",
      confirmText: "",
      cancelText: "",
      onConfirm: () => {},
      confirmButtonStyle: {},
    });
  };

  const onOpenDialog = (type) => {
    let opt = {
      visible: true,
      type,
      title: "",
      contentText: "Are you sure?",
      confirmText: "Confirm",
      cancelText: "Cancel",
      onConfirm: () => {},
      confirmButtonStyle: {},
    };

    switch (type) {
      case ACTION_CONSTANTS.APPROVE:
        opt = {
          ...opt,
          title: "Approve user",
          confirmText: "Approve",
          onConfirm: onApprove,
        };
        break;
      case ACTION_CONSTANTS.REJECT:
        opt = {
          ...opt,
          title: "Reject user",
          confirmText: "REJECT",
          onConfirm: onReject,
          confirmButtonStyle: {
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "red",
              color: "#FFF",
            },
          },
        };
        break;
      case ACTION_CONSTANTS.DELETE:
        opt = {
          ...opt,
          title: "Delete user",
          contentText: "Are you sure to permanently delete user?",
          confirmText: "Delete",
          onConfirm: onDelete,
          confirmButtonStyle: {
            backgroundColor: "red",
            "&:hover": {
              backgroundColor: "red",
              color: "#FFF",
            },
          },
        };
        break;
      default:
        break;
    }

    return setOpenDialog(opt);
  };

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: mobileView ? "column" : "row",
        gap: mobileView && "10px",
      }}
    >
      <ButtonByViewType
        disabled={loading || status === "approved"}
        variant="outlined"
        size={mobileView ? "small" : "default"}
        sx={[
          styles.actionButton,
          {
            color: "#1E88E5",
            borderColor: "#1E88E5",
            "&:hover": {
              backgroundColor: "#1E88E5",
              color: "#FFF",
              borderColor: "#1E88E5",
            },
          },
        ]}
        icon={<ThumbUp />}
        onClick={() => {
          onOpenDialog(ACTION_CONSTANTS.APPROVE);
        }}
        text="Approve"
      />

      <ButtonByViewType
        disabled={loading || status === "rejected"}
        sx={[
          styles.actionButton,
          {
            color: "#E53935",
            borderColor: "#E53935",
            "&:hover": {
              backgroundColor: "#E53935",
              color: "#FFF",
              borderColor: "#E53935",
            },
          },
        ]}
        icon={<Block />}
        onClick={() => onOpenDialog(ACTION_CONSTANTS.REJECT)}
        text="Reject"
      />

      {/* <IconButton
        disabled={loading}
        variant="outlined"
        size="small"
        sx={[
          styles.actionButton,
          {
            color: "#E53935",
            borderColor: "#E53935",
            "&:hover": {
              backgroundColor: "#E53935",
              color: "#FFF",
              borderColor: "#E53935",
            },
          },
        ]}
        onClick={() => onOpenDialog(ACTION_CONSTANTS.DELETE)}
      >
        <Delete />
      </IconButton> */}
      <Dialog
        open={openDialog.visible}
        onClose={onCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{openDialog.title}</DialogTitle>
        <DialogContent sx={{ width: "300px" }}>
          <DialogContentText id="alert-dialog-description">
            {openDialog.contentText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog} sx={{ color: "#00000099" }}>
            {openDialog.cancelText}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              openDialog.onConfirm();
              onCloseDialog();
            }}
            sx={{ ...openDialog.confirmButtonStyle }}
            autoFocus
          >
            {openDialog.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Actions;
