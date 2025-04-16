const admin = require('firebase-admin');
const serviceAccount = require('../firebaseConfig/pronet-connect-840da-firebase-adminsdk-fbsvc-eb1a6fefe3.json'); // Update with the correct path
const sampleUserData = require('./firestore_user_sample_data.json');
const sampleJobData = require('./firestore_job_sample_data.json');
const sampleEventData = require('./firestore_events_sample_data.json');
const sampleFeedData = require('./firestore_feeds_sample_data.json'); // Add this line to import feeds sample data
const firestoreChatSampleData = require('./firestore_chat_sample_data.json'); // Add this line to import chats sample data

// Initialize Firebase Admin SDK
// Run node src/services/import.js to import sample data into the collections
// Ensure you have the correct path to your service account key file
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function importUsers() {
  try {
    const users = Object.entries(sampleUserData);
    for (const [userId, userData] of users) {
      const userDoc = await db.collection('users').doc(userId).get();
      const { connections, ...userDetails } = userData;
      if (userDoc.exists) {
        await db.collection('users').doc(userId).update({
          ...userDetails,
          connections: connections || [],
        });
        console.log(`Updated user data for ${userId}`);
      } else {
        await db.collection('users').doc(userId).set({
          ...userDetails,
          connections: connections || [],
        });
        console.log(`Imported user data for ${userId}`);
      }
    }
  } catch (error) {
    console.error('Error importing user data:', error);
  }
}

async function importJobs() {
  try {
    const jobs = Object.entries(sampleJobData);
    for (const [jobId, jobData] of jobs) {
      const jobDoc = await db.collection('jobs').doc(jobId).get();
      if (jobDoc.exists) {
        await db.collection('jobs').doc(jobId).update(jobData);
        console.log(`Updated job data for ${jobId}`);
      } else {
        await db.collection('jobs').doc(jobId).set(jobData);
        console.log(`Imported job data for ${jobId}`);
      }
    }
  } catch (error) {
    console.error('Error importing job data:', error);
  }
}

async function importEvents() {
  try {
    const events = Object.entries(sampleEventData);
    for (const [eventId, eventData] of events) {
      const eventDoc = await db.collection('events').doc(eventId).get();
      if (eventDoc.exists) {
        await db.collection('events').doc(eventId).update(eventData);
        console.log(`Updated event data for ${eventId}`);
      } else {
        await db.collection('events').doc(eventId).set(eventData);
        console.log(`Imported event data for ${eventId}`);
      }
    }
  } catch (error) {
    console.error('Error importing event data:', error);
  }
}

async function importFeeds() {
  try {
    const feeds = sampleFeedData;
    for (const feed of feeds) {
      if (!feed.postId) {
        console.warn(`Skipping feed without postId:`, feed);
        continue; // Skip feeds without a postId
      }
      const feedDoc = await db.collection('feeds').doc(feed.postId).get();
      if (feedDoc.exists) {
        await db.collection('feeds').doc(feed.postId).update(feed);
        console.log(`Updated feed data for ${feed.postId}`);
      } else {
        await db.collection('feeds').doc(feed.postId).set(feed);
        console.log(`Imported feed data for ${feed.postId}`);
      }
    }
  } catch (error) {
    console.error('Error importing feed data:', error);
  }
}

async function importChatSampleData() {
  try {
    for (const chatId in firestoreChatSampleData) {
      if (firestoreChatSampleData.hasOwnProperty(chatId)) {
        const chatData = firestoreChatSampleData[chatId];
        const { messages, ...chatInfo } = chatData;

        // Add chat document to the chats collection
        await db.collection('chats').doc(chatId).set(chatInfo);

        // Add messages as a subcollection
        const messagesRef = db.collection('chats').doc(chatId).collection('messages');
        for (const messageId in messages) {
          if (messages.hasOwnProperty(messageId)) {
            await messagesRef.doc(messageId).set(messages[messageId]);
          }
        }
      }
    }
    console.log('Imported chat data successfully!');
  } catch (error) {
    console.error('Error importing chat data:', error);
  }
}

async function importData() {
  await importUsers();
  await importJobs();
  await importEvents();
  await importFeeds(); // Add this line to include feeds import
  await importChatSampleData(); // Add this line to include chats import
  console.log('All data import completed!');
}

importData();
