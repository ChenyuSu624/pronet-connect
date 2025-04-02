const admin = require('firebase-admin');
const serviceAccount = require('../firebaseConfig/pronet-connect-firebase-firebase-adminsdk-fbsvc-7dec6b14da.json'); // Update with the correct path

// Initialize Firebase Admin SDK
// Run node src/services/delete.js to delete all data from the collections
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function deleteData() {
  try {
    const collections = ['users', 'jobs', 'events', 'feeds']; // Add more collections as needed

    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const snapshot = await collection.get();

      if (snapshot.empty) {
        console.log(`No data found in the ${collectionName} collection.`);
        continue;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`All data deleted successfully from the ${collectionName} collection!`);
    }
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

deleteData();
