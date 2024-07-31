// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import React, {useState,useEffect} from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import UserDialog from "../../components/UserDialog";
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'

const UsersList = () => {
  const [data, setData] = useState([])
  const [selectorData, setSelectorData] = useState<any[]>([])
  const [totalPage, setTotalPage] = useState<number>(0);
  const [openUpdate, setUpdateOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const openDialog = () => {setOpen(false)}
  const closeUpdateDialogHandler = () => setUpdateOpen(false);
  const openUpdateDialogHandler = () => setUpdateOpen(true);

  const columns: GridColDef[] = [

    {
      field :"id",
      headerName: "ID",
      flex: 1,
    },

    {
      field: "first_name",
      headerName: "Adı",
      flex: 1,
    },
    {
      field: "last_name",
      headerName: "Soyadı",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Rol",
      flex: 1,
      renderCell: (params:any) => {
        return (
          <Typography>{params.row.role.name}</Typography>
        )
      }
    }, {
      field: 'actions',
      headerName: 'İşlemler',
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return (
          <>
            <IconButton color='warning' onClick={() => {
              openUpdateDialogHandler()
              setSelectorData(row)
              console.log('openUpdate',openUpdate)

            }}>
              <Icon icon='mdi:pencil-outline' fontSize={22} />
            </IconButton>
            <IconButton
              color='error'
              onClick={async ()  => {
                const url = `http://localhost:8080/api/users/${row.id}`
                const response = await fetch(url, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                });
                console.log('res',response)
                toast.success('Kullanıcı başarıyla silindi.')
                setData(data.filter((item: any) => item.id !== row.id))
              }}
            >
              <Icon icon='mdi:delete-outline' fontSize={22} />
            </IconButton>
          </>
        )
      }
    }

    ];
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const prevPage = paginationModel?.page;

  const handlePageChange = (newPage: { page: number; pageSize: number }) => {
    setPaginationModel({
      page: prevPage == newPage.page ? 0 : newPage.page,
      pageSize: newPage.pageSize,
    });
  };

  const fetchData = async () => {
    const url = `http://localhost:8080/api/users?page=${paginationModel?.page + 1}&limit=${paginationModel?.pageSize}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    console.log('data',data)

    setTotalPage(data?.meta?.total)
    setData((prev) =>
      prev?.length ? [...prev, ...data.data] : data.data
    );


  }

  useEffect(() => {
    const currentDataCount = data.length ?? 0;
    if (currentDataCount > paginationModel?.page * paginationModel?.pageSize)
      return;
    fetchData();
  }, [paginationModel]);

  // @ts-ignore
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Kullanıcılar" action={<Button variant="contained" color="primary" onClick={() => setOpen(true)}>
            Kullanıcı Ekle
          </Button>}/>
          <CardContent>
            <Box mt={4}>
              <DataGrid
                autoHeight
                columns={columns}
                rows={data ? data : []}
                disableRowSelectionOnClick
                pageSizeOptions={[10, 25, 50, 100]}
                paginationModel={paginationModel}
                rowCount={totalPage ? totalPage : 0}
                onPaginationModelChange={handlePageChange}

              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <UserDialog open={open} handleClose={()=>openDialog()} variant="create" />
      <UserDialog open={openUpdate} handleClose={()=>closeUpdateDialogHandler()} variant="update" data={selectorData} />

    </Grid>
  )
}

export default UsersList
