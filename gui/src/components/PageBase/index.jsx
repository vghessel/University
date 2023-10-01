import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

export default function PageBase(props) {
  const {
    toolBar,
    tableHeader,
    children
  } = props
  return (
    <div style={{ paddingTop: '74px', paddingLeft: '10px', paddingRight: '10px' }}>
      <Box>
        <Paper>
          {toolBar}
          <TableContainer>
            <Table>
              {tableHeader}
              <TableBody>
                {children}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
}

PageBase.propTypes = {
  toolBar: PropTypes.node,
  tableHeader: PropTypes.node,
  children: PropTypes.object,
};