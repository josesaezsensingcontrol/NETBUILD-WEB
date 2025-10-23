import { Stack, Typography } from "@mui/material";
import { IBuilding } from "../../../models/IBuilding";
import { getDayOfWeekName } from "../../../helpers/DateHelper";

type ScheduleViewProps = {
    building: IBuilding;
};

const ScheduleView = ({ building }: ScheduleViewProps) => {
    return (
        <Stack direction="column" spacing={1}>
            {Array.from([1, 2, 3, 4, 5, 6, 0]).map((daySchedule) => {
                return (
                    <Stack key={daySchedule} direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                        <Typography fontWeight="bold">
                            {getDayOfWeekName(daySchedule)}
                        </Typography>
                        <Stack direction="row">
                            <Typography>
                                {building.schedule?.daySchedules[daySchedule]
                                    ?.map((dayRange) => `${dayRange.openTime} - ${dayRange.closeTime}`)
                                    ?.join(" / ") ?? "----"
                                }
                            </Typography>
                        </Stack>
                    </Stack>
                );
            })
            }
        </Stack>
    );
};

export default ScheduleView;
