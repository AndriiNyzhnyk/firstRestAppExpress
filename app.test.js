const request = require("supertest");

let app = require("./app").app;

it("Get list users", function(done){
    request(app)
        .get("/api/users")
        .expect([{"name":"Andrii","surname":"Nyzhnyk","age":"19","id":1},
                 {"name":"Taras","surname":"Nyzhnyk","age":"17","id":2},
                 {"name":"Oleg","surname":"Nyzhnyk","age":"41","id":3},
                 {"name":"Vira","surname":"Nyzhnyk","age":"41","id":4}])
        .end(done);
});

it("Get user when id == null", function(done){
    request(app)
        .get("/api/users/:" + null)
        .expect(404)
        .end(done);
});

it("Add undefined user", function(done){
    request(app)
        .post("/api/users")
        .expect(400)
        .end(done);
});

it("Remove user with invalid id", function(done){
    request(app)
        .delete("/api/users/:" + "-1")
        .expect(404)
        .end(done);
});

it("Put user", function(done){
    request(app)
        .put("/api/users")
        .expect(400)
        .end(done);
});