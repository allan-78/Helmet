const Filter = require('bad-words');

const filter = new Filter();

// Add custom bad words to the filter (optional)
filter.addWords('scam', 'fraud', 'fake'); // Add more if needed

/**
 * Middleware to filter/mask bad words from review comments
 * Masks bad words with asterisks (e.g., "badword" -> "***word")
 */
const filterReviewContent = (req, res, next) => {
  try {
    const { comment } = req.body;

    if (comment) {
      // Check if comment contains bad words
      if (filter.isProfane(comment)) {
        // Option 1: Mask bad words (replaces with ***)
        req.body.comment = filter.clean(comment);
        
        // Option 2: Reject the review entirely (uncomment if needed)
        // return res.status(400).json({
        //   success: false,
        //   message: 'Your review contains inappropriate language. Please revise and try again.',
        // });
      }
    }

    next();
  } catch (error) {
    console.error('Bad words filter error:', error);
    next(); // Continue even if filter fails
  }
};

module.exports = { filterReviewContent, filter };
