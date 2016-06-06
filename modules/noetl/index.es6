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

let testdate = testCoursor.RANGE;


// to avoid delimiter problem like ["2011-01-01:2012-01-01"] => path ["2011-01-01 12:00:00 : 2011-12-12 12:00:00"] = failed  we need to change to range object instead {from:"2011-10-01 12:00:00",to:"2012-01-01 12:00:00"}
let range = [
    {from:"2011-10-01",to:"2012-01-01"},"2013-10-01"
]

let range1 = [
    {from:1,to:2},10
]

console.log(range)

console.log("Step.toDate(start) ",Step.toDate("-2012-11-11",'-YYYY-%m-%d'))

function* generateCursorCall(cur, end = null, dataType = "integer",  step = 1){
    let from = Step.isDate(cur) ? new Date(cur.getTime()) : cur, to = end;
    if(ConfigEntry.isObject(cur)) {
        let {from: start,to: stop} = cur;
        from = (dataType === "date" ) ? Step.toDate(start) : start, to =  (dataType === "date" ) ? Step.toDate(stop)  : stop;
    }
    yield from;
    if (from < to) {
        let nextVal;
        if (from instanceof Date) {
            nextVal = new Date(from.getTime());
            nextVal.setDate(nextVal.getDate() + step)
        } else {
            nextVal =  from + step;
        }
        yield  *generateCursorCall(nextVal, to , dataType, step);
    }
};



console.log("int cursors",[...generateCursorCall({from:1,to:4})])

var cursors = [...generateCursorCall({ from: '2011-10-01', to: '2011-10-05' },null,"date")];

console.log("date cursors",cursors)