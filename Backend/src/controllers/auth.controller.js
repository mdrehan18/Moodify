const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://moodify-xi.vercel.app"
  ],
  credentials: true
}));