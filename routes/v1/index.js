const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.json({
		app_name: process.env.APP_NAME,
		app_version: process.env.APP_VERSION,
		app_vendor: process.env.APP_VENDOR
	});
});

module.exports = router;
