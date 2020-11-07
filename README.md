- LOGO -

What is Sink Overflow?
 - Sink Overflow is a platform for both home improvement questions and answers, modeled on Stack Overflow. It allows users to create accounts, post, delete, upvote, downvote, and comment on both answers and questions.


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





























User Guide

 Table Of Contents

 - Getting started -
    * Signing Up
    * Logging In
      > Demo User
    * Logging Out

  - Questions -
    * Creating Questions
    * Editing Questions
    * Deleting Questions
    * Viewing Questions

  - Answers -
    * Create an Answer
    * Remove Answers
    * Edit Answers
    * View Answers

  - Voting -
    * Voting Questions
    * Voting Answers (Upvote/Downvote)
  
  - Comments -
    * Posting a comment
    * Reading a comment

Getting Started

- Sink Overflow was made for the user who:
- Seeks to find some ideas and answers for their home improvement questions and projects
- Seeks a home improvement community
- Wants to learn about home imporvement

The community will have the power to comment on answers, and upvote or downvote answers as well. By having these options, the users will be able to find the most relevant and helpful questions and answers to their home improvement needs.

- Sink Overflow can be accessed through the link below:
  * (Link to Sink Overflow) 

- The link will take you to the homepage where you will see the following :
  * A navigation bar at the top that inlcudes:
    > a search bar 
    > a login button
  * A navigation bar on the left with the options to:
    > View the top questions
    > Create a new question (Visible to registered users only)
    > View all of your questions (visible to registered users only)
    > View all of your answers (visible to registered users only)
  * A list of the most recent questions that include :
    > The title of the question
    > The question itself
    > The amount of answers for the qeustion
    > The option to upvote or downvote the question and the vote count
    > The user that posted the question
    > The date that the question was created
  
Logging-In
  * Create a new accout (register)
  * Log-in (as an existing user)
  * Log-in (as a Demo User)

Creating a new account

- As a new user, to start creating an account, you must click the "login" button on the top naviation bar.
- Once you are at the login page, click the option "Don't have an account". This will bring you to the registration page where you'll create your username and password for your Sink Overflow account.
- In order to create a successful login, the user must fill in the following fields accordingly:
  * Username 
    > Must have an input
    > Must not be more than 50 characters long
  * Email Address
    > Must be a valid email
    > Must be not be more than 255 characters long
  * Password
    > Must contain at least one lowercase letter, uppercase letter, number, and special character(i.e."@#$%^&*")
    > Must not be more than 50 characters long
  * Confirm password
    > Must match the password

- Once all the information is inputed, you must click the register button to complete the registration process.
- To cancel the process of creating an accout, you have to click the "Cancel" link underneath the register button. Once clicked, the user will be redirected to the homepage.
- If you already have an account, click "Already have an account?". This will redirect users back to the login page.

*If you just want to try out the webstie, look at the Demo user section of this README* 


Logging in

- As an existing user, to log-in, the user must enter the username and password that they used to sign up.

Demo user

- As a new user that just wants to have the privileges of a registered user, without creating an account, can sign in as a "Demo user" by clicking the "Demo User" button.

-- Questions --

Creating questions

- As a registered user, you can post questions on Sink Overflow. The question form can be accessed by clicking the "New Question" button on the side navigation bar (on the left of the homepage).

- Once the user is at the "New Question" form, two inputs are required in order for the question to be posted:
  * A title -> Must be no longer than 50 characters long.
  * The question --> Must be no longer than 255 characters long.

- After filling in those two fields, the user must click the "Submit" button to post the question.

- The user can also cancel the question by clicking "Cancel" on the "New Question" form. They will be redirected to the homepage.

Editing Questions

- As a registered user, you can edit the questions that you post.
- To 
