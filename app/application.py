import os, os.path
import json
from datetime import datetime
import operator
import feedparser
import uuid
import markdown2
import cherrypy

@cherrypy.expose
class Application_cl(object):

    def __init__(self):
        self.data_o = {}
        self.feed_o = feedparser.parse("https://www.hs-niederrhein.de/rss")

    @cherrypy.tools.accept(media='application/json')
    def GET(self):

        print(cherrypy.request.path_info)

        if cherrypy.request.path_info == "/publishedHNInfos":
            rssList = self.getHNList()
        elif cherrypy.request.path_info == "/publishedFBInfos":
            rssList = self.getFBList()

        if rssList == -1:
            cherrypy.response.status = 500
            return "Datei konnte nicht gefunden werden"
        else:
            return json.dumps(rssList)

    def initList(self):
        with open('data/rss_feed.json', 'r+') as fp:
            jsonData = json.load(fp)

            if len(jsonData) > 0 and len(jsonData) == len(self.feed_o["entries"]):
                return 0

        for i in self.feed_o["entries"]:

            data = {
                "title": i.title,
                "created": "",
                "published": i.published_parsed,
                "status": "",
                "content": markdown2.markdown(i.content[0].value)
            }

            id = str(uuid.uuid4())

          
            with open('data/rss_feed.json', 'r+') as fp:
                self.data_o[id] = data

                if len(jsonData) == len(self.feed_o["entries"]):
                    break
                
                fp.seek(0)

                print(str(i.published_parsed[0:5]))

                #jsonData = sorted(jsonData, key=lambda x: str(x['published']), reverse=True)
                

                json.dump(self.data_o, fp, indent = 3)
            

    def getHNList(self):
        try:
            if self.initList() == 0:
                f = open('data/rss_feed.json')
                jsonData = json.load(f)
                f.close()
        except:
            return -1

        return jsonData

    def getFBList(self):
        try:
            if self.initList() == 0:
                f = open('data/fb_feed.json')
                jsonData = json.load(f)
                data = {}

                for i in jsonData:
                    if jsonData[i]['status'] == "Veroeffentlicht":
                        data[i] = jsonData[i]
                        data[i]['content'] = markdown2.markdown(jsonData[i]['content'])

                f.close()

            return data
        except:
            return -1
