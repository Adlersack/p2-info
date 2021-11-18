import os
import os.path
import codecs
import markdown2
import uuid
import json
import uuid

import cherrypy

@cherrypy.expose
class Handler_cl(object):

   def __init__(self):
      data_o = {}

   @cherrypy.tools.accept(media='application/json')
   def GET(self, id = None):
      if id == None or id == "":
         try:
            f = open('data/fb_feed.json')
            jsonData = json.load(f)

            for i in jsonData:
               jsonData[i]['content'] = markdown2.markdown(jsonData[i]['content'])

            f.close()

            return json.dumps(jsonData)
         except:
            return -1
      else:
         with open('data/fb_feed.json', 'r+') as fp:
            jsonData = json.load(fp)
            data = {}
            try:

               data[id] = jsonData[id]

               return json.dumps(data)
            except:
               cherrypy.response.status = 404

               return "Eintrag mit gegebener ID gibt es nicht"

   def DELETE(self, id):
      with open('data/fb_feed.json', 'r+') as fp:
         jsonData = json.load(fp)

         print(jsonData)

         try:
            del jsonData[id]
            fp.truncate(0)
     
            fp.seek(0)

            json.dump(jsonData, fp, indent=3)

            return "1"
         except:
            cherrypy.response.status = 404

            return "Eintrag mit gegebener ID gibt es nicht"

   @cherrypy.tools.json_in()
   @cherrypy.tools.json_out()
   def POST(self):
      data_o = {}

      try:
         with open('data/fb_feed.json', 'r+') as fp:
            jsonData = json.load(fp)

            content = cherrypy.request.json
            id = str(uuid.uuid4())         
            data_o[id] = content

            jsonData.update(data_o)

            fp.seek(0)

            json.dump(jsonData, fp, indent=3)

            return id

      except:
         return self.getDefault()

   @cherrypy.tools.json_in()
   def PUT(self, id = None):
      if id != None:
         try:
            with open('data/fb_feed.json', 'r+') as fp:
               jsonData = json.load(fp)

               content = cherrypy.request.json

               print(content['title'])
               print(content['content'])
               
               print(jsonData[id])
               
               jsonData[id].update({"title": content['title']})
               jsonData[id].update({"content": content['content']})

               print(jsonData[id]['content'])

               if content['status'] != "":
                  jsonData[id].update({"status": content['status']})
                  if content['status'] == "Veroeffentlicht":
                     jsonData[id].update({"published": content['published']})

               fp.seek(0)
               fp.truncate(0)

               json.dump(jsonData, fp, indent=3)

               return "1"
         except:

            return "dfhdfhdfhdfhdfhdf"
      else:
         return "Keine ID wurde angegeben"
   
   def getDefault(self):
      obj = {
            "title": "",
            "created": "",
            "published": "",
            "status": "",
            "content": ""
        }

      return obj
