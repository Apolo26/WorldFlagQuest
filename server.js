const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {});
let collection;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/save-nick", async (req, res) => {
  const nick = req.body.nick;
  const score = req.body.score;
  const time = req.body.time;

  try {
    await client.connect();
    collection = client.db("jugador").collection("playerData");
    let playerInfo;

    playerInfo = {
      WFQ: {
        nick: nick,
        score: score,
        time: time,
      },
    };

    const result = await collection.insertOne(playerInfo);

    console.log("Datos del jugador guardados en MongoDB");
    res.status(200).json({ id: result.insertedId, nick: nick });
  } catch (err) {
    console.error("Error al insertar datos del jugador en MongoDB:", err);
    res.status(500).json({ error: "Error al guardar los datos del jugador" });
  } finally {
    await client.close();
  }
});

app.get("/get-leaderboard", async (req, res) => {
  try {
    await client.connect();
    collection = client.db("jugador").collection("playerData");

    const leaderboardData = await collection
      .find()
      .sort({ "WFQ.score": -1, "WFQ.time": 1 })
      .limit(20)
      .toArray();

    res.status(200).json(
      leaderboardData.map((player) => ({
        nick: player.WFQ.nick,
        score: player.WFQ.score,
        time: player.WFQ.time,
      }))
    );
  } catch (error) {
    console.error("Error al obtener datos del leaderboard:", error);
    res.status(500).json({ error: "Error al obtener datos del leaderboard" });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
