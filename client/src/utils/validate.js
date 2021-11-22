import * as Yup from "yup";

const ValidateLogin = Yup.object().shape({
    email: Yup.string()
        .email("有効なメールアドレスを入力してください！")
        .required("メールは必須です"),
    password: Yup.string()
        .min(6, "パスワードは最低でも6文字必要です。")
        .required("パスワードは必須です")
});
const ValidateSignup = Yup.object().shape({
    name: Yup.string().required("名前は必須です"),
    email: Yup.string()
        .email("有効なメールアドレスを入力してください！")
        .required("メールは必須です"),
    password: Yup.string()
        .min(6, "パスワードは最低でも6文字必要です。")
        .required("パスワードは必須です"),
    confirm: Yup.string()
        .oneOf([Yup.ref("password"), null], "パスワードが一致していません")
        .required("確認パスワードは必須です")
});
const ValidateProduct = Yup.object().shape({
    name: Yup.string().required("商品名は必須です"),
    price: Yup.string().required("価格は必須です"),
    description: Yup.string()
        .min(6, "ディスクリプションは最低でも6文字必要です。")
        .required("ディスクリプションは必須です"),
    image: Yup.string().required("イメージは必須です"),
    category: Yup.string().required("商品類をせんたくしてください！")
});
const ValidateCredit = Yup.object().shape({
    cardNumber: Yup.string()
        .required("クレジットカード番号が必須です。")
        .min(16, "最低16文字必要です")
        .max(16, "最大16文字必要です"),
    expiry: Yup.string().required("有効期限が必須です。"),
    cvCode: Yup.string()
        .max(3, "コードは最大3文字までです。")
        .required("コードが必要です。")
});
const ValidatePayment = Yup.object().shape({
    date: Yup.string().required("日時が必須です"),
    time: Yup.string().required("日時が必須です"),
    address: Yup.string()
        .min(6, "有効な住所を入力してください")
        .required("住所が必須です")
});

export { ValidateSignup, ValidateLogin, ValidateProduct, ValidatePayment, ValidateCredit };