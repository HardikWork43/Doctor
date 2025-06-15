import { Sequelize } from 'sequelize';

// Database configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export { sequelize };