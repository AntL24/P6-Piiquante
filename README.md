#P6-Piiquante

Cloner ce projet depuis GitHub. 

Lancer le Frontend
    • Ouvrez le terminal sur le dossier \front et exécuter npm install pour installer les dépendances. 
    • Le projet est codé avec Angular.
    • Taper ng serve pour activer le serveur front du site.

Lancer le Backend
    • Ouvrez le terminal sur le dossier \backend.
    • Pour installer le serveur back, chargez nodemon : npm install -g nodemon. 
    • Enfin, lancez le back avec la commande : nodemon index.js.

Si les packages sont déja installés, ces commandes suffisent à démarrer les serveurs.
    • npm start via le terminal sur le frontend 
    • nodemon server via le terminal sur le backend 
    • Se connecter à l'url : http://localhost:4200 

Connexion
    • Ouvrir localhost:4200 dans votre navigateur. 
    • Pour s'enregistrer, l'utilisateur doit fournir un email et un mot de passe contenant 08 caractères minimum (dont 1 majuscule, 1 minuscule, 1 chiffre, pas de symbole, espaces autorisés). //Réparer le regex pour le mot de passe (non pris en compte).