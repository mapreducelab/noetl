"use strict";

// www.noetl.io ////////////////////////////////////////////////////////////////////////////////////////////////////////
// www.noetl.io //////////////// NoETL /////////////////////////////////////////////////////////////////////////////////
// www.noetl.io ////////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * NoETL module dependencies
 */
//require("babel-polyfill");

var fs          = require('fs'),
    nconf       = require('nconf'),
    co          = require('co'),
    ConfigEntry = require('./ConfigEntry'),
    Task        = require('./Task'),
    Step        = require('./Step');

var keys = Object.keys;
var assign = Object.assign;

// Config keys
const   PROJECT     = 'PROJECT',
        WORKFLOW    = 'WORKFLOW',
        TASKS       = 'TASKS',
        START       = 'start',
        EXIT        = 'exit'; //SEP = [' ',':','.',',',';','|','-'];

// Read configuration file
nconf.argv()
    .env()
    .file({ file: '../../conf/coursor.inherit.cfg.v2.json' });

// Validate config file for main entries
nconf.required([`${WORKFLOW}:${TASKS}:${START}`,`${WORKFLOW}:${TASKS}:${EXIT}`]);

/**
 * @function generateTaskList
 * Iterate over all tasks of workflow.
 * @returns { Iterator.<Task> }
 * @example
 * var tasks = [...generateTaskList(new Task('-',WORKFLOW,TASKS,'start'),'-')];
 */
function* generateTaskList(task,sep='-'){
    yield task;
    if (!['exit'].find(x => x === task._entryPath) && task.nextSuccess) {
        yield  *generateTaskList(Task.task(sep,WORKFLOW,TASKS,task.nextSuccess));
    }
};

// Initiate a task list to push workflow
var tasks = [...generateTaskList(new Task('-',WORKFLOW,TASKS,'start'),'-')];


//console.log("object: ",Object.keys(tasks[0].START).length);
//console.log("VARTATSKS: ",tasks);
//
//var translatedEntry = ConfigEntry.translateConfigEntryReference({},tasks[1].STEPS.step1);
//
//console.log("translatedEntry", translatedEntry);
//
//console.log("translatedEntry1",translatedEntry.CALL.EXEC.CMD);

var testCoursor = tasks[1].getStep('step2').getCursor();

console.log("testCoursor",testCoursor)

