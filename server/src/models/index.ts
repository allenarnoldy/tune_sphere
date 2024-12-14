import sequelize from '../config/connection.js';
import { UserFactory } from './user.js';

//initialize the User model using the factory function & Sequelize instance
const User = UserFactory(sequelize);

//Export the Sequelize instance & the initialized model for use in other parts of the application
export {sequelize, User};