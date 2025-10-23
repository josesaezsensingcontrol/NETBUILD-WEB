import { Autocomplete, TextField } from '@mui/material';
import { SyntheticEvent } from 'react';

type TimeZoneSelectorProps = {
    value: string | null | undefined;
    onChange: (newValue: string | null) => void;
};

type TimeZoneOption = {
    value: string;
    displayName: string;
};

const allTimeZones: TimeZoneOption[] = [
    { value: 'Dateline Standard Time', displayName: 'International Date Line West' },
    { value: 'UTC-11', displayName: 'Coordinated Universal Time - 11' },
    { value: 'Aleutian Standard Time', displayName: 'Aleutian Islands' },
    { value: 'Hawaiian Standard Time', displayName: 'Hawaii' },
    { value: 'Marquesas Standard Time', displayName: 'Marquesas Islands' },
    { value: 'Alaskan Standard Time', displayName: 'Alaska' },
    { value: 'UTC-09', displayName: 'Coordinated Universal Time-09' },
    { value: 'Pacific Standard Time (Mexico)', displayName: 'Baja California' },
    { value: 'UTC-08', displayName: 'Coordinated Universal Time-08' },
    { value: 'Pacific Standard Time', displayName: 'Pacific Time (US & Canada)' },
    { value: 'US Mountain Standard Time', displayName: 'Arizona' },
    { value: 'Mountain Standard Time (Mexico)', displayName: 'Chihuahua, La Paz, Mazatlan' },
    { value: 'Mountain Standard Time', displayName: 'Mountain Time (US & Canada)' },
    { value: 'Yukon Standard Time', displayName: 'Yukon' },
    { value: 'Central America Standard Time', displayName: 'Central America' },
    { value: 'Central Standard Time', displayName: 'Central Time (US & Canada)' },
    { value: 'Easter Island Standard Time', displayName: 'Easter Island' },
    { value: 'Central Standard Time (Mexico)', displayName: 'Guadalajara, Mexico City, Monterrey' },
    { value: 'Canada Central Standard Time', displayName: 'Saskatchewan' },
    { value: 'SA Pacific Standard Time', displayName: 'Bogota, Lima, Quito, Rio Branco' },
    { value: 'Eastern Standard Time (Mexico)', displayName: 'Chetumal' },
    { value: 'Eastern Standard Time', displayName: 'Eastern Time (US & Canada)' },
    { value: 'Haiti Standard Time', displayName: 'Haiti' },
    { value: 'Cuba Standard Time', displayName: 'Havana' },
    { value: 'US Eastern Standard Time', displayName: 'Indiana (East)' },
    { value: 'Turks And Caicos Standard Time', displayName: 'Turks and Caicos' },
    { value: 'Paraguay Standard Time', displayName: 'Asuncion' },
    { value: 'Atlantic Standard Time', displayName: 'Atlantic Time (Canada)' },
    { value: 'Venezuela Standard Time', displayName: 'Caracas' },
    { value: 'Central Brazilian Standard Time', displayName: 'Cuiaba' },
    { value: 'SA Western Standard Time', displayName: 'Georgetown, La Paz, Manaus, San Juan' },
    { value: 'Pacific SA Standard Time', displayName: 'Santiago' },
    { value: 'Newfoundland Standard Time', displayName: 'Newfoundland' },
    { value: 'Tocantins Standard Time', displayName: 'Araguaina' },
    { value: 'E. South America Standard Time', displayName: 'Brasilia' },
    { value: 'SA Eastern Standard Time', displayName: 'Cayenne, Fortaleza' },
    { value: 'Argentina Standard Time', displayName: 'City of Buenos Aires' },
    { value: 'Greenland Standard Time', displayName: 'Greenland' },
    { value: 'Montevideo Standard Time', displayName: 'Montevideo' },
    { value: 'Magallanes Standard Time', displayName: 'Punta Arenas' },
    { value: 'Saint Pierre Standard Time', displayName: 'Saint Pierre and Miquelon' },
    { value: 'Bahia Standard Time', displayName: 'Salvador' },
    { value: 'UTC-02', displayName: 'Coordinated Universal Time-02' },
    { value: 'Mid-Atlantic Standard Time', displayName: 'Mid-Atlantic - Old' },
    { value: 'Azores Standard Time', displayName: 'Azores' },
    { value: 'Cape Verde Standard Time', displayName: 'Cabo Verde Is.' },
    { value: 'UTC', displayName: 'Coordinated Universal Time' },
    { value: 'GMT Standard Time', displayName: 'Dublin, Edinburgh, Lisbon, London' },
    { value: 'Greenwich Standard Time', displayName: 'Monrovia, Reykjavik' },
    { value: 'Sao Tome Standard Time', displayName: 'Sao Tome' },
    { value: 'Morocco Standard Time', displayName: 'Casablanca' },
    { value: 'W. Europe Standard Time', displayName: 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna' },
    { value: 'Central Europe Standard Time', displayName: 'Belgrade, Bratislava, Budapest, Ljubljana, Prague' },
    { value: 'Romance Standard Time', displayName: 'Brussels, Copenhagen, Madrid, Paris' },
    { value: 'Central European Standard Time', displayName: 'Sarajevo, Skopje, Warsaw, Zagreb' },
    { value: 'W. Central Africa Standard Time', displayName: 'West Central Africa' },
    { value: 'GTB Standard Time', displayName: 'Athens, Bucharest' },
    { value: 'Middle East Standard Time', displayName: 'Beirut' },
    { value: 'Egypt Standard Time', displayName: 'Cairo' },
    { value: 'E. Europe Standard Time', displayName: 'Chisinau' },
    { value: 'Syria Standard Time', displayName: 'Damascus' },
    { value: 'West Bank Standard Time', displayName: 'Gaza, Hebron' },
    { value: 'South Africa Standard Time', displayName: 'Harare, Pretoria' },
    { value: 'FLE Standard Time', displayName: 'Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius' },
    { value: 'Israel Standard Time', displayName: 'Jerusalem' },
    { value: 'South Sudan Standard Time', displayName: 'Juba' },
    { value: 'Kaliningrad Standard Time', displayName: 'Kaliningrad' },
    { value: 'Sudan Standard Time', displayName: 'Khartoum' },
    { value: 'Libya Standard Time', displayName: 'Tripoli' },
    { value: 'Namibia Standard Time', displayName: 'Windhoek' },
    { value: 'Jordan Standard Time', displayName: 'Amman' },
    { value: 'Arabic Standard Time', displayName: 'Baghdad' },
    { value: 'Turkey Standard Time', displayName: 'Istanbul' },
    { value: 'Arab Standard Time', displayName: 'Kuwait, Riyadh' },
    { value: 'Belarus Standard Time', displayName: 'Minsk' },
    { value: 'Russian Standard Time', displayName: 'Moscow, St. Petersburg' },
    { value: 'E. Africa Standard Time', displayName: 'Nairobi' },
    { value: 'Volgograd Standard Time', displayName: 'Volgograd' },
    { value: 'Iran Standard Time', displayName: 'Tehran' },
    { value: 'Arabian Standard Time', displayName: 'Abu Dhabi, Muscat' },
    { value: 'Astrakhan Standard Time', displayName: 'Astrakhan, Ulyanovsk' },
    { value: 'Azerbaijan Standard Time', displayName: 'Baku' },
    { value: 'Russia Time Zone 3', displayName: 'Izhevsk, Samara' },
    { value: 'Mauritius Standard Time', displayName: 'Port Louis' },
    { value: 'Saratov Standard Time', displayName: 'Saratov' },
    { value: 'Georgian Standard Time', displayName: 'Tbilisi' },
    { value: 'Caucasus Standard Time', displayName: 'Yerevan' },
    { value: 'Afghanistan Standard Time', displayName: 'Kabul' },
    { value: 'West Asia Standard Time', displayName: 'Ashgabat, Tashkent' },
    { value: 'Ekaterinburg Standard Time', displayName: 'Ekaterinburg' },
    { value: 'Pakistan Standard Time', displayName: 'Islamabad, Karachi' },
    { value: 'Qyzylorda Standard Time', displayName: 'Qyzylorda' },
    { value: 'India Standard Time', displayName: 'Chennai, Kolkata, Mumbai, New Delhi' },
    { value: 'Sri Lanka Standard Time', displayName: 'Sri Jayawardenepura' },
    { value: 'Nepal Standard Time', displayName: 'Kathmandu' },
    { value: 'Central Asia Standard Time', displayName: 'Astana' },
    { value: 'Bangladesh Standard Time', displayName: 'Dhaka' },
    { value: 'Omsk Standard Time', displayName: 'Omsk' },
    { value: 'Myanmar Standard Time', displayName: 'Yangon (Rangoon)' },
    { value: 'SE Asia Standard Time', displayName: 'Bangkok, Hanoi, Jakarta' },
    { value: 'Altai Standard Time', displayName: 'Barnaul, Gorno-Altaysk' },
    { value: 'W. Mongolia Standard Time', displayName: 'Hovd' },
    { value: 'North Asia Standard Time', displayName: 'Krasnoyarsk' },
    { value: 'N. Central Asia Standard Time', displayName: 'Novosibirsk' },
    { value: 'Tomsk Standard Time', displayName: 'Tomsk' },
    { value: 'China Standard Time', displayName: 'Beijing, Chongqing, Hong Kong, Urumqi' },
    { value: 'North Asia East Standard Time', displayName: 'Irkutsk' },
    { value: 'Singapore Standard Time', displayName: 'Kuala Lumpur, Singapore' },
    { value: 'W. Australia Standard Time', displayName: 'Perth' },
    { value: 'Taipei Standard Time', displayName: 'Taipei' },
    { value: 'Ulaanbaatar Standard Time', displayName: 'Ulaanbaatar' },
    { value: 'Aus Central W. Standard Time', displayName: 'Eucla' },
    { value: 'Transbaikal Standard Time', displayName: 'Chita' },
    { value: 'Tokyo Standard Time', displayName: 'Osaka, Sapporo, Tokyo' },
    { value: 'North Korea Standard Time', displayName: 'Pyongyang' },
    { value: 'Korea Standard Time', displayName: 'Seoul' },
    { value: 'Yakutsk Standard Time', displayName: 'Yakutsk' },
    { value: 'Cen. Australia Standard Time', displayName: 'Adelaide' },
    { value: 'AUS Central Standard Time', displayName: 'Darwin' },
    { value: 'E. Australia Standard Time', displayName: 'Brisbane' },
    { value: 'AUS Eastern Standard Time', displayName: 'Canberra, Melbourne, Sydney' },
    { value: 'West Pacific Standard Time', displayName: 'Guam, Port Moresby' },
    { value: 'Tasmania Standard Time', displayName: 'Hobart' },
    { value: 'Vladivostok Standard Time', displayName: 'Vladivostok' },
    { value: 'Lord Howe Standard Time', displayName: 'Lord Howe Island' },
    { value: 'Bougainville Standard Time', displayName: 'Bougainville Island' },
    { value: 'Russia Time Zone 10', displayName: 'Chokurdakh' },
    { value: 'Magadan Standard Time', displayName: 'Magadan' },
    { value: 'Norfolk Standard Time', displayName: 'Norfolk Island' },
    { value: 'Sakhalin Standard Time', displayName: 'Sakhalin' },
    { value: 'Central Pacific Standard Time', displayName: 'Solomon Is., New Caledonia' },
    { value: 'Russia Time Zone 11', displayName: 'Anadyr, Petropavlovsk-Kamchatsky' },
    { value: 'New Zealand Standard Time', displayName: 'Auckland, Wellington' },
    { value: 'UTC+12', displayName: 'Coordinated Universal Time+12' },
    { value: 'Fiji Standard Time', displayName: 'Fiji' },
    { value: 'Kamchatka Standard Time', displayName: 'Petropavlovsk-Kamchatsky - Old' },
    { value: 'Chatham Islands Standard Time', displayName: 'Chatham Islands' },
    { value: 'UTC+13', displayName: 'Coordinated Universal Time+13' },
    { value: 'Tonga Standard Time', displayName: "Nuku'alofa" },
    { value: 'Samoa Standard Time', displayName: 'Samoa' },
    { value: 'Line Islands Standard Time', displayName: 'Kiritimati Island' },
];

const TimeZoneSelector = ({ value, onChange }: TimeZoneSelectorProps) => {
    return (
        <Autocomplete
            fullWidth
            options={allTimeZones}
            value={allTimeZones.find((x) => x.value === value) ?? null}
            onChange={(_event: SyntheticEvent, newValue?: TimeZoneOption | null) => {
                onChange(newValue?.value ?? null);
            }}
            getOptionLabel={(option) => option?.displayName ?? ""}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={value ? '' : 'Selecciona una zona horaria'}
                    size="small"
                />
            )}
        />
    );
};

export default TimeZoneSelector;
