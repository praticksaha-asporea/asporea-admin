import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import img1 from "../../../assets/images/product-img1.png";
import dataTable from "./datatable.module.scss";
import edit from "../../../assets/images/ri_edit-line.png";
import del from "../../../assets/images/ic_outline-delete.png";
import delt from "../../../assets/images/delete.png";

function createData(
  id: number | string,
  product: string,
  img: any,
  date: number | string,
  inventory: number | string,
  price: number | string,
  category: {
    categoryName:string
  } | any,
  status: string,
  actions: string
) {
  return {
    id,
    product,
    img,
    date,
    inventory,
    price,
    category,
    status,
    actions,
  };
}

const rows = [
  createData(
    "Q23-0117",
    "Apple AirPods",
    img1,
    "04 Feb, 2024",
    30,
    "$200.00",
    "Digital",
    "Approved",
    "action"
  ),
  createData(
    "Q23-0117",
    "NUBWO G06",
    img1,
    "04 Feb, 2024",
    30,
    "$200.00",
    "Digital",
    "Approved",
    "action"
  ),
  createData(
    "Q23-0117",
    "Hooded Sweatshirt",
    img1,
    "04 Feb, 2024",
    30,
    "$200.00",
    "Digital",
    "Approved",
    "action"
  ),
  createData(
    "Q23-0117",
    "Keyboard",
    img1,
    "04 Feb, 2024",
    30,
    "$200.00",
    "Digital",
    "Approved",
    "action"
  ),
  createData(
    "Q23-0117",
    "T-Shirt",
    img1,
    "04 Feb, 2024",
    30,
    "$200.00",
    "Digital",
    "Approved",
    "action"
  ),
  createData(
    "Q23-0117",
    "LED Monitor",
    img1,
    "04 Feb, 2024",
    30,
    "$200.00",
    "Digital",
    "Approved",
    "action"
  ),
];

export default function DataTable() {
  const [open, setOpen] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 3; // Set the number of rows per page

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Calculate the subset of rows to display based on the current page and rows per page
  const paginatedRows = rows.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <>
      <div
        className={dataTable.datatablemainwrap}
        style={
          {
            // backgroundColor: "#f2f2f2",
            // padding: "60px 30px",
            // borderRadius: "35px",
          }
        }
      >
        <h2>Products</h2>
        <TableContainer className={dataTable.tbodymain} component={Paper}>
          <Table
            sx={{ minWidth: 1000 }}
            aria-label='simple table'
            style={{ borderCollapse: "separate", borderSpacing: "0px 15px" }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Product ID</TableCell>
                <TableCell align='left'>Product</TableCell>
                <TableCell align='left'>Date</TableCell>
                <TableCell align='left'>Inventory</TableCell>
                <TableCell align='left'>Price</TableCell>
                <TableCell align='left'>Category</TableCell>
                <TableCell align='left'>Status</TableCell>
                <TableCell align='left'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={dataTable.tbodywrap}>
              {paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align='left'>{row.id}</TableCell>
                  <TableCell
                    className={dataTable.productwrp}
                    component='th'
                    scope='row'
                  >
                    <img src={row.img} alt={row.product} /> {row.product}
                  </TableCell>
                  <TableCell align='left'>{row.date}</TableCell>
                  <TableCell align='left'>{row.inventory}</TableCell>
                  <TableCell align='left'>{row.price}</TableCell>
                  <TableCell align='left'>{row?.category?.categoryName}</TableCell>
                  <TableCell className={dataTable.approved} align='left'>
                    <p>{row.status}</p>
                  </TableCell>
                  <TableCell align='left'>
                    <div className={dataTable.actionwrap}>
                      <p className={dataTable.edit} onClick={handleClickOpen}>
                        <img src={edit} alt='Edit' />
                      </p>
                     <a className="dell">
                      <p className={dataTable.delete}>
                        <img src={del} alt='Delete' />
                      </p>
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          spacing={2}
          justifyContent={"center"}
          alignItems='center'
          style={{ marginTop: "30px" }}
        >
          <Pagination
            count={Math.ceil(rows.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            sx={{
              ".MuiPaginationItem-page": {
                backgroundColor: "#fff",
                color: "#414141",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                "&.Mui-selected": {
                  backgroundColor: "#FF0000",
                  color: "#fff",
                },
                "&:hover": {
                  backgroundColor: "#FF0000",
                  color: "#fff",
                },
              },
              "& .MuiPagination-ul": {
                justifyContent: "center",
              },
            }}
          />
        </Stack>
      </div>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "35px",
            overflowY: "inherit",
            padding: "40px",
            maxWidth: "562px",
          },
        }}
        maxWidth={"md"}
        fullWidth
        className={dataTable.custommodal}
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <div className={dataTable.modalimg}>
          <img src={delt} alt='Delete Confirmation' />
        </div>
        <DialogTitle
          id='alert-dialog-title'
          style={{
            textAlign: "center",
            fontSize: "32px",
            color: "#000",
            fontWeight: "700",
          }}
        >
          {"Delete Customer"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            style={{
              textAlign: "center",
              color: "#676767",
              fontSize: "16px",
            }}
          >
            Are you sure you want to delete this?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center", gap: "15px"}}>
          <Button onClick={handleClose} className="btn btn-gray">Cancel</Button>
          <Button onClick={handleClose} className="btn">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
