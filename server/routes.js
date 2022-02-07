const Company = require("./models/company");
const Founder = require("./models/founder");

const router = require("express").Router();
const { Op } = require("sequelize");

router.route("/companies")
  .get(async (req, res) => {
    try {
      const query = {}
      let pageSize = 2
      const allowedFilters = ['name', 'date']
      const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1)
      if (filterKeys.length > 0) {
        query.where = {}
        for (const key of filterKeys) {
          query.where[key] = {
            [Op.like]: `%${req.query[key]}%`
          }
        }
      }

      const sortField = req.query.sortField
      let sortOrder = 'ASC'
      if (req.query.sortOrder && req.query.sortOrder === '-1') {
        sortOrder = 'DESC'
      }

      if (req.query.pageSize) {
        pageSize = parseInt(req.query.pageSize)
      }

      if (sortField) {
        query.order = [[sortField, sortOrder]]
      }

      if (!isNaN(parseInt(req.query.page))) {
        query.limit = pageSize
        query.offset = pageSize * parseInt(req.query.page)
      }

      const records = await Company.findAll(query)
      const count = await Company.count()
      res.status(200).json({ records, count })
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })
  .post(async (req, res) => {
    try {
      await Company.create(req.body);
      res.status(201).json({ message: "Company created!" });
    } catch (err) {
      console.warn(err);
      res.status(500).json(err);
    }
  });

router
  .route("/companies/:id")
  .get(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.id);
      if (company) {
        res.status(200).json(company);
      } else {
        res.status(404).json({ Error: 'not found' });
      }
    } catch (err) {
      console.warn(err);
      res.status(500).json(err);
    }
  })
  .put(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.id)
      if (company) {
        await company.update(req.body, { fields: ['name', 'date'] })
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })
  .delete(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.id, { include: Founder })
      if (company) {
        await company.destroy()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })

router.route("/companies/:cid/founders")
  .get(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.cid)
      if (company) {
        const founders = await company.getFounders()

        res.status(200).json(founders)
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })
  .post(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.cid)
      if (company) {
        const founder = req.body
        founder.companyId = company.id
        console.warn(founder)
        await Founder.create(founder)
        res.status(201).json({ message: 'created' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  });

router
  .route("/companies/:cid/founders/:fid")
  .get(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.cid)
      if (company) {
        const founders = await company.getFounders({ where: { id: req.params.fid } })
        if (founders) {
          res.status(200).json(founders.shift())
        } else {
          // res.status(404).json({ message: 'not found' })
          res.status(404).json({ Error: 'not found' });
        }
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })
  .put(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.cid)
      if (company) {
        const founders = await company.getFounders({ where: { id: req.params.fid } })
        const founder = founders.shift()
        if (founder) {
          await founder.update(req.body)
          res.status(202).json({ message: 'accepted' })
        } else {
          res.status(404).json({ message: 'not found' })
        }
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })
  .delete(async (req, res) => {
    try {
      const company = await Company.findByPk(req.params.cid)
      if (company) {
        const founders = await company.getFounders({ where: { id: req.params.fid } })
        const founder = founders.shift()
        if (founder) {
          await founder.destroy(req.body)
          res.status(202).json({ message: 'accepted' })
        } else {
          res.status(404).json({ message: 'not found' })
        }
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (e) {
      console.warn(e)
      res.status(500).json({ message: 'server error' })
    }
  })

module.exports = router;