import TrainingPlan from "../models/TrainingPlan.js";

// Create a new training plan
export async function createTrainingPlan(request, response) {
  try {
    const { name, description } = request.body;
    const newTrainingPlan = new TrainingPlan({
      name,
      description,
    });
    await newTrainingPlan.save();
    response.status(201).json(newTrainingPlan);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// Read all training plans
export async function readMultipleTrainingPlans(request, response) {
  try {
    const trainingPlans = await TrainingPlan.find().sort({ name: "ascending" });
    response.status(200).json({ trainingPlans });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// Read a single training plan
export async function readSingleTrainingPlan(request, response) {
  console.log(request.params.trainingPlanId);
  try {
    const trainingPlan = await TrainingPlan.findById(
      request.params.trainingPlanId
    );
    console.log(trainingPlan);
    if (!trainingPlan) {
      return response.status(404).json({ message: "Training plan not found" });
    }
    response.status(200).json({ trainingPlan });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// Update a training plan
export async function updateTrainingPlan(request, response) {
  const { trainingPlanId } = request.params;
  const { name, description } = request.body;

  const updatedData = { name, description };

  try {
    const updatedTrainingPlan = await TrainingPlan.findByIdAndUpdate(
      trainingPlanId,
      updatedData,
      { new: true }
    );
    response.send(updatedTrainingPlan);
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}

// -------------------------------------------------------------------------------------------------------------

// Delete a training plan
export async function destroySingleTrainingPlan(request, response) {
  try {
    await TrainingPlan.findByIdAndDelete(request.params.trainingPlanId);
    response.send("Training plan deleted");
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}
