const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
//mysql connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "foodsale",
});

connection.connect((err) => {
  if (err) {
    console.log("Error connecting", err);
    return;
  }
  console.log("mysql success");
});
//Create route
app.post("/create", async (req, res) => {
  console.log(req.body);
  const {
    o_id,
    OrderDate,
    Region,
    City,
    Category,
    Product,
    Quantity,
    UnitPrice,
    TotalPrice,
  } = req.body;

  try {
    connection.query(
      "INSERT INTO food_sales(o_id,OrderDate,Region,City,Category,Product,Quantity,UnitPrice,TotalPrice)VALUE(?,?,?,?,?,?,?,?,?) ",
      [
        o_id,
        OrderDate,
        Region,
        City,
        Category,
        Product,
        Quantity,
        UnitPrice,
        TotalPrice,
      ],
      (err, result, fields) => {
        if (err) {
          console.log("error foodsales into database", err);
          return res.status(400), send();
        }
        return res.status(201).json({ massage: "New success create" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
//Read
app.get("/read", async (req, res) => {
  try {
    connection.query("SELECT * FROM food_sales", (err, result, fields) => {
      if (err) {
        console.log(err);
        return res.status(400).send();
      }
      res.status(200).json(result);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
//read single o_id from db
app.get("/read/:o_id", async (req, res) => {
  const o_id = req.params.o_id;
  try {
    connection.query(
      "SELECT * FROM food_sales WHERE o_id = ?",
      [o_id],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json(result[0]);
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
//Update data
app.put("/update/:id", (req, res) => {
  console.log('req.body', req.body);
  console.log('req.params.id', req.params.id);
  const { id } = req.params
  
  let OrderDate = req.body.OrderDate;
  let Region = req.body.Region;
  let City = req.body.City;
  let Category = req.body.Category;
  let Product = req.body.Product;
  let Quantity = req.body.Quantity;
  let UnitPrice = req.body.UnitPrice;
  let TotalPrice = req.body.TotalPrice;

  try {
    connection.query(
      "UPDATE food_sales SET OrderDate = ?, Region = ?, City = ?, Category = ?, Product = ?, Quantity = ?, UnitPrice = ?, TotalPrice = ? WHERE o_id = ?",
      [
        OrderDate,
        Region,
        City,
        Category,
        Product,
        Quantity,
        UnitPrice,
        TotalPrice,
        id,
      ],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        res.status(200).json({ massage: "Update success" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});
//Delete
app.delete("/delete/:o_id", async (req, res) => {
  const o_id = req.params.o_id;
  try {
    connection.query(
      "DELETE FROM food_sales WHERE o_id = ?",
      [o_id],
      (err, result, fields) => {
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        if (result.affectedrows === 0) {
          return res.status(404).json({ massage: "No data" });
        }
        return res.status(200).json({ massage: "Delete success" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.listen(3000, () => console.log("Sever running port 3000"));
