import { Schema, model } from "mongoose";

const taskSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    name: {
        type: String,
        required: [true, "Task name is required"]
    },
    description: {
        type: String,
        required: [true, "Task description is required"]
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"]
    },
    state: {
        type: String,
        uppercase: true,
        enum: ['COMPLETE', 'INCOMPLETE'],
        default: 'INCOMPLETE'
    },
    nameCreator: {
        type: String,
        required: [true, "Name to Creator  is required"],
    },
    lastnameCreator: {
        type: String,
        required: [true, "lastname to Creator  is required"]
    }
}, {
    versionKey: false
});


export default model('task', taskSchema)