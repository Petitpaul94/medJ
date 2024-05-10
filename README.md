Résumé de la structure pour le nain: 


gitignore : node modules (à télécharger), credentials

auto.bat : terminal lancé automatiquement (chrontab ou equivalent) qui prompte le nom du cours et l'envoie sur le serveur via curl

db: **désuet. Enregistrement des cours ds une database. A remettre au gout du jour si on veut faire un truc plus sophistiqué ?


index.js: serveur node.js, qui tourne en arrière plan au démarrage. Envoie les requêtes à l'api de google calendar



