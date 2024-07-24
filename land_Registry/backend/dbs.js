// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

// const scema = new mongoose.Schema({
//     name: String,
//     state: String,
//     city: String,
//     propertyid: String,
//     owneraddress: String,
//     size: Number,
//     adharNo: Number,
//     email: String,
//     phone: Number,
//     password: String // Store hashed password
// });

// // Hash password before saving
// scema.pre('save', async function(next) {
//     const user = this;
//     if (!user.isModified('password')) return next();

//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hash = await bcrypt.hash(user.password, salt);
//         user.password = hash;
//         next();
//     } catch (error) {
//         return next(error);
//     }
// });

// // Method to compare passwords
// scema.methods.comparePassword = async function(candidatePassword) {
//     try {
//         return await bcrypt.compare(candidatePassword, this.password);
//     } catch (error) {
//         throw error;
//     }
// };

// const User = mongoose.model('User', scema);

// module.exports = User;
