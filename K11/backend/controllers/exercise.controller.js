import Exercise from "../models/Exercise.js";

// create a new exercise
export async function createExercises(request, response, next) {
  try {
    const { name, description } = request.body;
    const newExercise = new Exercise({
      name,
      cover: request.file?.path,
      description,
    });
    await newExercise.save();
    response.send(newExercise);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// read multiple exercises
export async function readMultipleExercises(request, response, next) {
  const page = parseInt(request.query.page) || 1;
  const limitPerPage = parseInt(request.query.limit) || 6;
  if (limitPerPage > 6) limitPerPage = 6;
  const skip = (page - 1) * limitPerPage;

  const totalExercises = await Exercise.countDocuments();
  const totalPages = Math.ceil(totalExercises / limitPerPage);

  try {
    const exercises = await Exercise.find()
      .sort({ name: "ascending" })
      .skip(skip)
      .limit(limitPerPage);

    response.json({
      page,
      currentPage: page,
      limitPerPage,
      totalPages,
      totalResouces: totalExercises,
      exercises,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// read single exercise
export async function readSingleExercise(request, response, next) {
  try {
    const exercise = await Exercise.findById(request.params.exerciseId);

    if (!exercise) {
      return response.status(404).json({ message: "Exercise not found" });
    }
    response.send(exercise);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// update single exercise
export async function updateSingleExercise(request, response, next) {
  const { exerciseId } = request.params;
  const { name, description } = request.body;

  const updatedData = { name, description };

  if (request.file) {
    updatedData.cover = request.file.path;
  }

  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      updatedData,
      { new: true }
    );
    response.send(updatedExercise);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// delete single exercise
export async function destroySingleExercise(request, response, next) {
  try {
    await Exercise.findByIdAndDelete(request.params.exerciseId);
    response.send("Exercise deleted");
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}
