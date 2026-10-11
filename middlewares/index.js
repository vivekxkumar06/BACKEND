const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    fs.appendFile(
      filename,
      `${Date.now()} : ${req.ip} : ${req.method} : ${req.path}\n`,
      (err) => {
        if (err) {
          console.log("Log Error:", err);
        }

        next();
      },
    );
  };
}

module.exports = {
  logReqRes,
};
