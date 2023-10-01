import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import School from '@mui/icons-material/School';
import LocalLibrary from '@mui/icons-material/LocalLibrary';
import Article from '@mui/icons-material/Article';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
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
export default function AdminHome() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  return (
    <div style={{ paddingTop: '64px' }}>
      <Box>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab icon={<Article />} iconPosition="start" label="Matérias" />
          <Tab icon={<School />} iconPosition="start" label="Professores" />
          <Tab icon={<LocalLibrary />} iconPosition="start" label="Alunos" />
        </Tabs>
        <SwipeableViews
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0}>
            Matérias
          </TabPanel>
          <TabPanel value={value} index={1}>
            Professores
          </TabPanel>
          <TabPanel value={value} index={2}>
            Alunos
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}
