const Nations = require('../models/nation')
class NationsController{
    index(req, res, next){
        Nations.find({})
    .then((nation) =>{

        res.render('nations',{
            title: 'The list of Nations',
            nation: nation
        });
        
    }).catch(next);
    }
    add(req,res,next){
        res.render('addNations',{
            title:"Add a Nation"
        })
    }

    create(req, res, next){
        // console.log(req.body);
        // Nations.create(req.body)
        // .then(() => res.redirect('/nations'))
        // .catch(error =>{});
        const nation = new Nations({
            name:req.body.name,
            description:req.body.description
        })
        nation.save(nation)
        .then(()=>res.redirect('/nations'))
        .catch(err=>{
            res.status(500).json('Error: '+err)
        })
    }

    delete(req,res,next) {
        console.log(req.body);
        Nations.findByIdAndRemove({_id: req.params.nationId})
        .then(()=> res.redirect('/nations'))
        .catch(err=>{
            res.status(500)})
    }

    formUpdate(req,res,next){
        const nationId = req.params.nationId;
        Nations.findById(nationId)
        .then((nation) => {
            res.render('updateNations',{
                nation: nation
            })
        })
        .catch(next);
    }

    update(req,res,next) {
        const nationId = req.params.nationId;
        Nations.updateOne({_id:nationId},req.body)
        .then(()=>{
            res.redirect('/nations')
        })
        .catch(next)
    }

}

module.exports = new NationsController;