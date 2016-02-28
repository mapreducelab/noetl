from unittest import TestCase
import TestUtils
from src.main.python.execution.ExecutionActionsForTests import SupportedTestActionsUtils


class TestNOETL_ForkTests(TestCase):
    """
        Fork Tests
    """

    """
            start,  0:[step1, step2]
            /   \
           /     \
          /       \
    step1:        step2:cursor[1]
    cursor[1]


            exit
    """

    def test_simpleFork_1(self):
        # This one tests simple 2 forks without merge
        def asserts(allLines):
            self.assertEquals(2, len(allLines))
            if allLines[0].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")):
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step2", "1")))
            else:
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")))

        TestUtils.sameSetupUp("noetlTest_simpleFork_1.json", asserts)

    """
            start, exit:[step1, step2]
            /   \
           /     \
          /       \
    step1:        step2:cursor[1]
    cursor[1]      /
         \        /
          \      /
            exit
    """

    def test_simpleFork_2(self):
        # This one tests simple 2 forks merge at exit
        def asserts(allLines):
            self.assertEquals(2, len(allLines))
            if allLines[0].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")):
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step2", "1")))
            else:
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")))

        TestUtils.sameSetupUp("noetlTest_simpleFork_2.json", asserts)

    """
            start,  mergeStep:[step1, step2]
            /   \
           /     \
          /       \
    step1:        step2:cursor[1]
    cursor[1]      /
         \        /
        MN\      /MN
           \    /
           mergeStep: cursor[1]
             |
             |N
             |
            exit
    """

    def test_simpleFork_3(self):
        # This one tests simple 2 forks merge at exit
        def asserts(allLines):
            self.assertEquals(3, len(allLines))
            if allLines[0].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")):
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step2", "1")))
            else:
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")))
            self.assertTrue(allLines[2].startswith(SupportedTestActionsUtils.getPrefixString("mergeStep", "1")))

        TestUtils.sameSetupUp("noetlTest_simpleFork_3.json", asserts)

        """
            start
              |
              |
           FailedStep, 0:[step1, step2]
            /   \
          S/     \SF
          /       \
    step1:        step2:cursor[1]
    cursor[1]


            exit
    """

    def test_simpleFork_NextFailurePointingToADifferentBranch(self):
        # Disallow the case that next failure points to a different branch.
        # Next failure can only go to exit or merge with current branch.
        # This program should stop at FailedStep
        def asserts(allLines):
            self.assertEquals(1, len(allLines))
            self.assertTrue(allLines[0].startswith(SupportedTestActionsUtils.getPrefixString("FailedStep", "-1")))

        TestUtils.sameSetupUp("noetlTest_simpleFork_disallow1.json", asserts)

    """
            start,  exit:[step1, step2]
            /   \
           /     \
          /       \
    step1:        step2
        \          /   |
    |    \        /    |
    |    N\      /N    |
    |      \    /      |
    |M     mergeStep   |M
    \__      |       _/
       \__   |N  ___/
          \  |  /
            exit
    """

    def test_simpleFork_4(self):
        # This is creating three branches.
        # 1. Step1 - mergeStep
        # 2. Step2 - mergeStep
        # 3. exit.
        # This one tests simple 2 forks merge at exit
        def asserts(allLines):
            self.assertEquals(4, len(allLines))
            if allLines[0].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")):
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step2", "1")))
            else:
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")))
            self.assertTrue(allLines[2].startswith(SupportedTestActionsUtils.getPrefixString("mergeStep", "1")))
            self.assertTrue(allLines[3].startswith(SupportedTestActionsUtils.getPrefixString("mergeStep", "1")))

        TestUtils.sameSetupUp("noetlTest_simpleFork_4.json", asserts)

    """
            start,  exit:[step1, step2]
            /   \
           /     \
          /       \
    step1:        step2
        \          /    \
    |    \        /      \
    |    N\      /N       |
    |      \    /         |
    |M    step_shared1    |M
    |        |            |
    |        |            |
    |        |            |
    |     step_shared2   /
     \_      |       ___/
       \__   |N  ___/
          \  |  /
            exit
    """

    def test_simpleFork_5(self):
        # This is creating three branches.
        # 1. Step1 - step_shared1 - step_shared2
        # 2. Step2 - step_shared1 - step_shared2
        # 3. exit.
        # This one tests simple 2 forks merge at exit
        def asserts(allLines):
            self.assertEquals(6, len(allLines))
            if allLines[0].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")):
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step2", "1")))
            else:
                self.assertTrue(allLines[1].startswith(SupportedTestActionsUtils.getPrefixString("step1", "1")))
            self.assertTrue(allLines[2].startswith(SupportedTestActionsUtils.getPrefixString("step_share1", "1")))
            self.assertTrue(allLines[3].startswith(SupportedTestActionsUtils.getPrefixString("step_share1", "1")))
            self.assertTrue(allLines[4].startswith(SupportedTestActionsUtils.getPrefixString("step_share2", "1")))
            self.assertTrue(allLines[5].startswith(SupportedTestActionsUtils.getPrefixString("step_share2", "1")))

        TestUtils.sameSetupUp("noetlTest_simpleFork_5.json", asserts)

    """
       start,  merge1:[step1, step2], finalMerge:[merge1, step3]
        |              |                         |
        |              |                         |
        |              |                         |
    step1:        step2:cursor[1]           step3:cursor[1]
    cursor[1]      /                             |
         \        /                              |
        MN\      /MN                             |
           \    /                     ___________/
           merge1: cursor[1]         /
              \                     /
             MN\________           /
                        \         /
                        finalMerge: cursor[1]
                             |
                             |
                             |
                            exit

    """

    def test_complicatedFork_1(self):
        # This version cannot be supported because of current design.
        # The problem is that merge1-finalMerge is a merge branch from left side.
        # But merge1 is a forking branch from right side.
        # Will be supported in the further if the design changes to tree transverse
        # rather than task-branch-step.
        # The other problem with current design is that
        pass
        # def asserts(allLines):
        #     self.assertEquals(0, len(allLines))
        #
        # TestUtils.sameSetupUp("noetlTest_complicatedFork_1.json", asserts)
