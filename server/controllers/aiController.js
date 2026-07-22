const { generateReply } = require("../services/aiService");

const chatWithAI = async (req, res) => {
  try {
    const text = req.body.text;

    const history = JSON.parse(req.body.history || "[]");

    const files = req.files || [];

    console.log("Text:", text);
    console.log("History:", history);
    console.log("Files:", files);

    const reply = await generateReply(text, history, files);

    res.json({
      reply,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Failed to generate AI response.",
    });
  }
};

module.exports = {
  chatWithAI,
};
