const express = require("express");
const Users = require("../models/Users");
const app = express();
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const { DynamicStrategy } = require("@dynamic-labs/passport-dynamic");
const passport = require("passport");
const { CourierClient } = require("@trycourier/courier");
const InterestedSection = require("../models/InterestedSection");
const axios = require("axios");
const Projects = require("../models/Projects");

const courier = new CourierClient({
  authorizationToken: "pk_prod_QMHBDQJEH14GB4MZA8M96DXA9FM2"
})

exports.addUsers = async (req, res) => {
  try {
    // console.log(req.body);
    const { login, avatar_url, email, id, company, bio, followers, following, location, twitter_username, address, organizations_url } = req.body.users;

    const user = new Users({
      username: login,
      Image: avatar_url,
      email: email,
      auth0_id: id,
      company: company,
      bio: bio,
      followers: followers,
      following: following,
      location: location,
      twitter_url: twitter_username,
      walletAddress: address,
      organizations_url: organizations_url,
      interests: [],
      stack: [],
      projects: [],
      likedUsers: [],
    });

    await user.save();
    res.status(200).send("User added successfully");
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username === 1) {
      res.status(409).send("Username is already registered.");
    } else {
      console.error(err.message);
      res.status(500).send("An error occurred while adding the user.");
    }
  }
};


const getRandomUser = async (req, res) => {
  try {
    const currentUserId = req.headers.username;
    const currentUser = await Users.findOne({ username: currentUserId });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const excludedUserIds = [
      ...currentUser.likedUsers,
      ...currentUser.rejectedUsers,
    ];

    const allUsersExceptCurrent = await Users.find({
      _id: { $ne: currentUser._id },
    });

    const filteredUsers = allUsersExceptCurrent.filter(
      (user) => !excludedUserIds.includes(user._id.toString())
    );

    if (filteredUsers.length === 0) {
      return res.status(200).json({ message: "No more users to show!" });
    }

    const randomUser =
      filteredUsers[Math.floor(Math.random() * filteredUsers.length)];

    // Create a new object without the likedUsers property
    const userWithoutLikedUsers = { ...randomUser.toObject() };
    delete userWithoutLikedUsers.likedUsers;
    delete userWithoutLikedUsers.rejectedUsers;
    delete userWithoutLikedUsers.matchedUsers;
    delete userWithoutLikedUsers.messageArrays;

    return res.status(200).json({ user: userWithoutLikedUsers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.likeUser = async (req, res) => {
  try {
    const { username, likedUserId } = req.body;

    if (!likedUserId || !likedUserId.length) {
      return res.status(400).json({ message: "No user id found" });
    }

    const stringifiedCurrentUserId = likedUserId.toString();

    const currentUser = await Users.findOneAndUpdate(
      { username: username },
      { $addToSet: { likedUsers: stringifiedCurrentUserId } },
      { new: true }
    );

    const likedUser = await Users.findById(likedUserId);

    if (likedUser.likedUsers.includes(currentUser._id.toString())) {
      const randomString = uuidv4();
      currentUser.matchedUsers.push(likedUserId);
      likedUser.matchedUsers.push(currentUser._id.toString());
      currentUser.messageArrays.push(randomString);
      likedUser.messageArrays.push(randomString);

      const notification = await courier.send({
        message: {
          to: {
            email: likedUser.email
          },
          content: {
            elements: [
              {
                "type": "text",
                "elements": [
                  {
                    "content": "Cheers, \n",
                    "type": "string"
                  },
                  {
                    "content": likedUser.username,
                    "bold": true,
                    "type": "string"
                  }
                ]
              },
              {
                "type": "text",
                "elements": []
              },
              {
                "align": "center",
                "background_color": "#ED4362",
                "content": "Click to check it out!",
                "href": "https://devmatch.tech/",
                "locales": {},
                "style": "button",
                "type": "action"
              },
              {
                "type": "text",
                "elements": []
              },
              {
                "type": "text",
                "elements": [
                  {
                    "content": "You might've had matched with your future co-founder, hackathon teammate or someone you might like talking tech about ",
                    "bold": true,
                    "type": "string"
                  },
                  {
                    "content": "😶‍🌫️",
                    "type": "string"
                  }
                ]
              },
              {
                "type": "text",
                "elements": [
                  {
                    "content": "You have a new match DevMatch!",
                    "bold": true,
                    "type": "string"
                  }
                ]
              },
              {
                "title": "You have a new match!🥳",
                "type": "meta"
              }
            ],
            version: "2022-01-01",
          },
          routing: {
            method: "single",
            channels: ["email"]
          }
        }
      })

      const personalNotification = await courier.send({
        message: {
          to: {
            email: "satyam99820@gmail.com"
          },
          content: {
            elements: [
              {
                "type": "text",
                "elements": [
                  {
                    "content": "Cheers, \n",
                    "type": "string"
                  },
                  {
                    "content": likedUser.username,
                    "bold": true,
                    "type": "string"
                  }
                ]
              },
              {
                "type": "text",
                "elements": []
              },
              {
                "align": "center",
                "background_color": "#ED4362",
                "content": "Click to check it out!",
                "href": "https://devmatch.tech/",
                "locales": {},
                "style": "button",
                "type": "action"
              },
              {
                "type": "text",
                "elements": []
              },
              {
                "type": "text",
                "elements": [
                  {
                    "content": "You might've had matched with your future co-founder, hackathon teammate or someone you might like talking tech about ",
                    "bold": true,
                    "type": "string"
                  },
                  {
                    "content": "😶‍🌫️",
                    "type": "string"
                  }
                ]
              },
              {
                "type": "text",
                "elements": [
                  {
                    "content": "You have a new match DevMatch!",
                    "bold": true,
                    "type": "string"
                  }
                ]
              },
              {
                "title": "You have a new match!🥳",
                "type": "meta"
              }
            ],
            version: "2022-01-01",
          },
          routing: {
            method: "single",
            channels: ["email"]
          }
        }
      })

      await currentUser.save();
      await likedUser.save();
      return res.status(201).json({ message: "Matched!" });
    }

    return res.status(200).json({ message: "Liked!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.DislikeUser = async (req, res) => {
  try {
    const { username, dislikedUserId } = req.body;

    if (!dislikedUserId || !dislikedUserId.length) {
      return res.status(400).json({ message: "Invalid dislikedUserId" });
    }

    // Convert dislikedUserId to string before updating the rejectedUsers array
    const stringifiedDislikedUserId = dislikedUserId.toString();

    const currentUser = await Users.findOne({ username: username });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await Users.findOneAndUpdate(
      { username: username },
      { $addToSet: { rejectedUsers: stringifiedDislikedUserId } },
      { new: true }
    );
    if (updatedUser) {
      return res.status(200).json({ message: "User disliked successfully" });
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMatchedUsers = async (req, res) => {
  const username = req.headers.username;
  console.log(username, "username");
  try {
    const user = await Users.findOne({ username: username });
    if (user) {
      const matchedUsersIds = user.matchedUsers.map((user) => user);

      const matchedUsersData = await Users.find({
        _id: { $in: matchedUsersIds },
      });

      const currentUserMessageArrays = user.messageArrays;
      const matchedUserMessageArrays = matchedUsersData.map(
        (user) => user.messageArrays
      );

      const currentUserMessageIds = new Set(currentUserMessageArrays);
      const matchedUserMessageIds = new Set(
        [].concat(...matchedUserMessageArrays)
      );

      const commonMessageIds = [...currentUserMessageIds].filter((messageId) =>
        matchedUserMessageIds.has(messageId)
      );

      const matchedUserData = matchedUsersData.map((user, index) => {
        const commonMessageIdsForUser = matchedUserMessageArrays[index]
          .filter((messageIds) => commonMessageIds.includes(messageIds))
          .join(",");

        const {
          messageArrays,
          likedUsers,
          rejectedUsers,
          _id,
          auth0_id,
          matchedUsers,
          ...userDataWithoutMatchedUsers
        } = user.toObject();

        return {
          ...userDataWithoutMatchedUsers,
          commonMessageIds: commonMessageIdsForUser,
        };
      });

      const currentUserData = {
        ...user.toObject(),
        messageArrays: currentUserMessageArrays,
      };

      res.status(200).json({ matchedUserData, currentUserData });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

// admin.initializeApp({
//   credential: admin.credential.cert(
//     "controllers/codeconnect-db43c-firebase-adminsdk-g7acc-4e84df04ed.json"
//   ),
//   databaseURL: "https://githubbuddy-f7a51-default-rtdb.firebaseio.com",
// });

const publicKey = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAyXHrqseJ19/ZHbhEN2v8
efDS32XI1G4/CLTXlASjcfa/WeGg55TkIJHXwKoAFzixUya9xBch4etPuSsE3nxT
u71p1ANBfGY8uy/7/GskZ7GLZX7VR9p+zHRNBlskaaLIpaWbbxEdvokd6fKRWDft
GVaqbm3SMKKyzIO4xx9IzXFyQr3ja8qfNmZdiPqnGOYdiGUwv6eIIenhgpAX1okX
Y+xazqu50BBqOFdxXfngNw4+mvBdrhpYZqSvQhhjHSy/hGbPtvmx006v57TIhA6i
6T8I+yxq/F6pwNBGV8MOihFgwCwnEBiBhgS4l0S0tUNth8WCXtagWC+l0iYaXcr8
j4DblFzARfqTG8Bseyr0jtcvw9CTnwHyc1Rvzr9RJfN2cA48IGeaHCux5sqVA5Nr
OjKYepFvmF0AGcXJ4wRl6LzURCsJ+NMrF7XX5MUYcqDeQahFOTN5SywcVcjUV58r
nMi0GKFsaQrd74RZcy7R6ag1FFG37o1ZIIQu4aSBltFDAceMJyp+QB3LP9SW7zoA
3s9HdY4+OcDDSPIEOIT/thIyDD3BJUaTq6q8Q2JQqRdPGw02LeSUbbqdWpR7jgKS
4zmX0+ecjZ++CDY7xiTUakgiA7YXwqRpNQTaZJ3pmfFsZutTHfbXrbWRc+JCITyo
8F5Wh/M+3LWP8joZX/71doUCAwEAAQ==
-----END PUBLIC KEY-----`;
const options = {
  publicKey
}

passport.use(new DynamicStrategy(options, (payload, done) => {
  try {
    // const user = {id: 1, email: "satyam99820@gmail.com"};
    if (payload) {
      return done(null, payload);
    } else {
      return done(null, false);
    }
  } catch (err) {
    console.error(err.message);
    return done(err, false);
  }
}))

exports.authMiddleware = (req, res, next) => {
  try {
    return passport.authenticate('dynamicStrategy', {
      session: false,
      failWithError: true,
    }, (err, user) => {
      if (user.email === req.headers.email) {
        // console.log(user, "user")
        return next();
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    })(req, res, next)
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: err.message });
  }
}

exports.RefreshUser = async (req, res) => {
  const currentUsername = req.body.currentUserName;

  try {
    const currentUser = await Users.findOneAndUpdate(
      { username: currentUsername },
      { $set: { rejectedUsers: [] } },
      { new: true }
    );
    if (currentUser) {
      res.status(200).json({ message: "User refreshed successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    // Retrieve the username from the decoded token
    // console.log(req.headers)
    // console.log(req.headers, "Hello")
    console.log(req.headers.email, "req.headers")
    const decodedToken = req.headers.authorization;
    const authenticatedUsername = req.headers.email;
    // admin
    //   .auth()
    //   .verifyIdToken(decodedToken)
    //   .then(async (decodedToken) => {
    //     req.user = decodedToken;
    //     if (req.user.email === authenticatedUsername) {
    //       console.log("user verified")
    const currentUser = await Users.findOne({ email: authenticatedUsername });
    if (currentUser) {
      // Remove the properties from the currentUser object
      const updatedUser = { ...currentUser.toObject() };
      delete updatedUser.likedUsers;
      delete updatedUser.rejectedUsers;
      delete updatedUser.matchedUsers;
      delete updatedUser.messageArrays;


      return res.status(200).json({ updatedUser });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
    // } else {
    //   console.log("user not verified")
    //   return res.status(401).json({ message: "Unauthorized" });
    // }
    // Fetch and return the user profile
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.updateUserWalletaddress = async (req, res) => {
  // try {
  //   const { email, walletaddress } = req.body;
  //   const user = await Users.findOneAndUpdate(
  //     { email: email },
  //     { $set: { walletAddress: walletaddress } },
  //     { new: true }
  //   );
  //   res.status(200).json({ message: "User updated successfully" });
  // } catch (err) {
  //   console.error(err.message);
  //   res.status(500).json({ message: err.message });
  // }
}

exports.updateUserProfile = async (req, res) => {
  try {
    const email = req.headers.email; // Directly access req.headers.email
    const { followers, following, username, Image, company, bio, location, twitter_url, organizations_url, projects, interests, stack } = req.body;

    const user = await Users.findOneAndUpdate(
      { email: email },
      {
        $set: {
          username: username,
          Image: Image,
          company: company,
          bio: bio,
          location: location,
          twitter_url: twitter_url,
          organizations_url: organizations_url,
          projects: projects,
          interests: interests,
          stack: stack,
          followers: followers,
          following: following
        }
      },
    )
    if (user) {
      res.status(200).json({ message: 'User profile updated successfully' });
    } else {
      res.status(400).json({ message: 'Something went wrong' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const jaccardSimilarity = (stack1, stack2) => {
  const stack2Set = new Set(stack2);

  const intersection = new Set([...stack1].filter(skill => stack2Set.has(skill)));
  const union = new Set([...stack1, ...stack2]);
  const similarity = intersection.size / union.size;
  return similarity;
};

exports.getUserRecommendationAsperStack = async (req, res) => {
  try {
    const currentUser = await Users.findOne({ email: req.headers.email });
    const currentUserStack = new Set(currentUser.stack);

    // Fetch a maximum of 10 users with similar interests
    const usersWithSimilarity = await Users.find({ stack: { $in: Array.from(currentUserStack) } }).limit(2);

    if (usersWithSimilarity.length === 0) {
      // If no similar users found, choose 10 random users
      const randomUsers = await Users.aggregate([{ $sample: { size: 2 } }]);
      const filteredUsers = randomUsers.map(({ likedUsers, rejectedUsers, matchedUsers, messageArrays, ...user }) => user);
      res.status(200).json({ filteredUsers });
    } else {
      // Calculate similarity scores and sort users
      const usersWithSimilarityData = usersWithSimilarity
        .filter(user => user.stack && user.stack.length > 0)  // Filter out users with empty or falsy stacks
        .map(user => {
          const userStack = new Set(user.stack);
          const similarity = jaccardSimilarity(currentUserStack, userStack);
          return { user, similarity };
        });

      // Sort users based on similarity in descending order
      const sortedUsers = usersWithSimilarityData.sort((a, b) => b.similarity - a.similarity);

      // Filter out already interacted users and remove unwanted fields
      const filteredUsers = sortedUsers
        .filter(({ user }) => (
          !currentUser.likedUsers.includes(user._id.toString()) &&
          !currentUser.rejectedUsers.includes(user._id.toString()) &&
          !currentUser.matchedUsers.includes(user._id.toString()) &&
          user._id.toString() !== currentUser._id.toString()
        ))
        .map(({ user }) => {
          // Remove unwanted fields
          const { likedUsers, rejectedUsers, email, matchedUsers, messageArrays, ...filteredUser } = user.toObject();
          return filteredUser;
        });

      // Check if filteredUsers is empty
      if (filteredUsers.length === 0) {
        // If no similar users found, choose 10 random users
        const randomUsers = await Users.aggregate([{ $sample: { size: 10 } }]);
        const randomFilteredUsers = randomUsers.map(({ likedUsers, rejectedUsers, matchedUsers, messageArrays, email, ...user }) => user);
        res.status(200).json({ filteredUsers: randomFilteredUsers });
      } else {
        // Find the project with the user's ID and update it
        const project = await Projects.findOne({ userId: currentUser._id });
        if (project) {
          project.recommendedUsers.push(filteredUsers[0]._id);
          await project.save();
        }

        res.status(200).json({ filteredUsers, recommendedUser: filteredUsers[0] });
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.addInterestedPost = async (req, res) => {
  try {
    const { title, description, user, stack, html_url } = req.body;
    const interestedPost = new InterestedSection({
      title: title,
      description: description,
      user: user,
      interestedUsers: [],
      stack: stack,
      html_url: html_url
    })
    await interestedPost.save();
    if (interestedPost) {
      res.status(200).json({ message: "Interested Post added successfully" });
    } else {
      console.log("Something went wrong");
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.addUserToInterestedPost = async (req, res) => {
  try {
    const { interestedPostId, userId } = req.body;
    const interestedPost = await InterestedSection.findById(interestedPostId);
    if (interestedPost && !interestedPost.interestedUsers.includes(userId)) {
      interestedPost.interestedUsers.push(userId);
      await interestedPost.save();
      res.status(200).json({ message: "User added to interested post successfully" });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getInterestedPostsRecommendation = async (req, res) => {
  try {
    const { email } = req.headers;
    const currentUser = await Users.findOne({ email: email });
    const currentUserInterests = new Set(currentUser.stack);
    console.log(currentUserInterests, "currentUserInterests");

    const interestedPosts = await InterestedSection.find({ stack: { $in: Array.from(currentUserInterests) } }).limit(3);
    console.log(interestedPosts, "interestedPosts");

    if (interestedPosts.length > 0) {
      const interestedPostsWithoutInterestedUsers = interestedPosts.map((interestedPost) => {
        const { interestedUsers, ...interestedPostWithoutInterestedUsers } = interestedPost.toObject();
        return interestedPostWithoutInterestedUsers;
      });
      res.status(200).json({ interestedPostsWithoutInterestedUsers });
    } else {
      const randomInterestedPosts = await InterestedSection.aggregate([{ $sample: { size: 10 } }]);
      const interestedPostsWithoutInterestedUsers = randomInterestedPosts.map((randomInterestedPost) => {
        const { interestedUsers, ...randomInterestedPostWithoutInterestedUsers } = randomInterestedPost;
        return randomInterestedPostWithoutInterestedUsers;
      });
      res.status(200).json({ interestedPostsWithoutInterestedUsers });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getInterestedPostsofCurrentuser = async (req, res) => {
  try {
    const { email } = req.headers;
    const currentUser = await Users.findOne({ email: email });
    const interestedPostsofCurrentUser = await InterestedSection.find({ user: currentUser._id });
    const currentuserinterestedposts = interestedPostsofCurrentUser.map((interestedPost) => {
      const { interestedUsers, ...interestedPostWithoutInterestedUsers } = interestedPost.toObject();
      return interestedPostWithoutInterestedUsers;
    })
    if (currentuserinterestedposts) {
      res.status(200).json({ currentuserinterestedposts });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const technologiesAllowed = ["html", "css", "react", "vue", "angular", "node", "python", "typescript", "nextjs", "javascript", "java", "csharp", "php", "go", "rust", "swift", "kotlin", "sql", "mongodb", "postgres", "mysql", "docker", "kubernetes", "aws", "reactnative", "flutter", "django", "spring", "laravel", "web3", "c++", "graphql", "solidity"]

exports.getJobRecommendation = async (req, res) => {
  try {
    const { email, page } = req.headers;
    const user = await Users.findOne({ email: email })
    let stack = []
    for (let i = 0; i < user.stack.length; i++) {
      console.log(user.stack[i], "user.stack[i]")
      if (technologiesAllowed.includes(user.stack[i].toLowerCase())) {
        stack.push(user.stack[i].toLowerCase())
      }
    }

    const structuredStack = stack.map((tech) => `${tech},`)
    const newT = structuredStack.join("").slice(0, -1)
    console.log(newT, "structuredStack")
    const jobs = await axios.get(`${newT.length > 0 ? `https://api.crackeddevs.com/v1/get-jobs?limit=8&page=${page}&technologies=${newT}` : `https://api.crackeddevs.com/api/get-jobs?limit=8&page=${page}`}`, {
      // const jobs = await axios.get(`https://api.crackeddevs.com/api/get-jobs?limit=8&page=${page}&technologies=${newT}`, {
      headers: {
        "api-key": "f884a5ff-f946-4624-9dba-03fb784b6a3c"
      }
    })
    if (jobs) {
      res.status(200).json({ jobs: jobs.data });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error", });
  }
}

exports.addProjectForUser = async (req, res) => {
  try {
    const { email } = req.headers;
    const { title, description, user, stack } = req.body;
    const project = new Projects({
      title: title,
      description: description,
      user: user,
      stack: stack
    })
    await project.save();
    if (project) {
      res.status(200).json({ message: "Project added successfully" });
    } else {
      console.log("Something went wrong");
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getCurrentUserProject = async (req, res) => {
  try {
    const { email } = req.headers;
    const user = await Users.findOne({ email: email });
    const projects = await Projects.find({ user: user._id });
    const currentuserprojects = projects.map((project) => {
      const { interestedUsers, ...projectWithoutInterestedUsers } = project.toObject();
      return projectWithoutInterestedUsers;
    })
    if (currentuserprojects) {
      res.status(200).json({ currentuserprojects });
    } else {
      res.status(400).json({ message: "Something went wrong" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// exports.getRecommendedUserProjects = async(req, res) => {
//   try {

//   }
// }