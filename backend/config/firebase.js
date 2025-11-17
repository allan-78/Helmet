const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'firebase', 'firebase-admin-sdk.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ecommerce-1b241',
});

// Verify Firebase Token
const verifyFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return { success: true, data: decodedToken };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = { admin, verifyFirebaseToken };
