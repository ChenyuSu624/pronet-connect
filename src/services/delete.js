const admin = require('firebase-admin');
const serviceAccount = require('../firebaseConfig/pronet-connect-840da-firebase-adminsdk-fbsvc-eb1a6fefe3.json'); // Update with the correct path

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

async function deleteChatSampleData(db) {
  const chatsCollection = db.collection('chats');
  const snapshot = await chatsCollection.get();

  for (const doc of snapshot.docs) {
    // Delete messages subcollection
    const messagesRef = doc.ref.collection('messages');
    const messagesSnapshot = await messagesRef.get();
    for (const messageDoc of messagesSnapshot.docs) {
      await messageDoc.ref.delete();
    }

    // Delete chat document
    await doc.ref.delete();
  }
}

deleteData();

module.exports = { deleteChatSampleData };
