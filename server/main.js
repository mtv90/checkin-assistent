import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

import '../imports/api/users';
import '../imports/api/termine';
import '../imports/startup/simple-schema-configuration';

Meteor.startup(() => {
  // Middleware die Requests prüft
  // WebApp.connectHandlers.use((req, res, next) => {
  //   console.log("this is from my custom middleware");
  //   console.log(req.url, req.query, req.method)
  //   if(req.url === '/1234'){
  //     res.statusCode = 302;
  //     res.setHeader('location', 'https://www.google.de');
  //     res.end()
  //   } else {
  //     next();
  //   }
    
  // })
});
