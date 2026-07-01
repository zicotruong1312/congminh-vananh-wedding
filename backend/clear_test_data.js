require('dotenv').config();
const mongoose = require('mongoose');
const Rsvp = require('./models/RsvpModel');
const Wish = require('./models/WishModel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wedding';

async function clearData() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        console.log('Deleting all RSVPs...');
        const rsvpRes = await Rsvp.deleteMany({});
        console.log(`Deleted ${rsvpRes.deletedCount} RSVPs.`);

        console.log('Deleting all Wishes...');
        const wishRes = await Wish.deleteMany({});
        console.log(`Deleted ${wishRes.deletedCount} Wishes.`);

        console.log('All test data cleared successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing data:', err);
        process.exit(1);
    }
}

clearData();
