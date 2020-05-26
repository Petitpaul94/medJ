function call(titre, commence_le) {

  const mysql = require('mysql');
  //Formatage variables db
  const firstYear = Boolean(commence_le > new Date(2020, 8, 1));
  commence_le = commence_le.slice(0, 10);
  const matiere = titre.slice(0, /\s/.exec(titre).index);
  const nom = titre.slice(/\s/.exec(titre).index + 1);

  var con = mysql.createConnection({
    host: 'localhost',
    user: 'student',
    password: 'socrate',
    database: 'medecine'
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query(`SELECT * FROM matieres WHERE nom="${matiere}"`, function(err, result, fields) {

      if (result.length != 0) {
        return result[0].couleur;
      } else {
        con.query('SELECT COUNT(nom) AS count FROM matieres', function(err, result) {
			// on ramène couleur à [|1,11|]
          let couleur = (result[0].count + 1)%13+13*((result[0].count + 1)%13==0);
          con.query(`INSERT INTO matieres VALUES ("${matiere}", ${couleur})`, function(err, result) {
            if (err) throw err;
            return couleur;
          });
        });
      }
    });
  });

}

exports.call = call;
