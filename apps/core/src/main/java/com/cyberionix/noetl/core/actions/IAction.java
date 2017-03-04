package com.cyberionix.noetl.core.actions;

/**
 * Created by Davit on 01.31.2017.
 */
public interface IAction {
    public String getActionID();

    public void onStateChanged(IAction action); //??? is called when previous task is changed
    public ActionState getState();
    public Integer getExitCode();
    public ActionOutput getOutputResult();
    public Object getPropertyValue(String key);

}
