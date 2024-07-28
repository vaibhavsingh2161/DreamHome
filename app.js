"use strict";
let normalquery = [
  {
    id: 1,
    query: "Identify the total number of branches in each city.",
  },
  {
    id: 2,
    query: "Identify the total number of staff and the sum of their salaries.",
  },
  {
    id: 3,
    query:
      " Identify the total number of staff in each position at branches in Glasgow.",
  },
  {
    id: 4,
    query:
      " List the name of each Manager at each branch, ordered by branch address.",
  },
  {
    id: 5,
    query:
      " List the property number, address, type, and rent of all properties in Glasgow, ordered by rental amount.",
  },
  {
    id: 6,
    query:
      "Identify the total number of properties of each type at all branches.",
  },
  {
    id: 7,
    query:
      "Identify the details of private property owners that provide more than one property for rent.",
  },
  {
    id: 8,
    query:
      "Identify the total number of properties of each type at all branches.",
  },
  {
    id: 9,
    query:
      "Identify flats with at least three rooms and with a monthly rent no higher than £500 in Aberdeen.",
  },
  {
    id: 10,
    query:
      "Identify the properties that have been advertised more than the average number of times.",
  },
  {
    id: 11,
    query:
      "List the total number of leases with rental periods that are less than one year at branches in London.",
  },
  {
    id: 12,
    query:
      "List the total possible daily rental for property at each branch, ordered by branch number.",
  },
  {
    id: 13,
    query:
      "Identify properties located in Glasgow with rents no higher than £450.",
  },
  {
    id: 14,
    query:
      "List the details of properties that have not been rented out for more than three months.",
  },
];

let branchquery = [
  {
    id: 15,
    query:
      "List the name, position, and salary of staff at a given branch, ordered by staff name.",
  },
  {
    id: 16,
    query:
      "Identify the total number of properties assigned to each member of staff at a given branch.",
  },
  {
    id: 17,
    query:
      "List the details of properties provided by business owners at a given branch.",
  },
  {
    id: 18,
    query:
      "List the number, name, and telephone number of clients and their property preferences at a given branch.",
  },
  {
    id: 19,
    query:
      "List the details of leases due to expire next month at a given branch.",
  },
  {
    id: 20,
    query:
      "List details of all Assistants alphabetically by name at the branch.",
  },
  {
    id: 21,
    query:
      "List the details of property (including the rental deposit) available for rent at the branch, along with the owner’s details.",
  },
  {
    id: 22,
    query:
      "List the clients registering at the branch and the names of the members of staff who registered the clients.",
  },
  {
    id: 23,
    query: "Identify the leases due to expire next month at the branch.",
  },
];

let staffquery = [
  {
    id: 24,
    query: "List the names of staff supervised by a named Supervisor.",
  },
  {
    id: 25,
    query:
      "List the details of properties for rent managed by a named member of staff.",
  },
  {
    id: 26,
    query:
      "List the details of properties managed by a named member of staff at the branch.",
  },
];
let cityquery = [
  {
    id: 27,
    query: "List the details of branches in a given city.",
  },
];
let propertyrelated = [
  {
    id: 28,
    query:
      "Identify the name and telephone number of an owner of a given property.",
  },
  {
    id: 29,
    query:
      "List the details of comments made by clients viewing a given property.",
  },
  {
    id: 30,
    query:
      "Display the names and phone numbers of clients who have viewed a given property but not supplied comments.",
  },
  {
    id: 31,
    query:
      "Display the details of a lease between a named client and a given property.",
  },
];

const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");


app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
const dotenv = require('dotenv');
dotenv.config();

function connectioni() {
  var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "dreamhouse",
  });
  return conn;
}

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/", function (req, res) {
  res.render("index");
});

app.post("/register", function (req, res) {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      let sql = `SELECT * FROM users WHERE username='${name}'`;
      c.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            res.render("register", {
              error: "User with the same username already exists",
            });
          } else {
            sql = `INSERT INTO users(username, email, password) VALUES('${name}','${email}','${password}')`;
            c.query(sql, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                console.log(result);
              }
            });
            c.end();
            res.render("index");
          }
        }
      });
    }
  });
});
app.post("/login", function (req, res) {
  const user = req.body.username;
  const pass = req.body.password;
  let re;
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    }
  });

  let sql = `select * from users where username='${user}' and password='${pass}'`;

  c.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length != 0) {
        //console.log(result[0].id,result[0].username);
        req.session.user = { id: result[0].id, name: result[0].username };
        c.end();
        res.render("home");
      } else {
        console.log(result);
        c.end();
        res.render("error");
      }
    }
  });
});
// function to check if user is logged in or not
function requiredlogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

app.post("/adminreg", function (req, res) {
  const staffno = req.body.staffno;
  const name = req.body.fullname;
  const dob = req.body.dat;
  const gender = req.body.gender;
  const branchnumber = req.body.branchnumber;
  const telephoneno = req.body.telepno;
  const position = req.body.position;
  const supervisor = req.body.Supervisorname;
  const managerstart = req.body.managerstart;
  const managerbonus = req.body.bonus;
  const salary = req.body.salary;
  //console.log(staffno,name,dob,gender,branchnumber,telephoneno,position,supervisor,managerstart,managerbonus);
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      var sql;
      if (supervisor === "") {
        sql = `insert into staffregistration(staffno,name,sex,dob,branchno,telephoneno,position,salary) values('${staffno}','${name}','${gender}','${dob}','${branchnumber}','${telephoneno}','${position}','${salary}')`;
      } else {
        sql = `insert into staffregistration(staffno,name,sex,dob,branchno,telephoneno,position,salary,supervisorname) values('${staffno}','${name}','${gender}','${dob}','${branchnumber}','${telephoneno}','${position}','${salary}','${supervisor}')`;
      }
      if (position != "Manager") {
        c.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            res.render("adminlogin");
            c.end();
          }
        });
      } else {
        c.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          } else {
            let stat = `insert into managerinfo(staffno,managerbonus,startdate) values('${staffno}','${managerbonus}','${managerstart}')`;
            c.query(stat, function (err, result) {
              if (err) {
                console.log(err);
              } else {
                res.render("adminlogin");
                c.end();
              }
            });
          }
        });
      }
    }
  });
});
app.post("/adminlogin", function (req, res) {
  const staffno = req.body.staffno;
  const branchno = req.body.branchno;
  console.log(staffno, branchno);
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    }
  });

  let sql = `select * from staffregistration where staffno='${staffno}' and branchno='${branchno}'`;

  c.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result.length != 0) {
        //console.log(result[0].id,result[0].username);
        req.session.user = { id: result[0].staffno, name: result[0].branchno };
        c.end();
        res.render("adminhome");
      } else {
        console.log(result);
        c.end();
        res.render("error");
      }
    }
  });
});

app.post("/clientreg", function (req, res) {
  const clientnumber = req.body.clientnumber;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const telephoneno = req.body.telephoneno;
  const propertytype = req.body.propertytype;
  const maxrent = req.body.maxrent;
  const regby = req.body.regby;
  const registerdate = req.body.registerdate;
  const email = req.body.email;
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      let sql = `insert into client(clientNo,fname,lname,telNo,prefType,maxRent,email) values('${clientnumber}','${firstname}','${lastname}','${telephoneno}','${propertytype}','${maxrent}','${email}')`;
      c.query(sql, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          let st = `select branchno from staffregistration where staffno='${regby}'`;
          c.query(st, function (err, rest) {
            if (err) {
              console.log(err);
            } else {
              console.log(rest[0].branchno);
              let s = `insert into registration(clientNo,branchNo,staffNo,dateJoined) values('${clientnumber}','${rest[0].branchno}','${regby}','${registerdate}')`;

              c.query(s, function (err, result) {
                if (err) {
                  console.log(err);
                } else {
                  res.render("home");
                  c.end();
                }
              });
            }
          });
        }
      });
    }
  });
});
app.post("/propertyregister", function (req, res) {
  const propertynumber = req.body.propertynumber;
  const type = req.body.type;
  const rent = req.body.rent;
  const rooms = req.body.rooms;
  const propertyaddress = req.body.propertyaddress;
  const ownernumber = req.body.ownernumber;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const owneraddress = req.body.owneraddress;
  const telephoneno = req.body.telephoneno;
  const staffno = req.body.staffno;
  const branchno = req.body.branchno;
  const c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      let sa = `select * from privateOwner where ownerno='${ownernumber}'`;
      c.query(sa, function (err, rey) {
        if (err) {
          console.log(err);
        } else {
          if (rey.length == 0) {
            let sql = `insert into privateOwner(ownerNo,fname,lname,address,telNo) values('${ownernumber}','${fname}','${lname}','${owneraddress}','${telephoneno}') `;
            c.query(sql, function (err, rest) {
              if (err) {
                console.log(err);
              } else {
                let st = `insert into propertyForRent(propertyNo,address,type,rooms,rent,ownerNo,staffNo,branchNo) values('${propertynumber}','${propertyaddress}','${type}','${rooms}','${rent}','${ownernumber}','${staffno}','${branchno}')`;
                c.query(st, function (err, t) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render("home");
                    c.end();
                  }
                });
              }
            });
          } else {
            let st = `insert into propertyForRent(propertyNo,address,type,rooms,rent,ownerNo,staffNo,branchNo) values('${propertynumber}','${propertyaddress}','${type}','${rooms}','${rent}','${ownernumber}','${staffno}','${branchno}')`;
            c.query(st, function (err, t) {
              if (err) {
                console.log(err);
              } else {
                res.render("home");
                c.end();
              }
            });
          }
        }
      });
    }
  });
});
app.post("/normal", function (req, res) {
  let sql;
  let header;
  switch (Number(req.body.queryid)) {
    case 1:
      sql = "select city,count(branchno) as ret from branch group by city";

      break;
    case 2:
      sql =
        "select count(staffno) as Total_staff,sum(salary) as Total_Salary from staffregistration";
      break;
    case 3:
      sql = `select  position,count(*) as Total_Employee from staffregistration natural join branch where city='Glasgow' group by position `;
      break;
    case 4:
      sql = `select name,concat_ws(',',street,city,postalcode) as address from managerinfo natural join staffregistration  natural join branch order by street,city,postalcode`;
      break;
    case 5:
      sql = `select propertyno as propertynumber,address,type,rent from propertyforrent where address like "%Glasgow%" order by rent`;
      break;
    case 6:
      sql = `select  branchno,type,count(propertyno) as Number_of_Property from propertyforrent  group by branchno,type `;
      break;
    case 7:
      sql = `select privateowner.ownerno as OwnerNumber,fname,lname,privateowner.address,telno as telephonenumber from privateowner   join propertyforrent on privateowner.ownerNo=propertyforrent.ownerno group by privateowner.ownerno having count(*)>1 ;`;
      break;
    case 8:
      sql = `select  branchno,type,count(propertyno) as Number_of_Property from propertyforrent  group by branchno,type `;
      break;
    case 9:
      sql = `select propertyno as PropertyNumber,address,type,rooms,rent,ownerno as OwnerNumber from propertyforrent where type='flat' and rent<500 and rooms>=3 and address like '%Aberdeen%'`;
      break;
    case 10:
      sql = `select propertyno as PropertyNumber,address,type,rooms,rent,ownerno as OwnerNumber from propertyforrent where totaladvertise >(select avg(totaladvertise) from propertyforrent) `;
      break;
    case 11:
      sql = `select count(*) as Total_Leases from leases inner join propertyforrent on leases.property_number=propertyforrent.propertyno inner join branch on propertyforrent.branchno=branch.branchno  WHERE TIMESTAMPDIFF(year, rent_start_date, rent_finish_date) <1 and city='london'
      `;
      break;
    case 12:
      sql = `select branchno as Branch_Number,sum(rent) as total_rent from  propertyforrent group by(branchno) order by branchno;`;
      break;
    case 13:
      sql = `select propertyno as PropertyNumber,address,type,rooms,rent,ownerno as OwnerNumber from propertyforrent where  rent<450 and address like '%Glasgow%'`;
      break;
    case 14:
      sql = `select PropertyNo,Address,Type,Rooms,Rent,OwnerNo from propertyforrent where propertyno not in( SELECT property_number FROM leases
        WHERE TIMESTAMPDIFF(MONTH, rent_start_date, rent_finish_date) > 3
        );`;
      break;
  }

  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest, fields) {
        if (err) {
          console.log(err);
        } else {
          const output = fields.map((field) => field.name);
          const re = [];
          console.log(output);
          for (let i = 0; i < rest.length; i++) {
            let f = [];
            for (let j = 0; j < output.length; j++) {
              let d = output[j];
              f.push(rest[i][d]);
            }
            re.push(f);
          }
          res.render("result", { head: output, rest: re });
          console.log(re);
          c.end();
        }
      });
    }
  });
});
app.post("/branch", function (req, res) {
  let branch = req.body.branchnumber;
  let id = req.body.queryid;
  let sql;
  switch (Number(id)) {
    case 15:
      sql = `select Name,Position,Salary from staffregistration where branchno='${branch}' order by name`;
      break;
    case 16:
      sql = `select staffNo as StaffNumber,count(propertyNo) as Number_of_properties from propertyforrent where branchno="${branch}" group by staffNo; `;
      break;
    case 17:
      sql = `select PropertyNo,Address,Type,Rooms,Rent,OwnerNo from propertyforrent where branchNo="${branch}";`;
      break;
    case 18:
      sql = `select ClientNo as ClientNumber,concat(fname,lname) as Name,telno as TelephoneNumber,preftype as Preference_Type from client natural join registration  where branchno="${branch}"; `;
      break;
    case 19:
      sql = `SELECT l.*
      FROM leases l
      JOIN propertyforrent p ON l.property_number = p.propertyno
      WHERE p.branchno = '${branch}'
      AND MONTH(l.rent_finish_date) = MONTH(CURRENT_DATE() + INTERVAL 1 MONTH)
      AND YEAR(l.rent_finish_date) = YEAR(CURRENT_DATE() + INTERVAL 1 MONTH)`;
      break;
    case 20:
      sql = `select staffno as StaffNumber,Name,Sex,date_format(dob,"%Y-%M-%D") as DateofBirth,Branchno as BranchNumber,telephoneno as TelephoneNumber,Salary,SupervisorName from staffregistration where position="Assistant" and branchno="${branch}" order by name;`;
      break;
    case 21:
      sql = `select propertyforrent.propertyno as PropertyNumber,propertyforrent.ADDRESS as Property_Address,propertyforrent.type as Type,propertyforrent.rooms as Rooms,propertyforrent.rent as Rent,propertyforrent.ownerno as OwnerNumber,concat_ws(" ",fname,lname) as Name,privateowner.address as Address,Telno as TelephoneNumber         from propertyforrent   inner join  privateowner on propertyforrent.ownerno=privateowner.ownerno where propertyforrent.branchno="${branch}" ;`;
      break;
    case 22:
      sql = `select ClientNo as clientNumber,concat_ws(" ",fname,lname) as Name,StaffNo as RegisteredBy ,(select name from staffregistration where staffno=registration.staffno) as StaffName from client  natural join registration  where branchno="${branch}";`;
      break;
    case 23:
        sql = `SELECT l.*
        FROM leases l
        JOIN propertyforrent p ON l.property_number = p.propertyno
        WHERE p.branchno = '${branch}'
        AND MONTH(l.rent_finish_date) = MONTH(CURRENT_DATE() + INTERVAL 1 MONTH)
        AND YEAR(l.rent_finish_date) = YEAR(CURRENT_DATE() + INTERVAL 1 MONTH)`;
        break;  
  }

  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest, fields) {
        if (err) {
          console.log(err);
        } else {
          const output = fields.map((field) => field.name);
          const re = [];
          console.log(output);
          for (let i = 0; i < rest.length; i++) {
            let f = [];
            for (let j = 0; j < output.length; j++) {
              let d = output[j];
              f.push(rest[i][d]);
            }
            re.push(f);
          }
          res.render("result", { head: output, rest: re });
          console.log(re);
          c.end();
        }
      });
    }
  });
});

app.post("/city", function (req, res) {
  let city = req.body.cityname;
  let id = req.body.queryid;
  let sql;
  switch (Number(id)) {
    case 27:
      sql = `select branchno as BranchNumber,concat_ws(",",street,city,postalcode) as Address from branch where city="${city}";`;
      break;
  }

  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest, fields) {
        if (err) {
          console.log(err);
        } else {
          const output = fields.map((field) => field.name);
          const re = [];
          console.log(output);
          for (let i = 0; i < rest.length; i++) {
            let f = [];
            for (let j = 0; j < output.length; j++) {
              let d = output[j];
              f.push(rest[i][d]);
            }
            re.push(f);
          }
          res.render("result", { head: output, rest: re });
          console.log(re);
          c.end();
        }
      });
    }
  });
});
app.post("/sta", function (req, res) {
  let staff = req.body.staffname;
  let id = req.body.queryid;
  let sql;
  switch (Number(id)) {
    case 24:
      sql = `select Name from staffregistration where supervisorname="${staff}";`;
      break;
    case 25:
      sql = `select propertyno as PropertyNumber ,Type,Rooms,Rent,Ownerno  as OwnerNumber ,address from propertyforrent  natural join staffregistration where name="${staff}" and status="available";`;
      break;
    case 26:
      sql = `select propertyno as PropertyNumber ,Type,Rooms,Rent,Ownerno  as OwnerNumber ,address from propertyforrent  natural join staffregistration where name="${staff}"`;
      break;
  }

  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest, fields) {
        if (err) {
          console.log(err);
        } else {
          const output = fields.map((field) => field.name);
          const re = [];
          console.log(output);
          for (let i = 0; i < rest.length; i++) {
            let f = [];
            for (let j = 0; j < output.length; j++) {
              let d = output[j];
              f.push(rest[i][d]);
            }
            re.push(f);
          }
          res.render("result", { head: output, rest: re });
          console.log(re);
          c.end();
        }
      });
    }
  });
});

app.post("/property", function (req, res) {
  let property = req.body.propertynumber;
  let id = req.body.queryid;
  let sql;
  switch (Number(id)) {
    case 28:
      sql = `select distinct concat_ws(" ",fname,lname ) as Name, telno as Telephone_Number from propertyforrent  join privateowner on propertyforrent.ownerno = privateowner.ownerno where propertyno='${property}'`;
      break;
    case 29:
      sql=`select * from viewing where propertyno="${property}";`;
      break;
    case 30:
      sql=``;
      break;   
    case 31:
      sql=`select * from leases where property_number="${property}"`;
      break; 
  }

  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest, fields) {
        if (err) {
          console.log(err);
        } else {
          const output = fields.map((field) => field.name);
          const re = [];
          console.log(output);
          for (let i = 0; i < rest.length; i++) {
            let f = [];
            for (let j = 0; j < output.length; j++) {
              let d = output[j];
              f.push(rest[i][d]);
            }
            re.push(f);
          }
          res.render("result", { head: output, rest: re });
          console.log(re);
          c.end();
        }
      });
    }
  });
});
app.post("/any", function (req, res) {
  const query = req.body.query;
  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(query, function (err, rest, fields) {
        if (err) {
          console.log(err);
        } else {
          const output = fields.map((field) => field.name);
          const re = [];
          console.log(output);
          for (let i = 0; i < rest.length; i++) {
            let f = [];
            for (let j = 0; j < output.length; j++) {
              let d = output[j];
              f.push(rest[i][d]);
            }
            re.push(f);
          }
          res.render("result", { head: output, rest: re });
          console.log(re);
          c.end();
        }
      });
    }
  });
});

app.post("/add-comment", function (req, res) {
  const propertynumber = req.body.propertynumber;
  const clientNumber = req.body.clientnumber;
  const comment = req.body.comment;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() returns a zero-based index, so we add 1 and pad with leading zero if necessary
  const day = String(today.getDate()).padStart(2, "0"); // pad with leading zero if necessary
  const formattedDate = `${year}-${month}-${day}`;
  let sql = `insert into viewing(clientno,propertyno,viewdate,comment) values("${clientNumber}","${propertynumber}","${formattedDate}","${comment}")`;
  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest) {
        if (err) {
          console.log(err);
        } else {
          res.render("home", { aler: "added comment succesfully" });

          console.log("success");
          c.end();
        }
      });
    }
  });
});
app.post("/lease", function (req, res) {
  const clientNumber = req.body.clientnumber;
  const propertyNumber = req.body.propertynumber;
  
  const depositPaid = req.body.depositpaid;
  const rentStartDate = req.body.startdate;
  const rentFinishDate = req.body.enddate;
  const pay = req.body.paymentmethod;

  let sql = `select * from propertyforrent where propertyno="${propertyNumber}" and status="available"`;
  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest) {
        if (err) {
          console.log(err);
        } else {
          if (rest.length == 0) {
            res.render("error");
          } else {
            let st = `insert into leases(client_number, property_number, payment_method, deposit_paid, rent_start_date, rent_finish_date) values("${clientNumber}","${propertyNumber}","${pay}","${depositPaid}","${rentStartDate}","${rentFinishDate}")`;
            c.query(st, function (er, result) {
              if (er) {
                console.log(er);
              } else {
                let s = `update propertyforrent set status="notavailable" where propertyno="${propertyNumber}"`;
                c.query(s, function (err, r) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.render("home");
                    c.end();
                  }
                });
              }
            });
          }
        }
      });
    }
  });
});

app.listen(3000, function (req, res) {
  console.log("started");
});
app.get("/home", requiredlogin, function (req, res) {
  res.render("home");
});
app.get("/addcomment", requiredlogin, function (req, res) {
  const propertynumber = req.query.id;
  res.render("addcomment", { propertynumber: propertynumber });
});
app.get("/propertyregister", requiredlogin, function (req, res) {
  res.render("propertyregister");
});
app.get("/view-property", requiredlogin, function (req, res) {
  let sql = `select propertyno as Property_Number,Address,Type,Rooms,Rent from propertyforrent where status='available'`;
  let c = connectioni();
  c.connect(function (err) {
    if (err) {
      console.log(err);
    } else {
      // let sql = "select city,count(branchno) as number_of_branches from branch group by city";
      c.query(sql, function (err, rest, fields) {
        if (err) {
          console.log(err);
        } else {
          const output = fields.map((field) => field.name);
          const re = [];
          console.log(output);
          for (let i = 0; i < rest.length; i++) {
            let f = [];
            for (let j = 0; j < output.length; j++) {
              let d = output[j];
              f.push(rest[i][d]);
            }
            re.push(f);
          }
          res.render("viewproperty", { head: output, rest: re });
          console.log(re);
          c.end();
        }
      });
    }
  });
});
app.get("/clientregister", requiredlogin, function (req, res) {
  res.render("clientregister");
});
app.get("/secret/admin", function (req, res) {
  res.render("adminregister");
});
app.get("/secret", function (req, res) {
  res.render("adminlogin");
});
app.get("/secret/adminhome", function (req, res) {
  res.render("adminhome");
});
app.get("/secret/normalquery", function (req, res) {
  res.render("normalquery", { obj: normalquery });
});
app.get("/secret/branchquery", function (req, res) {
  res.render("branchquery", { obj: branchquery });
});
app.get("/secret/staffquery", function (req, res) {
  res.render("staffquery", { obj: staffquery });
});
app.get("/secret/cityquery", function (req, res) {
  res.render("cityquery", { obj: cityquery });
});
app.get("/secret/propertyquery", function (req, res) {
  res.render("propertyquery", { obj: propertyrelated });
});
app.get("/result", function (req, res) {
  res.render("result");
});
app.get("/lease", requiredlogin, function (req, res) {
  res.render("lease");
});
