import {Sequelize} from 'sequelize-typescript';

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'kere',
    database: 'base',
    models: [__dirname + '/src/models'],
    logging: console.log,
});

export default sequelize;
