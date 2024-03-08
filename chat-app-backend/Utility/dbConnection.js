import mongoose from 'mongoose';

export const connectToDatabase = () => {
    mongoose.connect(`${process.env.DB_CONNECTION_STRING}ChatAppDB`)
        .then(() => {
            console.log('Database connection sucessfull');
        })
        .catch(() => {
            console.log('Database connection unsucessfull');
        });
};