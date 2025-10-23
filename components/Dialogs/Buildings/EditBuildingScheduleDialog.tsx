import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import { IBuilding } from "../../../models/IBuilding";
import { format, isAfter, isBefore, set } from "date-fns";
import { ISchedule } from "../../../models/ISchedule";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, LinearProgress, Stack, Switch, Tab, Tabs, Typography } from "@mui/material";
import { ToggleOn as ToggleOnIcon, ToggleOff as ToggleOffIcon, Delete as DeleteIcon, Add as AddIcon, Alarm as AlarmIcon } from "@mui/icons-material";
import { useUpdateBuildingScheduleMutation } from "../../../features/api/apiSlice";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import TimeZoneSelector from "../../Selectors/TimeZoneSelector";
import { getDayOfWeekName, parseTime } from "../../../helpers/DateHelper";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type EditBuildingScheduleDialogProps = {
    open: boolean;
    onClose: () => void;
    building: IBuilding;
};

const defaultOpenDate = set(new Date(), { hours: 8, minutes: 0, seconds: 0 });
const defaultCloseDate = set(new Date(), { hours: 20, minutes: 0, seconds: 0 });
const emptySchedule: ISchedule = {
    timeZone: "Romance Standard Time",
    daySchedules: []
};

const EditBuildingScheduleDialog = ({ open, onClose, building }: EditBuildingScheduleDialogProps) => {
    const [updateBuildingSchedule, updateBuildingScheduleResult] = useUpdateBuildingScheduleMutation();

    const [formSchedule, setFormSchedule] = useImmer<ISchedule>(emptySchedule);
    const [activeDay, setActiveDay] = useState(0);
    const [activeDayOfWeek, setActiveDayOfWeek] = useState(1);

    const [updateError, setError] = useState(false);

    useEffect(() => {
        setFormSchedule(building.schedule ?? emptySchedule);
    }, [building, setFormSchedule]);

    useEffect(() => {
        setActiveDayOfWeek((activeDay + 1) % 7);
    }, [activeDay, formSchedule]);

    const handleActiveDay = (_: React.SyntheticEvent, newActiveDay: number) => {
        setActiveDay(newActiveDay);
    };

    const handleEnableChange = (enabled: boolean) => {
        if (enabled) {
            setFormSchedule({
                ...formSchedule,
                daySchedules: {
                    ...formSchedule.daySchedules,
                    [activeDayOfWeek]: [
                        {
                            openTime: format(defaultOpenDate, 'HH:mm'),
                            closeTime: format(defaultCloseDate, 'HH:mm')
                        }
                    ]
                }
            });
        } else {
            const newSchedule: ISchedule = { ...formSchedule, daySchedules: { ...formSchedule.daySchedules } };
            delete (newSchedule.daySchedules[activeDayOfWeek])
            setFormSchedule(newSchedule);
        }
    };

    const handleOpenTimeChange = (newOpenTime: Date | null, i: number) => {
        if (newOpenTime && isBefore(newOpenTime, parseTime(formSchedule.daySchedules[activeDayOfWeek][i].closeTime))) {
            setFormSchedule(newSchedule => {
                newSchedule.daySchedules[activeDayOfWeek][i].openTime = format(newOpenTime, "HH:mm");
            });
        }
    };

    const handleCloseTimeChange = (newCloseTime: Date | null, i: number) => {
        if (newCloseTime && isAfter(newCloseTime, parseTime(formSchedule.daySchedules[activeDayOfWeek][i].openTime))) {
            setFormSchedule(newSchedule => {
                newSchedule.daySchedules[activeDayOfWeek][i].closeTime = format(newCloseTime, "HH:mm");
            });
        }
    };

    const handleDeleteTimeRange = (i: number) => {
        setFormSchedule(newSchedule => {
            if (newSchedule.daySchedules[activeDayOfWeek].length === 1) {
                newSchedule.daySchedules[activeDayOfWeek][i] = {
                    openTime: format(defaultOpenDate, "HH:mm"),
                    closeTime: format(defaultCloseDate, "HH:mm")
                };
            } else {
                newSchedule.daySchedules[activeDayOfWeek].splice(i, 1);
            }
        });
    }

    const handleAddTimeRange = () => {
        setFormSchedule(newSchedule => {
            newSchedule.daySchedules[activeDayOfWeek].push({
                openTime: format(defaultOpenDate, "HH:mm"),
                closeTime: format(defaultCloseDate, "HH:mm")
            })
        });
    }

    const handleApply = async () => {
        if (formSchedule) {
            setError(false);
            try {
                await updateBuildingSchedule({
                    buildingId: building.id,
                    neighborhoodId: building.neighborhoodId,
                    updateBuildingSchedule: { schedule: formSchedule },
                }).unwrap();

                onClose();
            } catch {
                setError(true);
            }
        }
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>
                Horario
            </DialogTitle>

            <DialogContent>
                <Stack width="100%" spacing={2}>
                    {(updateBuildingScheduleResult.isLoading) && (
                        <Box width="100%" display="flex" alignItems="center" justifyContent="center" padding={5}>
                            <LinearProgress sx={{ width: '50%' }} />
                        </Box>
                    )}
                    {!updateBuildingScheduleResult.isLoading && formSchedule && (
                        <>
                            {updateError &&
                                <Alert icon={<AlarmIcon fontSize="inherit" />} severity="error">
                                    El horario no se ha podido actualizar, revisa que todos los tramos horarios sean correctos e inténtalo de nuevo
                                </Alert>
                            }
                            <Typography fontWeight="bold">
                                Zona Horaria
                            </Typography>
                            <TimeZoneSelector
                                value={formSchedule.timeZone}
                                onChange={(newTimeZone) => setFormSchedule({ ...formSchedule, timeZone: newTimeZone ?? emptySchedule.timeZone })}
                            />

                            <Tabs value={activeDay} onChange={handleActiveDay} centered>
                                {Array.from(Array(7), (_, i) => {
                                    return (
                                        <Tab
                                            key={i}
                                            icon={
                                                formSchedule.daySchedules[(i + 1) % 7] !== undefined ? (
                                                    <ToggleOnIcon color="primary" />
                                                ) : (
                                                    <ToggleOffIcon sx={{ color: 'gray' }} />
                                                )
                                            }
                                            iconPosition="bottom"
                                            label={getDayOfWeekName((i + 1) % 7)}
                                        />
                                    );
                                })}
                            </Tabs>

                            <Stack direction="row" width="100%" alignItems="start" justifyContent="space-evenly">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formSchedule.daySchedules[activeDayOfWeek] !== undefined}
                                            onChange={(event) => {
                                                handleEnableChange(event.target.checked);
                                            }}
                                        />
                                    }
                                    label="Activado"
                                />
                                <Stack direction="column" spacing={2}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        {formSchedule.daySchedules[activeDayOfWeek] === undefined &&
                                            <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                                                <MobileTimePicker
                                                    disabled
                                                    label="Hora Apertura"
                                                    slotProps={{ textField: { size: 'small' } }}
                                                />
                                                <MobileTimePicker
                                                    disabled
                                                    label="Hora Cierre"
                                                    slotProps={{ textField: { size: 'small' } }}
                                                />
                                                <IconButton disabled>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <IconButton disabled>
                                                    <AddIcon />
                                                </IconButton>
                                            </Stack>
                                        }
                                        {formSchedule.daySchedules[activeDayOfWeek]?.map((daySchedule, i) => {
                                            return (
                                                <Stack key={i} direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                                                    <MobileTimePicker
                                                        label="Hora Apertura"
                                                        views={['hours', 'minutes']}
                                                        value={parseTime(daySchedule.openTime)}
                                                        minutesStep={5}
                                                        onChange={(value) => handleOpenTimeChange(value, i)}
                                                        slotProps={{ textField: { size: 'small' } }}
                                                        ampm={false}
                                                    />
                                                    <MobileTimePicker
                                                        label="Hora Cierre"
                                                        views={['hours', 'minutes']}
                                                        value={parseTime(daySchedule.closeTime)}
                                                        minutesStep={5}
                                                        onChange={(value) => handleCloseTimeChange(value, i)}
                                                        slotProps={{ textField: { size: 'small' } }}
                                                        ampm={false}
                                                    />

                                                    <IconButton onClick={() => handleDeleteTimeRange(i)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleAddTimeRange()}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </Stack>
                                            )
                                        })}
                                    </LocalizationProvider>
                                </Stack>
                            </Stack>

                            <Stack direction="column" width="100%" spacing={1}>
                                {Object.keys(formSchedule.daySchedules)
                                    .sort((a, b) => {
                                        if (a === '0') {
                                            return 1;
                                        }

                                        if (b === '0') {
                                            return -1;
                                        }

                                        return parseInt(a) - parseInt(b);
                                    })
                                    .map((daySchedule) => {
                                        return (
                                            <Stack key={daySchedule} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                                                <Typography fontWeight="bold">
                                                    {getDayOfWeekName(parseInt(daySchedule))}
                                                </Typography>
                                                <Stack direction="row">
                                                    <Typography>
                                                        {formSchedule.daySchedules[parseInt(daySchedule)]
                                                            .map((dayRange) => `${dayRange.openTime} - ${dayRange.closeTime}`)
                                                            .join(" / ")
                                                        }
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        );
                                    })}
                            </Stack>
                        </>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApply}
                    disabled={!formSchedule.timeZone}
                >
                    Aplicar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditBuildingScheduleDialog;
