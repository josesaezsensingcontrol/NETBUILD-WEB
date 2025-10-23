import { IconButton, Paper, Stack, Typography } from '@mui/material';
import { IBuilding } from '../../models/IBuilding';
import { Edit as EditIcon } from '@mui/icons-material';
import ScheduleView from './Schedule/ScheduleView';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUser } from '../../features/auth/authSlice';
import { useState } from 'react';
import EditBuildingScheduleDialog from '../Dialogs/Buildings/EditBuildingScheduleDialog';
import { hasOwnerRights } from '../../helpers/PermissionsHelper';
import WeatherChart from './WeatherChart';
import ElectricityPricesChart from './ElectricityPricesChart';

type BuildingDetailsProps = {
  building: IBuilding;
};

export default function BuildingDetails({ building }: BuildingDetailsProps) {
  const authUser = useAppSelector(selectCurrentUser);

  const [showEditScheduleDialog, setShowEditScheduleDialog] = useState(false);

  return (
    <Stack direction="column" width="100%" height="100%" overflow="auto" justifyContent="top" mt={2} spacing={2} px={1}>
      <Stack direction="row" alignItems="start" justifyContent="start" spacing={2}>
        <Stack direction="column" width="100%" height="100%" spacing={1}>
          <Typography variant="h6" fontWeight="bold">
            Información
          </Typography>
          <Paper elevation={6} sx={{ height: '100%', padding: 2, marginLeft: 1 }}>
            <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">
                Id Vecindario
              </Typography>
              <Typography variant="body1">{building.neighborhoodId}</Typography>
            </Stack>

            <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">
                Id Edificio
              </Typography>
              <Typography variant="body1">{building.id}</Typography>
            </Stack>

            <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">
                Latitud
              </Typography>
              <Typography variant="body1">{building.latitude}</Typography>
            </Stack>

            <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">
                Longitud
              </Typography>
              <Typography variant="body1">{building.longitude}</Typography>
            </Stack>
          </Paper>
        </Stack>
        <Stack width="100%" direction="column" alignItems="start" spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h6" fontWeight="bold">
              Horario
            </Typography>
            {hasOwnerRights(authUser, building) && (
              <IconButton onClick={() => setShowEditScheduleDialog(true)} sx={{ padding: 0 }}>
                <EditIcon />
              </IconButton>
            )}
          </Stack>
          <Paper elevation={6} sx={{ width: '100%', padding: 2 }}>
            <ScheduleView building={building} />
          </Paper>
        </Stack>
      </Stack>

      <Stack direction="column" alignItems="start" justifyContent="start" width="49%" spacing={1}>
        <Typography variant="h6" fontWeight="bold">
          Precio Electricidad
        </Typography>
        <Paper elevation={6} sx={{ width: '100%', minHeight: 250, padding: 2 }}>
          <ElectricityPricesChart />
        </Paper>
      </Stack>

      <Stack direction="column" alignItems="start" spacing={1} width="100%" pb={2}>
        <Typography variant="h6" fontWeight="bold">
          Meteo
        </Typography>
        <Stack direction="row" width="100%" alignItems="center" justifyContent="space-evenly" spacing={2}>
          <Paper elevation={6} sx={{ width: '50%', padding: 2 }}>
            <WeatherChart data={building.weatherForecast?.temperature} name="Temperatura" units="ºC" color="#EB5936" />
          </Paper>
          <Paper elevation={6} sx={{ width: '50%', padding: 2 }}>
            <WeatherChart data={building.weatherForecast?.humidity} name="Humedad" units="%" color="#36A2EB" />
          </Paper>
        </Stack>
        <Stack direction="row" width="100%" alignItems="center" justifyContent="space-evenly" spacing={2}>
          <Paper elevation={6} sx={{ width: '50%', padding: 2 }}>
            <WeatherChart
              data={building.weatherForecast?.directSolarRadiation}
              name="Radiación Solar"
              units="W/m²"
              color="#EBEB36"
              min={0}
            />
          </Paper>
          <Typography width="50%"></Typography>
        </Stack>
      </Stack>

      {setShowEditScheduleDialog && (
        <EditBuildingScheduleDialog
          building={building}
          open={showEditScheduleDialog}
          onClose={() => setShowEditScheduleDialog(false)}
        />
      )}
    </Stack>
  );
}
