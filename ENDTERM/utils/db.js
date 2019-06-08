var mysql =  require('mysql');

var createConnection = () =>{
    return mysql.createConnection({
        host: 'localhost',
        port: '427',
        user: 'root',
        password: 'password',
        database: 'baodientu16th'
    });
};

module.exports = {
    load: (sql) =>{
        return new Promise((resolve, reject)=>{
            var connection = createConnection();
            connection.connect();
            connection.query(sql, (error, result, field)=>{
                if (error)
                    reject(error);
                else
                    resolve(result);
                connection.end();
            });
        });
    }
};
