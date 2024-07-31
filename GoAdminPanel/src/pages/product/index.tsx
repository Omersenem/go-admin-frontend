import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Icon from "../../@core/components/icon";
import toast from "react-hot-toast";
import ProductDialog from "../../components/ProductDialog";

const Product = () => {
  const [data, setData] = useState([]);
  const [selectorData, setSelectorData] = useState<any[]>([]);
  const [openUpdate, setUpdateOpen] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const closeOpenDialogHandler = () => setOpen(false);
  const openOpenDialogHandler = () => setOpen(true);
  const closeUpdateDialogHandler = () => setUpdateOpen(false);
  const openUpdateDialogHandler = () => setUpdateOpen(true);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalPage, setTotalPage] = useState<number>(0);
  const prevPage = paginationModel?.page;

  const handlePageChange = (newPage: { page: number; pageSize: number }) => {
    setPaginationModel({
      page: prevPage == newPage.page ? 0 : newPage.page,
      pageSize: newPage.pageSize,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "title",
      headerName: "Adı",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Açıklama",
      flex: 1,
    },
    {
      field: "image",
      headerName: "Fotoğraf",
      flex: 1,
      renderCell: ({ row }: any) => {
        return (
          <Box key={row.id} style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', width: '100%', height: '100%' }}>
            <img src={row.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </Box>
        );
      }
    },
    {
      field: "price",
      headerName: "Fiyat",
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      flex: 0.5,
      renderCell: ({ row }: any) => {
        return (
          <>
            <IconButton color='warning' onClick={() => {
              setSelectorData(row);
              openUpdateDialogHandler();
            }}>
              <Icon icon='mdi:pencil-outline' fontSize={22} />
            </IconButton>
            <IconButton
              color='error'
              onClick={async () => {
                const url = `http://localhost:8080/api/products/${row.id}`;
                const response = await fetch(url, {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                });
                console.log('res', response);
                toast.success('Ürün başarıyla silindi.');
                setData(data.filter((item: any) => item.id !== row.id));
              }}
            >
              <Icon icon='mdi:delete-outline' fontSize={22} />
            </IconButton>
          </>
        );
      }
    }
  ];

  const fetchData = async () => {
    const url = `http://localhost:8080/api/products?page=${paginationModel?.page + 1}&limit=${paginationModel?.pageSize}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    console.log('data', data);

    setTotalPage(data?.meta?.total);
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

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Ürünler" action={<Button variant="contained" color="primary" onClick={() => openOpenDialogHandler()}>
            Ürün Ekle
          </Button>} />
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
      <ProductDialog open={open} handleClose={closeOpenDialogHandler} variant='create' />
      <ProductDialog open={openUpdate} data={selectorData} handleClose={closeUpdateDialogHandler} variant='update' />
    </Grid>
  );
}

export default Product;
