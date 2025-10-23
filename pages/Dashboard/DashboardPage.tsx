import { Backdrop, CircularProgress, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import GenericDeleteDialog from '../../components/Dialogs/GenericDeleteDialog';
import BuildingsList from '../../components/Buildings/BuildingsList';
import {
  useAddBuildingMutation,
  useAddNeighborhoodMutation,
  useDeleteBuildingMutation,
  useDeleteNeighborhoodMutation,
  useGetAllNeighborhoodBuildingsQuery,
  useGetAllNeighborhoodsQuery,
  useUpdateBuildingMutation,
  useUpdateNeighborhoodMutation,
} from '../../features/api/apiSlice';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { selectCurrentBuildingId, setSelectedBuildingId } from '../../features/buildings/buildingsSlice';
import { IBuilding } from '../../models/IBuilding';
import AddBuildingDialog from '../../components/Dialogs/Buildings/AddBuildingDialog';
import { Add as AddIcon } from '@mui/icons-material';
import { selectCurrentNeighborhood, setSelectedNeighborhood } from '../../features/neighborhoods/neighborhoodsSlice';
import NeighborhoodsList from '../../components/Neighborhoods/NeighborhoodsList';
import { INeighborhood } from '../../models/INeighborhood';
import AddNeighborhoodDialog from '../../components/Dialogs/Neighborhoods/AddNeighborhoodDialog';
import EditNeighborhoodDialog from '../../components/Dialogs/Neighborhoods/EditNeighborhoodDialog';
import EditBuildingDialog from '../../components/Dialogs/Buildings/EditBuildingDialog';
import { isSuperAdmin } from '../../helpers/PermissionsHelper';
import BuildingPanel from '../../components/Buildings/BuildingPanel';
import { skipToken } from '@reduxjs/toolkit/query';

export default function DashboardPage() {
  const authUser = useAppSelector(selectCurrentUser);
  const selectedNeighborhood = useAppSelector(selectCurrentNeighborhood);
  const selectedBuildingId = useAppSelector(selectCurrentBuildingId);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(null);

  const dispatcher = useAppDispatch();

  const { data: neighborhoods, isLoading: isLoadingNeighborhoods } = useGetAllNeighborhoodsQuery();
  const { data: buildings, isLoading: isLoadingBuildings } = useGetAllNeighborhoodBuildingsQuery(selectedNeighborhood ? { neighborhoodId: selectedNeighborhood?.id } : skipToken);

  const [openAddNeighborhoodDialog, setOpenAddNeighborhoodDialog] = useState(false);
  const [openEditNeighborhoodDialog, setOpenEditNeighborhoodDialog] = useState(false);
  const [openDeleteNeighborhoodDialog, setOpenDeleteNeighborhoodDialog] = useState(false);

  const [openAddBuildingDialog, setOpenAddBuildingDialog] = useState(false);
  const [openEditBuildingDialog, setOpenEditBuildingDialog] = useState(false);
  const [openDeleteBuildingDialog, setOpenDeleteBuildingDialog] = useState(false);

  const [addNeighborhood, addNeighborhoodResult] = useAddNeighborhoodMutation();
  const [updateNeighborhood, updateNeighborhoodResult] = useUpdateNeighborhoodMutation();
  const [deleteNeighborhood, deleteNeighborhoodResult] = useDeleteNeighborhoodMutation();

  const [addBuilding, addBuildingResult] = useAddBuildingMutation();
  const [updateBuilding, updateBuildingResult] = useUpdateBuildingMutation();
  const [deleteBuilding, deleteBuildingResult] = useDeleteBuildingMutation();

  useEffect(() => {
    if (buildings && selectedBuildingId) {
      setSelectedBuilding(buildings?.find(b => b.id === selectedBuildingId) ?? null);
    } else {
      setSelectedBuilding(null);
    }
  }, [buildings, selectedBuildingId]);

  const handleAddNeighborhood = (name: string, description: string | null) => {
    setOpenAddNeighborhoodDialog(false);
    if (authUser) {
      addNeighborhood({ name, description });
    }
  };

  const handleEditNeighborhood = (id: string, name: string, description: string | null) => {
    setOpenEditNeighborhoodDialog(false);
    if (authUser) {
      updateNeighborhood({ neighborhoodId: id, updateNeighborhood: { name, description } });
    }
  };

  const handleDeleteNeighborhood = (neighborhood: INeighborhood) => {
    setOpenDeleteNeighborhoodDialog(false);
    deleteNeighborhood({ neighborhoodId: neighborhood.id });
  };

  const handleAddBuilding = (
    name: string,
    description: string | null,
    ownerId: string,
    latitude: number,
    longitude: number,
  ) => {
    setOpenAddBuildingDialog(false);
    if (authUser && selectedNeighborhood) {
      addBuilding({ neighborhoodId: selectedNeighborhood.id, request: { name, description, ownerId, latitude, longitude } });
    }
  };

  const handleEditBuilding = (
    id: string,
    name: string,
    description: string | null,
    latitude: number,
    longitude: number,
  ) => {
    setOpenEditBuildingDialog(false);
    if (authUser && selectedNeighborhood) {
      updateBuilding({ buildingId: id, neighborhoodId: selectedNeighborhood.id, updateBuilding: { name, description, latitude, longitude } });
    }
  };

  const handleCloseDeleteNeighborhoodDialog = () => {
    setOpenDeleteNeighborhoodDialog(false);
    dispatcher(setSelectedNeighborhood(null));
  };

  const handleCloseDeleteBuildingDialog = () => {
    setOpenDeleteBuildingDialog(false);
    dispatcher(setSelectedBuildingId(null));
  };

  const handleDeleteBuilding = (building: IBuilding) => {
    setOpenDeleteBuildingDialog(false);
    deleteBuilding({ buildingId: building.id, neighborhoodId: building.neighborhoodId });
  };

  return (
    <>
      <Grid
        container
        display="flex"
        rowSpacing={1}
        direction="row"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Grid item xs={12} sx={{ m: 1 }}>
          <Stack direction="row" spacing={1} minHeight="100%">
            <Stack direction="column" width="30%" height="88vh" spacing={1}>
              <Paper elevation={4} sx={{ width: '100%', height: '50%' }} square>
                <Stack direction="column" width="100%" height="100%" padding={2} spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" fontWeight="bold">
                      Vecindarios
                    </Typography>
                    {isSuperAdmin(authUser) && (
                      <IconButton onClick={() => setOpenAddNeighborhoodDialog(true)}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Stack>
                  <NeighborhoodsList
                    neighborhoods={neighborhoods}
                    selectedNeighborhood={selectedNeighborhood}
                    onSelectedNeighborhood={(neighborhood) => {
                      dispatcher(setSelectedNeighborhood(neighborhood.id));
                    }}
                    onEditNeighborhoodClick={(neighborhood) => {
                      dispatcher(setSelectedNeighborhood(neighborhood.id));
                      setOpenEditNeighborhoodDialog(true);
                    }}
                    onDeleteNeighborhoodClick={(neighborhood) => {
                      dispatcher(setSelectedNeighborhood(neighborhood.id));
                      setOpenDeleteNeighborhoodDialog(true);
                    }}
                    isLoading={isLoadingNeighborhoods}
                  />
                </Stack>
              </Paper>
              <Paper elevation={4} sx={{ width: '100%', height: '50%' }} square>
                <Stack direction="column" width="100%" height="100%" padding={2} spacing={1}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" fontWeight="bold">
                      Edificios
                    </Typography>
                    {isSuperAdmin(authUser) && (
                      <IconButton disabled={!selectedNeighborhood} onClick={() => setOpenAddBuildingDialog(true)}>
                        <AddIcon />
                      </IconButton>
                    )}
                  </Stack>
                  <BuildingsList
                    buildings={buildings}
                    selectedBuilding={selectedBuilding}
                    onSelectedBuilding={(building) => {
                      dispatcher(setSelectedBuildingId(building.id));
                    }}
                    onEditBuildingClick={(building) => {
                      dispatcher(setSelectedBuildingId(building.id));
                      setOpenEditBuildingDialog(true);
                    }}
                    onDeleteBuildingClick={(building) => {
                      dispatcher(setSelectedBuildingId(building.id));
                      setOpenDeleteBuildingDialog(true);
                    }}
                    isLoading={isLoadingBuildings}
                  />
                </Stack>
              </Paper>
            </Stack>

            <Stack direction="column" width="100%" height="88vh" spacing={1}>
              <Paper elevation={4} sx={{ width: '100%', height: '100%' }} square>
                {selectedBuilding ? (
                  <Stack direction="column" width="100%" height="100%" paddingX={2} spacing={1}>
                    <BuildingPanel building={selectedBuilding} />
                  </Stack>
                ) : (
                  <Stack width="100%" height="100%" alignItems="center" justifyContent="center">
                    <Typography variant="body1">
                      Selecciona un vecindario y un edificio para ver los detalles
                    </Typography>
                  </Stack>
                )}
              </Paper>
            </Stack>
          </Stack>
        </Grid>
      </Grid>

      {openAddNeighborhoodDialog && (
        <AddNeighborhoodDialog
          openDialog={openAddNeighborhoodDialog}
          handleClose={() => setOpenAddNeighborhoodDialog(false)}
          handleAddNeighborhood={handleAddNeighborhood}
        />
      )}

      {openAddBuildingDialog && (
        <AddBuildingDialog
          openDialog={openAddBuildingDialog}
          handleClose={() => setOpenAddBuildingDialog(false)}
          handleAddBuilding={handleAddBuilding}
        />
      )}

      {openEditNeighborhoodDialog && selectedNeighborhood && (
        <EditNeighborhoodDialog
          openDialog={openEditNeighborhoodDialog}
          handleClose={() => setOpenEditNeighborhoodDialog(false)}
          neighborhood={selectedNeighborhood}
          handleUpdateNeighborhood={handleEditNeighborhood}
        />
      )}

      {openEditBuildingDialog && selectedBuilding && (
        <EditBuildingDialog
          openDialog={openEditBuildingDialog}
          building={selectedBuilding}
          handleClose={() => setOpenEditBuildingDialog(false)}
          handleUpdateBuilding={handleEditBuilding}
        />
      )}

      {openDeleteNeighborhoodDialog && selectedNeighborhood && (
        <GenericDeleteDialog
          openDialog={openDeleteNeighborhoodDialog}
          handleClose={handleCloseDeleteNeighborhoodDialog}
          title={`Quieres eliminar ${selectedNeighborhood.name} con Id ${selectedNeighborhood.id} ?`}
          message="Está acción no es reversible"
          handleDelete={() => handleDeleteNeighborhood(selectedNeighborhood)}
        />
      )}

      {openDeleteBuildingDialog && selectedBuilding && (
        <GenericDeleteDialog
          openDialog={openDeleteBuildingDialog}
          handleClose={handleCloseDeleteBuildingDialog}
          title={`Quieres eliminar ${selectedBuilding.name} con Id ${selectedBuilding.id} ?`}
          message="Está acción no es reversible"
          handleDelete={() => handleDeleteBuilding(selectedBuilding)}
        />
      )}

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={
          addBuildingResult.isLoading ||
          deleteBuildingResult.isLoading ||
          addNeighborhoodResult.isLoading ||
          deleteNeighborhoodResult.isLoading ||
          updateNeighborhoodResult.isLoading ||
          updateBuildingResult.isLoading
        }
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
