
let config = {};
if(process.env.TEST){
    config = {
        user: 'postgres',
        host: 'localhost',
        database: 'travis_ci_test',
        password: 'root',
        port: '5432'
    }
}else{
    config = {
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.PORT_DB,
        host: process.env.HOST

    }
}


module.exports = config;