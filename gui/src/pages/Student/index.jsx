import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import _ from 'lodash';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhachedTableHead from '../../components/EnhachedTableHead';
import PageBase from '../../components/PageBase'
const headCells = [
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: "Matérias",
  },
  {
    id: 'professor',
    numeric: false,
    disablePadding: false,
    label: 'Professor',
  },
  {
    id: 'load',
    numeric: true,
    disablePadding: false,
    label: 'Carga horária',
  },
  {
    id: 'nota',
    numeric: true,
    disablePadding: false,
    label: 'Nota',
  },
];
export default function Student() {
  return (
    <PageBase
      toolBar={<EnhancedTableToolbar label="Notas" hideAdd />}
      tableHeader={
        <EnhachedTableHead
          order={'order'}
          orderBy={'orderBy'}
          rowCount={0}
          onRequestSort={() => null}
          headCells={headCells}
          noActions
        />
      }
    >
      <TableRow
        hover
        key={1}
      >
        <TableCell>Matemática</TableCell>
        <TableCell>José</TableCell>
        <TableCell>20</TableCell>
        <TableCell>10.0</TableCell>
      </TableRow>
    </PageBase>
  );
}
