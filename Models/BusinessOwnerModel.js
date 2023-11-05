const { DataTypes } = require('sequelize');
const sequelize = require('../Sequelize/config');
const bcrypt = require('bcrypt');


const Owner = sequelize.define('Owner', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    }
    ,
    profileImg: {
        type: DataTypes.STRING,
        defaultValue: "https://adala-app.s3.ap-south-1.amazonaws.com/shareO+placeholder+img.png"
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUnique: async function (value) {
                const existingOwner = await this.constructor.findOne({
                    where: { projectName: value },
                });
                if (existingOwner && existingOwner.id !== this.id) {
                    throw new Error(JSON.stringify({
                        ar: "يجب أن يكون اسم المشروع فريدًا.",
                        en: 'Project name  must be unique.'
                    }));
                }
            },
        },

    },
    mobileNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8, 8],
                msg: JSON.stringify({
                    ar: "يجب أن يتكون رقم الجوال من 6 أرقام فقط.",
                    en: "Mobile number must be exactly 6 digits long."
                }),
            },

            isUnique: async function (value) {
                const existingOwner = await this.constructor.findOne({
                    where: { mobileNumber: value },
                });
                if (existingOwner && existingOwner.id !== this.id) {
                    throw new Error(JSON.stringify({
                        ar: "يجب ان يكون رقم الجوال فريدا",
                        en: "Mobile number must be unique."
                    }));
                }
            },
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: JSON.stringify({
                ar: "يجب أن يكون عنوان البريد الإلكتروني فريدًا.",
                en: "Email address must be unique."
            }),
        },
        validate: {
            isEmail: {
                args: true,
                msg: JSON.stringify({
                    ar: "يرجى إدخال عنوان بريد إلكتروني صالح.",
                    en: "Please enter a valid email address."
                }),
            },
            isUnique: async function (value) {
                const existingOwner = await this.constructor.findOne({
                    where: { email: value },
                });
                if (existingOwner && existingOwner.id !== this.id) {
                    throw new Error(JSON.stringify({
                        ar: "يجب ان يكون البريد الالكتروني فريدا",

                        en: 'Email address must be unique.'
                    }));
                }
            },
        },
    },
    civilId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: JSON.stringify({
                ar: "يجب أن يكون رقم الهوية المدنية فريدًا.",
                en: "Civil ID must be unique."
            }),
        },

        validate: {
            len: {
                args: [12, 12],
                msg: JSON.stringify({
                    ar: "يجب أن يتكون رقم الهوية المدنية من 12 رقمًا فقط.",
                    en: "Civil ID must be exactly 12 digits long."
                }),
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, Infinity],
                msg: JSON.stringify({
                    ar: "يجب أن يتكون كلمة المرور من 6 أحرف على الأقل.",
                    en: "The password must consist of at least 6 characters."
                }),
            },
        },
        set(value) {
            const hashedPassword = bcrypt.hashSync(value, 12);
            this.setDataValue('password', hashedPassword);
        },
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    block: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paciNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    jadaa: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null

    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null

    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    ProjectTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});


// Create the table if it doesn't exist
(async () => {

    await Owner.sync({
        force: false,
    });

})();

// Owner.beforeCreate(async (owner) => {
//     if (owner.password) {
//         owner.password = await bcrypt.hash(owner.password, 12)
//     }
// })


module.exports = Owner;
