

//Internal Dependencies
const app = require("../app")
const {port} = require("../secret");
const {connectDB} = require("./config/dbConfig")

app.listen(port, async (error) => {
  if (!error) {
    console.log(`server is running at http://localhost:${port}/`);
    await connectDB();
  } else {
    console.log(error.message);
  }
});

