/*globals module, initConfig */
module.exports = function (grunt) {
  "use strict";
  var getDate = function () {
    var d = new Date();
    // bron: http://stackoverflow.com/a/3067896
    Date.prototype.yyyymmdd = function () {
      var yyyy = this.getFullYear().toString(),
        mm = (this.getMonth() + 1).toString(), // getMonth() is zero-based
        dd  = this.getDate().toString();
      // padding
      return yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0]);
    };
    return d.yyyymmdd();
  };
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    "string-replace": {
      build: {
        files: [
          {
            src: "nederlab/config.js",
            dest: "min/config-temp.js"
          }
        ],
        options: {
          replacements: [
            {
              pattern: "www.nederlab.dev",
              replacement: "www.nederlab.nl"
            }
          ]
        }
      },
      inline: {
        files: [
          {
            src: ["../smarty/templates/generic.tpl"],
            dest: "../smarty/templates/generic.tpl"
          }
        ],
        options: {
          replacements: [
            {
              pattern: /v=\d\d\d\d-\d\d-\d\d/g,
              replacement: "v=" + getDate()
            }
          ]
        }
      }
    },
    concat: {
      build: {
        src: [
          "min/config-temp.js",
          "nederlab/utilities.js",
          "nederlab/model/broker.js",
          "nederlab/view/view.js",
          "nederlab/controller/controller.js",
          "nederlab/controller/querybuilder.js",
          "nederlab/controller/eventhandler.js",
          "nederlab/visualization.js",
          "nederlab/rvisualization.js",
          "nederlab/analyzer/model.js",
          "nederlab/analyzer/view.js",
          "nederlab/analyzer/controller.js"
        ],
        dest: "min/nederlab-temp.js"
      }
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"isoDateTime\") %> */\n"
      },
      build: {
        src: "min/nederlab-temp.js",
        dest: "min/nederlab.min.js"
      }
    },
    clean: {
      build: {
        src: ["min/*-temp.js"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-string-replace");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-clean");

  // Default task(s).
  grunt.registerTask("default", ["string-replace", "concat", "uglify", "clean"]);

};
