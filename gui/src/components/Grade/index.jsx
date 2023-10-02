import { useState } from 'react';
import TextField from '@mui/material/TextField';

export default function Grade({ initialValue, grade, handlerChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    handlerChange(grade, parseFloat(value, 10))
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div onDoubleClick={handleDoubleClick} onBlur={handleBlur}>
      {isEditing ? (
        <TextField
          value={value || ''}
          onChange={handleChange}
          fullWidth
          autoFocus
          size="small"
          type="number"
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
