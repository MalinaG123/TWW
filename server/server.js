const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require("./sequelize");
const Company = require("./models/company");
const Founder = require("./models/founder");

Company.hasMany(Founder);

app.use(cors())
app.use(bodyParser.json())

app.get('/sync', async (req, res) => {
    try {
      await sequelize.sync({ force: true })
      res.status(201).json({ message: 'created' })
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })

app.use("/api", require("./routes"));

app.post('/', async (request, response) => {
  try {
    const registry = {};
    for (let c of request.body) {
      const company = await Company.create(c);
      for (let f of c.founders) {
        const founder = await Founder.create(f);
        registry[f.key] = founder;
        company.addFounder(founder);
      }
      await company.save();
    }
    response.sendStatus(204);
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
});

app.get('/', async (request, response) => {
  try {
    const result = [];
    for (let c of await Company.findAll()) {
      const company = {
        name: c.name,
        date: c.date,
        founders: []
      };
      for (let f of await c.getFounders()) {
        company.founders.push({
          name: f.name,
          rol: f.rol
        });
      }
      result.push(company);
    }
    if (result.length > 0) {
      response.json(result);
    } else {
      response.sendStatus(204); 
    }
  } catch (e) {
    console.warn(e)
    res.status(500).json({ message: 'server error' })
  }
});

const port = 8080;

 app.listen(port);

