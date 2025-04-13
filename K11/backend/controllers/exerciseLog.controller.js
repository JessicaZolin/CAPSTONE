import ExerciseLog from "../models/ExerciseLog.js";


// Create a new exercise log entry
export async function createExerciseLog(request, response) {
    try {
        const { user, exercise, date, weight, notes } = request.body;
        const newLog = new ExerciseLog({ user, exercise, date, weight, notes });
        await newLog.save();
        response.status(201).json(newLog);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal Server Error" });
    }
}


// -------------------------------------------------------------------------------------------------------------

// Get all exercise logs for a specific user and exercise
export async function readSingleUserExerciseLog(request, response) {
    
    try {
        const { exerciseId, userId } = request.params;
        const logs = await ExerciseLog.find({ exercise: exerciseId, user: userId }).sort({ date: -1 });
        response.status(200).json(logs);
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal Server Error" });
    }
}


// -------------------------------------------------------------------------------------------------------------

// Delete a specific exercise log entry for a user and exercise
export async function destroySingleUserExerciseLog(request, response) {
    try {
        const deletedLog = await ExerciseLog.findByIdAndDelete(request.params.logId);
        response.status(200).json(deletedLog);
    } catch (error) {
        console.error(error);    
        response.status(500).json({ message: "Internal Server Error" });
    }
}