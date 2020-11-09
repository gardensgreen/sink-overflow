What is Sink Overflow?
 - Sink Overflow is a platform for both home improvement questions and answers, modeled on Stack Overflow. It allows users to create accounts, post, delete, upvote, downvote, and comment on answers.


Technologies used:
- Bcrypt
- Cookie-Parser
- dotenv
- faker.js 
- nodemon
- Pug
- Sequelize
- Sequelize-cli

Application Architecture:

Sink Overflow's backend server was built using Express, NodeJS and used Sequelize ORM to migrate and seed our database. The database and tables were created using PostgreSQL.

For Sink Overflow's front end, we used HTML for the structure and  the Pug templating engine to render all of our views from the back end server and we styled our page using vanilla css along with using vanilla javascript for some functionality.


--------------------------------------------------------
Backend



Security and Authentication: 
We used csurf to protect our app from CSURF attacks (where?) and we also used bcrypt hashing to protect the passwords of our users. 

How did we use RESTful APIs?

Our Databse schema:
![Image of Schema](https://imgur.com/a/geZjKdx)

The search API:

The vote API:






What is Sink Overflow?
 - Sink Overflow is a platform for both home improvement questions and answers, modeled on Stack Overflow. It allows users to create accounts, post, delete, upvote, downvote, and comment on answers.


Technologies used:
- Bcrypt
- Cookie-Parser
- dotenv
- faker.js 
- nodemon
- Pug
- Sequelize
- Sequelize-cli

Application Architecture:

![App Architecture Diagram](https://photos.app.goo.gl/1gmFXSQhNvVgWCHM8)

Sink Overflow's backend server was built using Express NodeJS and  our database (where the application data is stored) was created using PostgreSQL.

For Sink Overflow's front end, we used the Pug templating engine to render all of our views (where from? the back end server?) and we styled our page using css.

To connect our backend to our database, we used the Sequelize ORM.
(I'm having trouble putting more detail here.)


--------------------------------------------------------
Backend



Security and Authentication: 
We used csurf to protect our app from CSURF attacks (where?) and we also used bcrypt hashing to protect the passwords of our users. 

Implementing User authentication:
![Code snippet of user authentication](https://photos.app.goo.gl/GCVDFEQNGaZh6tF67)

Our Databse schema:
![Image of Schema](https://photos.app.goo.gl/bNJXGuGvhJPnUVgt9)

The search API:

The vote API:














































