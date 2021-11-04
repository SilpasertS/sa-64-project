import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { ReceiptInterface } from "../models/IReceipt";
import moment from "moment";
import { format } from 'date-fns'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);

function Receipts() {
  const classes = useStyles();
  const [receipts, setReceipts] = useState<ReceiptInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getReceipts = async () => {
    fetch(`${apiUrl}/receipts`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setReceipts(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getReceipts();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลใบเสร็จชำระเงิน
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/receipt/create"
              variant="contained"
              color="primary"
            >
              ออกใบเสร็จ
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="15%">
                  ลำดับใบเสร็จ
                </TableCell>
                <TableCell align="center" width="15%">
                  เลขที่บิล
                </TableCell>
                <TableCell align="center" width="20%">
                  ช่องทางการชำระ
                </TableCell>
                <TableCell align="center" width="20%">
                  ผู้ดำเนินการ
                </TableCell>
                <TableCell align="center" width="30%">
                  วันที่และเวลา
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {receipts.map((item: ReceiptInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.ID}</TableCell>
                  <TableCell align="center">{item.Bill.ID}</TableCell>
                  <TableCell align="center">{item.Method.Type}</TableCell>
                  <TableCell align="center">{item.Cashier.Name}</TableCell>
                  <TableCell align="center">{moment(item.SavedTime).format('D MMMM YYYY (HH:mm')}{" น.)"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default Receipts;