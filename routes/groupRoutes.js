const express = require('express');
const router = express.Router();
const validateTokenHandler = require('../middleware/validateTokenHandler');
const { createGroup, getGroupOfUser, getGroup, deleteGroup, updateGroup, exitFromGroup, addUserToGroup } = require('../controllers/groupController');

router.use(validateTokenHandler);
router.route('/').get(getGroup).post(createGroup);
router.route('/user').get(getGroupOfUser);
router.route('/:id').put(updateGroup).delete(deleteGroup);
router.route('/exit/:id').delete(exitFromGroup);
router.route('/user/:id').put(addUserToGroup);
module.exports = router;