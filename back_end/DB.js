import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 3306
});

connection.connect(err => {
  if (err) {
    console.error("error", err);
  } else {
    console.log("DB.js connected");
  }
});
export default  connection;

// import mysql from "mysql2";
// import dotenv from "dotenv";

// dotenv.config();

// let connection;

// function handleDisconnect() {
//   connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: 3306
//   });

//   connection.connect(err => {
//     if (err) {
//       console.error("❌ DB connect error:", err.message);
//       // ถ้ายังต่อไม่ได้ให้รอ 5 วินาทีแล้วลองใหม่
//       setTimeout(handleDisconnect, 5000);
//     } else {
//       console.log("✅ DB.js connected");
//     }
//   });

//   // ถ้า connection หลุด ให้ reconnect อัตโนมัติ
//   connection.on("error", err => {
//     console.error("⚠️ DB error:", err);
//     if (err.code === "PROTOCOL_CONNECTION_LOST") {
//       handleDisconnect();
//     } else {
//       throw err;
//     }
//   });
// }


// handleDisconnect();

// export default connection;
