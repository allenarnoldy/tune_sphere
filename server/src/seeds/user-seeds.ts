
import { User } from '../models/index.js';

export const seedUsers = async () => {
    await User.bulkCreate(
    [
        {
        user_name : "Sunny",
        email : "Sunny@gmail.com",
        password: "Test123",
        name: "Sunny Deol",
        dob: "01/01/2001",
        gender:"M",
        share_info:"Y"
        },
        {
        user_name : "allen",
        email : "allen@gmail.com",
        password: "password",
        name: "Allen Arnoldy",
        dob: "02/18/1990",
        gender:"M",
        share_info:"Y",
        },
        {
        user_name : "billy",
        email : "billy@gmail.com",
        password: "password",
        name: "Billy Joel",
        dob: "08/12/1972",
        gender:"M",
        share_info:"Y",
        },
    ],
    { individualHooks: true }
    );
};
