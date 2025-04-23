const Item = require('../models/item');
const { cloudinary } = require('../config/cloudinary');

// GET / store - show all items
exports.index = async (req, res, next) => {
    try {
        const items = await Item.find();
        res.render('./store/index', { items, extraStyles: '/css/index.css' });
    } catch (err) {
        next(err);
    }
}

// GET / store/new - show new item form
exports.new = (req, res) => {
    res.render('./store/new', {extraStyles: '/css/new.css'});
}

//POST / store - create new item with image
// exports.create = async (req, res, next) => {
//     try {
//         // Validate that an image was uploaded
//         if (!req.file) {
//             throw new Error('Please upload an image.');
//         }

//         const item = new Item({
//             ...req.body,
//             image: req.file.path // Cloudinary URL
//         })

//         await item.save();
//         res.redirect('/store/items');
        
//     } catch (err) {
//         if (err.name === 'ValidationError') {
//             err.status = 400;
//         }
//         next(err);
//     }
// }
exports.create = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error('Please upload an image.');
        }

        const item = new Item({
            ...req.body,
            image: req.file.path // Cloudinary URL
        })

        item.seller = req.session.user;

        await item.save();
        req.flash('success', 'You have successfully added an item');
        res.redirect('/store/items');
        
    } catch (err) {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    }
}

//GET / store/:id - show specific item
// exports.show = async (req, res, next) => {
//     try {
//         let id = req.params.id;

//         if(!id.match(/^[0-9a-fA-F]{24}$/)){
//             let err = new Error(`Invalid item id: ${id}`);
//             err.status = 400;
//             throw err;
//         }

//         let item = await Item.findById(id);

//         if(!item){
//             let err = new Error(`Item with id "${id}" not found`);
//             err.status = 404;
//             throw err;
//         }

//         res.render('store/item', { item, extraStyles: '/css/item.css' });
    
//     } catch (err) {
//         next(err);
//     }
// };
exports.show = async (req, res, next) => {
    try {
        let id = req.params.id;
        let item = await Item.findById(id).populate('seller', 'firstName lastName');
        res.render('store/item', { item, extraStyles: '/css/item.css' });
    } catch (err) {
        next(err);
    }
};

//GET / store/:id/edit - Render edit item form
// exports.edit = async (req, res, next) => {
//     try {
//         let id = req.params.id;

//         if(!id.match(/^[0-9a-fA-F]{24}$/)){
//             let err = new Error(`Invalid item id: ${id}`);
//             err.status = 400;
//             throw err;
//         }

//         let item = await Item.findById(id);

//         if(!item){
//             let err = new Error(`Item with id ${id} not found`);
//             err.status = 404;
//             throw err;
//         }

//         res.render('./store/edit', { item, extraStyles: '/css/new.css' });

//     } catch (err) {
//         next(err);
//     }
// }
exports.edit = async (req, res, next) => {
    try {
        let id = req.params.id;
        let item = await Item.findById(id);
        res.render('./store/edit', { item, extraStyles: '/css/new.css' });
    } catch (err) {
        next(err);
    }
}

//PUT / store/:id - Update item
// exports.update = async (req, res, next) => {
//     try {
//         let id = req.params.id;

//         if(!id.match(/^[0-9a-fA-F]{24}$/)){
//             let err = new Error(`Invalid item id: ${id}`);
//             err.status = 400;
//             throw err;
//         }

//         let item = await Item.findById(id);

//         if(!item){
//             let err = new Error(`Item with id ${id} not found`);
//             err.status = 404;
//             throw err;
//         }

//         // Update fields from req.body
//         item.set(req.body);

//         // If a new image is uploaded, delete the old image from Cloudinary and upload the new one
//         if (req.file) {
//             const oldImagePublicId = item.image.split('/').slice(-2).join('/').split('.')[0];
//             await cloudinary.uploader.destroy(oldImagePublicId);
//             item.image = req.file.path;
//         }

//         await item.save();
//         res.redirect(`/store/${id}`);

//     } catch (err) {
//         if (err.name === 'ValidationError') {
//             err.status = 400;
//         }
//         next(err);
//     }
// }
exports.update = async (req, res, next) => {
    try {
        let item = req.body;
        let id = req.params.id;

        // If a new image is uploaded, delete the old image from Cloudinary and upload the new one
        if (req.file) {
            const oldImagePublicId = item.image ? item.image.split('/').slice(-2).join('/').split('.')[0] : null;
            if (oldImagePublicId) {
                await cloudinary.uploader.destroy(oldImagePublicId);
            }
            item.image = req.file.path;
        }

        let updatedItem = await Item.findByIdAndUpdate(id, item, {
            useFindAndModify: false, 
            runValidators: true
        });
        
        req.flash('success', 'You have successfully updated your item');
        res.redirect(`/store/${id}`);

    } catch (err) {
        if (err.name === 'ValidationError') {
            err.status = 400;
        }
        next(err);
    } 
}

//DELETE / store/:id - Delete item and its image
// exports.delete = async (req, res, next) => {
//     try {
//         let id = req.params.id;

//         if(!id.match(/^[0-9a-fA-F]{24}$/)){
//             let err = new Error(`Invalid item id: ${id}`);
//             err.status = 400;
//             throw err;
//         }

//         const item = await Item.findById(id);        
//         if (!item) {
//             let err = new Error(`Item with id ${id} not found`);
//             err.status = 404;
//             throw err;
//         }
        
//         // Delete image from Cloudinary
//         const imagePublicId = item.image.split('/').slice(-2).join('/').split('.')[0];
//         await cloudinary.uploader.destroy(imagePublicId);

//         // Delete item from database
//         await item.deleteOne();
//         res.redirect('/store/items');

//     } catch (err) {
//         next(err);
//     }
// }
exports.delete = async (req, res, next) => {
    try {

        let id = req.params.id;
        const item = await Item.findById(id);        
        // Delete image from Cloudinary
        const imagePublicId = item.image.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(imagePublicId);
        // Delete item from database
        await item.deleteOne();
        req.flash('success', 'You have successfully deleted your item');
        res.redirect('/store/items');
    } catch (err) {
        next(err);
    }

}

//GET / store/items - show all items with optional search
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

        let items = await Item.find(filter).sort({ price: 1});

        res.render('./store/items', { items, extraStyles: '/css/items.css' });
    } catch (err) {
        next(err);
    }
}