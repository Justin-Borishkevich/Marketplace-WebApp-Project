const model = require('../models/item');

exports.index = async (req, res, next) => {
    try {
        const items = await model.find();
        res.render('./store/index', { items, extraStyles: '/css/index.css' });
    } catch (err) {
        next(err);
    }
}

exports.new = (req, res) => {
    res.render('./store/new', {extraStyles: '/css/new.css'});
}

exports.create = async (req, res, next) => {
    try {
        const item = new model(req.body);

        if (req.file) {
            item.image = `/images/${req.file.filename}`;
        }

        await item.save();
        res.redirect('/store/items');
        
    } catch (err) {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    }
}

exports.show = async (req, res, next) => {
    try {
        let id = req.params.id;

        if(!id.match(/^[0-9a-fA-F]{24}$/)){
            let err = new Error(`Invalid item id: ${id}`);
            err.status = 400;
            throw err;
        }

        let item = await model.findById(id);

        if(!item){
            let err = new Error(`Item with id "${id}" not found`);
            err.status = 404;
            throw err;
        }

        res.render('store/item', { item, extraStyles: '/css/item.css' });
    
    } catch (err) {
        next(err);
    }
};

exports.edit = async (req, res, next) => {
    try {
        let id = req.params.id;

        if(!id.match(/^[0-9a-fA-F]{24}$/)){
            let err = new Error(`Invalid item id: ${id}`);
            err.status = 400;
            throw err;
        }

        let item = await model.findById(id);

        if(!item){
            let err = new Error(`Item with id ${id} not found`);
            err.status = 404;
            throw err;
        }

        res.render('./store/edit', { item, extraStyles: '/css/new.css' });

    } catch (err) {
        next(err);
    }
}

exports.update = async (req, res, next) => {
    try {
        let item = req.body;
        let id = req.params.id;

        if(!id.match(/^[0-9a-fA-F]{24}$/)){
            let err = new Error(`Invalid item id: ${id}`);
            err.status = 400;
            throw err;
        }

        let updatedItem = await model.findByIdAndUpdate(id, item, {
            useFindAndModify: false, 
            runValidators: true
        });

        if(!updatedItem){
            let err = new Error(`Item with id ${id} not found`);
            err.status = 404;
            throw err;
        }

        res.redirect(`/store/${id}`);

    } catch (err) {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    } 
}

exports.delete = async (req, res, next) => {
    try {
        let id = req.params.id;

        if(!id.match(/^[0-9a-fA-F]{24}$/)){
            let err = new Error(`Invalid item id: ${id}`);
            err.status = 400;
            throw err;
        }

        const item = await model.findByIdAndDelete(id);
        
        if (!item) {
            let err = new Error(`Item with id ${id} not found`);
            err.status = 404;
            throw err;
        }

        res.redirect('/store/items');

    } catch (err) {
        next(err);
    }

}

exports.items = async (req, res, next) => {
    try {
        const searchQuery = req.query.search || '';
        let filter = { isActive: true };

        if (searchQuery) {
            const searchRegex = new RegExp(searchQuery, 'i');
            filter.$or = [
                { title: searchRegex },
                { description: searchRegex }
            ];
        }

        let items = await model.find(filter).sort({ price: 1});

        res.render('./store/items', { items, extraStyles: '/css/items.css' });
    } catch (err) {
        next(err);
    }
}