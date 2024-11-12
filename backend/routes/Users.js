const express = require("express");
const {
  addUsers,
  likeUser,
  DislikeUser,
  getMatchedUsers,
  authMiddleware,
  RefreshUser,
  getCurrentUser,
  updateUserWalletaddress,
  updateUserProfile,
  getUserRecommendationAsperStack,
  addInterestedPost,
  addUserToInterestedPost,
  getInterestedPostsRecommendation,
  getInterestedPostsofCurrentuser,
  getJobRecommendation,
  addProjectForUser,
  getCurrentUserProject,
  getRecommendedHackathonTeammate,
} = require("../controllers/User");
const app = express();
const Router = express.Router();

Router.post("/addUser", addUsers);
// Router.get("/getrandomUser", authMiddleware, getRandomUser);
Router.get("/getrandomUser", authMiddleware, getRecommendedHackathonTeammate);
Router.put("/likeUser", authMiddleware, likeUser);
Router.put("/dislikeUser", authMiddleware, DislikeUser);
Router.get("/getMatchedUsers", authMiddleware, getMatchedUsers);
Router.put("/refreshUser", authMiddleware, RefreshUser)
Router.get("/getcurrentuser", authMiddleware, getCurrentUser);
Router.put("/updateAddress", authMiddleware, updateUserWalletaddress);
Router.patch("/updatecurrentUser", authMiddleware, updateUserProfile);
Router.get("/getrecommendations", authMiddleware, getUserRecommendationAsperStack);
Router.post("/adduserinterest", authMiddleware, addInterestedPost);
Router.put("/adduserinterested", authMiddleware, addUserToInterestedPost);
Router.get("/getinterestedpostsforuser", authMiddleware, getInterestedPostsRecommendation);
Router.get("/getinterestedpostsofcurrentuser", authMiddleware, getInterestedPostsofCurrentuser);
Router.get("/jobrecommendation", authMiddleware, getJobRecommendation);
Router.post("/addpostforuser", authMiddleware, addProjectForUser);
Router.get("/getcurrentuserprojects", authMiddleware, getCurrentUserProject);

const UserRoutes = Router;
module.exports = UserRoutes;
