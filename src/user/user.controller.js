import User from './user.model.js'
import { generateJwt } from '../../utils/jwt.js'
import { comparePassword, encrypt } from '../../utils/validation.js'


/* Prueba de conexion entre backend y front*/
export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const signUp = async (req, res) => {
    try {
        let data = req.body
        if (!data.name || !data.lastname || !data.username || !data.password) {
            return res.status(400).send({ message: 'you must complete all fields' });
        }
        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already in use' });
        }
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ message: `Registered successfully, can be logged with username ${user.username}` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err: err })
    }
}

export const login = async (req, res) => {
    try {
        let { username, password } = req.body
        let users = await User.findOne({ username: username });
        if (users && await comparePassword(password, users.password)) {
            let loggedUser = {
                uid: users.id,
                username: users.username,
                name: users.name,
                lastname: users.lastname
            }
            let token = await generateJwt(loggedUser)
            loggedUser = {
                uid: users.id,
                username: users.username,
                name: users.name,
                lastname: users.lastname,
                token: token
            }
            return res.send({ message: `Welcome ${loggedUser.name}`, loggedUser, token })

        }
        return res.status(404).send({ message: 'Invalid credentials' })

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error to login' })
    }
}

export const defaultUser = async () => {
    try {
        const existingUser = await User.findOne({ username: 'default' });

        if (existingUser) {
            return;
        }
        let data = {
            name: 'Default',
            lastname: 'default',
            username: 'default',
            password: await encrypt('hola'),
        }

        let user = new User(data)
        await user.save()

    } catch (error) {
        console.error(error)
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let uid = req.user._id;

        if (id != uid) return res.status(401).send({ message: 'you can only update your account' });
        delete data.password;


        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' });

        return res.send({ message: 'Updated user', updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating account' });
    }
};

export const deleted = async (req, res) => {
    try {
        const { id } = req.params; 
        const uid = req.user._id; 
        console.log(id)
        console.log(uid)

        if (id != uid) {
            return res.status(401).json({ message: 'You can only delete your own account' });
        }

        const deletedUser = await User.findOneAndDelete({_id: id});

        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.status(200).send({ message: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting user', err});
    }
};