module.exports = {
    sessionSecret: process.env.SESSION_SECRET || "djM-ZcroJldgmx57lfTU-9HRQ_g",
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8080,
    db: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
    },
    
   // cloudinary://878285479738192:djM-ZcroJldgmx57lfTU-9HRQ_g@sinkoverflow,
};
