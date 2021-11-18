import os, os.path
import cherrypy
import codecs
import json

@cherrypy.expose
class Template(object):

    def GET(self):
      retVal_o = {
         'templates': {}
      }

      files_a = os.listdir("./templates")
      for fileName_s in files_a:
         file_o = open("templates/" + fileName_s, "r")
         content_s = file_o.read()
         file_o.close()
         retVal_o["templates"][fileName_s] = content_s

      return json.dumps(retVal_o)
