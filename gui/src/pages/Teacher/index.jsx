import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhancedTableHead from '../../components/EnhachedTableHead';
import PageBase from '../../components/PageBase'
const headCells = [
  {
    id: 'description',
    numeric: false,
    disablePadding: false,
    label: "Aluno",
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
      toolBar={<EnhancedTableToolbar label={`Alunos da matéria: ${true}`} hideAdd />}
      tableHeader={
        <EnhancedTableHead
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
        <TableCell>
          <TextField
            size="small"
            value={10}
            numeric
          />
        </TableCell>
      </TableRow>
    </PageBase>
  );
}
