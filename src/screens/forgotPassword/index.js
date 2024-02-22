import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from "react-router";
import { login, requestResetPassword, resetPassword } from "../../api/auth";
import { Input, LoadingOverlay } from "../../components";
import { UserContext } from "../../context/userContext";
import { validateEmail } from "../../utils";
import { isEmpty } from "lodash";
import { useSearchParams } from "react-router-dom";

const logo = require("../../assets/logo_with_bg.png");

const styles = {
  button: { textTransform: "none" },
  container: {
    display: "flex",
    height: "100vh",
    flexDirection: "row",
    justifyContent: "center",
  },
  wrapper: {
    form: {
      flex: 1,
      padding: "50px 0",
    },
    image: {},
  },
  image: {
    width: "100%",
    height: "100px",
    objectFit: "contain",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "20px 0",
  },
  text: {
    fontSize: "14px",
  },
  errorCard: {
    margin: "0 0 20px",
    padding: "15px 10px",
    backgroundColor: "#F44336",
    borderColor: "#EF5350",
    color: "#ffffff",
  },
  errorText: {
    fontSize: "14px",
    lineHeight: "14px",
    padding: 0,
    margin: 0,
    fontWeight: "600",
  },
  successCard: {
    margin: "0 0 20px",
    padding: "15px 10px",
    backgroundColor: "#388E3C",
    borderColor: "#66BB6A",
    color: "#ffffff",
  },
};

const PAGE = {
  SEND_EMAIL: "SEND_EMAIL",
  UDPATE_PASSWORD: "UPDATE_PASSWORD",
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const email = searchParams.get("email");
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const apiKey = searchParams.get("apiKey");
  const { signIn, signOut, user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });

  const [page, setPage] = useState(PAGE.SEND_EMAIL);
  const [error, setError] = useState({ email: false });

  const [showAlert, setShowAlert] = useState({
    visible: false,
    type: null,
    message: "",
  });

  useEffect(() => {
    if (location?.search) {
      setPage(PAGE.UDPATE_PASSWORD);
      setForm({ ...form, email });
    }
  }, [location]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateInput = (key) => {
    const val = form[key];
    switch (key) {
      case "email":
        const isValid = isEmpty(val) ? true : validateEmail(val);
        if (!isValid) {
          setError({ ...error, email: true });
        } else {
          setError({ ...error, email: false });
        }
        break;
      case "confirmPassword":
        if (val !== form.password) {
          setError({ ...error, confirmPassword: true });
        } else {
          setError({ ...error, confirmPassword: false });
        }
        break;
      default:
        break;
    }
  };

  const onChangeInput = (key, val) => {
    setShowAlert({ visible: false, type: null, message: "" });
    setForm({ ...form, [key]: val });
    setError({ ...error, [key]: false });
  };

  const onResetPassword = async () => {
    try {
      setLoading(true);
      const res = await resetPassword(form.email, oobCode, form.password);
    } catch (err) {
      let errMsg = "Kemaskini kata laluan tidak berjaya";
      setShowAlert({ visible: true, type: "error", message: errMsg });
      console.log("[ERROR] :: ", { err });
    } finally {
      setLoading(false);
    }
  };

  const onRequestResetPassword = async () => {
    try {
      setLoading(true);
      await requestResetPassword(form.email);
      setShowAlert({
        visible: true,
        type: "success",
        message: `Emel pengesahan reset kata lalua telah berjaya dihantar. Sila semak "Inbox" atau "Spam" `,
      });
    } catch (err) {
      let errMsg = "Permohonan untuk kemaskini kata laluan tidak berjaya";
      if (err?.code === "auth/user-not-found") {
        errMsg = "Akaun tidak wujud";
      }

      setShowAlert({ visible: true, type: "error", message: errMsg });
      console.log("[ERROR] :: ", { err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container sx={styles.container}>
      <Grid item xs={11} md={6} sx={styles.wrapper.form}>
        {showAlert.visible && (
          <Paper
            xs={12}
            variant="outlined"
            sx={
              showAlert.type === "error" ? styles.errorCard : styles.successCard
            }
          >
            <Typography sx={styles.errorText}>{showAlert.message}</Typography>
          </Paper>
        )}
        <Card xs={12} variant="outlined">
          <CardContent>
            {loading && <LoadingOverlay />}
            <Grid
              container
              display="flex"
              direction="column"
              alignItems="center"
            >
              <Grid
                item
                display="flex"
                direction="column"
                alignItems="center"
                sx={styles.wrapper.image}
              >
                <img alt="" src={logo} style={styles.image} />
                <Typography sx={styles.title}>Portal Admin</Typography>
              </Grid>
              <Grid container justifyContent="center">
                <Typography sx={styles.text}>
                  Sila isi emel dan tekan butang Hantar untuk set semula Kata
                  Laluan.
                </Typography>
                <Grid item xs={12} sm={10} sx={{ margin: "20px 0 0" }}>
                  <Grid
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",

                      gap: "10px",
                    }}
                  >
                    <Grid sx={{ flex: 3 }}>
                      <Input
                        fullWidth
                        size="small"
                        label="Emel"
                        value={email || form.email}
                        onChange={(event) => {
                          onChangeInput("email", event.target.value);
                        }}
                        onBlur={() => {
                          validateInput("email");
                        }}
                        error={error.email}
                        errorText={error.email && "Emel tidak sah"}
                        disabled={email}
                      />
                    </Grid>
                    {page === PAGE.SEND_EMAIL && (
                      <Grid sx={{ flex: 1, margin: "12px 0 0" }}>
                        <Button
                          fullWidth
                          disableElevation
                          variant="contained"
                          sx={styles.button}
                          disabled={loading || !form.email || email}
                          onClick={onRequestResetPassword}
                        >
                          Hantar
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                  {/* UPDATE PASSWORD */}
                  {page === PAGE.UDPATE_PASSWORD && (
                    <Grid
                      xs={12}
                      sx={{
                        margin: "30px 0 0",
                      }}
                    >
                      <Typography sx={{ color: "grey", margin: "10px 0" }}>
                        Sila masukkan kata laluan yg baru
                      </Typography>
                      <Input
                        fullWidth
                        size="small"
                        label="Kata Laluan"
                        value={form.password}
                        onChange={(event) => {
                          onChangeInput("password", event.target.value);
                        }}
                        error={error.password}
                        errorText={error.password && "Kata laluan tidak sah"}
                        sx={{ margin: "15px 0" }}
                      />
                      <Input
                        fullWidth
                        size="small"
                        label="Sahkan Kata Laluan"
                        value={form.confirmPassword}
                        onChange={(event) => {
                          onChangeInput("confirmPassword", event.target.value);
                        }}
                        onBlur={() => {
                          validateInput("confirmPassword");
                        }}
                        error={error.confirmPassword}
                        errorText={
                          error.confirmPassword && "Kata laluan tidak sah"
                        }
                        sx={{ margin: "15px 0" }}
                      />

                      <Grid sx={{ flex: 1, margin: "12px 0 0" }}>
                        <Button
                          fullWidth
                          disableElevation
                          variant="contained"
                          sx={styles.button}
                          disabled={
                            isEmpty(form.password) ||
                            isEmpty(form.confirmPassword) ||
                            error?.confirmPassword
                          }
                          onClick={onResetPassword}
                        >
                          Hantar
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
