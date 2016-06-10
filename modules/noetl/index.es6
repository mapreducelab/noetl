"use strict";

// www.noetl.io ////////////////////////////////////////////////////////////////////////////////////////////////////////
// www.noetl.io //////////////// NoETL /////////////////////////////////////////////////////////////////////////////////
// www.noetl.io ////////////////////////////////////////////////////////////////////////////////////////////////////////

// for cursor npm install date_format --save https://www.npmjs.com/package/date_format

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
    if (!['exit'].find(x => x === task.entryPath) && task.nextSuccess) {
        yield  *generateTaskList(Task.task(sep,WORKFLOW,TASKS,task.nextSuccess));
    }
};


// Initiate a task list to push workflow
var tasks = [...generateTaskList(new Task('-',WORKFLOW,TASKS,'start'),'-')];


var testCoursor = tasks[1].getStep('step2').getCursor();

console.log("testCoursor",testCoursor)

let testRange = testCoursor.RANGE;


// to avoid delimiter problem like ["2011-01-01:2012-01-01"] => path ["2011-01-01 12:00:00 : 2011-12-12 12:00:00"] = failed  we need to change to range object instead {from:"2011-10-01 12:00:00",to:"2012-01-01 12:00:00"}

//console.log("Step.toDate(start) ",ConfigEntry.toDate("-2012-11-11",'-YYYY-%m-%d'))

var testtest = tasks[1].getStep('step2')

console.log("testtest",testtest)

let count = 0;
for (let test of testtest) {
    console.log("test", count++,test)
}

//let variter = [...testtest]
//
//
//console.log("variter",variter)

let date = ConfigEntry.toDate("2015:01:01 08:08:08",'%Y-%m-%d HH:MI:SS');

console.log("date", date)

console.log("date formated ", ConfigEntry.formatDate(date,'%Y-%m-%d HH:MI:SS'))

// let format = "[dfgad]dfsdfgfdg[aaaaa]"
// let regexp = /\[([^\]]+)\]/g




// function generateAction (cur,dataType) {
//
//         return "echo Cursor [%Y%m] > WORKFLOW.STAGING/[%Y%m].test".replace(/\[([^\]]+)\]/g, (match, p1) => {
//             return  (dataType === "date") ?  ConfigEntry.formatDate(cur, match) : cur
//         })
//
// }
//     let testGenerateAction = generateAction(date,"date")
// console.log("testGenerateAction", testGenerateAction)
//
// let testGenerateAction2 = generateAction(2,"integer")
// console.log("testGenerateAction2", testGenerateAction2)