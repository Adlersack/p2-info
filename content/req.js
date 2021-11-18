'use strict'

if (APPUTIL == undefined){
   var APPUTIL = {};
}

APPUTIL.Requester = class {
   constructor(){}

   GET(url){
      return this.request(url, "GET");
   }

   DELETE(url){
      return this.request(url, "DELETE");
   }

   POST(url, data){
      return this.request(url, "POST", data);
   }

   PUT(url, data){
      return this.request(url, "PUT", data);
   }

   async request(url, _method, data = null){
      var response

      try{
         if(data){
            response = await fetch(url, {
               method: _method,
               headers: {
                  'Content-Type': 'application/json'
               },
               cache: 'no-cache',
               body: JSON.stringify(data)
            });
   
            return response.text()
         } else {
            response = await fetch(url, {
               method: _method,
               cache: 'no-cache'
            });

            return response.json();
         }
      } catch(error){
         console.error("Fehler bei dem promise: ", error);
      }
   }
}