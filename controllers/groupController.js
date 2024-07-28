const asyncHandler = require("express-async-handler");
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
//@desc Get all Groups
//@route GET /api/Groups
//@access private
const getGroupOfUser = asyncHandler(async (req, res) => {
    const Groups = await Group.find({ userIds: req.user.id });
    res.status(200).json(Groups);
});

//@desc Create New Group
//@route POST /api/Groups
//@access private
const createGroup = asyncHandler(async (req, res) => {
    // console.log("The request body is :", req.body);
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }

    try {
        const groupResponse = await Group.create({
            name,
            author: req.user.id,
            userIds: [req.user.id]
        });
        res.status(201).json(groupResponse);
    }
    catch (error) {
        res.status(400);
        console.log(error)
        throw new Error("Invalid Data");
    }

    //     const session = await mongoose.startSession();
    //     session.startTransaction();

    //     try {
    //         // Create a new group
    //         const group = new Group({
    //             name: name,
    //             author: req.user.id,
    //             userIds: [req.user.id]
    //         });

    //         const savedGroup = await group.save({ session });

    //         // Update the user's groupIds
    //         await User.findByIdAndUpdate(req.user.id,
    //             { $push: { groupIds: savedGroup._id } },
    //             { session, new: true }
    //         );

    //         // Commit the transaction
    //         await session.commitTransaction();
    //         session.endSession();

    //         res.status(201).json(savedGroup);

    //     } catch (error) {
    //         // Abort the transaction if an error occurs
    //         await session.abortTransaction();
    //         session.endSession();
    //         res.status(400);
    //         console.log(error)
    //         throw new Error('something went wrong');
    //     }
}

);

//@desc Get Group
//@route GET /api/Groups/
//@access private
const getGroup = asyncHandler(async (req, res) => {
    const GroupResponse = await Group.find();
    if (!GroupResponse) {
        res.status(404);
        throw new Error("Group not found");
    }
    res.status(200).json(GroupResponse);
});

//@desc Update Group
//@route PUT /api/Groups/:id
//@access private
const updateGroup = asyncHandler(async (req, res) => {
    const GroupResponse = await Group.findById(req.params.id);
    if (!GroupResponse) {
        res.status(404);
        throw new Error("Group not found");
    }

    if (GroupResponse.author.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user Groups");
    }

    const updatedGroup = await Group.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.status(200).json(updatedGroup);
});

//@desc Delete Group
//@route DELETE /api/Groups/:id
//@access private
const deleteGroup = asyncHandler(async (req, res) => {
    const GroupResponse = await Group.findById(req.params.id);
    if (!GroupResponse) {
        res.status(404);
        throw new Error("Group not found");
    }
    if (GroupResponse.author.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user Groups");
    }
    await Group.deleteOne({ _id: req.params.id });
    res.status(200).json(GroupResponse);
});

const exitFromGroup = asyncHandler(async (req, res) => {
    const GroupResponse = await Group.findById(req.params.id);
    if (!GroupResponse) {
        res.status(404);
        throw new Error("Group not found");
    }
    let groupsRes;
    if (GroupResponse.author.toString() === req.user.id) {
        groupsRes = await Group.deleteOne({ _id: req.params.id });
    }
    else {
        console.log(GroupResponse)
        groupsRes = await Group.findOneAndUpdate({ _id: req.params.id }, { $pull: { userIds: req.user.id } }, { new: true });
    }
    res.status(200).json(groupsRes);
});

const addUserToGroup = asyncHandler(async (req, res) => {
    const { username } = req.body;
    if (!username) {
        res.status(400);
        throw new Error("Username are mandatory !");
    }
    const GroupResponse = await Group.findById(req.params.id);
    if (!GroupResponse) {
        res.status(404);
        throw new Error("Group not found");
    }
    const email = username;
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
        let groupsRes;
        if (GroupResponse.author.toString() !== req.user.id) {
            res.status(403);
            throw new Error("User don't have permission to update other user Groups");
        }
        else {
            groupsRes = await Group.findOneAndUpdate({ _id: req.params.id }, { $push: { userIds: user._id } }, { new: true });
        }
        res.status(200).json(groupsRes);
    }
    else {
        res.status(404);
        throw new Error("User Does'nt exist");
    }
});


module.exports = {
    getGroupOfUser,
    createGroup,
    getGroup,
    updateGroup,
    deleteGroup,
    exitFromGroup,
    addUserToGroup
};
