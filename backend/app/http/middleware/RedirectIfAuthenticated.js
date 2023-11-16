export default (req, res, next) => {
	// code for session
	// if (!req.session?.user) return next();
	// return res.status(403).end('Already Authenticated');

	const token = req.header('jwt_token');
	if (!token) return next();

	return res.status(403).end('Already Authenticated');
};
