import ExerciseLog from "../models/ExerciseLog.js";
import mongoose from "mongoose";

// Create a new exercise log entry
export async function createExerciseLog(request, response) {
  try {
    const { exerciseId } = request.params;
    const { user, date, weight, notes } = request.body;
    const newLog = new ExerciseLog({
      user,
      exercise: exerciseId,
      date,
      weight,
      notes,
    });
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

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return response
        .status(400)
        .json({ message: "Invalid exerciseId" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response
        .status(400)
        .json({ message: "Invalid userId" });
    }

    const logs = await ExerciseLog.find({
      exercise: exerciseId,
      user: userId,
    }).sort({ date: -1 });
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
    const deletedLog = await ExerciseLog.findByIdAndDelete(
      request.params.logId
    );
    response.status(200).json(deletedLog);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// Get all exercise logs for a specific user

export async function readSingleUserAllExerciseLogs(request, response) {
  try {
    const { userId } = request.params;

    // Validazione ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return response.status(400).json({ message: "Invalid user ID format" });
    }

    const uniqueLogs = await ExerciseLog.aggregate([
      // Match logs for specific user
      { $match: { user: new mongoose.Types.ObjectId(userId) } },

      // Group by exercise to get unique exercises
      {
        $group: {
          _id: "$exercise",
          lastLog: { $first: "$$ROOT" }, // Keep the most recent log
          totalLogs: { $sum: 1 }, // Count total logs per exercise
          lastDate: { $max: "$date" }, // Get the most recent date
        },
      },

      // Lookup exercise details
      {
        $lookup: {
          from: "exercises", // Your exercises collection name
          localField: "_id",
          foreignField: "_id",
          as: "exerciseDetails",
        },
      },

      // Unwind the exerciseDetails array
      { $unwind: "$exerciseDetails" },

      // Project final shape of documents
      {
        $project: {
          exercise: "$exerciseDetails",
          lastDate: 1,
          totalLogs: 1,
          lastLog: 1,
        },
      },

      // Sort by most recent date
      { $sort: { lastDate: -1 } },
    ]);

    if (!uniqueLogs.length) {
      return response.status(404).json({
        message: "No logs found for this user",
      });
    }

    response.status(200).json(uniqueLogs);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ message: error.message });
  }
}

// -------------------------------------------------------------------------------------------------------------

// Get all exercise logs of all exercises and all users

export async function readMultipleExerciseLogs(request, response) {
  try {
    const exercisesWithLogs = await ExerciseLog.aggregate([
      // Group by exercise first
      {
        $group: {
          _id: {
            exercise: "$exercise",
            user: "$user",
          },
          logs: {
            $push: {
              logId: "$_id",
              userId: "$user",
              date: "$date",
              weight: "$weight",
              notes: "$notes",
            },
          },
          latestLog: { $max: "$date" },
          totalUsersLogs: { $sum: 1 },
        },
      },

      // Lookup user details early to get names
      {
        $lookup: {
          from: "users",
          localField: "_id.user",
          foreignField: "_id",
          as: "userInfo",
        },
      },

      // Unwind user details
      { $unwind: "$userInfo" },

      // Group again by exercise to combine user logs
      {
        $group: {
          _id: "$_id.exercise",
          userLogs: {
            $push: {
              userId: "$_id.user",
              firstName: "$userInfo.firstName",
              lastName: "$userInfo.lastName",
              logs: {
                $map: {
                  input: "$logs",
                  as: "log",
                  in: {
                    logId: "$$log.logId",
                    userId: "$$log.userId",
                    date: "$$log.date",
                    weight: "$$log.weight",
                    notes: "$$log.notes",
                    firstName: "$userInfo.firstName",
                    lastName: "$userInfo.lastName",
                  },
                },
              },
              latestLog: "$latestLog",
              totalLogs: "$totalUserLogs",
            },
          },
          totalExerciseLogs: { $sum: "$totalUserLogs" },
        },
      },

      // Lookup exercise details
      {
        $lookup: {
          from: "exercises",
          localField: "_id",
          foreignField: "_id",
          as: "exerciseDetails",
        },
      },

      // Unwind exercise details
      { $unwind: "$exerciseDetails" },

      // Project final shape
      {
        $project: {
          exercise: "$exerciseDetails",
          userLogs: 1,
          totalExerciseLogs: 1,
        },
      },

      // Sort by exercise name
      { $sort: { "exercise.name": 1 } },
    ]);

    if (!exercisesWithLogs.length) {
      return response.status(404).json({
        message: "No exercises with logs found",
      });
    }
    response.status(200).json(exercisesWithLogs);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ message: error.message });
  }
}
