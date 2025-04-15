import {Schema, model} from 'mongoose';

const trainingPlanSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }, 
}, {
    timestamps: true,
});

const TrainingPlan = model('TrainingPlan', trainingPlanSchema);
export default TrainingPlan;