const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const { createToken } = require('../utils/createToken')
const BusinessOwner = require('../Models/BusinessOwner')
const ProjectType = require('../Models/ProjectType')
const AppError = require('../utils/appError')

// @desc   signup
// @route  POST /api/v1/businesOwner/signup
// @access public
exports.signup = asyncHandler(async (req, res, next) => {
    try {
        const {
            profileImg,
            projectName,
            mobileNumber,
            email,
            projectTypeId,
            civilId,
            password,
            area,
            block,
            street,
            paciNumber,
            jadaa,
            notes
        } = req.body;

        const businessOwner = await BusinessOwner.create({
            profileImg,
            projectName,
            mobileNumber,
            email,
            projectTypeId,
            civilId,
            password,
            area,
            block,
            street,
            paciNumber,
            jadaa,
            notes
        });


        const projectType = await ProjectType.findByPk(projectTypeId, {
            attributes: ['ar', 'en']
        });


        businessOwner.dataValues.createdAt = undefined;
        businessOwner.dataValues.updatedAt = undefined;
        businessOwner.dataValues.password = undefined;
        businessOwner.dataValues.projectTypeId = projectType;

        const token = await createToken(businessOwner.id)


        res.status(201).json({
            success: true,
            token,
            data: businessOwner
        });
    } catch (error) {
        return next(new AppError(JSON.stringify({
            en: "An error occurred while creating a new account",
            ar: "حدث خطأاثناء انشاء حساب جديد"
        }), 400))

    }
});

// @desc   login
// @route  POST /api/v1/auth/login
// @access public
exports.login = asyncHandler(async (req, res, next) => {

    try {
        let Owner;

        if (req.body.mobileNumber) {
            Owner = await BusinessOwner.findOne({
                where: { mobileNumber: req.body.mobileNumber },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            });
        } else {
            Owner = await BusinessOwner.findOne({
                where: { email: req.body.email },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
            })
        }

        if (!Owner || !(await bcrypt.compare(req.body.password, Owner.password))) {
            return next(new AppError(JSON.stringify({
                en: 'Incorrecte email or password',
                ar: "الايميل او الرقم السري غير صحيح"
            }), 400))
        }

        Owner.dataValues.password = undefined;
        const token = await createToken(Owner.id)


        res.status(200).json({
            success: "true",
            token,
            data:
                Owner


        })

    } catch (error) {
        return next(new AppError(JSON.stringify({
            en: "An error occurred while Login",
            ar: "حدث خطأاثناء تسجيل الدخول"
        }), 400))
    }


})