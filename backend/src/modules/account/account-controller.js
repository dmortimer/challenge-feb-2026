const asyncHandler = require("express-async-handler");
const { processPasswordChange, processGetAccountDetail } = require("./account-service");
const { setAllCookies, clearAllCookies } = require("../../cookie");
const { ApiError } = require("../../utils/api-error");

const handlePasswordChange = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
        throw new ApiError(400, "New Password must be at least 6 characters");
    }
    const { id: userId } = req.user;
    const {
        accessToken,
        refreshToken,
        csrfToken,
        message
    } = await processPasswordChange({ userId, oldPassword, newPassword });

    clearAllCookies(res);
    setAllCookies(res, accessToken, refreshToken, csrfToken)

    res.json({ message });
});

const handleGetAccountDetail = asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const accountDetail = await processGetAccountDetail(userId);
    res.json(accountDetail);
});

module.exports = {
    handlePasswordChange,
    handleGetAccountDetail,
};