// Define User table / CreateAttributes

import { DataTypes, type Sequelize, Model, type Optional } from 'sequelize';

import bcrypt from 'bcrypt';

interface UserAttributes {
    id: number;
    user_name: string;
    password: string;
    email: string;
    name: string;
    dob: string;
    gender:string;
    share_info:string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export class User
    extends Model<UserAttributes,UserCreationAttributes>
    implements UserAttributes
{
    public id!: number;
    public user_name!: string;
    public password!: string
    public email!: string;
    public name!: string
    public dob!: string;
    public gender!: string
    public share_info!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    //Hash the password before the save
    public async setPassword(password: string) {
        const saltRounds = 12;
        this.password = await bcrypt.hash(password, saltRounds);
    }
}

    export function UserFactory(sequelize: Sequelize): typeof User {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                user_name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                dob: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                gender: {
                    type: DataTypes.CHAR,
                    allowNull: false
                },
                share_info: {
                    type: DataTypes.CHAR,
                    allowNull: false
                },
            },
            {
                tableName: 'users',
                sequelize,
                timestamps: true,
                underscored: true,
                freezeTableName: true,
                hooks: {
                    beforeCreate: async (user: User) => {
                        await user.setPassword(user.password);
                    },
                    beforeUpdate: async (user: User) => {
                        await user.setPassword(user.password);
                    }
                }
            }
        );
        return User;
    }