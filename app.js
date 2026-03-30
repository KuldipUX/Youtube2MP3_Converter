// required packages
const express = require("express");
require("dotenv").config();

// create server
const app = express();

// port
const PORT = Number(process.env.PORT) || 3000;

// middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// view engine
app.set("view engine", "ejs");

// home route
app.get("/", (req, res) => {
    res.render("index", { success: null });
});

// convert route
app.post("/convert-mp3", async (req, res) => {
    try {
        let videoId = req.body.videoId;

        // validation
        if (!videoId || videoId.trim() === "") {
            return res.render("index", {
                success: false,
                message: "Please enter a video ID"
            });
        }

        videoId = videoId.trim();

        // API call
        const response = await fetch(
            `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
            {
                method: "GET",
                headers: {
                    "x-rapidapi-key": process.env.API_KEY,
                    "x-rapidapi-host": process.env.API_HOST
                }
            }
        );

        const data = await response.json();

        // success
        if (data.status === "ok") {
            return res.render("index", {
                success: true,
                song_title: data.title,
                song_link: data.link
            });
        } else {
            return res.render("index", {
                success: false,
                message: data.msg || "Conversion failed"
            });
        }

    } catch (error) {
        console.log("Error:", error);

        return res.render("index", {
            success: false,
            message: "Something went wrong. Try again!"
        });
    }
});

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});