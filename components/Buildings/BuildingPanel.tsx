import { Stack, Tab, Tabs } from '@mui/material';
import { IBuilding } from '../../models/IBuilding';
import { useState } from 'react';
import BuildingDetails from './BuildingDetails';
import SystemsTab from './Systems/SystemsTab';
import DiagramTab from './Diagram/DiagramTab';
import TradingTab from './Trading/TradingTab';

type BuildingPanelProps = {
  building: IBuilding;
};

export default function BuildingPanel({ building }: BuildingPanelProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Stack direction="column" width="100%" height="100%" maxHeight="100%" overflow="auto" justifyContent="top">
      <Tabs value={activeTab} onChange={(_event, newValue) => setActiveTab(newValue)}>
        <Tab label="Detalles" value={0} disableRipple />
        <Tab label="Sistemas" value={1} disableRipple />
        <Tab label="Diagrama" value={2} disableRipple />
        <Tab label="Trading" value={3} disableRipple />
      </Tabs>

      {activeTab === 0 && <BuildingDetails building={building} />}

      {activeTab === 1 && <SystemsTab building={building} />}

      {activeTab === 2 && <DiagramTab building={building} />}

      {activeTab === 3 && <TradingTab building={building} />}
    </Stack>
  );
}
