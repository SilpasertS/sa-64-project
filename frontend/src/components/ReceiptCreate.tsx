import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { MenuItem } from "@material-ui/core";
import { CashiersInterface } from "../models/ICashier";
import { BillsInterface } from "../models/IBill";
import { MethodsInterface } from "../models/IMethod";
import { ReceiptInterface } from "../models/IReceipt";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function ReceiptCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [cashiers, setCashiers] = useState<CashiersInterface>();
  const [bills, setBills] = useState<BillsInterface[]>([]);
  const [methods, setMethods] = useState<MethodsInterface[]>([]);
  const [receipt, setReceipt] = useState<Partial<ReceiptInterface>>(
    {}
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const apiUrl = "http://localhost:8080";
  const requestMenuItems = {
    method: "GET",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json" },
    
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };


  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof receipt;
    setReceipt({
      ...receipt,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getCashier = async () =>{
    let uid = localStorage.getItem("uid");
    console.log(uid);
    fetch(`${apiUrl}/cashier/${uid}`, requestMenuItems)
        .then((response) => response.json())
        .then((res) => {
            receipt.CashierID = res.data.ID
            if (res.data){
                setCashiers(res.data);
            }
            else{
                console.log("else");
            }
        });
};

  const getBills = async () => {
    fetch(`${apiUrl}/bills`, requestMenuItems)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setBills(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getMethods = async () => {
    fetch(`${apiUrl}/methods`, requestMenuItems)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setMethods(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getCashier();
    getBills();
    getMethods();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      CashierID: convertType(receipt.CashierID),
      BillID: convertType(receipt.BillID),
      MethodID: convertType(receipt.MethodID),
      SavedTime: selectedDate,
    };

    const requestOptionsPost = {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/receipts`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("???????????????????????????")
          setSuccess(true);
        } else {
          console.log("????????????????????????????????????")
          setError(true);
        }
      });
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          ??????????????????????????????????????????????????????
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          ???????????????????????????????????????????????????????????????
        </Alert>
      </Snackbar>
      <Paper className={classes.paper}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ???????????????????????????????????????
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>??????????????????????????????????????????????????????</p>
              <Select
                native
                value={receipt.CashierID}
                onChange={handleChange}
                disabled
                inputProps={{
                  name: "CashierID",
                }}
              >
                <option aria-label="None" value="">
                  ????????????????????????????????????????????????????????????????????????????????????
                </option>
                <option value={cashiers?.ID} key={cashiers?.ID}>
                  {cashiers?.Name}
                </option>

              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>????????????????????????????????????????????????</p>
              <Select
                
                value={receipt.BillID}
                onChange={handleChange}
                inputProps={{
                  name: "BillID",
                }}
              >
                <MenuItem aria-label="None" value="">
                  ??????????????????????????????????????????????????????????????????????????????
                </MenuItem>
                {bills.map((item: BillsInterface) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.ID}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>??????????????????????????????????????????</p>
              <Select
                
                value={receipt.MethodID}
                onChange={handleChange}
                inputProps={{
                  name: "MethodID",
                }}
              >
                <MenuItem aria-label="None" value="">
                  ????????????????????????????????????????????????????????????????????????
                </MenuItem>
                {methods.map((item: MethodsInterface) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.Type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>???????????????????????????????????????</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="SavedTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="?????????????????????????????????????????????????????????????????????"
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/receipts"
              variant="contained"
            >
              ????????????
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              ??????????????????
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ReceiptCreate;