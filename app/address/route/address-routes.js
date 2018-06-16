const express   = require('express');
const router    = express();

const addressController = require('../controller/address-controller');

/* Get The home page with list of fitness option */
router.route('/list').get(addressController.getListOfAddress);

router.route('/create').get(addressController.getCreateAddress);
router.route('/create').post(addressController.postCreateAddress);

router.route('/edit/:id').get(addressController.getEditAddress);
router.route('/edit/:id').put(addressController.putEditAddress);

router.route('/details/:id').get(addressController.getAddressDetails);

router.route('/delete/:id').get(addressController.getDeleteAddress);
router.route('/delete/:id').delete(addressController.deleteAddress);

module.exports = router;
