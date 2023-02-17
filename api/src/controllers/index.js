const { v4: uuidv4 } = require('uuid')

//                       C.R.U.D para Database, el cual estaré pisando a mi antojo en los controllers

class ModelCrud {
    constructor(model){
        this.model = model
    }
                                            
    getAll = (req, res, next) => {
        return this.model.findAll()
        .then((results) => res.send(results))
        .catch((error)=>next(error))
    }                                       
    getById = (req, res, next) => {
        const id = req.params.id;
        return this.model.findByPk(id)
            .then((result)=> res.send(result))
            .catch((error)=> next(error))
    }

    post = (req, res, next) => {
        const body = req.body
        return this.model.create({
            ...body, 
            id: uuidv4()
        })
            .then((createdElement)=> res.send(createdElement))
            .catch((error)=>next(error))
    }

    delete = (req, res, next) => {
        const id = req.params.id;
        return this.model.destroy({
            where: { 
                id,
            },
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => next(err));
    };

    update = (req, res, next) => {
       const id = req.params.id;
       const body = req.body;
       return this.model.update(body, {
            where: { 
                id,
            },
      })
         .then((updatedElement) => {
            res.send(updatedElement)
         })
         .catch(err => next(err));
   };
}

module.exports = ModelCrud;

//C.R.U.D -->> create, read, update, delete