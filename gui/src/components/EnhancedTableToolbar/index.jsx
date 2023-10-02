import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export default function EnhancedTableToolbar(props) {
  const {
    setIsNew,
    doSearch,
    search,
    label,
    hideAdd
  } = props;

  return (
    <Toolbar>
      <Typography sx={{ flex: '1 1 100%' }} variant="h6" component="div">
       {label}
      </Typography>
      <TextField
        fullWidth
        label="Busca"
        size="small"
        value={search}
        onChange={(event) => doSearch(event.target.value)}
        InputProps={{
          endAdornment: search && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => doSearch('')}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {!hideAdd &&
        <Tooltip>
          <IconButton
            onClick={() => {
              setIsNew(true);
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  setIsNew: PropTypes.func,
  doSearch: PropTypes.func,
  search: PropTypes.string,
  hideAdd: PropTypes.bool,
};