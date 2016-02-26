from Task import *


class Step:
    def __init__(self, task, stepName):
        self.task = task
        self.branch = None
        self.stepName = stepName
        self.stepPath = Step.getStepPath(self.task.taskName, stepName)

        stepDict = processConfRequest(task.config, self.stepPath)
        self.stepDesc = stepDict["DESC"]

        nextDict = stepDict["NEXT"]
        self.success = nextDict["SUCCESS"]
        failDict = nextDict["FAILURE"]

        self.nextFail = failDict["NEXT_STEP"]
        # self.maxFailures controls how many times the cursor can fail for EACH step processing.
        # This configuration seem to belong to call.cursor.
        self.maxFailures = int(failDict["MAX_FAILURES"])
        self.waittime = getWaitTime(failDict["WAITTIME"])
        self.cursorFail = []

        callDict = stepDict["CALL"]
        self.action = callDict["ACTION"]
        self.thread = "0"
        self.cursor = []
        self.curInherit = False
        self.execLists = []

        if self.action.lower() != "exit":
            self.thread = callDict["THREAD"]

            cursor = callDict["CURSOR"]
            self.cursorRange = cursor["RANGE"]
            self.cursorDataType = cursor["DATATYPE"]
            self.cursorIncrement = cursor["INCREMENT"]
            self.cursorFormat = cursor["FORMAT"]
            # self.cursor keeps the cursors that need to be run. Will be updated to cursorFail if step failed.
            self.cursor = getCursor(self.cursorRange, self.cursorDataType, self.cursorIncrement,
                                    self.cursorFormat)

            self.cursorListIndex = range(0, len(self.cursorRange))
            self.curInherit = cursor["INHERIT"].lower() == 'true'

            self.callExec = callDict["EXEC"]
            self.execLists = self.callExec["CMD"]

    @staticmethod
    def getStepPath(taskName, stepName):
        return "{0}.STEPS.{1}".format(Task.getTaskPath(taskName), stepName)
