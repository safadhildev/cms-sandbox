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
import React, { useContext, useEffect, useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import { login } from "../../api/auth";
import { Input, LoadingOverlay } from "../../components";
import { UserContext } from "../../context/userContext";

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

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signOut, user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: null,
    password: null,
  });

  const [showAlert, setShowAlert] = useState({ visible: false, type: null });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onChangeInput = (key, val) => {
    setShowAlert({ visible: false, type: null });
    setForm({ ...form, [key]: val });
  };

  const onLogin = async () => {
    try {
      setLoading(true);
      const res = await login(form);
      setShowAlert({ visible: true, type: "success" });
      signIn({
        uid: res?.user.uid,
        displayName: res?.user?.displayName,
        email: res?.user?.email,
      });
      navigate("/laman-utama", { replace: true });
    } catch (err) {
      setShowAlert({ visible: true, type: "error" });
      console.log("[ERROR] :: ", { err });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/terlupa-kata-laluan");
  };
  useEffect(() => {
    signOut();
  }, []);

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
            <Typography sx={styles.errorText}>
              {showAlert.type === "error"
                ? "Emel atau Kata Laluan anda tidak sah"
                : "Log masuk berjaya"}
            </Typography>
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
                <Grid item xs={12} sm={10} md={7}>
                  <Input
                    fullWidth
                    label="Emel"
                    onChange={(event) => {
                      onChangeInput("email", event.target.value);
                    }}
                  />
                  <Input
                    fullWidth
                    label="Kata Laluan"
                    type={showPassword ? "text" : "password"}
                    onChange={(event) => {
                      onChangeInput("password", event.target.value);
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Grid
                    xs={12}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      margin: "50px 0 20px",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      fullWidth
                      size="large"
                      disableElevation
                      variant="contained"
                      sx={styles.button}
                      disabled={loading}
                      onClick={onLogin}
                    >
                      Log Masuk
                    </Button>
                    <Button
                      size="medium"
                      disableElevation
                      variant="text"
                      sx={styles.button}
                      disabled={loading}
                      onClick={handleForgotPassword}
                    >
                      Lupa Kata Laluan?
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
