import { useState } from 'react';
import TextField from '@mui/material/TextField';

export default function Grade({ initialValue }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div onDoubleClick={handleDoubleClick} onBlur={handleBlur}>
      {isEditing ? (
        <TextField
          value={value}
          onChange={handleChange}
          fullWidth
          autoFocus
          size="small"
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
}
