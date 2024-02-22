import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Popover,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

import {
  AccessTimeOutlined,
  Block,
  Phone,
  ThumbUp,
  WhatsApp,
} from "@mui/icons-material";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import {
  approveUser,
  getUsers,
  rejectUser,
  updatedAvailableIdNumbers,
} from "../../api/user";
import { stateStr } from "../../constants/form";
import MuiTable from "../../components/MuiTable";
import Actions from "./Actions";
import { isEmpty } from "lodash";
import { REST_CODE } from "../../api/constants";
import { Toast } from "../../components";

const styles = {
  button: {
    textTransform: "none",
  },
  actionButton: {
    textTransform: "none",
    margin: "0 5px",
  },
};

let customBodyCellStyle = {
  fontSize: "14px",
  lineHeight: "18px",
  textAlign: "start",
  margin: 0,
  // padding: "0 15px",
  padding: 0,
  whiteSpace: "break-spaces",
};

let customHeadLabelStyle = {
  textTransform: "capitalize",
  fontWeight: "bold",
  fontSize: "16px",
  lineHeight: "20px",
  textAlign: "start",
  margin: 0,
  padding: 0,
};

const CustomCell = ({ value, clickable, onClick = () => {} }) => {
  return (
    <div style={{ cursor: clickable ? "pointer" : "none" }}>
      <Typography sx={{ fontSize: "14px", whiteSpace: "break-spaces" }}>
        {value}
      </Typography>
    </div>
  );
};

const PhoneCell = ({ value }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const onClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        disabled={!value}
        variant="text"
        sx={{ textTransform: "none" }}
        onClick={onClick}
      >
        {value}
      </Button>
      <Popover
        // id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        sx={{ border: "1px solid #e0e0e0" }}
      >
        <Grid
          container
          display="flex"
          direction="column"
          p={1}
          sx={{ border: "1px solid #e0e0e0", borderRadius: "10px" }}
        >
          <Button
            target="_blank"
            href={`tel:${value}`}
            sx={[styles.button, { color: "#1565C0" }]}
            endIcon={<Phone />}
          >
            Call
          </Button>
          <Button
            target="_blank"
            href={`https://wa.me/${value}`}
            sx={[styles.button, { color: "green" }]}
            endIcon={<WhatsApp />}
          >
            Whatsapp
          </Button>
        </Grid>
      </Popover>
    </>
  );
};

const StatusChip = ({ value = "pending" }) => {
  const getColor = () => {
    switch (value) {
      case "approved":
        return "#1E88E5";
      case "pending":
        return "#F9A825";
      case "rejected":
        return "#E53935";
      default:
        return "#000";
    }
  };

  const getIcon = () => {
    switch (value) {
      case "approved":
        return (
          <ThumbUp
            sx={{ fontSize: "20px", margin: "0 10px 0 0", color: getColor() }}
          />
        );
      case "pending":
        return (
          <AccessTimeOutlined
            sx={{ fontSize: "20px", margin: "0 10px 0 0", color: getColor() }}
          />
        );
      case "rejected":
        return (
          <Block
            sx={{ fontSize: "20px", margin: "0 10px 0 0", color: getColor() }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        border: `1px solid ${getColor()}`,
        borderRadius: "10px",
        padding: "5px 10px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {getIcon()}
      <Typography
        sx={{
          flex: 1,
          fontSize: "14px",
          whiteSpace: "break-spaces",
          color: getColor(),
          textTransform: "capitalize",
          // cursor: "pointer",
        }}
      >
        {value}
      </Typography>
    </div>
  );
};

// ==========================================================================================================================
// MAIN =====================================================================================================================
// ==========================================================================================================================

const Users = () => {
  const mobileView = useMediaQuery("(max-width:600px)");

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState({
    name: "created_at",
    direction: "asc",
  });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchValue, setSearchValue] = useState(null);
  const [negeriIndex, setNegeriIndex] = useState(5);

  const [showToast, setShowToast] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const [tableOption, setTableOption] = useState({
    onChangeRowsPerPage: (row) => {
      setPageSize(row);
    },
    onChangePage: (index) => {
      if (index < 0 || !index) {
        setCurrentPageIndex(1);
      } else {
        setCurrentPageIndex(index);
      }
    },
  });

  const getUsersData = async ({
    search = null,
    size = 10,
    pageIndex = 1,
    sortBy = { name: "updated_by", direction: "desc" },
  }) => {
    try {
      setLoading(true);
      const results = await getUsers({
        search,
        pageSize: size,
        pageIndex,
        sortBy,
      });

      setData(results?.users);
      setTotal(results?.total);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onRowClick = (rowData, rowMeta) => {};

  useEffect(() => {
    getUsersData({
      search: searchValue,
      size: pageSize,
      pageIndex: currentPageIndex,
      sortBy: { name: "updated_at", direction: "desc" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, currentPageIndex]);

  const onUpdateNumberList = async () => {
    await updatedAvailableIdNumbers();
  };

  const onApproveSingle = async ({ id, state }) => {
    try {
      setLoading(true);
      const res = await approveUser({ id, state });
      const { status, message } = res;

      if (status !== REST_CODE.ERROR) {
        setShowToast({
          open: true,
          severity: "success",
          message: "Ahli telah berjaya diterima",
        });
        getUsersData({
          search: searchValue,
          pageIndex: currentPageIndex,
          size: pageSize,
          sortBy: sortOrder,
        });
      }
    } catch (err) {
      console.log("[ERROR] :: ", { err });
    } finally {
      setLoading(false);
    }
  };

  const onRejectSingle = async (id) => {
    try {
      setLoading(true);
      await rejectUser(id);
      setShowToast({
        open: true,
        severity: "success",
        message: "Ahli telah ditolak",
      });
      getUsersData({
        search: searchValue,
        pageIndex: currentPageIndex,
        size: pageSize,
        sortBy: sortOrder,
      });
    } catch (err) {
      console.log("[ERROR] :: ", { err });
    } finally {
      setLoading(false);
    }
  };

  const onColumnOrderChange = (changedCol, direction) => {
    // console.log("[DEBUG] :: ", {});
  };

  const onSearchChange = (searchText) => {
    setSearchValue(searchText);
  };

  // const onColumnSortChange = (changedColumn, direction) => {
  //   console.log("[DEBUG] :: ", { changedColumn, direction });
  //   getUsersData({
  //     search: searchValue,
  //     size: pageSize,
  //     pageIndex: 0,
  //     sortBy: { column: changedColumn, direction },
  //   });
  // };

  const onSearchClose = () => {
    if (!isEmpty(searchValue)) {
      setSearchValue(null);
      getUsersData({
        search: null,
        pageIndex: currentPageIndex,
        size: pageSize,
        sortBy: sortOrder,
      });
    }
  };

  const actionsColumn = {
    name: "status",
    label: "Actions",
    options: {
      sort: false,
      filter: false,
      download: false,
      searchable: false,
      print: false,
      setCellProps: () => ({
        style: {
          whiteSpace: "nowrap",
          position: "sticky",
          right: 0,
          background: "#FAFAFA",
          zIndex: 100,
        },
      }),
      setCellHeaderProps: () => ({
        style: {
          whiteSpace: "nowrap",
          position: "sticky",
          right: "0px",
          background: "#FAFAFA",
          boxSizing: "border-box",
          zIndex: 101,
        },
      }),
      customHeadLabelRender: (columnMeta) => {
        let width = mobileView ? "80px" : "100px";
        customHeadLabelStyle = {
          ...customHeadLabelStyle,
          textAlign: "center",
          width,
        };
        return (
          <Typography sx={customHeadLabelStyle}>{columnMeta?.label}</Typography>
        );
      },
      customBodyRender: (value, tableMeta) => {
        const id = tableMeta?.rowData?.[0];
        const state = negeriIndex
          ? tableMeta?.rowData?.[negeriIndex]
          : tableMeta?.rowData?.[5];

        return (
          <Actions
            loading={loading}
            status={value}
            onApprove={() => {
              onApproveSingle({ id, state });
            }}
            onReject={() => {
              onRejectSingle(id);
            }}
          />
        );
      },
    },
  };

  const defaultColumnOptions = {
    filter: false,
    sort: false,
    customHeadLabelRender: (columnMeta) => {
      let width = "100px";

      if (
        columnMeta?.name === "nama" ||
        columnMeta?.name === "pendidikan" ||
        columnMeta?.name === "pekerjaan" ||
        columnMeta?.name === "alamat"
      ) {
        width = "250px";
      }

      customHeadLabelStyle = { ...customHeadLabelStyle, width };

      return (
        <Typography sx={customHeadLabelStyle}>{columnMeta?.label}</Typography>
      );
    },
    customBodyRender: (val, tableMeta) => {
      let bodyStyle = { ...customBodyCellStyle };
      let value = val || "-";
      if (tableMeta?.columnData?.name === "tel") {
        return <PhoneCell value={value} />;
      }

      if (tableMeta?.columnData?.name === "no_ahli") {
        return <CustomCell clickable onClick={() => {}} value={value} />;
      }
      if (tableMeta?.columnData?.name === "status") {
        return <StatusChip value={value} />;
      }

      if (tableMeta?.columnData?.name === "negeri") {
        value = stateStr[val];
        setNegeriIndex(tableMeta.columnIndex);
      } else if (
        tableMeta?.columnData?.name === "created_at" ||
        tableMeta?.columnData?.name === "updated_at"
      ) {
        value = moment(val).format("DD MMM YYYY HH:mm:ss A");
        bodyStyle = {
          ...customBodyCellStyle,
          width: "200px",
        };
      } else if (
        tableMeta?.columnData?.name === "nama" ||
        tableMeta?.columnData?.name === "pendidikan" ||
        tableMeta?.columnData?.name === "pekerjaan" ||
        tableMeta?.columnData?.name === "alamat"
      ) {
        bodyStyle = {
          ...customBodyCellStyle,
          width: "250px",
        };
      }

      return <Typography sx={bodyStyle}>{value}</Typography>;
    },
  };

  const columns = [
    {
      name: "id",
      label: "ID",
      options: { ...defaultColumnOptions, display: false },
    },
    {
      name: "id",
      label: "Bil",
      options: {
        ...defaultColumnOptions,
        customHeadLabelRender: (columnMeta) => {
          return (
            <Typography
              sx={{
                ...customHeadLabelStyle,
                width: "auto",
              }}
            >
              {columnMeta?.label}
            </Typography>
          );
        },
        customBodyRender: (val, tableMeta) => {
          return (
            <Typography
              sx={{
                ...customBodyCellStyle,
                width: "auto",
                textAlign: "center",
              }}
            >
              {tableMeta.rowIndex + 1}
            </Typography>
          );
        },
      },
    },
    {
      name: "no_ahli",
      label: "No. Ahli",
      options: {
        ...defaultColumnOptions,
        sort: true,
        filter: true,
      },
    },
    {
      name: "nama",
      label: "Nama",
      options: { ...defaultColumnOptions, sort: true, filter: true },
    },
    {
      name: "no_kp",
      label: "No. Kad Pengnalan",
      options: { ...defaultColumnOptions },
    },
    {
      name: "status",
      label: "Status",
      options: { ...defaultColumnOptions, filter: true, sort: true },
    },
    {
      name: "negeri",
      label: "Negeri",
      options: { ...defaultColumnOptions, filter: true, sort: true },
    },
    {
      name: "tel",
      label: "No. Tel",
      options: { ...defaultColumnOptions },
    },
    {
      name: "emel",
      label: "Emel",
      options: { ...defaultColumnOptions },
    },
    {
      name: "alamat",
      label: "Alamat",
      options: { ...defaultColumnOptions },
    },
    {
      name: "pendidikan",
      label: "Pendidikan",
      options: { ...defaultColumnOptions },
    },
    {
      name: "pekerjaan",
      label: "Pekerjaan",
      options: { ...defaultColumnOptions },
    },
    {
      name: "type",
      label: "Jenis Pendaftaran",
      options: {
        ...defaultColumnOptions,
        customBodyRender: (val, tableMeta) => {
          let bodyStyle = { ...customBodyCellStyle };
          let value = val || "-";
          const typeText = value === "new" ? "Pendaftaran Baru" : "Kemaskini";

          return <Typography sx={bodyStyle}>{typeText}</Typography>;
        },
      },
    },
    {
      name: "created_at",
      label: "Created At",
      options: { ...defaultColumnOptions, filter: true, sort: true },
    },
    {
      name: "updated_at",
      label: "Updated At",
      options: { ...defaultColumnOptions, filter: true, sort: true },
    },
  ];

  return (
    <div>
      <Toast
        open={showToast.open}
        severity={showToast.severity}
        message={showToast.message}
        onClose={() => {
          setShowToast({
            // message: "",
            // severity: "info",
            open: false,
          });
        }}
      />
      <div style={{ border: "1px solid #EEEEEE", position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.8)",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
            }}
          >
            <CircularProgress />
          </div>
        )}
        <MuiTable
          data={data}
          columns={[...columns, actionsColumn]}
          options={{
            ...tableOption,
            downloadOptions: {
              filename: `${moment().format("DD-MM-YYYY")}_ahli_perkasa.csv`,
              separator: ",",
              filterOptions: {
                useDisplayedColumnsOnly: false,
                useDisplayedRowsOnly: false,
              },
            },
            sortOrder,
            onRowClick,
            onColumnOrderChange,
            count: total,
            page: currentPageIndex,
            pageSize,
            onSearchChange,
            onSearchClose,
            // onColumnSortChange,
            // searchable: true,
          }}
        />
      </div>
      <Dialog
        open={selectedUser !== null}
        onClose={() => {
          setSelectedUser(null);
        }}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
