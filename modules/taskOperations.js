// --- Task Operations Module: Pure Functions for Task Management ---

/**
 * Pure functions for task operations
 * Immutable data structures, no side effects
 */

export const taskOperations = {
    createTask: (text) => ({ text, completed: false, subtasks: [] }),
    
    createSubtask: (text) => ({ text, completed: false }),
    
    toggleTask: (task) => ({ ...task, completed: !task.completed }),
    
    addTaskToList: (tasks, task) => [...tasks, task],
    
    addSubtaskToTask: (task, subtask) => ({
        ...task,
        subtasks: [...(task.subtasks || []), subtask]
    }),
    
    updateTaskAtIndex: (tasks, index, updatedTask) =>
        tasks.map((task, i) => i === index ? updatedTask : task),
    
    updateSubtaskAtIndex: (task, subIndex, updatedSubtask) => ({
        ...task,
        subtasks: task.subtasks.map((sub, i) => i === subIndex ? updatedSubtask : sub)
    }),
    
    removeTaskAtIndex: (tasks, index) => 
        tasks.filter((_, i) => i !== index),
    
    removeSubtaskAtIndex: (task, subIndex) => ({
        ...task,
        subtasks: task.subtasks.filter((_, i) => i !== subIndex)
    })
};
