module.exports = {
	presets: [["@babel/preset-env", { targets: { node: "current" } }]],
	plugins: [
		["@babel/transform-runtime"],
		["babel-plugin-module-resolver", { root: ["."] }],
	],
};
