import { Image, Palette, RecordVoiceOver } from '@mui/icons-material';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { SyntheticEvent, useState } from 'react'
import VoxPopuli from './tabs/VoxPopuli';
import ArteCiudad from './tabs/ArteCiudad';
import Murales from './tabs/Murales';
import Produccion from './tabs/Produccion';

const iconSize = 25;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Connect() {
  const [tab, setTab] = useState(0);
  const handleTabChange = (event:SyntheticEvent, newTab:number) => {
    setTab(newTab);
  }
  return (
    <>
      <Box sx={{
        pt: 8
      }}>
        <Typography variant='h4'>
          <b>Conectando con la ciudad</b>
        </Typography>
      </Box>
      <Box sx={{pt: 4}}>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab label={<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}><RecordVoiceOver sx={{pr: 2}}/> Vox pópuli </div>} {...a11yProps(0)} />
          <Tab label={<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}><Palette sx={{pr: 2}}/> Arte de la ciudad </div>} {...a11yProps(1)} />
          <Tab label={<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}><Image sx={{pr: 2}}/> Murales </div>} {...a11yProps(2)}/>
          <Tab label={<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}><RecordVoiceOver sx={{pr: 2}}/> Producción </div>} {...a11yProps(3)}/>
        </Tabs>
        <TabPanel value={tab} index={0}>
          <VoxPopuli></VoxPopuli>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ArteCiudad></ArteCiudad>
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <Murales></Murales>
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <Produccion></Produccion>
        </TabPanel>
      </Box>
    </>
  )
}

export default Connect