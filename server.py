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
   
    def POST(self):
        return 0

if __name__ == "__main__":
    conf = {
        '/': {
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './content',
            'tools.staticdir.index': './content/index.html'
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
        },
        '/itviewer': {
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './content',
            'tools.staticdir.index': './viewer.html'
        },
        '/iteditor': {
            'tools.staticdir.root': os.path.abspath(os.getcwd()),
            'tools.staticdir.on': True,
            'tools.staticdir.dir': './content',
            'tools.staticdir.index': './editor.html'
        }
        
    }

    webapp = Server()

    webapp.publishedHNInfos = application.Application_cl()
    webapp.publishedFBInfos = application.Application_cl()

    webapp.templates = template.Template()

    webapp.fbinfo = handler.Handler_cl()

    cherrypy.quickstart(webapp, '/', conf)

    # conf = {

    #     '/': {
    #         'tools.staticdir.root': os.path.abspath(os.getcwd()),
    #         'tools.staticdir.on': True,
    #         'tools.staticdir.dir': './content',
    #         'tools.staticdir.index': './content/index.html'
    #     }
        
    # }

    # methConf = {
    #     '/': {
    #         'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
    #     }
    # }

    # viewConf = {
    #     '/': {
    #         'tools.staticdir.root': os.path.abspath(os.getcwd()),
    #         'tools.staticdir.on': True,
    #         'tools.staticdir.dir': './content',
    #         'tools.staticdir.index': './viewer.html'
    #     }

    # }

    # editConf = {
    #     '/': {
    #         'tools.staticdir.root': os.path.abspath(os.getcwd()),
    #         'tools.staticdir.on': True,
    #         'tools.staticdir.dir': './content',
    #         'tools.staticdir.index': './editor.html'
    #     } 
    # }

    # cherrypy.tree.mount(None, "/", conf)
    # cherrypy.tree.mount(application.Application_cl(), "/publishedHNInfos", methConf)
    # cherrypy.tree.mount(application.Application_cl(), "/publishedFBInfos", methConf)
    # cherrypy.tree.mount(None, "/itviewer", viewConf)
    # cherrypy.tree.mount(None, "/iteditor", editConf)

    # cherrypy.engine.start()
    # cherrypy.engine.block()

    