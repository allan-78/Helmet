import { useEffect, useState } from 'react';
import { Box, Button, Rating, Stack, TextField, Typography } from '@mui/material';

const ReviewForm = ({
  onSubmit,
  initialData,
  loading,
  disabled,
  mode = 'create',
  onCancelEdit,
}) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [comment, setComment] = useState(initialData?.comment || '');

  useEffect(() => {
    setRating(initialData?.rating || 0);
    setComment(initialData?.comment || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
          {mode === 'edit' ? 'Edit Your Review' : mode === 'update' ? 'Update Your Review' : 'Write a Review'}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
          Share your experience
        </Typography>
      </Box>

      <Stack spacing={1}>
        <Typography variant="subtitle2" color="text.secondary">
          Rating
        </Typography>
        <Rating
          name="rating"
          value={rating}
          precision={0.5}
          onChange={(_, value) => setRating(value || 0)}
          size="large"
        />
      </Stack>

      <TextField
        label="Comment"
        multiline
        minRows={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Talk about fit, noise, comfort, safety tech..."
        disabled={disabled}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={disabled || loading}
          fullWidth
        >
          {mode === 'edit' || mode === 'update' ? 'Save Review' : 'Post Review'}
        </Button>
        {mode === 'edit' && onCancelEdit && (
          <Button onClick={onCancelEdit} fullWidth disabled={loading}>
            Cancel
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default ReviewForm;

