import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography'
import _ from 'lodash';
import EnhancedTableToolbar from '../../components/EnhancedTableToolbar';
import EnhachedTableHead from '../../components/EnhachedTableHead';
import Grade from '../../components/Grade';
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
    label: 'Nota *',
  },
];
export default function Student() {
  return (
    <>
      <PageBase
        toolBar={<EnhancedTableToolbar label={`Alunos da matéria: ${true}`} hideAdd />}
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
          <TableCell style={{ width: '100px' }}>
            <Grade initialValue={10} />
          </TableCell>
        </TableRow>
      </PageBase>


      <Typography style={{ paddingLeft: '20px', paddingRight: '20px' }} variant="caption" display="block">
        * clique 2 vezes para editar a nota
      </Typography>
    </>
  );
}
