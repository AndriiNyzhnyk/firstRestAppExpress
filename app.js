let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static(__dirname + "/public"));

// отримання списку даних
app.get("/api/users", (req, res) => {
    let content = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(content);
    res.send(users);
});

// отримання одного користувача по id
app.get("/api/users/:id", (req, res) => {
    let id = req.params.id;
    let content = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(content);
    let user = null;
    // знаходимо користувача в масиві по id
    for(let i = 0; i < users.length; i++){
        if(users[i].id == id){
            user = users[i];
            break;
        }
    }
    // відправляємо користувача
    if(user){
        res.send(user);
    } else {
        res.status(404).send();
    }
});

// отримання надісланих даних
app.post("/api/users", jsonParser, (req, res) => {
    if(!req.body) return res.sendStatus(400);

    let userName = req.body.name;
    let surname = req.body.surname;
    let userAge = req.body.age;
    let user = {name: userName, surname: surname, age: userAge};

    let data = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(data);

    // Знаходимо максимальний id
    let id = Math.max.apply(Math,users.map(function(o){return o.id;}));

    // збільшуємо його на 1
    if(id == -Infinity){
        user.id = 1;
    } else {
        user.id = ++id;
    }
    // добавляєм користувача в масив
    users.push(user);
    data = JSON.stringify(users);
    // перезаписуєм файл з користувачами
    fs.writeFileSync("users.json", data);
    res.send(user);
});

// видаляємо користувача по id
app.delete("/api/users/:id", (req, res) => {
    let id = req.params.id;
    let data = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(data);
    let index = -1;
    // знаходимо індекс користувача в масиві
    for(let i = 0; i < users.length; i++){
        if(users[i].id == id){
            index=i;
            break;
        }
    }

    if(index > -1){
        // видаляємо користувача із масиву по id
        let user = users.splice(index, 1)[0];
        let data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        // відправляємо видаленого користувача
        res.send(user);
    }  else {
        res.status(404).send();
    }
});

// змінення даних користувача
app.put("/api/users", jsonParser,(req, res) => {

    if(!req.body) return res.sendStatus(400);

    let userId = req.body.id;
    let userName = req.body.name;
    let surname = req.body.surname;
    let userAge = req.body.age;

    let data = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(data);
    let user;
    for(let i = 0; i < users.length; i++){
        if(users[i].id == userId){
            user = users[i];
            break;
        }
    }

    if(user){
        user.age = userAge;
        user.name = userName;
        user.surname = surname;
        let data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    } else {
        res.status(404).send(user);
    }
});

app.listen(3000, () => { console.log("Server start - localhost:3000"); });