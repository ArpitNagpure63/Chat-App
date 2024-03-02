import bcrypt from "bcrypt";
import Users from "../Models/users.js";
import { setCookies } from "../Utility/cookies.js";

const signupController = async (req, res) => {
    const { name, username, gender, password } = req.body;
    try {
        if (name && username && gender && password) {
            const isUserExist = await Users.findOne({ username });
            if (!isUserExist) {
                const newUser = new Users({
                    name, username, gender,
                    password: bcrypt.hashSync(password, 10)
                });
                await newUser.save();

                await setCookies(newUser._id, res);

                res.status(201).send({
                    message: 'User Created',
                    user: {
                        _id: newUser._id,
                        name: newUser.name,
                        username: newUser.username,
                        gender: newUser.gender
                    }
                });
            } else {
                res.status(400).send({ isError: true, error: 'User already exist' });
            }
        } else {
            res.status(400).send({ isError: true, error: 'Invalid User Details, Please enter all required fields' });
        }
    } catch (e) {
        res.status(500).send({ isError: true, error: 'Error occured in signup controller' });
    }
};

export default signupController;