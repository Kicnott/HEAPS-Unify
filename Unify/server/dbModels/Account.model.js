export default (sequelize, Sequelize) => {
    const Account = sequelize.define("Account", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.STRING,
        },
        myCalendars: {
            type: Sequelize.STRING,
        },
        followedCalendars: {
            type: Sequelize.ARRAY(Sequelize.STRING),
        },
    });
    return Account;
};
