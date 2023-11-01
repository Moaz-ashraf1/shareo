const { check } = require("express-validator");
const bcrypt = require("bcrypt");

const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const Owner = require("../../Models/BusinessOwner");
const ProjectType = require("../../Models/ProjectType");


exports.ownerSignupVaildator = [

    check("projectName").notEmpty().withMessage(JSON.stringify({
        ar: "لا بد من ادخال اسم المشروع",
        en: "Project Name must be provided"
    }))
        .custom(async (value, { req }) => {
            const owner = await Owner.findOne({ where: { projectName: value } })


            if (owner) {
                throw new Error(JSON.stringify({

                    ar: "اسم المشروع يجب أن يكون فريدًا",
                    en: "Project name must be unique"
                }));
            }
        }
        ),

    check("mobileNumber").notEmpty()
        .withMessage(
            JSON.stringify({
                ar: "لا بد من ادخال رقم الجوال",
                en: "Owner must provide a mobile number"
            })

        ).isLength({ min: 8, max: 8 }).withMessage(
            JSON.stringify({
                ar: "رقم الجوال يجب ان يكون 8 خانات فقط",
                en: "Mobile number must be exactly 8 digits long"
            })

        ).custom(async (value, { req }) => {
            const owner = await Owner.findOne({ where: { mobileNumber: value } })

            if (owner) {
                throw new Error(JSON.stringify({ ar: "رقم الجوال يجب أن يكون فريدًا", en: "Mobile number must be unique" }));
            }
        }),

    check("email").notEmpty().withMessage(
        JSON.stringify({
            ar: "يجب ادخال البريد الالكتروني الخاص بك",

            en: "Email address must be provided"
        })


    ).isEmail().withMessage(
        JSON.stringify({
            ar: "ايميل الكتروني غير صالح",
            en: "Invalid email address"
        })


    ).custom(async (value, { req }) => {
        const owner = await Owner.findOne({ where: { email: value } })

        if (owner) {
            throw new Error(JSON.stringify({ ar: "عنوان البريد الإلكتروني يجب أن يكون فريدًا", en: "Email address must be unique" }));
        }
    }),


    check("password").notEmpty().withMessage(
        JSON.stringify({
            ar: "يجب ادخال الرقم السري",
            en: "Owner must enter password "
        })


    ).isLength({ min: 6 }).withMessage(
        JSON.stringify({
            ar: "يجب ان يكون الرقم السري مكون علي الاقل من 6 خانات",
            en: "Password must be at least 6 digits"
        })
    ),

    check("passwordConfirm")
        .notEmpty()
        .withMessage(

            JSON.stringify({
                ar: "يجب ان تدخل تاكيد الرقم السري",
                en: "Owner must enter password confirm"
            })

        )
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(JSON.stringify({ ar: "تأكيد كلمة المرور غير متطابق", en: "The password confirmation does not match" }));
            }
            return true;
        }),

    check("civilId").notEmpty().withMessage(

        JSON.stringify({
            ar: "يجب ان تدخل رقم الهويه المدنية",
            en: "Owner must enter Civil ID"
        })

    ).isLength({ min: 12, max: 12 }).withMessage(

        JSON.stringify({
            ar: "يجب ان يتكون رقم الهويه المدنية من 12 خانه",
            en: "Civil ID must be exactly 12 digits long"
        })


    ).custom(async (value, { req }) => {
        const owner = await Owner.findOne({ where: { civilId: value } })

        if (owner) {
            throw new Error(JSON.stringify({ ar: "رقم الهوية المدنية يجب أن يكون فريدًا", en: "Civil ID must be unique" }));
        }
    }),

    check("projectTypeId").notEmpty().withMessage(

        JSON.stringify({
            ar: "يجب ان تدخل نوع المشروع الخاص بك",
            en: "Owner must enter project Type"
        })
    ).custom(async (value, { req }) => {
        const type = await ProjectType.findByPk(req.body.projectTypeId);
        if (!type) {
            throw new Error(JSON.stringify({
                ar: "الرجاء اختيار نوع مشروع من الموجودين",
                en: "you must enter vaild project type"
            }));
        }
    }),

    validatorMiddleware]


exports.ownerLoginValidator = [
    check("mobileNumber").optional().notEmpty()
        .withMessage(JSON.stringify({

            ar: "لا بد من ادخال رقم الجوال",
            en: "you must provide a mobile number"

        })).isLength({ min: 8, max: 8 }).withMessage(
            JSON.stringify({

                ar: "رقم الجوال غير صحيح، يجب أن يحتوي على 8 أرقام فقط",
                en: "Invalid mobile number, it should contain exactly 8 digits"
            })
        ).custom(async (value, { req }) => {
            const owner = await Owner.findOne({ where: { mobileNumber: value } })
            if (!owner) {
                throw new Error(JSON.stringify({
                    ar: "لا يوجد حساب لهذا الرقم",
                    en: "No account found for this phone number"
                }))
            }
        }),
    check("email").optional().notEmpty()
        .withMessage(JSON.stringify({

            ar: "لا بد من ادخال البريد الالكتروني",
            en: "Owner must provide a mobile number"

        })).isEmail().withMessage(

            JSON.stringify({
                ar: "بريد الكتروني غير صالح",
                en: "Invalid email address"
            })

        ).custom(async (value, { req }) => {
            const owner = await Owner.findOne({ where: { email: value } })
            const errorMessage = {
                ar: "لا يوجد حساب لهذا الايميل",
                en: "No account found for this email address"
            };
            if (!owner) {
                throw new Error(JSON.stringify(errorMessage))
            }
        }),

    check("password").notEmpty()
        .withMessage(JSON.stringify({
            ar: "لا بد من ادخال الرقم السري لحسابك",
            en: "you must enter your password"
        })).custom(async (value, { req }) => {

            let owner;

            if (req.body.mobileNumber) {
                owner = await Owner.findOne({ where: { mobileNumber: req.body.mobileNumber } });
            } else {
                owner = await Owner.findOne({ where: { email: req.body.email } });
            }


            if (!owner || !(await bcrypt.compare(value, owner.password))) {
                throw new Error(JSON.stringify({
                    ar: "البيانات المدخله غير صحيحه",
                    en: "The information entered is incorrect",
                }));
            }



        })
    , validatorMiddleware
]