import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

const ReviewList = ({ reviews = [], currentUserId, onEdit }) => {
  if (!reviews.length) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          No reviews yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Be the first rider to drop a review once your order is delivered.
        </Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      {reviews.map((review) => {
        const isOwner = review.user?._id === currentUserId;
        return (
          <Paper
            key={review._id}
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar
                src={review.user?.avatar}
                alt={review.user?.name}
                sx={{ bgcolor: 'primary.main' }}
              >
                {review.user?.name?.[0] || '?'}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {review.user?.name || 'Aegis Rider'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(review.createdAt)}
                </Typography>
              </Box>
              {isOwner && onEdit && (
                <IconButton onClick={() => onEdit(review)} size="small">
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Rating value={review.rating} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {review.comment}
            </Typography>
          </Paper>
        );
      })}
    </Stack>
  );
};

export default ReviewList;

