import Task from './task.model.js'
import User from '../user/user.model.js'

export const add = async (req, res) => {
    try {
        let data = req.body;
        let uid = req.user._id;

        data.user = uid;

        if (!data.name || !data.description || !data.startDate || !data.endDate) {
            return res.status(400).send({ message: 'You must send all the parameters' });
        }

        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        data.nameCreator = user.name;
        data.lastnameCreator = user.lastname;

        let task = new Task(data);

        await task.save();

        return res.send({ message: 'Task added successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding task', err: err });
    }
};

export const edit = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;
        const uid = req.user._id;

        let task = await Task.findOne({ _id: id });

        if (!task) {
            return res.status(404).send({ message: 'Task not found' });

        }
        console.log(task.user)
        console.log(uid)

        if (task.user.toString() != uid) {
            return res.status(401).send({ message: 'You can only edit your own tasks' });
        }

        const allowedFields = ['name', 'description', 'startDate', 'endDate', 'state'];
        Object.keys(newData).forEach(key => {
            if (!allowedFields.includes(key)) {
                delete newData[key];
            }
        });

        task = await Task.findOneAndUpdate(
            { _id: id},
            newData,
            { new: true }
        );

        return res.send({ message: 'Task updated successfully', task });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating task', err: err });
    }
};

export const deleted = async (req, res) => {
    try {
        const { id } = req.params;
        const uid = req.user._id;

        let task = await Task.findOne({ _id: id });


        if (task.user.toString() != uid) {
            return res.status(401).send({ message: 'You can only delete your own tasks' });
        }

        const deletedTask = await Task.findOneAndDelete({ _id: id });

        if (!deletedTask) {
            return res.status(404).send({ message: 'Task not found' });
        }

        return res.status(200).send({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting Task', err });
    }
};

export const completeTask = async (req, res) => {
    try {
        const { id } = req.params
        const uid = req.user._id

        let task = await Task.findOne({_id: id})

        if (!task) {
            return res.status(404).send({ message: 'Task not found' })
        }
        if (task.user.toString() != uid) {
            return res.status(401).send({ message: 'You can only complete your own tasks' })
        }

        const newTaskState = task.state === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE'
        task = await Task.findOneAndUpdate(
            {_id: id },
            { state: newTaskState }, 
            { new: true } 
        );
        return res.send({ message: 'Task state updated successfully', task });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating task state', err: err });
    }
}

export const getAll = async (req, res) => {
    try {
        const uid = req.user._id; 

        const tasks = await Task.find({ user: uid });

        return res.send({ tasks });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error retrieving tasks', err: err });
    }
};