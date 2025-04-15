import TrainingPlan from "../models/TrainingPlan.js";


// Create a new training plan
export async function createTrainingPlan (req, res) {
    try {
        const { name, description } = req.body;
        const newTrainingPlan = new TrainingPlan({
            name,
            description,
        });
        await newTrainingPlan.save();
        res.status(201).json(newTrainingPlan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}