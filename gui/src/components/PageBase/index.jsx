import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

export default function PageBase(props) {
  const {
    toolBar,
    tableHeader,
    children,
    loading,
    removePadding,
  } = props
  return (
    <div style={removePadding ? {} : { paddingTop: '74px', paddingLeft: '10px', paddingRight: '10px' }}>
      <Box>
        <Paper>
          {toolBar}
          {loading &&
            <div style={{ paddingLeft: '50%', paddingRight: '50%', paddingTop: '10px', paddingBottom: '10px', width: '100%' }}>
              <CircularProgress />
            </div>
          }
          {!loading && 
            <TableContainer>
              <Table stickyHeader>
                {tableHeader}
                <TableBody>
                  {children}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </Paper>
      </Box>
    </div>
  );
}

PageBase.propTypes = {
  toolBar: PropTypes.node,
  tableHeader: PropTypes.node,
  children: PropTypes.any,
  loading: PropTypes.bool,
  removePadding: PropTypes.bool
};