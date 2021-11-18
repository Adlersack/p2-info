import os, os.path
import cherrypy
import feedparser
import json

from app import application, handler, template

class Server(object):
    @cherrypy.expose
    def index(self):
        return open('./templates/index.html')

    @cherrypy.expose
    def detail(self):
        return open('./templates/form.html')

@cherrypy.expose
class API(object):

    def __init__(self):
        self.feed_o = feedparser.parse("https://www.hs-niederrhein.de/rss")
        self.app = application.Application_cl()
        
        self.app.initList()

    @cherrypy.tools.accept(media='application/json')
    def GET(self):

        print(cherrypy.request.path_info)

        if cherrypy.request.path_info == "/publishedHNInfos":
            rssList = self.app.getHNList()
        elif cherrypy.request.path_info == "/publishedFBInfos":
            rssList = self.app.getFBList()

        if rssList == -1:
            cherrypy.response.status = 500
            return "Datei konnte nicht gefunden werden"
        else:
            return json.dumps(rssList)
   
    def POST(self):
        return 0

if __name__ == "__main__":
    conf = {
        '/': {
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './content'
        },
        '/publishedHNInfos': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
        },
        '/publishedFBInfos': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
        },
        '/fbinfo': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
        },
        '/templates': {
            'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
        }
        
    }

    webapp = Server()
    webapp.publishedHNInfos = API()
    webapp.publishedFBInfos = API()
    webapp.templates = template.Template()
    webapp.fbinfo = handler.Handler_cl()

    cherrypy.quickstart(webapp, '/', conf)

    