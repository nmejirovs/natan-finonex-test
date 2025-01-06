const { open } = require('node:fs/promises');
const argv = require('yargs').argv
const { Sequelize, DataTypes } = require('@sequelize/core')
const { PostgresDialect } = require('@sequelize/postgres')

const sequelize = new Sequelize({
	dialect: PostgresDialect,
	database: process.env.DB_NAME ,
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	host: process.env.DB_SERVER,
	port: process.env.DB_PORT,
	ssl: false,
	clientMinMessages: 'notice',
	define: {
		freezeTableName: true,
		timestamps: false
	},
	logging: console.log
})


const usersRevenue = sequelize.define('users_revenue', {
	user_id: {
		type: DataTypes.STRING(20),
		primaryKey: true,
		allowNull: false,
	},
	revenue: {
		type: DataTypes.BIGINT,
		allowNull: false,
	},
})

const { filePath } = argv


//Can be unit tested if extracted to separate module
const calculateUpdatedRevenue = ({existingUser = { revenue: 0 }, eventType, value}) => {
	let revenueUpdate = parseInt(value)

	if(eventType === 'subtract_revenue') {
		revenueUpdate = revenueUpdate * -1
	}

	return parseInt(existingUser.revenue) + revenueUpdate
}

const handleFile = async () => {
	const file = await open(filePath);

	for await (const line of file.readLines()) {
		const transaction = await sequelize.startUnmanagedTransaction();
		try {
			const { userId, name: eventType, value} = JSON.parse(line)

			const existingUser = await usersRevenue.findByPk(userId, { transaction });
			const updatedRevenue = calculateUpdatedRevenue({ existingUser: existingUser || undefined, eventType, value })

			await usersRevenue.upsert({
				user_id: userId,
				revenue: updatedRevenue
			}, {
				transaction,
				updateOnDuplicate: ['revenue']
			});

			await transaction.commit();
		} catch (e) {
			await transaction.rollback();

			console.error(`Failed during handle line - ${e.message}`);
		}
	}
}

if(filePath) {
	handleFile().then(() => {
		console.log('Finished Successfully')
		process.exit(0)
	}).catch((e) => {
		console.error(`failed during handle file - ${e.message}`)
		process.exit(1)
	})
}





module.exports = {
	usersRevenue
}