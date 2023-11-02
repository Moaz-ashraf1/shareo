const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const { createToken } = require('../utils/createToken')
const BusinessOwner = require('../Models/BusinessOwnerModel')
const ProjectType = require('../Models/ProjectTypeModel')
const ApiError = require('../utils/apiError')


// @desc   check Data Before Signup
// @route  POST /api/v1/businesOwner/checkDataBeforeSignup
// @access public
exports.checkDataBeforeSignup = asyncHandler(async (req, res, next) => {
    const {

        mobileNumber,
        email,
        civilId,
    } = req.body;

    // Mobile phone number
    const phone = await BusinessOwner.findOne({ where: { mobileNumber } })

    if (phone) {
        return next(new ApiError(JSON.stringify({
            ar: "رقم الجوال مسجل مسبقا",
            en: "Mobile number already exists",
        }), 400));
    }

    // Civil identification
    const civil = await BusinessOwner.findOne({ where: { civilId } })

    if (civil) {
        return next(new ApiError(JSON.stringify({
            ar: "الرقم المدني مسجل مسبقا",
            en: "Civil id already exists",
        }), 400));
    }

    // Email addresses
    const emailAddress = await BusinessOwner.findOne({ where: { email } })

    if (emailAddress) {
        return next(new ApiError(JSON.stringify({
            ar: "البريد الالكتروني مسجل مسبقا",
            en: "Email address already exists",
        }), 400));
    }

    res.status(200).json({
        success: true,
        data: {
            "ar": "تم التحقق من البيانات بنجاح",
            "en": "Data check successfully",
        }
    });
});


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
            projectType,
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
            projectType,
            civilId,
            password,
            area,
            block,
            street,
            paciNumber,
            jadaa,
            notes
        });


        const proType = await ProjectType.findByPk(projectType, {
            attributes: ['ar', 'en']
        });


        businessOwner.dataValues.createdAt = undefined;
        businessOwner.dataValues.updatedAt = undefined;
        businessOwner.dataValues.password = undefined;
        businessOwner.dataValues.projectType = proType;

        const token = await createToken(businessOwner.id)


        res.status(201).json({
            success: true,
            token,
            data: businessOwner
        });
    } catch (error) {
        return next(new ApiError(JSON.stringify({
            en: "An error occurred while creating a new account",
            ar: "حدث خطأاثناء انشاء حساب جديد"
        }), 400))

    }
});

// @desc   login
// @route  POST /api/v1/businesOwner/login
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
            return next(new ApiError(JSON.stringify({
                en: 'Incorrecte email or password',
                ar: "الايميل او الرقم السري غير صحيح"
            }), 400))
        }

        const projectType = await ProjectType.findByPk(Owner.projectType, {
            attributes: ['ar', 'en']
        });
        Owner.dataValues.password = undefined;
        Owner.dataValues.projectType = projectType;

        const token = await createToken(Owner.id)


        res.status(200).json({
            success: "true",
            token,
            data:
                Owner


        })

    } catch (error) {
        return next(new ApiError(JSON.stringify({
            en: "An error occurred while Login",
            ar: "حدث خطأاثناء تسجيل الدخول"
        }), 400))
    }


})

// @desc   Protect (not complete)
exports.protect = asyncHandler(async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(new ApiError(JSON.stringify({
            en: "You are not logged in, please login to get access to this route",
            ar: "لم تقم بتسجيل الدخول، يرجى تسجيل الدخول لتتمكن من الوصول إلى هذا المسار",
        }), 401));
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY)

    const Owner = await BusinessOwner.findOne({ where: { id: decoded.id } })
    if (!Owner) {
        return next(new ApiError(JSON.stringify({
            en: "the owner that belong to this token does not exist",
            ar: "المالك الذي ينتمي إلى هذا الرمز غير موجود",
        }), 403));
    }

    // check if user changed his password after token created

    // attach owner to request object


})

// @desc   change owner password
// @route  POST /api/v1/businesOwner/changePassword
// @access (only logged in users)
exports.changePassword = asyncHandler(async (req, res, next) => {

    const { password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return next(new ApiError(JSON.stringify({
            ar: "تأكيد كلمة المرور الجديده غير متطابق",
            en: "The new password confirmation does not match"
        }), 400))
    }

    const owner = await BusinessOwner.findOne({ where: { id: 2 } })
    if (!owner) {
        return next(new ApiError(JSON.stringify({
            ar: "المستخدم غير موجود",
            en: "owner does not exist"
        }), 400))
    }

    console.log(owner);
    const hashedPassword = await bcrypt.hash(password, 12)

    await owner.update({
        password: hashedPassword
    })

    res.status(200).json({
        success: true,
        data: {
            "ar": "تم تغير كلمه المرور بنجاح",
            "en": "password updated successfully",
        }
    });
})